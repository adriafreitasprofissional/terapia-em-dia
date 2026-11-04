import type { Metadata } from "next";
import Image from "next/image";
import { supabaseAdmin } from "@/lib/supabase-admin";
export const dynamic = "force-dynamic";
export const metadata:Metadata={title:"Li Stilus | Terapia em Dia",description:"Conheça as sessões e tratamentos de Li Stilus."};
const ID="4b1927fe-9624-475e-9574-4e389a10d03c";
type Servico={id:string;slug:string;title:string;description:string;price_cents:number;session_count:number;duration_minutes:number;service_category:string};
export default async function LiStilus(){
  const {data,error}=await supabaseAdmin.from("therapy_professional_services")
    .select("id,slug,title,description,price_cents,session_count,duration_minutes,service_category")
    .eq("professional_id",ID).eq("active",true).order("created_at",{ascending:false});
  const services=(data||[]) as Servico[];
  const moeda=(centavos:number)=>(centavos/100).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
  return <main className="min-h-screen bg-[#392B2A] text-[#FFF4E9]">
    <header className="border-b border-[#F3B99D]/25 px-5 py-6">
      <div className="mx-auto flex max-w-5xl items-center gap-4">
        <Image src="/imagens/lilian-logo.png" alt="Logotipo Li Stilus" width={78} height={78} className="h-[78px] w-[78px] rounded-full object-contain"/>
        <div><p className="text-xs uppercase tracking-[.24em] text-[#F3B99D]">Terapia em Dia</p><h1 className="font-serif text-3xl">Li Stilus</h1></div>
      </div>
    </header>
    <section className="mx-auto max-w-5xl px-5 pb-12 pt-16 text-center">
      <p className="text-xs uppercase tracking-[.24em] text-[#F3B99D]">Seu cuidado, seu momento</p>
      <h2 className="mx-auto mt-5 max-w-3xl font-serif text-4xl leading-tight sm:text-6xl">Encontre o atendimento que <em className="text-[#F3B99D]">combina com você.</em></h2>
      <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#E9D5C8]">Conheça os serviços, tratamentos e sessões oferecidos por Li Stilus. Escolha o cuidado ideal para o seu momento.</p>
      <a href="#servicos" className="mt-7 inline-block rounded-md bg-[#F3B99D] px-6 py-4 text-sm font-semibold text-[#322625]">Conhecer serviços</a>
    </section>
    <section id="servicos" className="mx-auto max-w-5xl px-5 pb-20">
      <h3 className="mb-7 font-serif text-3xl">Sessões e tratamentos</h3>
      {error ? <p className="text-sm text-[#F3B99D]">O catálogo está temporariamente indisponível.</p> : services.length===0 ? <p className="rounded-2xl border border-[#F3B99D]/30 p-7 text-[#E9D5C8]">Os serviços serão publicados aqui em breve.</p> :
      <div className="grid gap-5 sm:grid-cols-2">
      {services.map(s=><article key={s.id} className="flex flex-col rounded-2xl border border-[#F3B99D]/30 bg-[#47332F] p-7">
        <p className="text-xs uppercase tracking-widest text-[#F3B99D]">{s.service_category==="tratamento"?"Tratamento":"Sessão"}</p>
        <h4 className="mt-3 font-serif text-2xl">{s.title}</h4>
        <p className="mt-3 flex-1 text-sm leading-7 text-[#E9D5C8]">{s.description}</p>
        <p className="mt-5 text-lg font-semibold text-[#F3B99D]">{s.session_count} {s.session_count===1?"consulta":"consultas"} · {s.duration_minutes} min por sessão</p>
        <p className="mt-4 font-serif text-4xl">{moeda(s.price_cents)}</p>
        <p className="mt-4 text-xs text-[#E9D5C8]">Pagamento pelo Mercado Pago será liberado após a configuração segura da conta da profissional.</p>
      </article>)}
      </div>}
    </section>
  </main>;
}
