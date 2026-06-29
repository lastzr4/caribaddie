-- ============================================================
-- CariBuddy — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================


-- ============================================================
-- EXTENSIONS
-- ============================================================
create extension if not exists "uuid-ossp";


-- ============================================================
-- ENUMS
-- ============================================================
create type gender_type as enum ('male', 'female');
create type preferred_gender_type as enum ('male', 'female', 'any');
create type skill_level_type as enum ('beginner', 'intermediate', 'advanced');
create type activity_category_type as enum ('solo', 'team', 'both');
create type match_status_type as enum ('pending', 'matched', 'rejected');
create type plan_type as enum ('free', 'freemium', 'premium');


-- ============================================================
-- TABLE: profiles
-- Auto-created on signup via trigger
-- ============================================================
create table public.profiles (
  id              uuid references auth.users(id) on delete cascade primary key,
  username        text unique,
  display_name    text,
  gender          gender_type,
  preferred_gender preferred_gender_type default 'any',
  bio             text,
  avatar_url      text,
  location_area   text,
  is_verified     boolean default false,
  plan            plan_type default 'free',
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- Index for fast lookup
create index profiles_gender_idx on public.profiles(gender);
create index profiles_location_idx on public.profiles(location_area);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function update_updated_at();

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();


-- ============================================================
-- TABLE: activities
-- Seed data below
-- ============================================================
create table public.activities (
  id       uuid default uuid_generate_v4() primary key,
  name     text not null,
  name_ms  text not null,
  icon     text not null,
  category activity_category_type not null
);


-- ============================================================
-- TABLE: user_activities
-- Which activities a user wants a buddy for
-- ============================================================
create table public.user_activities (
  id             uuid default uuid_generate_v4() primary key,
  user_id        uuid references public.profiles(id) on delete cascade not null,
  activity_id    uuid references public.activities(id) on delete cascade not null,
  schedule_note  text,
  skill_level    skill_level_type default 'beginner',
  is_active      boolean default true,
  created_at     timestamptz default now(),
  unique(user_id, activity_id)
);

create index user_activities_user_idx on public.user_activities(user_id);
create index user_activities_activity_idx on public.user_activities(activity_id);


-- ============================================================
-- TABLE: swipes
-- Tracks every swipe action
-- ============================================================
create table public.swipes (
  id          uuid default uuid_generate_v4() primary key,
  swiper_id   uuid references public.profiles(id) on delete cascade not null,
  target_id   uuid references public.profiles(id) on delete cascade not null,
  activity_id uuid references public.activities(id) on delete cascade not null,
  liked       boolean not null,
  created_at  timestamptz default now(),
  unique(swiper_id, target_id, activity_id),
  check(swiper_id != target_id)
);

create index swipes_swiper_idx on public.swipes(swiper_id);
create index swipes_target_liked_idx on public.swipes(target_id, liked);

-- Auto-create match when both users swipe right
create or replace function check_mutual_like()
returns trigger as $$
declare
  reverse_swipe record;
begin
  if new.liked = false then
    return new;
  end if;

  select * into reverse_swipe
  from public.swipes
  where swiper_id = new.target_id
    and target_id = new.swiper_id
    and activity_id = new.activity_id
    and liked = true;

  if found then
    insert into public.matches (user_a, user_b, activity_id)
    values (
      least(new.swiper_id::text, new.target_id::text)::uuid,
      greatest(new.swiper_id::text, new.target_id::text)::uuid,
      new.activity_id
    )
    on conflict do nothing;
  end if;

  return new;
end;
$$ language plpgsql security definer;

create trigger on_swipe_check_match
  after insert on public.swipes
  for each row execute function check_mutual_like();


-- ============================================================
-- TABLE: matches
-- Created automatically via trigger above
-- ============================================================
create table public.matches (
  id          uuid default uuid_generate_v4() primary key,
  user_a      uuid references public.profiles(id) on delete cascade not null,
  user_b      uuid references public.profiles(id) on delete cascade not null,
  activity_id uuid references public.activities(id) on delete cascade not null,
  status      match_status_type default 'matched',
  created_at  timestamptz default now(),
  unique(user_a, user_b, activity_id),
  check(user_a < user_b)
);

create index matches_user_a_idx on public.matches(user_a);
create index matches_user_b_idx on public.matches(user_b);


-- ============================================================
-- TABLE: messages
-- Chat within a match
-- ============================================================
create table public.messages (
  id          uuid default uuid_generate_v4() primary key,
  match_id    uuid references public.matches(id) on delete cascade not null,
  sender_id   uuid references public.profiles(id) on delete cascade not null,
  content     text not null check(char_length(content) > 0 and char_length(content) <= 1000),
  read_at     timestamptz,
  created_at  timestamptz default now()
);

create index messages_match_idx on public.messages(match_id, created_at desc);


-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

alter table public.profiles enable row level security;
alter table public.activities enable row level security;
alter table public.user_activities enable row level security;
alter table public.swipes enable row level security;
alter table public.matches enable row level security;
alter table public.messages enable row level security;

-- profiles: anyone can read, only owner can update
create policy "profiles_read" on public.profiles
  for select using (true);

create policy "profiles_update" on public.profiles
  for update using (auth.uid() = id);

-- activities: public read
create policy "activities_read" on public.activities
  for select using (true);

-- user_activities: owner only
create policy "user_activities_read" on public.user_activities
  for select using (auth.uid() = user_id);

create policy "user_activities_insert" on public.user_activities
  for insert with check (auth.uid() = user_id);

create policy "user_activities_update" on public.user_activities
  for update using (auth.uid() = user_id);

create policy "user_activities_delete" on public.user_activities
  for delete using (auth.uid() = user_id);

-- swipes: only swiper can see own swipes
create policy "swipes_insert" on public.swipes
  for insert with check (auth.uid() = swiper_id);

create policy "swipes_read" on public.swipes
  for select using (auth.uid() = swiper_id);

-- matches: both users can see their match
create policy "matches_read" on public.matches
  for select using (auth.uid() = user_a or auth.uid() = user_b);

-- messages: only match participants can read/write
create policy "messages_read" on public.messages
  for select using (
    exists (
      select 1 from public.matches
      where id = match_id
        and (user_a = auth.uid() or user_b = auth.uid())
    )
  );

create policy "messages_insert" on public.messages
  for insert with check (
    auth.uid() = sender_id
    and exists (
      select 1 from public.matches
      where id = match_id
        and (user_a = auth.uid() or user_b = auth.uid())
    )
  );

create policy "messages_update_read" on public.messages
  for update using (
    exists (
      select 1 from public.matches
      where id = match_id
        and (user_a = auth.uid() or user_b = auth.uid())
    )
  );


-- ============================================================
-- REALTIME
-- Enable realtime for chat & matches
-- ============================================================
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.matches;


-- ============================================================
-- SEED DATA: activities
-- ============================================================
insert into public.activities (name, name_ms, icon, category) values
  ('Jogging',   'Jogging',        '🏃', 'both'),
  ('Pilates',   'Pilates',        '🧘', 'solo'),
  ('Ping Pong', 'Ping Pong',      '🏓', 'both'),
  ('Movies',    'Wayang',         '🎬', 'solo'),
  ('Badminton', 'Badminton',      '🏸', 'team'),
  ('Hiking',    'Mendaki',        '🥾', 'both'),
  ('Cycling',   'Berbasikal',     '🚴', 'both'),
  ('Swimming',  'Berenang',       '🏊', 'solo'),
  ('Futsal',    'Futsal',         '⚽', 'team'),
  ('Marathon',  'Marathon',       '🏅', 'both'),
  ('Gym',       'Gim',            '💪', 'solo'),
  ('Tennis',    'Tenis',          '🎾', 'both');
