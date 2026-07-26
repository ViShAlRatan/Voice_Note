import { createBrowserClient } from "@supabase/ssr";

// This file creates a Supabase connection for the Browser (Client-side)
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}