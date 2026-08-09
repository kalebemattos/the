import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Role = "admin" | "operator" | "staff";

interface User {
  id: string;
  email: string;
  name?: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdminOrOperator: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error?: any }>;
  resetPassword: (email: string) => Promise<{ error?: any }>;
  updatePassword: (newPassword: string) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Carrega usuário da tabela CORRETA: users_meta
  const loadUser = async (authUser: any) => {
    const { data, error } = await supabase
      .from("users_meta")
      .select("name, role")
      .eq("auth_id", authUser.id)
      .single();

    if (error || !data) {
      console.error("Erro ao buscar users_meta:", error);
      setUser(null);
      return;
    }

    setUser({
      id: authUser.id,
      email: authUser.email,
      name: data.name,
      role: data.role,
    });
  };

  useEffect(() => {
    // Timeout de segurança: garante que loading vira false mesmo se Supabase travar
    const timeout = setTimeout(() => setLoading(false), 5000);

    const init = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        const session = data?.session;
        const isExpired = session && session.expires_at && session.expires_at < Math.floor(Date.now() / 1000);
        if (error || isExpired) {
          // Sessão inválida ou expirada — limpa para evitar loop de refresh
          await supabase.auth.signOut();
        } else if (session?.user) {
          await loadUser(session.user);
        }
      } catch (e) {
        console.error('Erro ao inicializar auth:', e);
        // Garante limpeza em caso de erro inesperado
        try { await supabase.auth.signOut(); } catch {}
      } finally {
        clearTimeout(timeout);
        setLoading(false);
      }
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          await loadUser(session.user);
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      clearTimeout(timeout);
      listener.subscription.unsubscribe();
    };
  }, []);

  // 🔹 LOGIN
  const signIn = async (email: string, password: string) => {
    // Limpa sessão local antes de logar para evitar deadlock no storage lock
    try { await supabase.auth.signOut({ scope: 'local' }); } catch {}

    try {
      const result = await Promise.race([
        supabase.auth.signInWithPassword({ email, password }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('TIMEOUT_AUTH')), 8000)
        ),
      ]) as Awaited<ReturnType<typeof supabase.auth.signInWithPassword>>;

      const { data, error } = result;
      console.log('[Auth] Resultado signIn:', { error: error?.message, hasUser: !!data?.user });

      if (!error && data.user) {
        try {
          await Promise.race([
            loadUser(data.user),
            new Promise<void>((resolve) => setTimeout(resolve, 5000)),
          ]);
        } catch {
          // ignora erro do loadUser
        }
      }

      return { error };
    } catch (e: any) {
      console.error('[Auth] Erro no signIn:', e?.message);
      const msg = e?.message === 'TIMEOUT_AUTH'
        ? 'Servidor não respondeu (timeout). Tente novamente em alguns minutos.'
        : e?.message || 'Erro desconhecido';
      return { error: { message: msg } };
    }
  };

  // 🔹 CADASTRO
  const signUp = async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (!error && data.user) {
      await supabase.from("users_meta").insert({
        auth_id: data.user.id,
        email,
        name,
        role: "staff",
      });

      await loadUser(data.user);
    }

    return { error };
  };

  // 🔹 RESET DE SENHA
  const resetPassword = async (email: string) => {
    return supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://thebestofangra.vercel.app/admin/reset",
    });
  };

  // 🔹 ATUALIZAR SENHA
  const updatePassword = async (newPassword: string) => {
    return supabase.auth.updateUser({ password: newPassword });
  };

  // 🔹 LOGOUT
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const isAdminOrOperator =
    user?.role === "admin" || user?.role === "operator";

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdminOrOperator,
        signIn,
        signUp,
        resetPassword,
        updatePassword,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
