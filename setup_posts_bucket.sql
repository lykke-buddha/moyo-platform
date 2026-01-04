
-- Create a new public bucket called 'posts'
insert into storage.buckets (id, name, public)
values ('posts', 'posts', true);

-- Set up access policies for the 'posts' bucket

-- 1. Allow public access to view all post images
create policy "Post images are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'posts' );

-- 2. Allow authenticated users to upload post images
create policy "Anyone can upload a post image"
  on storage.objects for insert
  with check ( bucket_id = 'posts' and auth.role() = 'authenticated' );

-- 3. Allow users to update their own post images
create policy "Anyone can update their own post images"
  on storage.objects for update
  using ( bucket_id = 'posts' and auth.role() = 'authenticated' );

-- 4. Allow users to delete their own post images
create policy "Anyone can delete their own post images"
  on storage.objects for delete
  using ( bucket_id = 'posts' and auth.role() = 'authenticated' );
