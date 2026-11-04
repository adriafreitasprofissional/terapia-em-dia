import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, CalendarDays, ClipboardList, MonitorSmartphone, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Planos para Terapeutas | Terapia em Dia",
  description: "Planos profissionais do Terapia em Dia: teste por 7 dias e assinaturas para organizar a prática terapêutica.",
};

const contato = "adriafreitasprofissional@gmail.com";
const moeda = (valor: number) => valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const planos = [
  { id: "teste", nome: "Plano de Teste", valor: 27, periodo: "7 dias · pagamento único", beneficio: "1 atendimento de demonstração", descricao: "Conheça o funcionamento do sistema antes de contratar uma assinatura." },
  { id: "fundador", nome: "Fundador", valor: 47, periodo: "por mês", beneficio: "Seu primeiro espaço profissional", descricao: "Um plano de entrada para começar a organizar a rotina terapêutica." },
  { id: "profissional", nome: "Profissional", valor: 67, periodo: "por mês", beneficio: "Mais organização na rotina", descricao: "Para profissionais que desejam um espaço dedicado à sua prática.", destaque: true },
  { id: "empreendedor", nome: "Empreendedor", valor: 167, periodo: "por mês", beneficio: "Estrutura para crescer", descricao: "Para profissionais que querem expandir sua atuação com o Terapia em Dia." },
  { id: "construtor", nome: "Construtor", valor: 230, periodo: "por mês", beneficio: "Uma operação mais completa", descricao: "Para quem procura estruturar e ampliar seu trabalho profissional." },
] as const;

function solicitar(nome: string, valor: number, periodo: string) {
  const assunto = "Quero contratar " + nome + " | Terapia em Dia";
  const corpo = [
    "Olá, Ádria!",
    "Tenho interesse no plano " + nome + " do Terapia em Dia.",
    "Valor anunciado: " + moeda(valor) + " (" + periodo + ").",
    "Por favor, envie os detalhes do plano e as orientações para contratar.",
  ].join("\n");
  return "https://mail.google.com/mail/?view=cm&fs=1&to=" + encodeURIComponent(contato) +
    "&su=" + encodeURIComponent(assunto) + "&body=" + encodeURIComponent(corpo);
}

export default function TerapiaVitrinePage() {
  return (
    <main className="min-h-screen bg-[#222F20] text-[#F5F0E6]">
      <header className="border-b border-[#D7C18C]/25">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-7">
          <Link href="/" className="flex items-center gap-3 font-serif text-xl sm:text-2xl">
            <span className="relative h-12 w-12 overflow-hidden rounded-full border border-[#D7C18C]/70">
              <Image src="/terapia-icon-192-v2.png" alt="Marca Terapia em Dia" fill sizes="48px" className="object-contain" />
            </span>
            <span>Terapia em <em className="text-[#D7C18C]">Dia.</em></span>
          </Link>
          <Link href="/terapia/admin/login" className="rounded-full border border-[#D7C18C]/50 px-5 py-3 text-xs font-semibold text-[#E8D5AB] transition hover:bg-white/10">
            Entrar no espaço profissional
          </Link>
        </div>
      </header>
      <section className="mx-auto max-w-6xl px-5 pb-14 pt-16 text-center sm:px-7 sm:pt-20">
        <p className="text-xs uppercase tracking-[0.28em] text-[#D7C18C]">Terapia em Dia para profissionais</p>
        <h1 className="mx-auto mt-6 max-w-4xl font-serif text-4xl leading-[1.14] sm:text-6xl">
          Mais tempo para cuidar. <em className="font-normal text-[#D7C18C]">Menos tempo para organizar.</em>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-sm leading-8 text-[#DFE4D6] sm:text-base">
          Agenda, pacientes e acompanhamento terapêutico em um só lugar. Conheça os planos e escolha a estrutura que combina com seu momento profissional.
        </p>
        <a href="#planos" className="mt-9 inline-flex items-center gap-2 rounded-md bg-[#D8C399] px-7 py-4 text-sm font-semibold text-[#222F20] transition hover:bg-[#E8D5AD]">
          Conhecer planos <ArrowUpRight size={17} />
        </a>
      </section>
      <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-7">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { Icon: CalendarDays, titulo: "Agenda organizada", texto: "Visualize compromissos e facilite a rotina de atendimentos." },
            { Icon: ClipboardList, titulo: "Acompanhamento", texto: "Reúna informações e atividades de seus pacientes em um só lugar." },
            { Icon: MonitorSmartphone, titulo: "Experiência digital", texto: "Ofereça um portal dedicado ao acompanhamento terapêutico." },
          ].map(({Icon, titulo, texto}) => (
            <div key={titulo} className="rounded-2xl border border-[#D7C18C]/30 bg-[#1B271A] p-6">
              <Icon size={23} className="text-[#D7C18C]" />
              <h2 className="mt-4 font-serif text-xl">{titulo}</h2>
              <p className="mt-2 text-sm leading-7 text-[#D4DCCF]">{texto}</p>
            </div>
          ))}
        </div>
      </section>
      <section id="planos" className="mx-auto max-w-6xl scroll-mt-6 px-5 pb-16 sm:px-7">
        <div className="mb-9 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-[#D7C18C]">Investimento profissional</p>
          <h2 className="mt-3 font-serif text-3xl sm:text-4xl">Planos para a sua prática</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#D4DCCF]">
            Comece com 7 dias de teste ou escolha um dos planos mensais. Consulte os recursos e limites de cada opção antes de contratar.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {planos.map((plano) => (
            <article key={plano.id} className={"flex flex-col rounded-[24px] border bg-[#1B271A] p-6 sm:p-8 " + ("destaque" in plano && plano.destaque ? "border-[#D7C18C]" : "border-[#D7C18C]/30")}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h3 className="font-serif text-2xl sm:text-3xl">{plano.nome}</h3>
                {"destaque" in plano && plano.destaque && <span className="rounded-full border border-[#D7C18C]/50 px-3 py-1 text-xs text-[#D7C18C]">Mais procurado</span>}
              </div>
              <div className="mt-6 rounded-xl border border-[#D7C18C]/40 bg-[#2A3927] px-5 py-6">
                <p className="font-serif text-4xl text-[#E3C993] sm:text-5xl">{moeda(plano.valor)}</p>
                <p className="mt-2 text-sm text-[#E0E4D7]">{plano.periodo}</p>
              </div>
              <p className="mt-6 text-base font-semibold text-[#F2E7CC]">{plano.beneficio}</p>
              <p className="mt-3 flex-1 text-sm leading-7 text-[#D4DCCF]">{plano.descricao}</p>
              <a href={solicitar(plano.nome, plano.valor, plano.periodo)} target="_blank" rel="noopener noreferrer"
                className="mt-8 flex min-h-14 items-center justify-center gap-2 rounded-md bg-[#D8C399] px-5 py-4 text-center text-sm font-semibold text-[#222F20] transition hover:bg-[#E8D5AD]">
                Solicitar este plano <ArrowUpRight size={16} />
              </a>
              <p className="mt-3 text-center text-xs leading-5 text-[#C9D2C3]">
                Abre o Gmail com o plano escolhido. Não efetua pagamento.
              </p>
            </article>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-6 text-[#C9D2C3]">
          O Plano de Teste tem taxa única de R$ 27,00; os demais são mensais. Consulte disponibilidade e condições antes da contratação.
        </p>
      </section>
      <section className="border-t border-[#D7C18C]/20 px-5 py-14 sm:px-7">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-serif text-3xl">Tudo mais simples, desde o primeiro acesso.</h2>
          <div className="mt-7 grid gap-6 sm:grid-cols-3">
            {[
              {Icon: ShieldCheck, titulo: "Escolha", texto: "Compare os planos e encontre a opção para seu momento." },
              {Icon: CalendarDays, titulo: "Contratação", texto: "Solicite as informações e confirme condições antes de contratar." },
              {Icon: MonitorSmartphone, titulo: "Seu portal", texto: "Após a liberação, acesse as funcionalidades de seu espaço profissional." },
            ].map(({Icon, titulo, texto}) => (
              <div key={titulo} className="border-t border-[#D7C18C]/40 pt-5">
                <Icon size={22} className="text-[#D7C18C]" />
                <h3 className="mt-3 font-serif text-xl">{titulo}</h3>
                <p className="mt-2 text-sm leading-7 text-[#D1D9CC]">{texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <footer className="border-t border-[#D7C18C]/20 px-5 py-8 text-center text-xs text-[#C6CDBF]">
        Terapia em Dia · Ádria Freitas
      </footer>
    </main>
  );
}
