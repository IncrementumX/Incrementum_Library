# Incrementum Library

Incrementum Library is a living investment research workspace centered around a resident analyst.

The product is now asset-first:

- Library is the source of truth for uploaded materials
- Assets are the central research object
- Important AI outputs stay editable by the user
- The active investment framework shapes future analyst drafts

The app now supports a clean dual mode:

- `mock / fallback mode`
  - runs without external credentials
  - uses repository-backed seed data and non-persistent workflow previews
- `real mode`
  - activates when Supabase credentials are present
  - uses the same repositories and workflow boundaries

## Install

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

Then open `http://localhost:3000`.

## Environment

Copy:

```bash
cp .env.example .env.local
```

If you leave Supabase and AI credentials blank, the app stays in fallback mode and still runs.

## Current Routes

- `/`
- `/library`
- `/library/upload`
- `/library/folders/new`
- `/library/[sourceSlug]`
- `/research`
- `/research/new`
- `/research/assets/[slug]`
- `/research/assets/[slug]/edit`
- `/insights`
- `/notebook`
- `/search`
- `/settings`

## Architecture

- `app/`
  - Next.js App Router pages and API route handlers
- `components/`
  - Reusable UI and workflow components
- `lib/config/`
  - runtime mode and feature configuration
- `lib/repositories/`
  - folders, files, assets, frameworks, chats, insights, and analyst repositories
- `lib/services/`
  - upload, processing, summary, and insight workflow services
- `lib/supabase/`
  - Supabase client and storage helpers
- `lib/mock/`
  - fallback seed data only
- `supabase/migrations/`
  - first-pass SQL schema

## What Is Real Now

- repository-based data access
- centralized fallback vs Supabase mode selection
- folder creation API boundary
- multi-file upload API boundary
- file processing pipeline shape
- persisted summary/excerpt save-back after upload
- insight generation service boundary
- asset creation and edit form flow
- file-to-asset linking API boundary
- investment framework repository and save flow
- download/open route for stored files

## What Is Still Fallback / Preview

- data persists only when Supabase is configured
- uploads are non-persistent in fallback mode
- AI summary generation degrades gracefully without `OPENAI_API_KEY`
- chat sending, folder creation, asset creation, and framework saving are workflow-real but persistence depends on credentials

## Supabase Preparation

See:

- `supabase/README.md`
- `supabase/migrations/0001_initial_schema.sql`
- `supabase/migrations/0002_assets_pivot.sql`

## Verification

- `npm run lint`
- `npm run build`
