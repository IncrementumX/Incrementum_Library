create table if not exists public.assets (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  symbol text,
  asset_type text,
  status text not null default 'seeded',
  thesis text not null default '',
  notes text not null default '',
  primary_thread_id uuid references public.chat_threads(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.asset_files (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null references public.assets(id) on delete cascade,
  file_id uuid not null references public.files(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  unique (asset_id, file_id)
);

create table if not exists public.asset_updates (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null references public.assets(id) on delete cascade,
  title text not null,
  happened_at timestamptz not null,
  what_changed text not null,
  why_it_matters text not null,
  thesis_impact text not null,
  analyst_view text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.asset_drafts (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null references public.assets(id) on delete cascade,
  field_key text not null,
  generated_content text not null default '',
  edited_content text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (asset_id, field_key)
);

create table if not exists public.investment_frameworks (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  instructions text not null default '',
  question_set text[] not null default '{}',
  checklist text[] not null default '{}',
  key_lenses text[] not null default '{}',
  preferred_memo_structure text[] not null default '{}',
  red_flags text[] not null default '{}',
  output_preferences text[] not null default '{}',
  is_active boolean not null default false,
  version integer not null default 1,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.insights
  add column if not exists related_asset_id uuid references public.assets(id) on delete set null;

alter table public.chat_threads
  add column if not exists related_asset_id uuid references public.assets(id) on delete set null;

create index if not exists idx_assets_title on public.assets(title);
create index if not exists idx_asset_files_asset_id on public.asset_files(asset_id);
create index if not exists idx_asset_files_file_id on public.asset_files(file_id);
create index if not exists idx_asset_updates_asset_id on public.asset_updates(asset_id);
create index if not exists idx_asset_drafts_asset_id on public.asset_drafts(asset_id);
create index if not exists idx_investment_frameworks_is_active on public.investment_frameworks(is_active);
create index if not exists idx_insights_related_asset_id on public.insights(related_asset_id);
create index if not exists idx_chat_threads_related_asset_id on public.chat_threads(related_asset_id);

drop trigger if exists assets_set_updated_at on public.assets;
create trigger assets_set_updated_at
before update on public.assets
for each row
execute function public.set_updated_at();

drop trigger if exists asset_updates_set_updated_at on public.asset_updates;
create trigger asset_updates_set_updated_at
before update on public.asset_updates
for each row
execute function public.set_updated_at();

drop trigger if exists asset_drafts_set_updated_at on public.asset_drafts;
create trigger asset_drafts_set_updated_at
before update on public.asset_drafts
for each row
execute function public.set_updated_at();

drop trigger if exists investment_frameworks_set_updated_at on public.investment_frameworks;
create trigger investment_frameworks_set_updated_at
before update on public.investment_frameworks
for each row
execute function public.set_updated_at();
