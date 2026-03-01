import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkSubmissions() {
    console.log('Fetching submissions...');
    const { data, error } = await supabase.from('submissions').select('*').order('created_at', { ascending: false });
    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Submissions:', data.length);
        console.log(data);
    }
}

checkSubmissions();
