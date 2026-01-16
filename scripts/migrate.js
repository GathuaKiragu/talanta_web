
require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const client = new Client({
    host: 'aws-1-eu-central-1.pooler.supabase.com',
    port: 6543,
    database: 'postgres',
    user: 'postgres.fnnikfimmdztkkbntomd',
    password: 'Kenya#2020**',
    ssl: { rejectUnauthorized: false }
});

async function runMigrations() {
    try {
        await client.connect();
        console.log("Connected to database.");

        // Ensure migration tracking table exists
        await client.query(`
            CREATE TABLE IF NOT EXISTS public.schema_migrations (
                version TEXT PRIMARY KEY,
                applied_at TIMESTAMPTZ DEFAULT now()
            );
        `);

        const migrationsDir = path.resolve(__dirname, '../../supabase/migrations');
        const files = fs.readdirSync(migrationsDir)
            .filter(file => file.endsWith('.sql'))
            .sort();

        const { rows: applied } = await client.query('SELECT version FROM public.schema_migrations');
        const appliedVersions = new Set(applied.map(r => r.version));

        for (const file of files) {
            if (appliedVersions.has(file)) {
                console.log(`Skipping ${file} (already applied).`);
                continue;
            }

            const filePath = path.join(migrationsDir, file);
            console.log(`Applying ${file}...`);
            const sql = fs.readFileSync(filePath, 'utf8');
            try {
                await client.query(sql);
                await client.query('INSERT INTO public.schema_migrations (version) VALUES ($1)', [file]);
                console.log(`Applied ${file} successfully.`);
            } catch (err) {
                if (err.code === '42P07' || err.code === '42710') { // Relation or object already exists
                    console.warn(`Object in ${file} already exists. Marking as applied.`);
                    await client.query('INSERT INTO public.schema_migrations (version) VALUES ($1)', [file]);
                } else {
                    throw err;
                }
            }
        }

        console.log("All migrations applied.");
    } catch (err) {
        console.error("Migration failed:", err);
    } finally {
        await client.end();
    }
}

runMigrations();
