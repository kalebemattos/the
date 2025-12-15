import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Role = "admin" | "operator" | "client";

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

  // 🔹 Carrega usuário + role da tabela users_metadata
  const loadUser = async (authUser: any) => {
    const { data: meta, error } = await supabase
      .from("users_metadata")
      .select("name, role")
      .eq("auth_id", authUser.id)
      .single();

    if (error) {
      console.error("Erro ao buscar users_metadata:", error);
      setUser(null);
      return;
    }

    setUser({
      id: authUser.id,
      email: authUser.email,
      name: meta?.name,
      role: meta?.role || "client",
    });
  };

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) await loadUser(data.user);
      setLoading(false);
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

    return () => listener.subscription.unsubscribe();
  }, []);

  // 🔹 LOGIN
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error && data.user) {
      await loadUser(data.user);
    }

    return { error };
  };

  // 🔹 CADASTRO
  const signUp = async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (!error && data.user) {
      await supabase.from("users_metadata").insert({
        auth_id: data.user.id,
        name,
        role: "client",
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
