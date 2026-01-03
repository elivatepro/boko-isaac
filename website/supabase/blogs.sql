-- Run this in Supabase SQL Editor to create the blogs table
create extension if not exists "pgcrypto";

create table if not exists public.blogs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  subtitle text,
  summary text,
  content text,
  image text,
  published_at date,
  tag text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists blogs_published_at_idx on public.blogs (published_at desc);

create or replace function public.set_blogs_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_blogs_updated_at on public.blogs;
create trigger set_blogs_updated_at
before update on public.blogs
for each row
execute function public.set_blogs_updated_at();
