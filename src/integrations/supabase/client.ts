import { createClient } from "@supabase/supabase-js";

// Remove sessão expirada antes de criar o cliente
// Evita que o SDK tente renovar um token inválido (projeto pausado no free tier)
try {
  const key = "sb-caqdwewivcqngmetscha-auth-token";
  const raw = localStorage.getItem(key);
  if (raw) {
    const parsed = JSON.parse(raw);
    if (!parsed?.expires_at || parsed.expires_at < Math.floor(Date.now() / 1000)) {
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
      detectSessionInUrl: true, // necessário para recovery flow (reset de senha)
    },
  }
);
