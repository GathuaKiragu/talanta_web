
const { Client } = require('pg');

const client = new Client({
    host: 'aws-1-eu-central-1.pooler.supabase.com',
    port: 6543,
    database: 'postgres',
    user: 'postgres.fnnikfimmdztkkbntomd',
    password: 'Kenya#2020**',
    ssl: { rejectUnauthorized: false }
});

async function syncUsers() {
    try {
        await client.connect();
        console.log("Connected.");

        const authUsers = await client.query('SELECT id, email, raw_user_meta_data FROM auth.users');
        console.log(`Found ${authUsers.rows.length} users in auth.users.`);

        for (const authUser of authUsers.rows) {
            console.log(`Syncing ${authUser.email}...`);
            await client.query(`
            INSERT INTO public.users (id, email, full_name)
            VALUES ($1, $2, $3)
            ON CONFLICT (id) DO UPDATE 
            SET email = EXCLUDED.email, 
                full_name = COALESCE(EXCLUDED.full_name, public.users.full_name)
        `, [
                authUser.id,
                authUser.email,
                authUser.raw_user_meta_data?.full_name || 'User'
            ]);
        }

        console.log("Sync complete.");
        await client.end();
    } catch (err) {
        console.error("Sync failed:", err);
        process.exit(1);
    }
}

syncUsers();
