import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, HeartHandshake, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Tratamentos | Terapia em Dia com Ádria Freitas",
  description: "Conheça os tratamentos terapêuticos, duração, quantidade de consultas e investimento de cada pacote.",
};

type PlanoId = "teste" | "social" | "profundo" | "avancado";
const planos: { id: PlanoId; nome: string; periodo: string; consultas: number; valor: number; descricao: string; destaque?: boolean }[] = [
  { id: "teste", nome: "Fase Teste", periodo: "7 dias", consultas: 1, valor: 27, descricao: "Conheça o acompanhamento terapêutico e seu espaço digital." },
  { id: "social", nome: "Social", periodo: "1 mês", consultas: 4, valor: 396, descricao: "Um encontro por semana para um cuidado com continuidade." },
  { id: "profundo", nome: "Tratamento Profundo", periodo: "3 meses", consultas: 24, valor: 2280, descricao: "Dois encontros por semana para aprofundar seu processo.", destaque: true },
  { id: "avancado", nome: "Tratamento Avançado", periodo: "6 meses", consultas: 48, valor: 4080, descricao: "Dois encontros por semana com acompanhamento prolongado." },
];

const moeda = (valor: number) => valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const pagamentos: Record<PlanoId, { cartao: string; pix: string }> = {
  "teste": {
    "cartao": "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=17739565-441fdf8a-10b6-44af-9fe2-452f516fa77b",
    "pix": "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=17739565-fd15366c-98ab-4980-9e32-f2c2ec5badfb"
  },
  "social": {
    "cartao": "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=17739565-3c7953b5-8ec7-45e7-8f47-342445dd4687",
    "pix": "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=17739565-4ba13e70-6a65-4d14-a19c-1fb056b85f0f"
  },
  "profundo": {
    "cartao": "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=17739565-64046de5-b685-4778-963a-f715c211e829",
    "pix": "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=17739565-3a3b40e3-51c5-4cc5-8b50-8bab1d7a4eff"
  },
  "avancado": {
    "cartao": "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=17739565-20e43460-d40e-4f24-8e41-9d80f16ba4fa",
    "pix": "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=17739565-83709f83-3620-4e16-a5be-d733bf2c67d2"
  }
};

export default function TratamentosPage() {
  return (
    <main className="min-h-screen bg-[#222F20] text-[#F5F0E6]">
      <header className="border-b border-[#D7C18C]/25">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-7">
          <Link href="/" className="flex items-center gap-3 font-serif text-xl sm:text-2xl">
            <span className="relative h-12 w-12 overflow-hidden rounded-full border border-[#D7C18C]/70">
              <Image src="/terapia-icon-192-v2.png" alt="Marca Ádria Freitas" fill sizes="48px" className="object-contain" />
            </span>
            <span>Terapia em <em className="text-[#D7C18C]">Dia.</em></span>
          </Link>
          <Link href="/terapia" className="rounded-full border border-[#D7C18C]/50 px-5 py-3 text-xs font-semibold text-[#E8D5AB] transition hover:bg-white/10">Entrar no meu espaço</Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 pb-12 pt-16 text-center sm:px-7 sm:pb-16 sm:pt-20">
        <p className="text-xs uppercase tracking-[0.28em] text-[#D7C18C]">Ádria Freitas · Acompanhamento terapêutico</p>
        <h1 className="mx-auto mt-6 max-w-3xl font-serif text-4xl leading-[1.13] sm:text-6xl">
          O seu cuidado merece <em className="font-normal text-[#D7C18C]">tempo e presença.</em>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-[#DFE4D6] sm:text-base">
          Escolha a duração e a intensidade do seu acompanhamento. Encontre um tratamento que respeite o seu momento, com clareza sobre as consultas e o investimento.
        </p>
        <a href="#planos" className="mt-9 inline-flex items-center gap-2 rounded-md bg-[#D8C399] px-7 py-4 text-sm font-semibold text-[#222F20] transition hover:bg-[#E8D5AD]">
          Conhecer os pacotes <ArrowUpRight size={17} />
        </a>
      </section>

      <section id="condicao-especial" aria-labelledby="condicao-especial-titulo" className="mx-auto max-w-6xl scroll-mt-6 px-5 pb-16 sm:px-7">
        <article className="rounded-[24px] border border-[#D7C18C] bg-[#1B271A] p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D7C18C]">Condição Especial Mensal</p>
          <h2 id="condicao-especial-titulo" className="mt-4 font-serif text-3xl leading-tight sm:text-4xl">Acompanhamento Terapêutico – R$ 280,00/mês</h2>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-[#D8DFD1] sm:text-base">Valor promocional exclusivo para clientes com assinatura paga e ativa do Plano Prata do Clube do Tarô. A assinatura do clube é opcional, contratada e paga separadamente. O valor de R$ 280,00/mês corresponde somente às quatro consultas terapêuticas mensais. Quem preferir contratar apenas a terapia poderá escolher uma modalidade individual, sem necessidade de assinar o clube.</p>
          <h3 className="mt-7 text-lg font-semibold">O que está incluído:</h3>
          <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-7 text-[#D8DFD1] sm:text-base">
            <li>1 consulta terapêutica por semana.</li>
            <li>4 consultas mensais.</li>
            <li>Acompanhamento semanal contínuo.</li>
            <li><strong className="text-[#E3C993]">Bônus especial:</strong> nos meses com 5 semanas e cinco consultas agendadas, a quinta consulta será gratuita, sem qualquer acréscimo à mensalidade.</li>
          </ul>
          <div className="mt-7 border-t border-[#D7C18C]/20 pt-6">
            <p className="font-serif text-2xl sm:text-3xl"><strong className="font-normal">Investimento: R$ 280,00 por mês.</strong></p>
            <p className="mt-3 text-sm leading-7 text-[#D8DFD1]">O valor permanece o mesmo, inclusive nos meses em que houver uma quinta consulta.</p>
            <p className="mt-5 font-semibold text-[#E3C993]">Início disponível a partir de dezembro de 2026.</p>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-[#D8DFD1] sm:text-base">Invista no seu bem-estar emocional com regularidade, acolhimento e cuidado personalizado.</p>
            <a href="https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=17739565-fdcf1f1d-3a72-48fc-a8e9-3cd4f8f33787" className="mt-7 inline-flex min-h-14 w-full items-center justify-center rounded-md bg-[#D8C399] px-5 py-4 text-center text-sm font-semibold text-[#222F20] transition hover:bg-[#E8D5AD] sm:w-auto">
              CONTRATAR CONDIÇÃO ESPECIAL
            </a>
          </div>
        </article>
      </section>

      <section id="planos" className="mx-auto max-w-6xl scroll-mt-6 px-5 pb-16 sm:px-7">
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-[#D7C18C]">Seu investimento</p>
          <h2 className="mt-3 font-serif text-3xl sm:text-4xl">Tratamentos disponíveis</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#D6DCCF]">Valores totais por tratamento. Desconto de 5% para pagamento à vista por Pix ou saldo Mercado Pago. Parcelamento no cartão sujeito às condições do Mercado Pago.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {planos.map(plano => (
            <article key={plano.id} className={"flex flex-col rounded-[24px] border bg-[#1B271A] p-6 sm:p-8 " + (plano.destaque ? "border-[#D7C18C]" : "border-[#D7C18C]/30")}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-serif text-2xl sm:text-3xl">{plano.nome}</h3>
                  <p className="mt-2 text-sm text-[#D4DACD]">{plano.periodo} de acompanhamento</p>
                </div>
                {plano.destaque && <span className="rounded-full border border-[#D7C18C]/50 px-3 py-1 text-xs text-[#D7C18C]">Acompanhamento intensivo</span>}
              </div>
              <div className="mt-6 rounded-xl border border-[#D7C18C]/40 bg-[#2A3927] px-5 py-5">
                <div className="flex items-end gap-3">
                  <span className="font-serif text-5xl leading-none text-[#E3C993] sm:text-6xl">{plano.consultas}</span>
                  <div className="pb-1">
                    <p className="text-lg font-semibold text-white">{plano.consultas === 1 ? "CONSULTA" : "CONSULTAS"}</p>
                    <p className="mt-1 text-xs text-[#D5DDCC]">incluídas no pacote</p>
                  </div>
                </div>
              </div>
              <p className="mt-5 min-h-[50px] text-sm leading-7 text-[#D8DFD1]">{plano.descricao}</p>
              <div className="mt-5 border-t border-[#D7C18C]/20 pt-5">
                <p className="text-xs uppercase tracking-[0.18em] text-[#D7C18C]">Valor total</p>
                <p className="mt-2 font-serif text-3xl sm:text-4xl">{moeda(plano.valor)}</p>
                <p className="mt-3 text-sm text-[#E3C993]">À vista (5% de desconto): {moeda(Math.round(plano.valor * 95) / 100)}</p>
              </div>
              <a href={pagamentos[plano.id].cartao} aria-label={"Pagar " + plano.nome + " com cartão no Mercado Pago"}
                className="mt-8 flex min-h-14 items-center justify-center gap-2 rounded-md bg-[#D8C399] px-5 py-4 text-center text-sm font-semibold text-[#222F20] transition hover:bg-[#E8D5AD]">
                Pagar com cartão <ArrowUpRight size={16} />
              </a>
              <a href={pagamentos[plano.id].pix} aria-label={"Pagar " + plano.nome + " à vista com 5% de desconto no Mercado Pago"}
                className="mt-3 flex min-h-14 items-center justify-center gap-2 rounded-md border border-[#D7C18C]/70 px-5 py-4 text-center text-sm font-semibold text-[#E3C993] transition hover:bg-white/10">
                Pagar à vista · 5% de desconto <ArrowUpRight size={16} />
              </a>
              <p className="mt-3 text-center text-xs leading-5 text-[#C9D2C3]">Pagamento seguro no Mercado Pago. À vista por Pix ou saldo da conta.</p>
            </article>
          ))}
        </div>
        <p className="mx-auto mt-7 max-w-3xl text-center text-xs leading-6 text-[#C5CEBF]">
          Os pacotes consideram quatro semanas por mês. Os atendimentos dependem da disponibilidade de agenda e das condições acordadas na contratação.
        </p>
      </section>

      <section className="border-t border-[#D7C18C]/20 bg-[#222F20] px-5 py-14 sm:px-7">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-serif text-3xl">Como funciona?</h2>
          <div className="mt-7 grid gap-6 sm:grid-cols-3">
            {[
              { icon: HeartHandshake, titulo: "Escolha", texto: "Compare os pacotes e escolha o acompanhamento que deseja." },
              { icon: CalendarDays, titulo: "Contratação", texto: "Pague pelo Mercado Pago. Após a confirmação, receba as orientações para agendar seus atendimentos." },
              { icon: ShieldCheck, titulo: "Seu espaço", texto: "Após a confirmação, você receberá as instruções para acessar seu portal." },
            ].map(({ icon: Icon, titulo, texto }) => (
              <div key={titulo} className="border-t border-[#D7C18C]/40 pt-5">
                <Icon size={22} className="text-[#D7C18C]" />
                <h3 className="mt-3 font-serif text-xl">{titulo}</h3>
                <p className="mt-2 text-sm leading-7 text-[#D1D9CC]">{texto}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 border-t border-[#D7C18C]/20 pt-8">
            <h3 className="font-serif text-2xl">Instalar o aplicativo</h3>
            <p className="mt-3 text-sm leading-7 text-[#D1D9CC]">O Terapia em Dia é um aplicativo de instalação pelo navegador (PWA), sem arquivo para baixar. No Chrome, abra o menu ⋮ e selecione “Instalar aplicativo” ou “Adicionar à tela inicial”. No iPhone, use Compartilhar → Adicionar à Tela de Início. Se a opção não aparecer, você pode continuar a usar o portal normalmente pelo navegador.</p>
          </div>
        </div>
      </section>
      <footer className="border-t border-[#D7C18C]/20 px-5 py-8 text-center text-xs text-[#C6CDBF]">Terapia em Dia · Ádria Freitas</footer>
    </main>
  );
}
