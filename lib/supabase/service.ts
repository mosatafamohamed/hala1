import { createClient } from "@supabase/supabase-js";

import { supabaseEnv } from "@/lib/supabase/env";

export function createSupabaseServiceClient() {
  if (!supabaseEnv.url || !supabaseEnv.serviceRoleKey) {
    throw new Error("Missing Supabase service role environment variables.");
  }

  return createClient(supabaseEnv.url, supabaseEnv.serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}
