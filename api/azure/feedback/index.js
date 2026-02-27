// Azure Function (Node.js) backed by PostgreSQL.
// Expects Postgres connection parameters via environment variables:
// PGHOST, PGUSER, PGPASSWORD, PGDATABASE, PGPORT

const { Pool } = require('pg');

// configure pool using env vars
const pool = new Pool({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
    ssl: { rejectUnauthorized: false }
});

module.exports = async function (context, req) {
    const method = (req.method || '').toUpperCase();

    if (method === 'POST') {
        const b = req.body || {};
        if (!b.rating || !b.feedback_primary) {
            context.res = { status: 400, body: 'rating and feedback_primary are required' };
            return;
        }

        const query = `INSERT INTO feedback
            (rating, feedback_primary, feedback_secondary, consent_to_publish, display_name, organization, service_category, created_at)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id, created_at`;
        const values = [
            Number(b.rating),
            b.feedback_primary,
            b.feedback_secondary || null,
            b.consent_to_publish ? true : false,
            b.display_name || null,
            b.organization || null,
            b.service_category || null,
            new Date().toISOString()
        ];

        try {
            const res = await pool.query(query, values);
            context.res = { status: 200, body: res.rows[0] };
        } catch (e) {
            context.log.error(e);
            context.res = { status: 500, body: 'DB error' };
        }
        return;
    }

    if (method === 'GET') {
        try {
            const { rows } = await pool.query('SELECT id, rating, feedback_primary, feedback_secondary, consent_to_publish, display_name, organization, service_category, created_at FROM feedback ORDER BY created_at DESC LIMIT 2000');
            context.res = { status: 200, body: rows };
        } catch (e) {
            context.log.error(e);
            context.res = { status: 500, body: 'DB error' };
        }
        return;
    }

    context.res = { status: 405, body: 'Method not allowed' };
};
