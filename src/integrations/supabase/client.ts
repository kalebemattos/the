import { createClient } from "@supabase/supabase-js";

// Limpa sessão expirada antes de criar o cliente
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
      detectSessionInUrl: false,
      // Usa steal:true para quebrar locks travados quando o projeto pausa/restaura
      // Evita deadlock sem desabilitar completamente a serialização do SDK
      lock: async (name: string, _acquireTimeout: number, fn: () => Promise<any>) => {
        if (typeof navigator !== "undefined" && navigator.locks) {
          return navigator.locks.request(name, { steal: true }, fn);
        }
        return await fn();
      },
    },
  }
);
