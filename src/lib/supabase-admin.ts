import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const IMAGE_BUCKET = "images";

let client: SupabaseClient | null = null;

/**
 * Server-only Supabase client with the service-role key (needed to write to Storage).
 * Throws a descriptive error if the env vars are missing so the upload route can report it.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase Storage is not configured: set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }
  client = createClient(url, key, { auth: { persistSession: false } });
  return client;
}
