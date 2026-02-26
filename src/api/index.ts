// Client-side storage using sql.js (SQLite compiled to WebAssembly).
// The database is persisted to `localStorage` as a base64-encoded SQLite file.

import initSqlJs from 'sql.js';
import type { Database, SqlJsStatic } from 'sql.js';

export interface FeedbackData {
    id?: number;
    rating: number;
    feedback_primary: string;
    feedback_secondary?: string;
    consent_to_publish?: boolean;
    display_name?: string | null;
    organization?: string | null;
    service_category?: string;
    created_at?: string;
}

let SQL: SqlJsStatic | null = null;
let db: Database | null = null;

const STORAGE_KEY = 'feedback_db_v1';

function uint8ArrayToBase64(u8: Uint8Array) {
    let CHUNK_SIZE = 0x8000;
    let index = 0;
    const length = u8.length;
    let result = '';
    let slice;
    while (index < length) {
        slice = u8.subarray(index, Math.min(index + CHUNK_SIZE, length));
        result += String.fromCharCode.apply(null, Array.from(slice));
        index += CHUNK_SIZE;
    }
    return btoa(result);
}

function base64ToUint8Array(base64: string) {
    const binary = atob(base64);
    const len = binary.length;
    const u8 = new Uint8Array(len);
    for (let i = 0; i < len; i++) u8[i] = binary.charCodeAt(i);
    return u8;
}

async function initSql() {
    if (SQL) return SQL;
    // Load the browser-specific wasm bundle from `public/` so the app serves the
    // correct file that matches the JS wrapper. We'll place
    // `sql-wasm-browser.wasm` in `public/`.
    SQL = await initSqlJs({ locateFile: () => '/sql-wasm-browser.wasm' });
    return SQL;
}

async function openDb() {
    if (db) return db;
    await initSql();
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        const u8 = base64ToUint8Array(saved);
        db = new SQL!.Database(u8);
    } else {
        db = new SQL!.Database();
        db.run(`CREATE TABLE IF NOT EXISTS feedback (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            rating INTEGER NOT NULL,
            feedback_primary TEXT NOT NULL,
            feedback_secondary TEXT,
            consent_to_publish INTEGER DEFAULT 0,
            display_name TEXT,
            organization TEXT,
            service_category TEXT,
            created_at TEXT NOT NULL
        );`);
        persist();
    }
    return db;
}

function persist() {
    if (!db) return;
    const u8 = db.export();
    const b64 = uint8ArrayToBase64(u8);
    localStorage.setItem(STORAGE_KEY, b64);
}

export const submitFeedback = async (data: FeedbackData) => {
    const database = await openDb();
    const created_at = new Date().toISOString();
    // Basic validation to prevent NOT NULL constraint failures
    if (data == null) throw new Error('Missing feedback data');
    if (!Number.isInteger(data.rating) || data.rating < 1 || data.rating > 5) {
        throw new Error('Invalid or missing `rating` - expected integer 1..5');
    }
    if (!data.feedback_primary || String(data.feedback_primary).trim().length === 0) {
        throw new Error('`feedback_primary` is required');
    }
    // Coerce rating to integer and ensure required fields are present
    const ratingVal = Number(data.rating);
    if (!Number.isInteger(ratingVal) || ratingVal < 1 || ratingVal > 5) {
        throw new Error('Invalid or missing `rating` - expected integer 1..5');
    }

    // Use `run` which is simpler and compatible across sql.js builds.
    try {
        database.run(
        `INSERT INTO feedback (rating, feedback_primary, feedback_secondary, consent_to_publish, display_name, organization, service_category, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
        [
            ratingVal,
            data.feedback_primary,
            data.feedback_secondary || null,
            data.consent_to_publish ? 1 : 0,
            data.display_name || null,
            data.organization || null,
            data.service_category || null,
            created_at,
        ]
    );
    } catch (err: any) {
        // translate common SQL errors into friendlier messages
        const msg = err && err.message ? String(err.message) : 'Database error';
        throw new Error(msg.includes('NOT NULL') ? 'Missing required field. Please complete all required inputs.' : msg);
    }
    persist();
    // return inserted row id (may be 0 on some builds if rowid handling differs)
    const res = database.exec('SELECT last_insert_rowid() as id');
    const id = res && res[0] && res[0].values && res[0].values[0] ? res[0].values[0][0] : undefined;
    return { id, created_at };
};

// Helper for debugging stored rows count
export const debugCount = async () => {
    const database = await openDb();
    const res = database.exec('SELECT COUNT(*) AS cnt FROM feedback;');
    if (!res || res.length === 0) return { cnt: 0 };
    const val = res[0].values && res[0].values[0] ? res[0].values[0][0] : 0;
    return { cnt: val };
};

export const getAllFeedback = async (): Promise<FeedbackData[]> => {
    const database = await openDb();
    const res = database.exec('SELECT id, rating, feedback_primary, feedback_secondary, consent_to_publish, display_name, organization, service_category, created_at FROM feedback ORDER BY created_at DESC;');
    if (!res || res.length === 0) return [];
    const result = res[0];
    const cols = result?.columns ?? [];
    const rows = result?.values ?? [];
    if (!Array.isArray(cols) || cols.length === 0 || !Array.isArray(rows) || rows.length === 0) return [];
    return rows.map((r: any[]) => {
        const obj: any = {};
        cols.forEach((c: string, i: number) => (obj[c] = r[i]));
        obj.consent_to_publish = !!obj.consent_to_publish;
        return obj as FeedbackData;
    });
};

export const clearDatabase = async () => {
    db = null;
    localStorage.removeItem(STORAGE_KEY);
};

// DEV DEBUG HELPERS: expose some functions to window for quick inspection during development
if (typeof window !== 'undefined') {
    try {
        (window as any).__feedbackApi = (window as any).__feedbackApi || {};
        (window as any).__feedbackApi.debugCount = debugCount;
        (window as any).__feedbackApi.getAllFeedback = getAllFeedback;
        (window as any).__feedbackApi.submitFeedback = submitFeedback;
        (window as any).__feedbackApi.clearDatabase = clearDatabase;
        (window as any).__feedbackApi.exportDbBase64 = async () => {
            const database = await openDb();
            const u8 = database.export();
            return uint8ArrayToBase64(u8);
        };
    } catch (e) {
        // no-op in non-browser environments
    }
}

