import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { supabaseEnv } from "@/lib/supabase/env";

export function createSupabaseServerClient() {
  if (!supabaseEnv.url || !supabaseEnv.anonKey) {
    throw new Error("Missing Supabase public environment variables.");
  }

  const cookieStore = cookies();

  return createServerClient(supabaseEnv.url, supabaseEnv.anonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: Record<string, unknown>) {
        cookieStore.set({ name, value, ...(options as object) });
      },
      remove(name: string, options: Record<string, unknown>) {
        cookieStore.set({ name, value: "", ...(options as object) });
      }
    }
  });
}
