
-- Create a new public bucket called 'avatars'
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true);

-- Set up access policies for the 'avatars' bucket

-- 1. Allow public access to view all avatar images
create policy "Avatar images are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'avatars' );

-- 2. Allow authenticated users to upload an avatar
create policy "Anyone can upload an avatar"
  on storage.objects for insert
  with check ( bucket_id = 'avatars' and auth.role() = 'authenticated' );

-- 3. Allow users to update their own avatar
create policy "Anyone can update their own avatar"
  on storage.objects for update
  using ( bucket_id = 'avatars' and auth.role() = 'authenticated' );

-- 4. Allow users to delete their own avatar
create policy "Anyone can delete their own avatar"
  on storage.objects for delete
  using ( bucket_id = 'avatars' and auth.role() = 'authenticated' );
