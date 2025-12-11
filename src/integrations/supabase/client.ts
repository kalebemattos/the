import { createClient } from "@supabase/supabase-js";

// Use suas variáveis de ambiente definidas no .env
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);