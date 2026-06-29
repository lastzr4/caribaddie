-- Update dummy user avatars to use picsum.photos (reliable, real photos, no CORS)
-- picsum.photos/seed/{text}/{width}/{height} → same seed = same photo always

UPDATE public.profiles SET avatar_url = 'https://picsum.photos/seed/sarah-ahmad/400/500'    WHERE username IS NULL AND display_name = 'Sarah Ahmad';
UPDATE public.profiles SET avatar_url = 'https://picsum.photos/seed/mira-khalid/400/500'    WHERE username IS NULL AND display_name = 'Mira Khalid';
UPDATE public.profiles SET avatar_url = 'https://picsum.photos/seed/anis-rahman/400/500'    WHERE username IS NULL AND display_name = 'Anis Rahman';
UPDATE public.profiles SET avatar_url = 'https://picsum.photos/seed/nurul-huda/400/500'     WHERE username IS NULL AND display_name = 'Nurul Huda';
UPDATE public.profiles SET avatar_url = 'https://picsum.photos/seed/siti-aisyah/400/500'   WHERE username IS NULL AND display_name = 'Siti Aisyah';
UPDATE public.profiles SET avatar_url = 'https://picsum.photos/seed/farah-diana/400/500'   WHERE username IS NULL AND display_name = 'Farah Diana';
UPDATE public.profiles SET avatar_url = 'https://picsum.photos/seed/aishah-zain/400/500'   WHERE username IS NULL AND display_name = 'Aishah Zain';
UPDATE public.profiles SET avatar_url = 'https://picsum.photos/seed/adam-razif/400/500'    WHERE username IS NULL AND display_name = 'Adam Razif';
UPDATE public.profiles SET avatar_url = 'https://picsum.photos/seed/hafiz-noor/400/500'    WHERE username IS NULL AND display_name = 'Hafiz Noor';
UPDATE public.profiles SET avatar_url = 'https://picsum.photos/seed/zulaikha-omar/400/500' WHERE username IS NULL AND display_name = 'Zulaikha Omar';
