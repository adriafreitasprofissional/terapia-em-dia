import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, HeartHandshake, ShieldCheck, Sparkles } from "lucide-react";
type TratamentoId = "teste" | "social" | "profundo" | "avancado";
const TRATAMENTOS = {
  teste: {titulo:"Fase Teste",duracao:"7 dias",sessoes:1,totalCentavos:2700,descricao:"Uma consulta para conhecer o acompanhamento e o portal."},
  social: {titulo:"Social",duracao:"1 mês",sessoes:4,totalCentavos:39600,descricao:"Uma consulta por semana para iniciar o acompanhamento."},
  profundo: {titulo:"Tratamento Profundo",duracao:"3 meses",sessoes:24,totalCentavos:228000,descricao:"Duas consultas por semana ao longo de três meses."},
  avancado: {titulo:"Tratamento Avançado",duracao:"6 meses",sessoes:48,totalCentavos:408000,descricao:"Duas consultas por semana ao longo de seis meses."},
} as const;
const reais=(v:number)=>(v/100).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const valorTratamento=(id:TratamentoId, metodo:"pix"|"cartao")=> metodo==="pix" ? Math.round(TRATAMENTOS[id].totalCentavos * 0.95) : TRATAMENTOS[id].totalCentavos;

export const metadata: Metadata = {
  title: "Tratamentos com Ádria Freitas | Terapia em Dia",
  description: "Conheça os acompanhamentos terapêuticos com Ádria Freitas, escolha seu tratamento e contrate com segurança.",
};

const ids: TratamentoId[] = ["teste", "social", "profundo", "avancado"];

export default function TratamentosPage() {
  return (
    <main className="min-h-screen bg-[#F7F3EA] text-[#293628]">
      <header className="border-b border-[#DCD4C3] bg-[#253323] text-[#F6F0E5]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-5">
          <Link href="/terapia-vitrine" className="font-serif text-2xl tracking-tight">Terapia em <span className="italic text-[#D6BD85]">Dia.</span></Link>
          <Link href="/terapia" className="rounded-full border border-[#D6BD85]/70 px-5 py-2 text-sm hover:bg-white/10">Entrar no meu espaço</Link>
        </div>
      </header>
      <section className="relative overflow-hidden bg-[#253323] text-[#F5EEE1]">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 md:grid-cols-[1.1fr_.9fr] md:py-20">
          <div>
            <p className="text-xs uppercase tracking-[.25em] text-[#D6BD85]">Um cuidado com espaço para você</p>
            <h1 className="mt-5 max-w-2xl font-serif text-4xl leading-tight sm:text-6xl">Seu processo merece <span className="italic text-[#D6BD85]">presença e acolhimento.</span></h1>
            <p className="mt-6 max-w-xl leading-8 text-[#E9E4D8]">Acompanhamento terapêutico com Ádria Freitas. Encontros planejados para respeitar sua história, seu ritmo e sua individualidade.</p>
            <a href="#tratamentos" className="mt-8 inline-flex rounded-full bg-[#D6BD85] px-7 py-4 text-sm font-semibold text-[#243021] hover:bg-[#E8D1A1]">Conhecer os tratamentos</a>
          </div>
          <div className="mx-auto w-full max-w-sm overflow-hidden rounded-[32px] border border-[#D6BD85]/50 bg-[#394634] p-2">
            <Image src="/imagens/adria-hero-terapia.png" alt="Ádria Freitas — terapeuta" width={900} height={1200} priority className="h-auto w-full rounded-[26px] object-cover" />
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-5 px-5 py-12 md:grid-cols-3">
        {[
          {Icon: HeartHandshake, titulo:"Acolhimento", texto:"Escuta respeitosa e acompanhamento individualizado."},
          {Icon: CalendarDays, titulo:"Continuidade", texto:"Uma jornada organizada com encontros e agenda no portal."},
          {Icon: ShieldCheck, titulo:"Seu espaço", texto:"Acesso pessoal aos seus agendamentos e materiais de acompanhamento."}
        ].map(({Icon,titulo,texto}) => <article key={titulo} className="rounded-3xl border border-[#DDD5C6] bg-white p-6"><Icon className="text-[#65785B]" size={25}/><h2 className="mt-3 font-serif text-2xl">{titulo}</h2><p className="mt-2 text-sm leading-6 text-[#5C6A58]">{texto}</p></article>)}
      </section>
      <section id="tratamentos" className="mx-auto max-w-6xl scroll-mt-8 px-5 pb-20 pt-8">
        <p className="text-center text-xs uppercase tracking-[.2em] text-[#708066]">Escolha sua jornada</p>
        <h2 className="mt-3 text-center font-serif text-4xl">Tratamentos e investimentos</h2>
        <p className="mx-auto mt-4 max-w-2xl text-center leading-7 text-[#5A6956]">Valores para pagamento único por período contratado. Consulte as condições de parcelamento; no Pix à vista há 5% de desconto.</p>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {ids.map((id) => {
            const t = TRATAMENTOS[id];
            return <article key={id} className={"rounded-[30px] border bg-white p-6 shadow-sm sm:p-8 " + (id==="profundo" ? "border-[#A58C55] ring-1 ring-[#D6BD85]" : "border-[#E3DBC9]")}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-serif text-3xl">{t.titulo}</h3>
                {id==="profundo" && <span className="rounded-full bg-[#EAE1C9] px-3 py-1 text-xs text-[#5A4B2F]">Acompanhamento contínuo</span>}
              </div>
              <p className="mt-2 text-sm text-[#687762]">{t.duracao} · {t.sessoes} {t.sessoes===1?"consulta":"consultas"}</p>
              <p className="mt-4 text-sm leading-7 text-[#5B6958]">{t.descricao}</p>
              <p className="mt-6 text-xs uppercase tracking-[.15em] text-[#677963]">Investimento total no cartão</p>
              <p className="mt-1 font-serif text-4xl">{reais(t.totalCentavos)}</p>
              <p className="mt-2 text-xs leading-5 text-[#697768]">Parcelamento sujeito às condições exibidas no checkout do Mercado Pago.</p>
              <div className="mt-6 rounded-2xl bg-[#EFF2E9] p-4">
                <p className="text-xs text-[#687963]">Pix à vista · 5% de desconto</p>
                <p className="mt-1 text-2xl font-semibold text-[#354F32]">{reais(valorTratamento(id,"pix"))}</p>
              </div>
              <a href="#como-contratar" className="mt-6 flex w-full items-center justify-center rounded-full bg-[#526B49] px-6 py-4 font-semibold text-white hover:bg-[#40583B]">Tenho interesse neste tratamento</a>
            </article>;
          })}
        </div>
        <p className="mt-6 text-center text-xs leading-6 text-[#6A7666]">Cálculo dos tratamentos por quatro semanas por mês: Social 4 consultas, Profundo 24 e Avançado 48. Datas e reagendamentos seguem as regras de agenda e o contrato de atendimento.</p>
      </section>
      <section id="como-contratar" className="scroll-mt-8 bg-[#EDE9DF] py-14">
        <div className="mx-auto max-w-4xl px-5">
          <div className="flex items-center gap-3"><Sparkles className="text-[#75866A]"/><h2 className="font-serif text-3xl">Como funciona?</h2></div>
          <p className="mt-4 leading-8 text-[#52634F]">Escolha o tratamento de sua preferência e informe o nome do pacote à pessoa que lhe encaminhou esta página. Ela orientará você sobre disponibilidade, pagamento e agendamento. A contratação online será liberada após a conclusão dos testes de segurança.</p>
          <h3 className="mt-8 font-serif text-2xl">Perguntas frequentes</h3>
          <div className="mt-4 space-y-3 text-sm leading-7 text-[#566552]">
            <p><strong>Posso parcelar?</strong> O parcelamento dependerá das condições disponíveis no Mercado Pago quando a contratação for disponibilizada.</p>
            <p><strong>Como funciona o Pix?</strong> O desconto de 5% no Pix à vista está previsto nos valores apresentados. Confirme as instruções de pagamento antes de contratar.</p>
            <p><strong>Quando recebo o acesso?</strong> Após a confirmação da contratação e a liberação do acesso. Você receberá as orientações pelo e-mail informado.</p>
            <p><strong>Como são marcadas as consultas?</strong> Os horários são combinados conforme disponibilidade da agenda. O pagamento não garante um horário específico.</p>
            <p><strong>E se eu precisar cancelar?</strong> Consulte as condições de atendimento e a política de cancelamento antes da contratação; os direitos previstos na legislação aplicável são respeitados.</p>
          </div>
        </div>
      </section>
      <footer className="bg-[#253323] px-5 py-8 text-center text-sm text-[#E3D6B9]">Terapia em Dia · Ádria Freitas · Cuidar com presença</footer>
    </main>
  );
}
