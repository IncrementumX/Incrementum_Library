create extension if not exists "pgcrypto";

create table if not exists public.folders (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null default '',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.files (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  folder_id uuid not null references public.folders(id) on delete cascade,
  title text not null,
  author text not null default 'Unknown',
  kind text not null,
  published_at date,
  added_at timestamptz not null default timezone('utc', now()),
  tags text[] not null default '{}',
  summary_status text not null default 'queued',
  processing_status text not null default 'idle',
  summary text not null default '',
  key_takeaways text[] not null default '{}',
  excerpts text[] not null default '{}',
  analyst_interpretation text not null default '',
  storage_bucket text,
  storage_path text,
  mime_type text,
  file_size_bytes bigint,
  original_file_name text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.research_items (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  type text not null,
  category_label text not null,
  status text not null default 'seeded',
  executive_summary text not null default '',
  key_pillars text[] not null default '{}',
  core_view text not null default '',
  primary_thread_id uuid,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.file_research_links (
  id uuid primary key default gen_random_uuid(),
  file_id uuid not null references public.files(id) on delete cascade,
  research_item_id uuid not null references public.research_items(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  unique (file_id, research_item_id)
);

create table if not exists public.research_updates (
  id uuid primary key default gen_random_uuid(),
  research_item_id uuid not null references public.research_items(id) on delete cascade,
  title text not null,
  happened_at timestamptz not null,
  what_changed text not null,
  why_it_matters text not null,
  thesis_impact text not null,
  analyst_view text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.insights (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  published_at timestamptz not null,
  summary text not null,
  what_matters text not null,
  related_file_id uuid references public.files(id) on delete set null,
  related_research_id uuid references public.research_items(id) on delete set null,
  review_status text not null default 'draft',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.chat_threads (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  updated_at timestamptz not null default timezone('utc', now()),
  context_type text not null default 'general',
  context_label text not null default 'General',
  related_research_id uuid references public.research_items(id) on delete set null,
  preview text not null default '',
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.chat_threads(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  author text not null,
  body text not null
);

alter table public.insights
  add column if not exists related_thread_id uuid references public.chat_threads(id) on delete set null;

alter table public.research_items
  drop constraint if exists research_items_primary_thread_id_fkey;

alter table public.research_items
  add constraint research_items_primary_thread_id_fkey
  foreign key (primary_thread_id) references public.chat_threads(id) on delete set null;

create index if not exists idx_files_folder_id on public.files(folder_id);
create index if not exists idx_files_added_at on public.files(added_at desc);
create index if not exists idx_research_items_type on public.research_items(type);
create index if not exists idx_research_updates_research_item_id on public.research_updates(research_item_id);
create index if not exists idx_insights_related_research_id on public.insights(related_research_id);
create index if not exists idx_chat_threads_related_research_id on public.chat_threads(related_research_id);
create index if not exists idx_chat_messages_thread_id on public.chat_messages(thread_id, created_at);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$ language plpgsql;

drop trigger if exists folders_set_updated_at on public.folders;
create trigger folders_set_updated_at
before update on public.folders
for each row
execute function public.set_updated_at();

drop trigger if exists files_set_updated_at on public.files;
create trigger files_set_updated_at
before update on public.files
for each row
execute function public.set_updated_at();

drop trigger if exists research_items_set_updated_at on public.research_items;
create trigger research_items_set_updated_at
before update on public.research_items
for each row
execute function public.set_updated_at();

drop trigger if exists research_updates_set_updated_at on public.research_updates;
create trigger research_updates_set_updated_at
before update on public.research_updates
for each row
execute function public.set_updated_at();

drop trigger if exists insights_set_updated_at on public.insights;
create trigger insights_set_updated_at
before update on public.insights
for each row
execute function public.set_updated_at();
