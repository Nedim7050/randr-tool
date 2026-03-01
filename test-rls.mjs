import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envContents = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf-8');
const env = {};
envContents.split('\n').forEach(line => {
    const [key, ...values] = line.split('=');
    if (key && values.length > 0) {
        env[key.trim()] = values.join('=').trim().replace(/^"|"$/g, '');
    }
});

// We need the user's password to login, or we can just forge a JWT if we had the JWT secret.
// Alternatively, we can use the Service Role to generate a link, but let's just make an anon query to see if the RLS blocks it.
const supabaseAdmin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function testRLS() {
    // 1. Get the user
    const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
    const user = users[0];
    console.log('Testing as user:', user.email, user.id);

    // 2. We can't easily impersonate without a JWT. Let's create a custom JWT or just log the RLS policies via SQL query?
    // Let's just create a client with the anon key and try to fetch. It should return 0 since we're not logged in.
    const supabaseAnon = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    const { data, error } = await supabaseAnon.from('submissions').select('*');
    console.log('Anon fetch:', data, error);
}

testRLS();
