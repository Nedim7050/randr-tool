# R and R Tool Tracking System

A full-stack web application for employees to submit Reward and Recognition proofs.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database & Auth**: Supabase (PostgreSQL, Storage, Auth)
- **Integrations**: Google Sheets API
- **Deployment**: Vercel

## Deployment Instructions (Vercel & GitHub)

### 1. Database Setup (Supabase)
1. Create a new project on [Supabase](https://supabase.com).
2. Go to the SQL Editor and run the contents of `schema.sql`.
3. Go to **Authentication > Users** and manually invite or create an Admin user (they will be inserted into the `auth.users` table). 
4. Important: You must manually insert their user ID into the `public.admin_profiles` table to grant them admin privileges:
   ```sql
   insert into public.admin_profiles (id, email) values ('<USER_UUID>', 'admin@example.com');
   ```

### 2. Google Sheets Setup
1. Go to Google Cloud Console and create a Service Account.
2. Generate a JSON private key.
3. Share your target Google Sheet with the Service Account email (give it Editor access).
4. Note your Google Sheet ID from the URL (e.g., `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID_HERE/edit`).

### 3. Vercel Deployment
1. Push this repository to GitHub.
2. Import the project in Vercel.
3. Add the following Environment Variables in the Vercel dashboard:

| Variable Name | Description |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase Anon Key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase Service Role Key |
| `GOOGLE_CLIENT_EMAIL` | Service Account email address |
| `GOOGLE_PRIVATE_KEY` | The private key string (must include `\n`) |
| `GOOGLE_SHEET_ID` | The ID of the target spreadsheet |

4. Deploy the application. Vercel will build the Next.js app and assign a domain.

## Local Development

1. Create a `.env.local` file by copying `.env.example`.
2. Fill in the required credentials.
3. Install dependencies: `npm install`
4. Run the development server: `npm run dev`
5. Visit `http://localhost:3000`
