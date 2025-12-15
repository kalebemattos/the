import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Role = "admin" | "operator" | "client";

interface User {
  id: string;
  email: string;
  full_name?: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdminOrOperator: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: any }>;
  resetPassword: (email: string) => Promise<{ error?: any }>;
  updatePassword: (newPassword: string) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Converte usuário do Supabase para o formato do app
  const mapUser = (sbUser: any): User => ({
    id: sbUser.id,
    email: sbUser.email,
    full_name: sbUser.user_metadata?.full_name,
    role: (sbUser.user_metadata?.role as Role) || "client",
  });

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user ? mapUser(data.user) : null);
      setLoading(false);
    };

    loadUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? mapUser(session.user) : null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // 🔹 LOGIN
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error && data.user) setUser(mapUser(data.user));
    return { error };
  };

  // 🔹 CADASTRO
  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: "client", // padrão
        },
      },
    });

    if (!error && data.user) setUser(mapUser(data.user));
    return { error };
  };

  // 🔹 RESET DE SENHA (EMAIL)
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
