-- ============================================================
-- CariBuddy — Supabase Storage: avatars bucket
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================================

-- Create the avatars bucket (public read)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  5242880,  -- 5MB limit
  array['image/jpeg','image/png','image/webp','image/gif']
)
on conflict (id) do nothing;

-- Policy: anyone can read avatars (public bucket)
create policy "avatars_public_read" on storage.objects
  for select using (bucket_id = 'avatars');

-- Policy: authenticated users can upload their own avatar
create policy "avatars_user_upload" on storage.objects
  for insert with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: users can update/delete their own avatar
create policy "avatars_user_update" on storage.objects
  for update using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "avatars_user_delete" on storage.objects
  for delete using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
