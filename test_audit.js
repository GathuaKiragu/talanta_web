
const { Client } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env') });

async function testAuditLogs() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        await client.connect();
        console.log("Connected to Database");

        // 1. Check audit_logs table columns
        const colRes = await client.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_schema = 'public' AND table_name = 'audit_logs';
        `);
        console.log("\n--- 'audit_logs' columns ---");
        colRes.rows.forEach(r => console.log(`${r.column_name}: ${r.data_type} (nullable: ${r.is_nullable})`));

        // 2. Try a dummy insert into audit_logs with NULL user_id
        console.log("\nAttempting dummy insert into audit_logs (NULL user_id)...");
        try {
            const res = await client.query(`
                INSERT INTO public.audit_logs (action, resource_type, resource_id, new_values)
                VALUES ($1, $2, $3, $4)
                RETURNING id
            `, ['TEST', 'DEBUG', '00000000-0000-0000-0000-000000000000', JSON.stringify({ test: true })]);
            console.log("Insert successful! ID:", res.rows[0].id);

            // Cleanup
            await client.query("DELETE FROM public.audit_logs WHERE id = $1", [res.rows[0].id]);
        } catch (err) {
            console.error("!!! AUDIT LOG INSERT FAILED !!!");
            console.error("Error:", err.message);
            console.error("Detail:", err.detail);
        }

    } catch (err) {
        console.error("Connection error:", err.message);
    } finally {
        await client.end();
    }
}

testAuditLogs();
