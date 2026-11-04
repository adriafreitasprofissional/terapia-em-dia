"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { adminFetch } from "../components/adminFetch";

type Servico = {
  id:string; slug:string; title:string; description:string; price_cents:number;
  session_count:number; duration_minutes:number; service_category:string; active:boolean;
};
const valor=(c:number)=>(c/100).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
export default function MeusServicos(){
  const [servicos,setServicos]=useState<Servico[]>([]);
  const [erro,setErro]=useState("");
  const [mensagem,setMensagem]=useState("");
  const [salvando,setSalvando]=useState(false);
  const [aberto,setAberto]=useState(false);
  const [nome,setNome]=useState("");
  const [descricao,setDescricao]=useState("");
  const [preco,setPreco]=useState("");
  const [sessoes,setSessoes]=useState(1);
  const [duracao,setDuracao]=useState(60);
  const [categoria,setCategoria]=useState("sessao");
  const carregar=useCallback(async()=>{
    const res=await adminFetch("/api/terapia/admin/servicos");
    const data=await res.json();
    if(!res.ok) throw new Error(data.error||"Não foi possível carregar os serviços.");
    setServicos(data.services||[]);
  },[]);
  useEffect(()=>{carregar().catch(e=>setErro(e.message));},[carregar]);
  async function criar(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault();setErro("");setMensagem("");setSalvando(true);
    const centavos=Math.round(Number(preco.replace(/\./g,"").replace(",","."))*100);
    try{
      const res=await adminFetch("/api/terapia/admin/servicos",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
        title:nome,description:descricao,price_cents:centavos,session_count:sessoes,duration_minutes:duracao,service_category:categoria
      })});
      const data=await res.json();
      if(!res.ok)throw new Error(data.error||"Falha ao cadastrar serviço.");
      setNome("");setDescricao("");setPreco("");setSessoes(1);setDuracao(60);setAberto(false);
      setMensagem("Serviço criado como rascunho. Revise antes de publicar.");
      await carregar();
    }catch(e){setErro(e instanceof Error?e.message:"Erro.");}finally{setSalvando(false);}
  }
  async function alternar(s:Servico){
    setErro("");setMensagem("");
    try{
      const res=await adminFetch("/api/terapia/admin/servicos",{method:"PATCH",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({id:s.id,active:!s.active})});
      const data=await res.json();
      if(!res.ok)throw new Error(data.error||"Não foi possível atualizar.");
      await carregar();
      setMensagem(!s.active?"Serviço publicado no catálogo. O checkout permanece indisponível até configurar o Mercado Pago.":"Serviço retirado do catálogo.");
    }catch(e){setErro(e instanceof Error?e.message:"Erro.");}
  }
  return <div className="mx-auto max-w-5xl">
    <p className="text-xs uppercase tracking-[.25em] text-[#F3B99D]">Li Stilus · Terapia em Dia</p>
    <h1 className="mt-2 font-serif text-4xl">Meus serviços</h1>
    <p className="mt-3 max-w-2xl text-sm leading-7 text-[#E9D5C8]">Cadastre sessões, Mesa Radiônica e tratamentos. Defina valor, descrição, duração e quantidade de encontros. O catálogo da sua loja será atualizado ao publicar.</p>
    <div className="mt-6 flex flex-wrap gap-3">
      <button type="button" onClick={()=>setAberto(!aberto)} className="rounded-lg bg-[#F3B99D] px-5 py-3 font-semibold text-[#322625]">
        {aberto?"Recolher formulário":"+ Criar serviço"}
      </button>
      <Link href="/li-stilus" target="_blank" className="rounded-lg border border-[#F3B99D]/50 px-5 py-3 text-[#F3B99D]">Ver minha página de vendas</Link>
    </div>
    {erro&&<p role="alert" className="mt-5 rounded-lg border border-red-300/40 p-4 text-red-100">{erro}</p>}
    {mensagem&&<p role="status" className="mt-5 rounded-lg border border-[#F3B99D]/40 p-4 text-[#F3B99D]">{mensagem}</p>}
    {aberto&&<form onSubmit={criar} className="mt-7 grid gap-4 rounded-2xl border border-[#F3B99D]/35 bg-[#47332F] p-6">
      <label className="grid gap-2 text-sm">Nome do serviço
        <input required minLength={3} maxLength={120} value={nome} onChange={e=>setNome(e.target.value)} placeholder="Ex.: Mesa Radiônica" className="rounded-lg border border-[#996E60] bg-[#533B35] p-3 text-white"/>
      </label>
      <label className="grid gap-2 text-sm">Descrição para a página de vendas
        <textarea rows={4} maxLength={1600} value={descricao} onChange={e=>setDescricao(e.target.value)} placeholder="Explique como funciona o atendimento e para quem ele é indicado." className="rounded-lg border border-[#996E60] bg-[#533B35] p-3 text-white"/>
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm">Preço total (R$)
          <input required inputMode="decimal" value={preco} onChange={e=>setPreco(e.target.value)} placeholder="150,00" className="rounded-lg border border-[#996E60] bg-[#533B35] p-3 text-white"/>
        </label>
        <label className="grid gap-2 text-sm">Categoria
          <select value={categoria} onChange={e=>setCategoria(e.target.value)} className="rounded-lg border border-[#996E60] bg-[#533B35] p-3 text-white">
            <option value="sessao">Sessão individual</option><option value="tratamento">Tratamento / pacote</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm">Sessões incluídas
          <input type="number" min={1} max={100} value={sessoes} onChange={e=>setSessoes(Number(e.target.value))} className="rounded-lg border border-[#996E60] bg-[#533B35] p-3 text-white"/>
        </label>
        <label className="grid gap-2 text-sm">Duração de cada sessão (minutos)
          <input type="number" min={15} max={240} value={duracao} onChange={e=>setDuracao(Number(e.target.value))} className="rounded-lg border border-[#996E60] bg-[#533B35] p-3 text-white"/>
        </label>
      </div>
      <button disabled={salvando} type="submit" className="mt-2 rounded-lg bg-[#F3B99D] px-6 py-4 font-semibold text-[#322625] disabled:opacity-60">{salvando?"Salvando...":"Gerar serviço"}</button>
      <p className="text-xs leading-6 text-[#E9D5C8]">O serviço é criado como rascunho. Publicar apenas mostra o catálogo; o pagamento real depende da configuração segura da conta Mercado Pago.</p>
    </form>}
    <section className="mt-10">
      <h2 className="font-serif text-2xl">Serviços cadastrados</h2>
      {servicos.length===0?<p className="mt-4 text-sm text-[#E9D5C8]">Nenhum serviço cadastrado.</p>:
      <div className="mt-5 grid gap-4">
        {servicos.map(s=><details key={s.id} className="rounded-xl border border-[#F3B99D]/30 bg-[#47332F] p-5">
          <summary className="flex cursor-pointer items-center justify-between gap-3 font-semibold">
            <span>{s.title} <span className="ml-2 text-sm text-[#F3B99D]">{valor(s.price_cents)}</span></span>
            <span className="text-xs text-[#E9D5C8]">{s.active?"Publicado":"Rascunho"}</span>
          </summary>
          <div className="mt-4 border-t border-[#F3B99D]/20 pt-4">
            <p className="text-sm leading-7 text-[#E9D5C8]">{s.description||"Sem descrição."}</p>
            <p className="mt-3 text-sm text-[#F3B99D]">{s.session_count} {s.session_count===1?"sessão":"sessões"} · {s.duration_minutes} minutos</p>
            <button type="button" onClick={()=>alternar(s)} className="mt-5 rounded-lg border border-[#F3B99D]/55 px-4 py-3 text-sm text-[#F3B99D]">
              {s.active?"Retirar da página":"Publicar no catálogo"}
            </button>
          </div>
        </details>)}
      </div>}
    </section>
  </div>;
}
