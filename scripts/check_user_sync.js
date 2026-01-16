
const { Client } = require('pg');

const client = new Client({
    host: 'aws-1-eu-central-1.pooler.supabase.com',
    port: 6543,
    database: 'postgres',
    user: 'postgres.fnnikfimmdztkkbntomd',
    password: 'Kenya#2020**',
    ssl: { rejectUnauthorized: false }
});

async function checkUserSync() {
    try {
        await client.connect();
        console.log("Connected.");

        const users = await client.query('SELECT id, email FROM public.users');
        console.log("Users in public.users:", users.rows);

        const authUsers = await client.query('SELECT id, email FROM auth.users');
        console.log("Users in auth.users:", authUsers.rows);

        await client.end();
    } catch (err) {
        console.error("Check failed:", err);
        process.exit(1);
    }
}

checkUserSync();
