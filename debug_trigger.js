
const { Client } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env') });

async function debugTrigger() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        await client.connect();
        console.log("Connected to Database");

        const dummyId = '00000000-0000-0000-0000-' + Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');

        console.log(`Attempting manual insert into public.users for ID: ${dummyId}`);

        try {
            await client.query('BEGIN');

            const res = await client.query(`
                INSERT INTO public.users (id, email, phone, full_name)
                VALUES ($1, $2, $3, $4)
                RETURNING *
            `, [dummyId, `test-${Date.now()}@example.com`, null, 'Debug User']);

            console.log("Insert successful!", res.rows[0]);
            await client.query('ROLLBACK');
        } catch (err) {
            console.error("\n!!! INSERT FAILED !!!");
            console.error("Error Message:", err.message);
            console.error("Error Detail:", err.detail);
            console.error("Error Code:", err.code);
            await client.query('ROLLBACK');
        }

    } catch (err) {
        console.error("Connection error:", err.message);
    } finally {
        await client.end();
    }
}

debugTrigger();
