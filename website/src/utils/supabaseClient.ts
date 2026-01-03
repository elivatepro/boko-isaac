import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types";

declare global {
  // eslint-disable-next-line no-var
  var _supabaseClient: SupabaseClient<Database> | undefined;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseServiceRoleKey);
}

export function getSupabaseClient(): SupabaseClient<Database> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase environment variables are not set. Please configure .env.local.");
  }

  if (!global._supabaseClient) {
    global._supabaseClient = createClient<Database>(supabaseUrl!, supabaseServiceRoleKey!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return global._supabaseClient;
}
