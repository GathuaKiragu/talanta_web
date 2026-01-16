
const { Client } = require('pg');

const config = {
    host: 'aws-1-eu-central-1.pooler.supabase.com',
    port: 6543,
    database: 'postgres',
    user: 'postgres.fnnikfimmdztkkbntomd',
    password: 'Kenya#2020**',
    ssl: { rejectUnauthorized: false }
};

const client = new Client(config);

async function testConnection() {
    try {
        console.log("Connecting with config:", { ...config, password: '***' });
        await client.connect();
        console.log("Successfully connected!");
        const res = await client.query('SELECT NOW()');
        console.log("Current time from DB:", res.rows[0]);
        await client.end();
    } catch (err) {
        console.error("Connection failed:", err);
        process.exit(1);
    }
}

testConnection();
