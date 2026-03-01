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

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkLeaderboard() {
    console.log('Fetching leaderboard as ANON...');

    // Query the View
    const { data, error } = await supabase.from('leaderboard').select('*').order('total_accepted_points', { ascending: false });
    if (error) {
        console.error('Error fetching leaderboard:', error.message);
    } else {
        console.log('Leaderboard Data as ANON:', data);
    }
}

checkLeaderboard();
