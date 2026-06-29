-- Update dummy user avatars to pravatar.cc
-- Serves photos directly (no redirect), portrait photos, no CORS issues
-- Run in: Supabase Dashboard → SQL Editor

UPDATE public.profiles SET avatar_url = 'https://i.pravatar.cc/400?img=5'  WHERE display_name = 'Sarah Ahmad';
UPDATE public.profiles SET avatar_url = 'https://i.pravatar.cc/400?img=9'  WHERE display_name = 'Mira Khalid';
UPDATE public.profiles SET avatar_url = 'https://i.pravatar.cc/400?img=16' WHERE display_name = 'Anis Rahman';
UPDATE public.profiles SET avatar_url = 'https://i.pravatar.cc/400?img=21' WHERE display_name = 'Nurul Huda';
UPDATE public.profiles SET avatar_url = 'https://i.pravatar.cc/400?img=25' WHERE display_name = 'Siti Aisyah';
UPDATE public.profiles SET avatar_url = 'https://i.pravatar.cc/400?img=29' WHERE display_name = 'Farah Diana';
UPDATE public.profiles SET avatar_url = 'https://i.pravatar.cc/400?img=33' WHERE display_name = 'Aishah Zain';
UPDATE public.profiles SET avatar_url = 'https://i.pravatar.cc/400?img=52' WHERE display_name = 'Adam Razif';
UPDATE public.profiles SET avatar_url = 'https://i.pravatar.cc/400?img=57' WHERE display_name = 'Hafiz Noor';
UPDATE public.profiles SET avatar_url = 'https://i.pravatar.cc/400?img=38' WHERE display_name = 'Zulaikha Omar';
