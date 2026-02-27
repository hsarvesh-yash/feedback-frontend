import { config } from 'dotenv';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import pg from 'pg';
const { Pool } = pg;

// Resolve __dirname in ES modules
const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env file
config({ path: `${__dirname}/../.env` });

// Debugging: Log environment variables
console.log('PGHOST:', process.env.PGHOST);
console.log('PGUSER:', process.env.PGUSER);
console.log('PGDATABASE:', process.env.PGDATABASE);

const pool = new Pool({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
    ssl: { rejectUnauthorized: true } // Enforce SSL mode
});

(async () => {
    try {
        const client = await pool.connect();
        console.log('Database connection successful!');
        client.release();
    } catch (error) {
        console.error('Database connection failed:', error);
    } finally {
        pool.end();
    }
})();