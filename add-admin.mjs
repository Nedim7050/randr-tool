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

async function createAdmin() {
    console.log('Creating second admin...');
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: 'admin2@company.com',
        password: 'password123',
        email_confirm: true
    });

    if (authError) {
        // user might already exist
        console.error('Error creating user:', authError);
        return;
    }

    const { error: profileError } = await supabaseAdmin.from('admin_profiles').insert([
        { id: authData.user.id, email: 'admin2@company.com' }
    ]);

    if (profileError) {
        console.error('Error creating profile:', profileError);
    } else {
        console.log('Admin 2 created successfully!');
    }
}

createAdmin();
