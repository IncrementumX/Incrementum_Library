export const persistencePlan = {
  recommendedStack: "Supabase",
  summary:
    "Use Supabase as the first persistence layer so the product can support auth, saved workspace data, file storage, and production deployment without introducing unnecessary backend complexity.",
  pieces: [
    "Supabase Auth for private user access",
    "Postgres tables for folders, files, research items, chats, messages, insights, and links",
    "Supabase Storage for uploaded source files",
    "Edge Functions or route handlers later for file processing and analyst actions"
  ]
};
