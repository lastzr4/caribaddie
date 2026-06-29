-- ============================================================
-- CariBuddy — 10 Dummy Users for Testing
-- Run in: Supabase Dashboard → SQL Editor
-- Password for all users: Test1234!
-- ============================================================

DO $$
DECLARE
  -- Fixed UUIDs so we can re-run safely
  u1  uuid := 'cb000001-0000-0000-0000-000000000001';
  u2  uuid := 'cb000001-0000-0000-0000-000000000002';
  u3  uuid := 'cb000001-0000-0000-0000-000000000003';
  u4  uuid := 'cb000001-0000-0000-0000-000000000004';
  u5  uuid := 'cb000001-0000-0000-0000-000000000005';
  u6  uuid := 'cb000001-0000-0000-0000-000000000006';
  u7  uuid := 'cb000001-0000-0000-0000-000000000007';
  u8  uuid := 'cb000001-0000-0000-0000-000000000008';
  u9  uuid := 'cb000001-0000-0000-0000-000000000009';
  u10 uuid := 'cb000001-0000-0000-0000-000000000010';
BEGIN

-- ============================================================
-- STEP 1: Insert into auth.users
-- ============================================================
INSERT INTO auth.users (
  id, instance_id, aud, role,
  email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data,
  is_super_admin, is_sso_user
)
VALUES
  (u1,  '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'sarah.ahmad@test.com',   crypt('Test1234!', gen_salt('bf')),
   now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', false, false),

  (u2,  '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'mira.khalid@test.com',   crypt('Test1234!', gen_salt('bf')),
   now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', false, false),

  (u3,  '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'anis.rahman@test.com',   crypt('Test1234!', gen_salt('bf')),
   now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', false, false),

  (u4,  '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'nurul.huda@test.com',    crypt('Test1234!', gen_salt('bf')),
   now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', false, false),

  (u5,  '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'siti.aisyah@test.com',   crypt('Test1234!', gen_salt('bf')),
   now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', false, false),

  (u6,  '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'farah.diana@test.com',   crypt('Test1234!', gen_salt('bf')),
   now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', false, false),

  (u7,  '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'aishah.zain@test.com',   crypt('Test1234!', gen_salt('bf')),
   now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', false, false),

  (u8,  '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'adam.razif@test.com',    crypt('Test1234!', gen_salt('bf')),
   now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', false, false),

  (u9,  '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'hafiz.noor@test.com',    crypt('Test1234!', gen_salt('bf')),
   now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', false, false),

  (u10, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'zulaikha.omar@test.com', crypt('Test1234!', gen_salt('bf')),
   now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', false, false)

ON CONFLICT (id) DO NOTHING;


-- ============================================================
-- STEP 2: Update profiles (trigger auto-created them)
-- Avatar: randomuser.me/api/portraits/women|men/N.jpg
-- ============================================================
UPDATE public.profiles SET
  display_name     = 'Sarah Ahmad',
  bio              = 'Suka jogging pagi sebelum kerja! Target 5km sehari. Cari buddy perempuan kawasan Bangsar.',
  gender           = 'female',
  preferred_gender = 'female',
  location_area    = 'Bangsar',
  avatar_url       = 'https://api.dicebear.com/9.x/avataaars/png?seed=SarahAhmad&backgroundColor=b6e3f4',
  is_verified      = true,
  lat              = 3.1319,
  lng              = 101.6770
WHERE id = u1;

UPDATE public.profiles SET
  display_name     = 'Mira Khalid',
  bio              = 'Pilates enthusiast sejak 2022. Kelas 3x seminggu di Mont Kiara. Nak kawan yang sama passion!',
  gender           = 'female',
  preferred_gender = 'any',
  location_area    = 'Mont Kiara',
  avatar_url       = 'https://api.dicebear.com/9.x/avataaars/png?seed=MiraKhalid&backgroundColor=c0aede',
  is_verified      = true,
  lat              = 3.1728,
  lng              = 101.6530
WHERE id = u2;

UPDATE public.profiles SET
  display_name     = 'Anis Rahman',
  bio              = 'Badminton addict! Main setiap Sabtu pagi. Level intermediate, prefer partner perempuan.',
  gender           = 'female',
  preferred_gender = 'female',
  location_area    = 'Petaling Jaya',
  avatar_url       = 'https://api.dicebear.com/9.x/avataaars/png?seed=AnisRahman&backgroundColor=d1d4f9',
  is_verified      = false,
  lat              = 3.1073,
  lng              = 101.6067
WHERE id = u3;

UPDATE public.profiles SET
  display_name     = 'Nurul Huda',
  bio              = 'Movie buff! Suka tengok filem Isnin pagi (tiket murah 😄). Genre: thriller & romance.',
  gender           = 'female',
  preferred_gender = 'female',
  location_area    = 'Cheras',
  avatar_url       = 'https://api.dicebear.com/9.x/avataaars/png?seed=NurulHuda&backgroundColor=ffd5dc',
  is_verified      = false,
  lat              = 3.0927,
  lng              = 101.7258
WHERE id = u4;

UPDATE public.profiles SET
  display_name     = 'Siti Aisyah',
  bio              = 'Marathon runner — dah habiskan 3 full marathon! Sekarang training untuk KL Marathon.',
  gender           = 'female',
  preferred_gender = 'any',
  location_area    = 'Shah Alam',
  avatar_url       = 'https://api.dicebear.com/9.x/avataaars/png?seed=SitiAisyah&backgroundColor=b6e3f4',
  is_verified      = true,
  lat              = 3.0733,
  lng              = 101.5185
WHERE id = u5;

UPDATE public.profiles SET
  display_name     = 'Farah Diana',
  bio              = 'Gym rat 💪 Pergi gym tiap pagi sebelum office. Nak workout buddy yang serious!',
  gender           = 'female',
  preferred_gender = 'female',
  location_area    = 'Subang Jaya',
  avatar_url       = 'https://api.dicebear.com/9.x/avataaars/png?seed=FarahDiana&backgroundColor=ffdfbf',
  is_verified      = false,
  lat              = 3.0559,
  lng              = 101.5834
WHERE id = u6;

UPDATE public.profiles SET
  display_name     = 'Aishah Zain',
  bio              = 'Hiking fanatic! Dah jejak semua bukit dalam KL. Next target: Gunung Ledang.',
  gender           = 'female',
  preferred_gender = 'female',
  location_area    = 'Ampang',
  avatar_url       = 'https://api.dicebear.com/9.x/avataaars/png?seed=AishahZain&backgroundColor=c0aede',
  is_verified      = true,
  lat              = 3.1548,
  lng              = 101.7626
WHERE id = u7;

UPDATE public.profiles SET
  display_name     = 'Adam Razif',
  bio              = 'Futsal & badminton. Main setiap petang Rabu & Jumaat. Cari kawan tambahan!',
  gender           = 'male',
  preferred_gender = 'male',
  location_area    = 'Kuala Lumpur',
  avatar_url       = 'https://api.dicebear.com/9.x/avataaars/png?seed=AdamRazif&backgroundColor=b6e3f4',
  is_verified      = false,
  lat              = 3.1412,
  lng              = 101.6865
WHERE id = u8;

UPDATE public.profiles SET
  display_name     = 'Hafiz Noor',
  bio              = 'Jogging dan cycling weekend. Biasanya round Putrajaya atau Taman Botani. Join sama!',
  gender           = 'male',
  preferred_gender = 'any',
  location_area    = 'Putrajaya',
  avatar_url       = 'https://api.dicebear.com/9.x/avataaars/png?seed=HafizNoor&backgroundColor=d1d4f9',
  is_verified      = true,
  lat              = 2.9264,
  lng              = 101.6964
WHERE id = u9;

UPDATE public.profiles SET
  display_name     = 'Zulaikha Omar',
  bio              = 'Swimming 4x seminggu. Nak kawan perempuan yang nak improve stroke bersama-sama.',
  gender           = 'female',
  preferred_gender = 'female',
  location_area    = 'Kepong',
  avatar_url       = 'https://api.dicebear.com/9.x/avataaars/png?seed=ZulaikhaOmar&backgroundColor=ffd5dc',
  is_verified      = false,
  lat              = 3.2094,
  lng              = 101.6304
WHERE id = u10;


-- ============================================================
-- STEP 3: Add user_activities (link users to activities)
-- ============================================================
INSERT INTO public.user_activities (user_id, activity_id, skill_level, schedule_note)
SELECT u1, id, 'intermediate', 'Pagi 6-7am' FROM public.activities WHERE name = 'Jogging'
ON CONFLICT DO NOTHING;

INSERT INTO public.user_activities (user_id, activity_id, skill_level, schedule_note)
SELECT u2, id, 'advanced', '3x seminggu' FROM public.activities WHERE name = 'Pilates'
ON CONFLICT DO NOTHING;

INSERT INTO public.user_activities (user_id, activity_id, skill_level, schedule_note)
SELECT u3, id, 'intermediate', 'Sabtu pagi' FROM public.activities WHERE name = 'Badminton'
ON CONFLICT DO NOTHING;

INSERT INTO public.user_activities (user_id, activity_id, skill_level, schedule_note)
SELECT u4, id, 'beginner', 'Isnin-Rabu' FROM public.activities WHERE name = 'Movies'
ON CONFLICT DO NOTHING;

INSERT INTO public.user_activities (user_id, activity_id, skill_level, schedule_note)
SELECT u5, id, 'advanced', 'Weekend' FROM public.activities WHERE name = 'Marathon'
ON CONFLICT DO NOTHING;

INSERT INTO public.user_activities (user_id, activity_id, skill_level, schedule_note)
SELECT u6, id, 'advanced', 'Pagi 5-6am' FROM public.activities WHERE name = 'Gym'
ON CONFLICT DO NOTHING;

INSERT INTO public.user_activities (user_id, activity_id, skill_level, schedule_note)
SELECT u7, id, 'intermediate', 'Weekend' FROM public.activities WHERE name = 'Hiking'
ON CONFLICT DO NOTHING;

INSERT INTO public.user_activities (user_id, activity_id, skill_level, schedule_note)
SELECT u8, id, 'intermediate', 'Rabu & Jumaat petang' FROM public.activities WHERE name = 'Futsal'
ON CONFLICT DO NOTHING;

INSERT INTO public.user_activities (user_id, activity_id, skill_level, schedule_note)
SELECT u9, id, 'intermediate', 'Sabtu pagi' FROM public.activities WHERE name = 'Cycling'
ON CONFLICT DO NOTHING;

INSERT INTO public.user_activities (user_id, activity_id, skill_level, schedule_note)
SELECT u10, id, 'intermediate', '4x seminggu' FROM public.activities WHERE name = 'Swimming'
ON CONFLICT DO NOTHING;

-- Bonus: add extra activities for some users
INSERT INTO public.user_activities (user_id, activity_id, skill_level, schedule_note)
SELECT u1, id, 'beginner', 'Weekend' FROM public.activities WHERE name = 'Hiking'
ON CONFLICT DO NOTHING;

INSERT INTO public.user_activities (user_id, activity_id, skill_level, schedule_note)
SELECT u5, id, 'advanced', 'Pagi' FROM public.activities WHERE name = 'Jogging'
ON CONFLICT DO NOTHING;

INSERT INTO public.user_activities (user_id, activity_id, skill_level, schedule_note)
SELECT u8, id, 'beginner', 'Petang' FROM public.activities WHERE name = 'Badminton'
ON CONFLICT DO NOTHING;

RAISE NOTICE 'Done! 10 dummy users created. Login: email + password Test1234!';
END;
$$;
