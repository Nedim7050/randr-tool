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

const supabaseAdmin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
const supabaseAnon = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function testDelete() {
    console.log('Fetching a pending submission to delete...');
    const { data: subs, error: errsubs } = await supabaseAdmin.from('submissions').select('id, email').limit(1);

    if (errsubs || !subs || subs.length === 0) {
        console.log('No subs found or error:', errsubs);
        return;
    }

    const idToDelete = subs[0].id;
    console.log(`Attempting to delete ${idToDelete}`);

    const { error } = await supabaseAdmin.from('submissions').delete().eq('id', idToDelete);
    if (error) {
        console.error('Delete failed:', error);
    } else {
        console.log('Delete succeeded!');
    }
}

testDelete();
