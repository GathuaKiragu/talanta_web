
const { Client } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env') });

async function inspectSchema() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        await client.connect();
        console.log("Connected to Database");

        // 1. Get all columns of public.users
        const colRes = await client.query(`
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns
            WHERE table_schema = 'public' AND table_name = 'users'
            ORDER BY ordinal_position;
        `);
        console.log("\n--- 'public.users' columns ---");
        colRes.rows.forEach(r => console.log(`${r.column_name}: ${r.data_type} (nullable: ${r.is_nullable}, default: ${r.column_default})`));

        // 2. Get handle_new_user function source
        const funcRes = await client.query(`
            SELECT pg_get_functiondef(p.oid) as def
            FROM pg_proc p
            JOIN pg_namespace n ON p.pronamespace = n.oid
            WHERE n.nspname = 'public' AND p.proname = 'handle_new_user';
        `);
        if (funcRes.rows.length > 0) {
            console.log("\n--- 'handle_new_user' definition ---");
            console.log(funcRes.rows[0].def);
        } else {
            console.log("\n'handle_new_user' NOT FOUND in public schema.");
        }

        // 3. Check for any other triggers on auth.users
        const trigRes = await client.query(`
            SELECT tgname, tgenabled, pg_get_triggerdef(oid) as def
            FROM pg_trigger
            WHERE tgrelid = 'auth.users'::regclass;
        `);
        console.log("\n--- Triggers on 'auth.users' ---");
        trigRes.rows.forEach(r => console.log(`${r.tgname} (${r.tgenabled}): ${r.def}`));

    } catch (err) {
        console.error("Inspection error:", err.message);
    } finally {
        await client.end();
    }
}

inspectSchema();
