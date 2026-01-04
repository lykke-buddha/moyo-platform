-- Create a table for public profiles using the auth.users table properties
create table public.profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  is_verified boolean default false,
  role text default 'user' check (role in ('user', 'creator', 'admin')),
  bio text
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on public.profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on public.profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on public.profiles for update
  using ( auth.uid() = id );

-- Create a table for posts
create table public.posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  content text,
  image_url text,
  video_url text, -- optional
  is_premium boolean default false,
  price numeric(10, 2) default 0,
  tags text[]
);

-- Set up RLS for posts
alter table public.posts enable row level security;

create policy "Posts are viewable by everyone."
  on public.posts for select
  using ( true );

create policy "Users can insert their own posts."
  on public.posts for insert
  with check ( auth.uid() = user_id );

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
