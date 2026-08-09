import { createClient } from "@supabase/supabase-js";

// Limpa sessão expirada ANTES de criar o cliente para evitar deadlock no storage lock
try {
  const key = "sb-caqdwewivcqngmetscha-auth-token";
  const raw = localStorage.getItem(key);
  if (raw) {
    const parsed = JSON.parse(raw);
    const expiresAt = parsed?.expires_at;
    if (!expiresAt || expiresAt < Math.floor(Date.now() / 1000)) {
      localStorage.removeItem(key);
    }
  }
} catch {
  try { localStorage.removeItem("sb-caqdwewivcqngmetscha-auth-token"); } catch {}
}

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  }
);
