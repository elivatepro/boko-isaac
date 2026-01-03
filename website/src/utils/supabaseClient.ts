import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types";

declare global {
  // eslint-disable-next-line no-var
  var _supabaseClient: SupabaseClient<any> | undefined;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && (supabaseServiceRoleKey || supabaseAnonKey));
}

export function getSupabaseClient(): SupabaseClient<any> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase environment variables are not set. Please configure .env.local.");
  }

  if (!global._supabaseClient) {
    const key = supabaseServiceRoleKey || supabaseAnonKey!;
    global._supabaseClient = createClient<Database>(supabaseUrl!, key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return global._supabaseClient;
}
