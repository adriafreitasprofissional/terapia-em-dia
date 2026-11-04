"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function MinhasTarologasPage() {
  const [autorizada, setAutorizada] = useState(false);
  const [carregando, setCarregando] = useState(true);
  useEffect(() => {
    let ativo = true;
    async function validar() {
      try {
        const {data:{session}} = await supabase.auth.getSession();
        if (!session?.access_token) return;
        const resposta = await fetch("/api/terapia/admin/me", {
          cache:"no-store",
          headers:{Authorization:"Bearer "+session.access_token}
        });
        const dados = await resposta.json();
        if (ativo && resposta.ok && dados.admin?.central_access === true && !dados.admin?.preview_mode)
          setAutorizada(true);
      } catch {
        // Falhar fechado para quem não for administradora da Central.
      } finally {
        if (ativo) setCarregando(false);
      }
    }
    validar();
    return () => { ativo = false; };
  }, []);
  return <main className="mx-auto max-w-6xl px-5 py-10 text-[#F5F0E6]">
    <Link href="/admin" className="text-sm text-[#D7C18C]">← Central de Negócios</Link>
    <p className="mt-8 text-xs uppercase tracking-[.24em] text-[#D7C18C]">Clube do Tarô · Gestão da plataforma</p>
    <h1 className="mt-3 font-serif text-4xl">Minhas Tarólogas</h1>
    {carregando ? <p className="mt-7 text-sm text-[#D4DCCE]">Verificando acesso administrativo...</p> :
      !autorizada ? <p role="alert" className="mt-7 rounded-xl border border-[#D7C18C]/30 p-5 text-sm">Acesso restrito à administradora da Central de Negócios.</p> :
      <section className="mt-8 max-w-3xl rounded-2xl border border-[#D7C18C]/30 bg-[#1B271A] p-7">
        <h2 className="font-serif text-2xl">Cadastro profissional em preparação</h2>
        <p className="mt-4 text-sm leading-7 text-[#D4DCCE]">
          Aqui ficarão somente as tarólogas que contratarem a plataforma, com acesso a seus aplicativos, páginas de vendas e visualização de suporte. As assinantes que recebem direcionamentos no Clube do Tarô continuarão em um cadastro separado.
        </p>
        <p className="mt-3 text-sm leading-7 text-[#D4DCCE]">
          A lista profissional ainda não está conectada a uma tabela própria, por isso nenhum cadastro ou botão “Ver como taróloga” será simulado.
        </p>
        <Link href="/admin/clube" className="mt-6 inline-block rounded-lg border border-[#D7C18C]/40 px-5 py-3 text-sm text-[#D7C18C]">Voltar ao Clube do Tarô</Link>
      </section>}
  </main>;
}
