"use client";

import {
  FormEvent,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function TerapiaAdminLoginPage() {
  const router =
    useRouter();

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    senha,
    setSenha,
  ] = useState("");

  const [
    mostrarSenha,
    setMostrarSenha,
  ] = useState(false);

  const [
    erro,
    setErro,
  ] = useState<
    string | null
  >(null);

  const [
    loading,
    setLoading,
  ] = useState(false);

  async function entrar(
    event: FormEvent
  ) {
    event.preventDefault();

    setLoading(true);
    setErro(null);

    const {
      data,
      error,
    } =
      await supabase.auth.signInWithPassword(
        {
          email,
          password:
            senha,
        }
      );

    if (
      error ||
      !data.session
        ?.access_token
    ) {
      setErro(
        "E-mail ou senha inválidos."
      );

      setLoading(false);

      return;
    }

    const response =
      await fetch(
        "/api/terapia/admin/me",
        {
          headers: {
            Authorization:
              `Bearer ${data.session.access_token}`,
          },
        }
      );

    if (!response.ok) {
      await supabase.auth.signOut();

      setErro(
        "Este usuário não possui acesso profissional ao Terapia em Dia."
      );

      setLoading(false);

      return;
    }

    router.replace(
      "/terapia/admin"
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#222F20] px-5 py-12 text-[#F5F0E6]">
      <form onSubmit={entrar} className="w-full max-w-md rounded-[24px] border border-[#D7C18C]/40 bg-[#1B271A] p-7 sm:p-9">
        <div className="mb-8 text-center">
          <img src="/terapia-icon-192-v2.png" alt="Terapia em Dia" width="88" height="88" className="mx-auto h-[88px] w-[88px] rounded-full border border-[#D7C18C]/60 object-contain p-1" />
          <p className="mt-5 text-xs uppercase tracking-[0.24em] text-[#D7C18C]">Terapia em Dia</p>
          <h1 className="mt-3 font-serif text-3xl">Área do profissional</h1>
          <p className="mt-3 text-sm leading-7 text-[#D5DDCD]">Acesse seu painel, agenda, pacientes e financeiro.</p>
        </div>
        {erro && <p role="alert" className="mb-5 rounded-lg border border-red-300/60 p-3 text-sm text-red-100">{erro}</p>}
        <label htmlFor="profissional-email" className="block text-sm font-medium text-[#F0E6D1]">E-mail</label>
        <input id="profissional-email" type="email" required autoComplete="username" value={email} onChange={e => setEmail(e.target.value)}
          className="mt-2 w-full rounded-lg border border-[#D7C18C]/40 bg-[#293A27] px-4 py-3 text-white outline-none focus:border-[#D7C18C]" />
        <label htmlFor="profissional-senha" className="mt-5 block text-sm font-medium text-[#F0E6D1]">Senha</label>
        <div className="relative mt-2">
          <input id="profissional-senha" type={mostrarSenha ? "text" : "password"} required autoComplete="current-password"
            value={senha} onChange={e => setSenha(e.target.value)}
            className="w-full rounded-lg border border-[#D7C18C]/40 bg-[#293A27] px-4 py-3 pr-20 text-white outline-none focus:border-[#D7C18C]" />
          <button type="button" onClick={() => setMostrarSenha(!mostrarSenha)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#E0C994]">
            {mostrarSenha ? "Ocultar" : "Ver"}
          </button>
        </div>
        <button type="submit" disabled={loading}
          className="mt-8 w-full rounded-lg bg-[#D8C399] px-5 py-4 font-semibold text-[#222F20] transition hover:bg-[#E8D5AD] disabled:opacity-60">
          {loading ? "Entrando..." : "Entrar"}
        </button>
        <a href="/" className="mt-5 block text-center text-sm text-[#D7C18C] hover:underline">Voltar ao início</a>
      </form>
    </main>
  );
}
