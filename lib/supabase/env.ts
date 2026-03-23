export const supabaseEnv = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  storageBucket: process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ?? "cms-assets"
};

export function hasSupabasePublicEnv() {
  return Boolean(supabaseEnv.url && supabaseEnv.anonKey);
}

export function hasSupabaseServiceEnv() {
  return Boolean(supabaseEnv.url && supabaseEnv.serviceRoleKey);
}
