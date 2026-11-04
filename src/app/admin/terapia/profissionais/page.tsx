"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Profissional = {id:string;name:string;slug:string|null;active:boolean;plan:string|null;subscription_status:string|null};
export default function MinhasProfissionais() {
  const [lista,setLista]=useState<Profissional[]>([]);
  const [erro,setErro]=useState("");
  const [carregando,setCarregando]=useState(true);
  const [busca,setBusca]=useState("");
  const [abrindo,setAbrindo]=useState<string|null>(null);
  useEffect(()=>{
    let ativo=true;
    async function carregar(){
      try {
        const {data:{session}}=await supabase.auth.getSession();
        if (!session?.access_token) throw new Error("Entre com sua conta administrativa.");
        const response=await fetch("/api/admin/terapia/profissionais",{
          headers:{Authorization:"Bearer "+session.access_token},cache:"no-store"});
        const body=await response.json();
        if (!response.ok) throw new Error(body.error||"Falha ao carregar profissionais.");
        if(ativo)setLista(body.profissionais||[]);
      } catch(e){ if(ativo)setErro(e instanceof Error?e.message:"Erro de acesso."); }
      finally{if(ativo)setCarregando(false);}
    }
    carregar();
    return ()=>{ativo=false;};
  },[]);
  async function visualizar(p:Profissional){
    setErro("");setAbrindo(p.id);
    try{
      const {data:{session}}=await supabase.auth.getSession();
      if(!session?.access_token)throw new Error("Sua sessão administrativa expirou.");
      // Revalidar no servidor o direito de conferir esta profissional.
      const response=await fetch("/api/admin/terapia/profissionais",{
        headers:{Authorization:"Bearer "+session.access_token},cache:"no-store"});
      const body=await response.json();
      if(!response.ok || !(body.profissionais||[]).some((x:Profissional)=>x.id===p.id && x.active)){
        throw new Error("Esta profissional não está disponível para visualização.");
      }
      window.localStorage.setItem("terapia_auth_access_token",session.access_token);
      window.localStorage.setItem("terapia_preview_professional_id",p.id);
      window.location.assign("/terapia/admin");
    }catch(e){setErro(e instanceof Error?e.message:"Não foi possível abrir.");setAbrindo(null);}
  }
  const filtradas=lista.filter(p=>(p.name+" "+(p.slug||"")).toLocaleLowerCase("pt-BR").includes(busca.toLocaleLowerCase("pt-BR")));
  return <main className="mx-auto max-w-6xl px-4 py-7 text-[#FFF4E9]">
    <Link href="/admin" className="text-sm text-[#D7C18C]">← Central de Negócios</Link>
    <p className="mt-8 text-xs uppercase tracking-[.24em] text-[#D7C18C]">Terapia em Dia · Administração</p>
    <h1 className="mt-3 font-serif text-4xl">Minhas terapeutas</h1>
    <p className="mt-4 max-w-3xl text-sm leading-7 text-[#D4DCCE]">Profissionais clientes da plataforma. Escolha uma conta para conferir seu painel em modo de suporte, sem modificar atendimentos, cadastros ou serviços.</p>
    <label className="mt-8 block max-w-xl text-sm">Buscar profissional
      <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Nome da terapeuta"
        className="mt-2 w-full rounded-lg border border-[#D7C18C]/40 bg-[#293A27] px-4 py-3 text-white"/>
    </label>
    {erro&&<p role="alert" className="mt-6 rounded-lg border border-red-300/50 p-4 text-sm text-red-100">{erro}</p>}
    {carregando?<p className="mt-8 text-sm">Carregando profissionais...</p>:
    <div className="mt-8 grid gap-4 md:grid-cols-2">
      {filtradas.map(p=><article key={p.id} className="rounded-2xl border border-[#D7C18C]/30 bg-[#1B271A] p-6">
        <p className="text-xs uppercase tracking-wider text-[#D7C18C]">Profissional cadastrada</p>
        <h2 className="mt-3 font-serif text-2xl">{p.name}</h2>
        <p className="mt-2 text-sm text-[#D4DCCE]">Plano: {p.plan||"Não informado"} · Situação: {p.subscription_status||"Não informado"}</p>
        <p className="mt-1 text-xs text-[#C5CEBF]">{p.active?"Conta ativa":"Conta inativa"}</p>
        <button disabled={!p.active||Boolean(abrindo)} onClick={()=>visualizar(p)}
          className="mt-5 w-full rounded-lg bg-[#D8C399] px-5 py-3 font-semibold text-[#222F20] disabled:opacity-40">
          {abrindo===p.id?"Abrindo...":"Ver como profissional"}
        </button>
        {p.slug==="lilian"&&<Link href="/admin/terapia/li-stilus" className="mt-3 block text-center text-sm text-[#D7C18C]">Ver suporte Li Stilus</Link>}
      </article>)}
      {filtradas.length===0&&<p className="text-sm text-[#D4DCCE]">Nenhuma profissional encontrada.</p>}
    </div>}
  </main>;
}
