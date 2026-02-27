// Usage: PG_CONN=postgresql://user:pass@host:5432/db node import-csv-to-pg.js path/to/feedback.csv
const fs = require('fs');
const { Pool } = require('pg');
const faker = require('faker');

async function main() {
  const fn = process.argv[2];
  if (!fn) {
    console.error('Provide CSV file path');
    process.exit(1);
  }
  const csv = fs.readFileSync(fn, 'utf8');
  const lines = csv.split('\n').filter(l => l.trim());
  if (lines.length <= 1) {
    console.log('No rows to import');
    return;
  }
  const header = lines.shift();

  const pool = new Pool({ connectionString: process.env.PG_CONN, ssl: { rejectUnauthorized: false } });
  for (const line of lines) {
    // basic CSV parse that supports quoted fields
    const cols = line.match(/(?:"([^"]*(?:""[^"]*)*)"|([^,]+))/g).map(s => s.replace(/^"|"$/g, '').replace(/""/g, '"'));
    const [id, rating, primary, secondary, consent, display_name, organization, service_category, created_at] = cols;
    try {
      await pool.query(
        `INSERT INTO feedback (rating, feedback_primary, feedback_secondary, consent_to_publish, display_name, organization, service_category, created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [Number(rating), primary, secondary || null, consent === '1' || consent === 'true', display_name || null, organization || null, service_category || null, created_at || new Date()]
      );
    } catch (e) {
      console.error('Error inserting line', line, e.message);
    }
  }
  await pool.end();
  console.log('Import complete');
}

main().catch(e => { console.error(e); process.exit(1); });

const pool = new Pool({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
    ssl: { rejectUnauthorized: false }
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
            display_name: faker.name.findName(),
            organization: faker.company.companyName(),
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
