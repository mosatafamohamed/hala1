"use client";

import { createBrowserClient } from "@supabase/ssr";

import { supabaseEnv } from "@/lib/supabase/env";

export function createSupabaseBrowserClient() {
  if (!supabaseEnv.url || !supabaseEnv.anonKey) {
    throw new Error("Missing Supabase public environment variables.");
  }

  return createBrowserClient(supabaseEnv.url, supabaseEnv.anonKey);
}
