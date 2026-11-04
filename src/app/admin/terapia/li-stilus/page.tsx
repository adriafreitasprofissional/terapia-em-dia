"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SuporteLiStilusPage() {
  const [autorizado, setAutorizado] = useState(false);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;
    async function verificar() {
      try {
        const { data } = await supabase.auth.getSession();
        if (!data.session?.access_token) return;
        const response = await fetch("/api/terapia/admin/me", {
          cache: "no-store",
          headers: { Authorization: "Bearer " + data.session.access_token },
        });
        const body = await response.json();
        if (ativo && response.ok && body.admin?.central_access === true) {
          setAutorizado(true);
        }
      } catch {
        // Falha de autorização: não liberar o painel de suporte.
      } finally {
        if (ativo) setCarregando(false);
      }
    }
    verificar();
    return () => { ativo = false; };
  }, []);

  if (carregando) return <main className="mx-auto max-w-4xl p-8 text-[#FFF4E9]">Verificando acesso à Central de Negócios...</main>;
  if (!autorizado) return (
    <main className="mx-auto max-w-4xl p-8 text-[#FFF4E9]">
      <h1 className="font-serif text-3xl">Acesso administrativo necessário</h1>
      <p className="mt-4 text-sm text-[#E9D5C8]">Entre com a sua conta de administradora para conferir o espaço da Lilian.</p>
      <Link href="/admin" className="mt-6 inline-block rounded-lg border border-[#F3B99D]/50 px-5 py-3 text-[#F3B99D]">Voltar à Central</Link>
    </main>
  );

  return <main className="mx-auto max-w-5xl px-4 py-8 text-[#FFF4E9]">
    <Link href="/admin" className="text-sm text-[#F3B99D]">← Central de Negócios</Link>
    <div className="mt-8 flex flex-wrap items-center gap-5 rounded-2xl border border-[#F3B99D]/30 bg-[#392B2A] p-7">
      <Image src="/imagens/lilian-logo.png" alt="Logotipo Li Stilus" width={96} height={96} className="h-24 w-24 rounded-full object-contain" />
      <div>
        <p className="text-xs uppercase tracking-[.25em] text-[#F3B99D]">Central de suporte</p>
        <h1 className="mt-2 font-serif text-4xl">Li Stilus | Terapia em Dia</h1>
        <p className="mt-2 text-sm text-[#E9D5C8]">Acompanhe a apresentação comercial e confira o painel da Lilian sem alterar os dados dela.</p>
      </div>
    </div>
    <div className="mt-6 grid gap-4 md:grid-cols-2">
      <Link href="/li-stilus" target="_blank" rel="noopener noreferrer"
        className="rounded-2xl border border-[#F3B99D]/30 bg-[#47332F] p-7 transition hover:border-[#F3B99D]">
        <p className="text-xs uppercase tracking-wider text-[#F3B99D]">Vitrine pública</p>
        <h2 className="mt-3 font-serif text-2xl">Ver página de vendas</h2>
        <p className="mt-3 text-sm leading-7 text-[#E9D5C8]">Confira logotipo, identidade, serviços publicados, descrições e valores como a cliente visualizará.</p>
        <p className="mt-6 text-sm font-semibold text-[#F3B99D]">Abrir página ↗</p>
      </Link>
      <Link href="/admin/terapia/ver-lilian"
        className="rounded-2xl border border-[#F3B99D]/30 bg-[#47332F] p-7 transition hover:border-[#F3B99D]">
        <p className="text-xs uppercase tracking-wider text-[#F3B99D]">Suporte administrativo</p>
        <h2 className="mt-3 font-serif text-2xl">Visualizar painel da Lilian</h2>
        <p className="mt-3 text-sm leading-7 text-[#E9D5C8]">Veja agenda, serviços e informações que o painel disponibiliza em modo de conferência.</p>
        <p className="mt-6 text-sm font-semibold text-[#F3B99D]">Entrar em modo de leitura →</p>
      </Link>
    </div>
    <p className="mt-7 text-sm leading-7 text-[#E9D5C8]">O modo de conferência é somente para leitura. Alterações de cadastros, agendas e serviços devem ser realizadas pela Lilian em sua própria conta. Os pagamentos ainda não estão habilitados.</p>
  </main>;
}
