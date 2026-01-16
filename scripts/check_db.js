
const { Client } = require('pg');

const client = new Client({
    host: 'aws-1-eu-central-1.pooler.supabase.com',
    port: 6543,
    database: 'postgres',
    user: 'postgres.fnnikfimmdztkkbntomd',
    password: 'Kenya#2020**',
    ssl: { rejectUnauthorized: false }
});

async function check() {
    try {
        await client.connect();
        console.log("Connected to database.");

        const res = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);

        console.log("Tables in public schema:");
        for (const row of res.rows) {
            console.log(`- ${row.table_name}`);
            const cols = await client.query(`
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = $1
            `, [row.table_name]);
            console.log("  Columns:", cols.rows.map(c => `${c.column_name} (${c.data_type})`));
        }

    } catch (err) {
        console.error("Database connection error:", err);
    } finally {
        await client.end();
    }
}

check();
