# Supabase Setup

This project can run in two modes:

- `mock`
  - default fallback when credentials are missing
- `supabase`
  - enabled automatically when the required env vars are present

## Required Environment Variables

Copy `.env.example` to `.env.local` and fill in:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_STORAGE_BUCKET`

## Schema / Migration

Run the SQL in:

- `supabase/migrations/0001_initial_schema.sql`
- `supabase/migrations/0002_assets_pivot.sql`

You can paste it into the Supabase SQL editor or run it through the Supabase CLI later.

## Storage

Create a bucket matching `SUPABASE_STORAGE_BUCKET`.

Recommended default:

- `library-files`

## After Credentials Are Added

1. Add your env vars to `.env.local`
2. Run both SQL migrations
3. Create the storage bucket
4. Restart the Next.js dev server
5. The repositories will automatically switch from mock mode to Supabase mode when `DATA_MODE=auto`

## Asset-First Tables Added In 0002

- `assets`
- `asset_files`
- `asset_updates`
- `asset_drafts`
- `investment_frameworks`

The second migration also adds:

- `insights.related_asset_id`
- `chat_threads.related_asset_id`
