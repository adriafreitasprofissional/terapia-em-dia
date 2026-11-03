"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DefinirSenhaTerapiaPage() {
  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);
  async function salvar(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (senha.length < 8 || senha !== confirmacao) {
      setMensagem("A senha precisa ter pelo menos 8 caracteres e ser igual nos dois campos."); return;
    }
    setLoading(true); setMensagem("");
    const { data } = await supabase.auth.getSession();
    if (!data.session) { setMensagem("Sessão expirada. Solicite um novo link de acesso."); setLoading(false); return; }
    const { error } = await supabase.auth.updateUser({ password: senha });
    if (error) { setMensagem("Não foi possível salvar sua senha: " + error.message); setLoading(false); return; }
    await supabase.auth.signOut();
    window.location.replace("/terapia");
  }
  return <main className="flex min-h-screen items-center justify-center bg-[#F7F3EA] px-5 py-12 text-[#34472F]"><div className="w-full max-w-md rounded-[32px] border border-[#DDD4C5] bg-white p-8 shadow-md">
    <h1 className="font-serif text-3xl">Terapia em Dia</h1>
    <p className="mt-3 leading-7 text-[#61725C]">Crie uma senha para entrar em seu espaço terapêutico. Se você já utiliza o Clube do Tarô com este e-mail, a nova senha também será usada nesse acesso.</p>
    <form onSubmit={salvar} className="mt-7 space-y-4">
      <label className="block text-sm font-medium">Nova senha<input type="password" required autoComplete="new-password" minLength={8} value={senha} onChange={e=>setSenha(e.target.value)} className="mt-2 w-full rounded-xl border border-[#CCD7C5] p-3"/></label>
      <label className="block text-sm font-medium">Repita a nova senha<input type="password" required autoComplete="new-password" minLength={8} value={confirmacao} onChange={e=>setConfirmacao(e.target.value)} className="mt-2 w-full rounded-xl border border-[#CCD7C5] p-3"/></label>
      {mensagem && <p role="alert" className="text-sm text-[#9B3D31]">{mensagem}</p>}
      <button type="submit" disabled={loading} className="w-full rounded-full bg-[#526B49] p-4 font-semibold text-white disabled:opacity-50">{loading?"Salvando...":"Definir senha e entrar"}</button>
    </form>
  </div></main>;
}
