-- Enable uuid-ossp extension if not already enabled
create extension if not exists "uuid-ossp";

-- 1. admin_profiles table
create table public.admin_profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.admin_profiles enable row level security;

create policy "Admins can view all admin_profiles" on public.admin_profiles
  for select using (auth.uid() in (select id from public.admin_profiles));

-- 2. metric_types table
create table public.metric_types (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  points integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.metric_types enable row level security;

create policy "Anyone can view metric_types" on public.metric_types
  for select using (true);

-- Insert default metrics
insert into public.metric_types (name, points) values
  ('Class Shout', 10),
  ('Stand Attendance', 5),
  ('Marketing Content Repost on Facebook or Instagram', 3),
  ('Sharing With Classmates Proof', 2),
  ('Comment On Marketing Department Posts', 1);

-- 3. submissions table
create type submission_status as enum ('pending', 'accepted', 'rejected');

create table public.submissions (
  id uuid default uuid_generate_v4() primary key,
  first_name text not null,
  last_name text not null,
  email text not null,
  department text not null,
  position text not null,
  metric_type_id uuid references public.metric_types(id) not null,
  awarded_points integer not null,
  proof_path text not null,
  proof_url text not null,
  proof_type text not null,
  status submission_status default 'pending'::submission_status not null,
  reviewed_by uuid references public.admin_profiles(id),
  reviewed_at timestamp with time zone,
  admin_note text,
  sheet_sync_status boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.submissions enable row level security;

-- Public can insert submissions
create policy "Anyone can insert submissions" on public.submissions
  for insert with check (true);

-- Admins can read all submissions
create policy "Admins can view all submissions" on public.submissions
  for select using (auth.uid() in (select id from public.admin_profiles));

-- Admins can update submissions
create policy "Admins can update submissions" on public.submissions
  for update using (auth.uid() in (select id from public.admin_profiles));

-- 4. Leaderboard View
create or replace view public.leaderboard as
select
  lower(email) as email,
  MAX(first_name) as first_name,
  MAX(last_name) as last_name,
  MAX(department) as department,
  MAX(position) as position,
  sum(awarded_points) as total_accepted_points
from
  public.submissions
where
  status = 'accepted'
group by
  lower(email)
order by
  total_accepted_points desc;

-- Proofs Storage Bucket
insert into storage.buckets (id, name, public) values ('proofs', 'proofs', true);

-- Storage Policies for proofs
create policy "Anyone can upload proofs" on storage.objects
  for insert with check ( bucket_id = 'proofs' );

create policy "Anyone can view proofs" on storage.objects
  for select using ( bucket_id = 'proofs' );
