import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: any;
  loading: boolean;
  isAdminOrOperator: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user ?? null);
      setLoading(false);
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) setUser(data.user);
    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    // Cria usuário no Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    // Você pode salvar fullName em outra tabela "profiles" se quiser
    if (!error && data.user) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        full_name: fullName,
        role: "client", // padrão, você pode ajustar para admin manualmente
      });
    }

    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const isAdminOrOperator =
    user?.role === "admin" || user?.role === "operator";

  return (
    <AuthContext.Provider value={{ user, loading, isAdminOrOperator, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};