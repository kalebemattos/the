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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Carrega usuário + role real
  const loadUser = async () => {
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      setUser(null);
      setLoading(false);
      return;
    }

    const { data: meta } = await supabase
      .from("users_meta")
      .select("name, role")
      .eq("auth_id", data.user.id)
      .single();

    setUser({
      id: data.user.id,
      email: data.user.email!,
      name: meta?.name,
      role: (meta?.role as Role) || "client",
    });

    setLoading(false);
  };

  useEffect(() => {
    loadUser();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      loadUser();
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // 🔹 LOGIN
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (!error) await loadUser();
    return { error };
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
        name,
        role: "client",
      });

      await loadUser();
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

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdminOrOperator:
          user?.role === "admin" || user?.role === "operator",
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
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro do AuthProvider");
  return ctx;
};
