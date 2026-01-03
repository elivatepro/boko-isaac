-- Run this in Supabase SQL Editor to create the projects table used by the site
create extension if not exists "pgcrypto";

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text,
  content text,
  images text[] default '{}'::text[],
  published_at date,
  link text,
  team jsonb default '[]'::jsonb,
  image text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists projects_published_at_idx on public.projects (published_at desc);

create or replace function public.set_projects_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at
before update on public.projects
for each row
execute function public.set_projects_updated_at();
