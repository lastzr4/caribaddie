-- Run this in Supabase SQL Editor after schema.sql

create table if not exists public.app_config (
  key   text primary key,
  value text not null
);

-- Only service_role can write; anon can read
alter table public.app_config enable row level security;

create policy "config_read" on public.app_config
  for select using (true);

create policy "config_write" on public.app_config
  for all using (auth.role() = 'service_role');

-- Default config values
insert into public.app_config (key, value) values
  ('appName',      'CariBuddy'),
  ('logoEmoji',    '👥'),
  ('tagline',      'Cari rakan aktiviti kamu'),
  ('primaryColor', '#C4622D'),
  ('fontFamily',   'geist'),
  ('adminEmail',   'lastzr4@gmail.com')
on conflict (key) do nothing;
