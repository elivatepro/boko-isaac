-- Run this in Supabase SQL Editor to create the reviews table used by the site
create extension if not exists "pgcrypto";

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  role text,
  company text,
  content text not null,
  rating integer not null default 5 check (rating between 1 and 5),
  avatar text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists reviews_created_at_idx on public.reviews (created_at desc);

create or replace function public.set_reviews_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_reviews_updated_at on public.reviews;
create trigger set_reviews_updated_at
before update on public.reviews
for each row
execute function public.set_reviews_updated_at();
