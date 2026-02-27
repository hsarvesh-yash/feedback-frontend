import { config } from 'dotenv';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import { faker } from '@faker-js/faker';

const { Pool } = pg;

// Resolve __dirname in ES modules
const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env file
config({ path: `${__dirname}/../.env` });

const pool = new Pool({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
    ssl: { rejectUnauthorized: true } // Enforce SSL mode
});

(async () => {
    const feedbacks = [];

    for (let i = 0; i < 2000; i++) {
        const rating = (() => {
            const rand = Math.random();
            if (rand < 0.6) return 4;
            if (rand < 0.9) return 5;
            return Math.floor(Math.random() * 3) + 1; // 1, 2, or 3
        })();

        feedbacks.push({
            rating,
            feedback_primary: faker.lorem.sentence(),
            feedback_secondary: faker.lorem.sentences(2),
            consent_to_publish: faker.datatype.boolean(),
            display_name: faker.person.fullName(),
            organization: faker.company.name(),
            service_category: faker.commerce.department(),
            created_at: faker.date.recent(30).toISOString()
        });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        for (const feedback of feedbacks) {
            const query = `INSERT INTO feedback
                (rating, feedback_primary, feedback_secondary, consent_to_publish, display_name, organization, service_category, created_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;

            const values = [
                feedback.rating,
                feedback.feedback_primary,
                feedback.feedback_secondary,
                feedback.consent_to_publish,
                feedback.display_name,
                feedback.organization,
                feedback.service_category,
                feedback.created_at
            ];

            await client.query(query, values);
        }

        await client.query('COMMIT');
        console.log('Inserted 2000 feedback records successfully.');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error inserting feedback records:', error);
    } finally {
        client.release();
        pool.end();
    }
})();