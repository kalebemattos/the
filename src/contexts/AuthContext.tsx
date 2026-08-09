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
    // Timeout de segurança — garante loading=false mesmo se Supabase não responder
    const timeout = setTimeout(() => setLoading(false), 8000);

    // onAuthStateChange dispara na inicialização com a sessão atual
    // Isso cobre tanto login normal quanto recovery flow (reset de senha)
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await loadUser(session.user);
        } else {
          setUser(null);
        }
        // Após o primeiro evento de inicialização, podemos parar o loading
        clearTimeout(timeout);
        setLoading(false);
      }
    );

    return () => {
      clearTimeout(timeout);
      listener.subscription.unsubscribe();
    };
  }, []);

  // 🔹 LOGIN
  const signIn = async (email: string, password: string) => {
    try {
      // Timeout generoso para permitir cold start do Supabase (plano gratuito pausa projetos)
      const result = await Promise.race([
        supabase.auth.signInWithPassword({ email, password }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('TIMEOUT_AUTH')), 30000)
        ),
      ]) as Awaited<ReturnType<typeof supabase.auth.signInWithPassword>>;

      const { data, error } = result;

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
      const msg = e?.message === 'TIMEOUT_AUTH'
        ? 'Servidor demorou para responder. Tente novamente.'
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
      redirectTo: `${window.location.origin}/admin/reset`,
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
