import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function Reset() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async () => {
    if (password !== confirm) {
      setMessage("As senhas não coincidem.");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setMessage("Erro ao redefinir senha.");
    } else {
      setMessage("Senha alterada com sucesso! Você já pode fazer login.");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", textAlign: "center" }}>
      <h2>Redefinir Senha</h2>

      <input
        type="password"
        placeholder="Nova senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", padding: 10, marginTop: 10 }}
      />

      <input
        type="password"
        placeholder="Confirmar senha"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        style={{ width: "100%", padding: 10, marginTop: 10 }}
      />

      <button
        onClick={handleReset}
        style={{ width: "100%", padding: 12, marginTop: 20 }}
      >
        Atualizar Senha
      </button>

      {message && (
        <p style={{ marginTop: 15, color: "green", fontWeight: "bold" }}>
          {message}
        </p>
      )}
    </div>
  );
}
