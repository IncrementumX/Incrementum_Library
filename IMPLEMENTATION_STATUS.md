# Implementation Status

## Real Now

- The app no longer depends conceptually on one giant mock-data file.
- Repositories now sit between the UI and the data source.
- Runtime mode is centralized through config:
  - fallback/mock when credentials are missing
  - Supabase when credentials are present
- The file workflow now has a clear pipeline shape:
  - file uploaded
  - record created
  - processing requested
  - summary generation staged
  - insight generation possible
  - file can be linked into research
- Research now has explicit create and edit flows.
- File-to-research linking is prepared from both directions.

## Fallback / Mock

- In fallback mode, folder creation, file upload, research creation, linking, and insight generation behave like real product actions but do not persist beyond the local seed-backed workflow.
- AI summary generation falls back to a safe placeholder summary when `OPENAI_API_KEY` is absent.

## Waiting For Credentials

- Supabase reads and writes
- storage-backed uploads
- persistent folders, files, research items, chats, and insights
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
5. Create the storage bucket.
6. Restart the dev server.

## Commands To Run After Credentials Are Added

```bash
npm install
npm run lint
npm run build
npm run dev
```

## Best Next Step After Setup

- Replace the fallback write previews with persistent Supabase writes end-to-end.
- Then wire authenticated file upload and real chat persistence.
- Then connect the summary service to a live AI call and save its output back onto the file record.
