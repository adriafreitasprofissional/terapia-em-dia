"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function TerapiaInicioPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function entrar() {
    if (!email || !senha) {
      setErro("Preencha seu e-mail e sua senha.");
      return;
    }

    setCarregando(true);
    setErro(null);

    try {
      const response = await fetch("/api/terapia/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password: senha,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Nao foi possivel entrar."
        );
      }

      window.localStorage.setItem(
        "terapia_auth_access_token",
        data.access_token
      );

      window.localStorage.setItem(
        "terapia_auth_refresh_token",
        data.refresh_token
      );

      router.push("/terapia/entrar");
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Nao foi possivel entrar."
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#222F20] px-5 py-12 text-[#F5F0E6]">
      <div className="w-full max-w-md rounded-[24px] border border-[#D7C18C]/40 bg-[#1B271A] p-7 sm:p-9">
        <div className="mb-8 text-center">
          <Image src="/terapia-icon-192-v2.png" alt="Terapia em Dia" width={88} height={88}
            priority className="mx-auto h-[88px] w-[88px] rounded-full border border-[#D7C18C]/60 object-contain p-1" />
          <p className="mt-5 text-xs uppercase tracking-[0.24em] text-[#D7C18C]">Terapia em Dia</p>
          <h1 className="mt-3 font-serif text-3xl">Seu espaço terapêutico</h1>
          <p className="mt-3 text-sm leading-7 text-[#D5DDCD]">Entre com seu e-mail e senha para acompanhar suas consultas e atividades.</p>
        </div>
        {erro && <p role="alert" className="mb-5 rounded-lg border border-red-300/60 p-3 text-sm text-red-100">{erro}</p>}
        <label htmlFor="paciente-email" className="block text-sm font-medium text-[#F0E6D1]">E-mail</label>
        <input id="paciente-email" type="email" autoComplete="username" value={email} onChange={e => setEmail(e.target.value)}
          placeholder="seuemail@exemplo.com"
          className="mt-2 w-full rounded-lg border border-[#D7C18C]/40 bg-[#293A27] px-4 py-3 text-white outline-none placeholder:text-[#C1CDB9] focus:border-[#D7C18C]" />
        <label htmlFor="paciente-senha" className="mt-5 block text-sm font-medium text-[#F0E6D1]">Senha</label>
        <div className="relative mt-2">
          <input id="paciente-senha" type={mostrarSenha ? "text" : "password"} autoComplete="current-password"
            value={senha} onChange={e => setSenha(e.target.value)} placeholder="Sua senha"
            className="w-full rounded-lg border border-[#D7C18C]/40 bg-[#293A27] px-4 py-3 pr-20 text-white outline-none placeholder:text-[#C1CDB9] focus:border-[#D7C18C]" />
          <button type="button" onClick={() => setMostrarSenha(!mostrarSenha)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#E0C994]">
            {mostrarSenha ? "Ocultar" : "Ver"}
          </button>
        </div>
        <button type="button" onClick={entrar} disabled={carregando}
          className="mt-8 w-full rounded-lg bg-[#D8C399] px-5 py-4 font-semibold text-[#222F20] transition hover:bg-[#E8D5AD] disabled:opacity-60">
          {carregando ? "Entrando..." : "Entrar"}
        </button>
        <a href="/" className="mt-5 block text-center text-sm text-[#D7C18C] hover:underline">Voltar ao início</a>
      </div>
    </main>
  );
}
