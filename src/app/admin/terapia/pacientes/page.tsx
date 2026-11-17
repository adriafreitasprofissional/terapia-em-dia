"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Paciente = {
  id: string;
  professional?: string;
  nome: string;
  nome_completo: string;
  email: string;
  slug: string;
  anamnese?: { id: string; status: string; submitted_at: string } | null;
};

type Atendimento = {
  id: string;
  client_id: string;
  professional?: string;
  service_type: string;
  scheduled_at: string;
  status: string;
};

type Profissional = {
  id: string;
  name: string;
  slug: string;
  active: boolean;
};

const verde = "rounded-2xl border border-[#597252]/45 bg-[#1B271A]";

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([]);
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [busca, setBusca] = useState("");
  const [abertos, setAbertos] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function carregar() {
      setCarregando(true);
      setErro(null);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) throw new Error("Sessão administrativa expirada.");
        const response = await fetch("/api/terapia/admin/dashboard", {
          cache: "no-store",
          headers: { Authorization: "Bearer " + session.access_token },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data?.error || "Não foi possível carregar as pacientes.");
        setPacientes(data.clientes || []);
        setAtendimentos(data.proximos_atendimentos || []);
        setProfissionais(data.profissionais || []);
      } catch (error) {
        setErro(error instanceof Error ? error.message : "Erro ao carregar a central.");
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  const grupos = useMemo(() => {
    const porNome = new Map<string, { nome: string; ativo: boolean; pacientes: Paciente[] }>();
    for (const profissional of profissionais) {
      const nome = profissional.name?.trim();
      if (nome) porNome.set(nome.toLocaleLowerCase("pt-BR"), {
        nome, ativo: profissional.active, pacientes: [],
      });
    }
    for (const paciente of pacientes) {
      const nome = paciente.professional?.trim() || "Profissional não identificado";
      const chave = nome.toLocaleLowerCase("pt-BR");
      if (!porNome.has(chave)) porNome.set(chave, { nome, ativo: true, pacientes: [] });
      const grupo = porNome.get(chave)!;
      if (!grupo.pacientes.some((p) => p.id === paciente.id)) grupo.pacientes.push(paciente);
    }
    return [...porNome.entries()].map(([chave, grupo]) => ({
      chave,
      ...grupo,
      pacientes: grupo.pacientes.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR")),
    })).sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
  }, [pacientes, profissionais]);

  const visiveis = useMemo(() => {
    const termo = busca.toLocaleLowerCase("pt-BR").trim();
    if (!termo) return grupos;
    return grupos.filter((grupo) => grupo.nome.toLocaleLowerCase("pt-BR").includes(termo)
      || grupo.pacientes.some((p) => (p.nome + " " + p.nome_completo).toLocaleLowerCase("pt-BR").includes(termo)));
  }, [busca, grupos]);

  function proximoAtendimento(paciente: Paciente) {
    return atendimentos.find((item) =>
      item.client_id === paciente.id
      && (!paciente.professional || item.professional === paciente.professional)
    );
  }

  if (carregando) return (
    <div className={verde + " p-6 text-[#D4DCCE]"}>Carregando profissionais e pacientes...</div>
  );

  return (
    <div className="mx-auto max-w-7xl pb-14 text-[#F5F0E6]">
      <div className="mb-8 flex flex-wrap gap-4 text-sm font-bold">
        <Link href="/admin/terapia" className="text-[#D7C18C]">← Terapia em Dia</Link>
        <Link href="/admin" className="text-[#D4DCCE]">Central de Negócios</Link>
      </div>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D7C18C]">Gestão terapêutica</p>
      <h1 className="mt-2 text-3xl font-semibold">Profissionais e pacientes</h1>
      <p className="mt-2 text-sm text-[#D4DCCE]">
        Selecione um profissional para consultar apenas seus pacientes e atendimentos.
      </p>

      {erro && <div role="alert" className="mt-6 rounded-2xl border border-red-300/40 bg-[#38231E] p-5 text-[#F5F0E6]">{erro}</div>}

      {!erro && <>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <div className={verde + " p-4"}>
            <p className="text-xs text-[#D4DCCE]">Profissionais cadastrados</p>
            <p className="mt-2 text-2xl font-semibold">{grupos.length}</p>
          </div>
          <div className={verde + " p-4"}>
            <p className="text-xs text-[#D4DCCE]">Vínculos ativos com pacientes</p>
            <p className="mt-2 text-2xl font-semibold">{grupos.reduce((total, grupo) => total + grupo.pacientes.length, 0)}</p>
          </div>
        </div>

        <label className="mt-6 block text-sm font-medium text-[#D4DCCE]" htmlFor="busca-terapeutas">
          Buscar profissional ou paciente
        </label>
        <input id="busca-terapeutas" value={busca} onChange={(e) => setBusca(e.target.value)}
          placeholder="Digite um nome" className="mt-2 w-full rounded-xl border border-[#597252] bg-[#1B271A] px-4 py-3 text-[#F5F0E6] placeholder:text-[#AAB9A5] focus:outline-none focus:ring-2 focus:ring-[#D7C18C]" />

        <div className="mt-5 grid gap-3">
          {visiveis.map((grupo) => {
            const expandido = Boolean(abertos[grupo.chave]);
            return (
              <section key={grupo.chave} className={verde + " overflow-hidden"}>
                <button type="button" aria-expanded={expandido}
                  onClick={() => setAbertos((anterior) => ({ ...anterior, [grupo.chave]: !anterior[grupo.chave] }))}
                  className="flex w-full flex-wrap items-center justify-between gap-3 px-5 py-5 text-left hover:bg-[#293A27]">
                  <span>
                    <span className="block text-lg font-semibold text-[#F5F0E6]">{grupo.nome}</span>
                    <span className="mt-1 block text-sm text-[#D4DCCE]">
                      {grupo.pacientes.length} {grupo.pacientes.length === 1 ? "paciente" : "pacientes"}
                      {!grupo.ativo && " · Profissional inativo"}
                    </span>
                  </span>
                  <span className="text-sm font-semibold text-[#D7C18C]">{expandido ? "⌃ Recolher" : "⌄ Ver pacientes"}</span>
                </button>
                {expandido && <div className="grid gap-3 border-t border-[#597252]/40 p-4 md:grid-cols-2">
                  {grupo.pacientes.length === 0 && <p className="text-sm text-[#D4DCCE]">Nenhum paciente ativo vinculado.</p>}
                  {grupo.pacientes.map((paciente) => {
                    const proximo = proximoAtendimento(paciente);
                    const recebida = paciente.anamnese?.status === "enviada" || paciente.anamnese?.status === "revisada";
                    return (
                      <article key={paciente.id} className="rounded-xl border border-[#597252]/45 bg-[#233322] p-4">
                        <p className="text-base font-semibold">{paciente.nome}</p>
                        {paciente.nome_completo && paciente.nome_completo !== paciente.nome &&
                          <p className="mt-1 text-xs text-[#D4DCCE]">{paciente.nome_completo}</p>}
                        {paciente.email && <p className="mt-2 break-all text-sm text-[#D4DCCE]">{paciente.email}</p>}
                        <div className="mt-4 space-y-1 text-sm">
                          <p>Anamnese: <span className="text-[#D7C18C]">{recebida ? "Recebida" : "Pendente"}</span></p>
                          <p>Próxima sessão: <span className="text-[#D4DCCE]">
                            {proximo ? proximo.service_type + " · " + new Date(proximo.scheduled_at).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }) : "Nenhuma"}
                          </span></p>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Link href={"/terapia/admin/anamneses/" + paciente.id} className="rounded-lg border border-[#D7C18C]/50 px-3 py-2 text-xs font-bold text-[#E7D59B]">Anamnese</Link>
                          <Link href={"/admin/terapia/pacientes/" + paciente.id} className="rounded-lg bg-[#AFC38D] px-3 py-2 text-xs font-bold text-[#1B271A]">Abrir paciente</Link>
                          <Link href={"/terapia/acesso/preview-" + paciente.id} className="rounded-lg border border-[#D7C18C]/50 px-3 py-2 text-xs font-bold text-[#E7D59B]">Ver como paciente</Link>
                          {proximo && <Link href={"/admin/agenda/" + proximo.id + "/atendimento"} className="rounded-lg border border-[#D7C18C]/50 px-3 py-2 text-xs font-bold text-[#E7D59B]">Atendimento</Link>}
                        </div>
                      </article>
                    );
                  })}
                </div>}
              </section>
            );
          })}
          {visiveis.length === 0 && <p className="text-sm text-[#D4DCCE]">Nenhum resultado encontrado.</p>}
        </div>
      </>}
    </div>
  );
}
