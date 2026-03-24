# Implementation Status

## Real Now

- The app no longer depends conceptually on one giant mock-data file.
- Repositories now sit between the UI and the data source.
- Research is now assets-only in the visible product.
- Runtime mode is centralized through config:
  - fallback/mock when credentials are missing
  - Supabase when credentials are present
- The file workflow now has a clear pipeline shape:
  - file uploaded
  - record created
  - processing requested
  - summary + excerpts generated
  - summary saved back onto the file record
  - insight generation possible
  - file can be linked into an asset
- Assets now have explicit create and edit flows.
- Editable draft fields are prepared for:
  - executive summary
  - what matters
  - key risks
  - counterview
- File-to-asset linking is prepared from both directions.
- Investment framework save flow is prepared in Settings.
- Stored files can be opened through the download route.

## Fallback / Mock

- In fallback mode, folder creation, file upload, asset creation, linking, and insight generation behave like real product actions but do not persist beyond the local seed-backed workflow.
- AI summary generation falls back to a safe placeholder summary when `OPENAI_API_KEY` is absent.

## Waiting For Credentials

- Supabase reads and writes
- storage-backed uploads
- persistent folders, files, assets, chats, insights, frameworks, and drafts
- live AI summary generation

## Manual Setup Later

1. Create a Supabase project.
2. Copy `.env.example` to `.env.local`.
3. Fill:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_STORAGE_BUCKET`
4. Run the SQL in `supabase/migrations/0001_initial_schema.sql`.
5. Run the SQL in `supabase/migrations/0002_assets_pivot.sql`.
6. Create the storage bucket.
7. Restart the dev server.

## Commands To Run After Credentials Are Added

```bash
npm install
npm run lint
npm run build
npm run dev
```

## Best Next Step After Setup

- Replace the remaining fallback write previews with persistent Supabase writes end-to-end.
- Then add provider-backed generation with OpenAI and Anthropic.
- Then add real extracted text parsing before summary generation.
