// Lightweight CSV-backed client storage for feedback records.
// Stores a comma-separated CSV string in localStorage under `feedback_csv_v1`.

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

const STORAGE_KEY = 'feedback_csv_v1';
const ID_SEQ_KEY = 'feedback_csv_id_v1';

// Optional remote API base URL (set Vite env var VITE_FEEDBACK_API_URL)
const REMOTE_API_BASE = (import.meta as any).env?.VITE_FEEDBACK_API_URL || '';
const useRemote = Boolean(REMOTE_API_BASE);

function csvEscape(value: any) {
    if (value === null || value === undefined) return '';
    const s = String(value);
    // Escape double quotes by doubling them, and wrap field in quotes
    return '"' + s.replace(/"/g, '""') + '"';
}

function csvLineFromRecord(r: FeedbackData) {
    return [
        r.id ?? '',
        r.rating ?? '',
        r.feedback_primary ?? '',
        r.feedback_secondary ?? '',
        r.consent_to_publish ? 1 : 0,
        r.display_name ?? '',
        r.organization ?? '',
        r.service_category ?? '',
        r.created_at ?? ''
    ].map(csvEscape).join(',');
}

function parseCsvLine(line: string) {
    const fields: string[] = [];
    let i = 0;
    const len = line.length;
    while (i < len) {
        let ch = line[i];
        if (ch === '"') {
            // quoted field
            i++;
            let out = '';
            while (i < len) {
                const c = line[i];
                if (c === '"') {
                    // check for doubled quote
                    if (i + 1 < len && line[i + 1] === '"') {
                        out += '"';
                        i += 2;
                        continue;
                    }
                    i++;
                    break;
                }
                out += c;
                i++;
            }
            fields.push(out);
            // skip optional comma
            if (line[i] === ',') i++;
        } else {
            // unquoted field
            let start = i;
            while (i < len && line[i] !== ',') i++;
            fields.push(line.slice(start, i));
            if (line[i] === ',') i++;
        }
    }
    return fields;
}

function readAllLines(): string[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    // split into lines, ignore empty
    return raw.split('\n').filter(l => l.trim().length > 0);
}

function writeAllLines(lines: string[]) {
    localStorage.setItem(STORAGE_KEY, lines.join('\n'));
}

function nextId() {
    const raw = localStorage.getItem(ID_SEQ_KEY);
    let v = raw ? Number(raw) : 0;
    v = (isNaN(v) ? 0 : v) + 1;
    localStorage.setItem(ID_SEQ_KEY, String(v));
    return v;
}

export const submitFeedback = async (data: FeedbackData) => {
    if (!data) throw new Error('Missing feedback data');
    const ratingVal = Number(data.rating);
    if (!Number.isInteger(ratingVal) || ratingVal < 1 || ratingVal > 5) {
        throw new Error('Invalid or missing `rating` - expected integer 1..5');
    }
    if (!data.feedback_primary || String(data.feedback_primary).trim().length === 0) {
        throw new Error('`feedback_primary` is required');
    }

    if (useRemote) {
        // send to remote API (expect JSON response { id, created_at })
        const payload = {
            rating: ratingVal,
            feedback_primary: data.feedback_primary,
            feedback_secondary: data.feedback_secondary || '',
            consent_to_publish: !!data.consent_to_publish,
            display_name: data.display_name ?? '',
            organization: data.organization ?? '',
            service_category: data.service_category ?? '',
        };
        const resp = await fetch(`${REMOTE_API_BASE.replace(/\/$/, '')}/feedback`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!resp.ok) throw new Error(`Remote API error: ${resp.status}`);
        return await resp.json();
    }

    const id = nextId();
    const created_at = new Date().toISOString();
    const rec: FeedbackData = {
        id,
        rating: ratingVal,
        feedback_primary: data.feedback_primary,
        feedback_secondary: data.feedback_secondary || '',
        consent_to_publish: !!data.consent_to_publish,
        display_name: data.display_name ?? '',
        organization: data.organization ?? '',
        service_category: data.service_category ?? '',
        created_at,
    };

    const lines = readAllLines();
    // If empty, add header first
    if (lines.length === 0) {
        lines.push('id,rating,feedback_primary,feedback_secondary,consent_to_publish,display_name,organization,service_category,created_at');
    }
    lines.push(csvLineFromRecord(rec));
    writeAllLines(lines);
    return { id, created_at };
};

import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
    ssl: { rejectUnauthorized: true },
});

export const getAllFeedback = async (): Promise<FeedbackData[]> => {
    const client = await pool.connect();
    try {
        console.log('Fetching feedback from database...');
        const result = await client.query('SELECT * FROM feedback ORDER BY created_at DESC');
        console.log('Fetched rows:', result.rows.length);
        return result.rows.map(row => ({
            id: row.id,
            rating: row.rating,
            feedback_primary: row.feedback_primary,
            feedback_secondary: row.feedback_secondary,
            consent_to_publish: row.consent_to_publish,
            display_name: row.display_name,
            organization: row.organization,
            service_category: row.service_category,
            created_at: row.created_at,
        }));
    } catch (error) {
        console.error('Error fetching feedback from database:', error);
        throw new Error('Failed to fetch feedback from database.');
    } finally {
        client.release();
    }
};

export const debugCount = async () => {
    const rows = await getAllFeedback();
    return { cnt: rows.length };
};

export const clearDatabase = async () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ID_SEQ_KEY);
};

export const exportCsv = async () => {
    return localStorage.getItem(STORAGE_KEY) || '';
};

// Expose dev helpers for convenience
if (typeof window !== 'undefined') {
    try {
        (window as any).__feedbackApi = (window as any).__feedbackApi || {};
        (window as any).__feedbackApi.submitFeedback = submitFeedback;
        (window as any).__feedbackApi.getAllFeedback = getAllFeedback;
        (window as any).__feedbackApi.debugCount = debugCount;
        (window as any).__feedbackApi.clearDatabase = clearDatabase;
        (window as any).__feedbackApi.exportCsv = exportCsv;
    } catch (e) {
        // noop
    }
}
