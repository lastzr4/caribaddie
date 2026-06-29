-- Update dummy user avatars — Unsplash direct CDN, no redirect, no CORS
-- Run in: Supabase Dashboard → SQL Editor

UPDATE public.profiles SET avatar_url = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop&crop=face' WHERE display_name = 'Sarah Ahmad';
UPDATE public.profiles SET avatar_url = 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop&crop=face' WHERE display_name = 'Mira Khalid';
UPDATE public.profiles SET avatar_url = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop&crop=face' WHERE display_name = 'Anis Rahman';
UPDATE public.profiles SET avatar_url = 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=500&fit=crop&crop=face' WHERE display_name = 'Nurul Huda';
UPDATE public.profiles SET avatar_url = 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=500&fit=crop&crop=face' WHERE display_name = 'Siti Aisyah';
UPDATE public.profiles SET avatar_url = 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=500&fit=crop&crop=face' WHERE display_name = 'Farah Diana';
UPDATE public.profiles SET avatar_url = 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=500&fit=crop&crop=face' WHERE display_name = 'Aishah Zain';
UPDATE public.profiles SET avatar_url = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face' WHERE display_name = 'Adam Razif';
UPDATE public.profiles SET avatar_url = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop&crop=face' WHERE display_name = 'Hafiz Noor';
UPDATE public.profiles SET avatar_url = 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=500&fit=crop&crop=face' WHERE display_name = 'Zulaikha Omar';
