"use client";
import { useState } from "react";
import type { TratamentoId, MetodoTratamento } from "@/lib/terapia/tratamentos";

export default function Contratacao({ tratamento }: { tratamento: TratamentoId }) {
  const [metodo, setMetodo] = useState<MetodoTratamento>("cartao");
  const [aberto, setAberto] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  async function continuar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    setLoading(true); setErro("");
    try {
      const response = await fetch("/api/terapia/contratacoes/checkout", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tratamento, metodo, nome, email, whatsapp }),
      });
      const data = await response.json();
      if (!response.ok || !data?.url) throw new Error(data?.error || "Não foi possível iniciar o pagamento.");
      window.location.assign(data.url);
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Não foi possível iniciar o pagamento.");
      setLoading(false);
    }
  }
  return <div className="mt-6">
    {!aberto ? <button onClick={() => setAberto(true)} type="button" className="w-full rounded-full bg-[#526B49] px-6 py-4 font-semibold text-white hover:bg-[#40583B]">Escolher tratamento</button> :
      <form onSubmit={continuar} className="space-y-3 rounded-2xl border border-[#D9E0D3] bg-[#FAFCF8] p-4">
        <p className="font-semibold">Seus dados para contratação</p>
        <input autoComplete="name" required minLength={2} maxLength={120} value={nome} onChange={e=>setNome(e.target.value)} placeholder="Nome completo" aria-label="Nome completo" className="w-full rounded-xl border border-[#CED8C8] bg-white p-3 text-sm"/>
        <input autoComplete="email" required type="email" maxLength={254} value={email} onChange={e=>setEmail(e.target.value)} placeholder="E-mail para receber o acesso" aria-label="E-mail" className="w-full rounded-xl border border-[#CED8C8] bg-white p-3 text-sm"/>
        <input autoComplete="tel" type="tel" maxLength={25} value={whatsapp} onChange={e=>setWhatsapp(e.target.value)} placeholder="WhatsApp (opcional)" aria-label="WhatsApp" className="w-full rounded-xl border border-[#CED8C8] bg-white p-3 text-sm"/>
        <fieldset><legend className="mb-2 text-sm">Como deseja pagar?</legend><div className="grid grid-cols-2 gap-2 text-sm">
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#D2D9C9] p-3"><input type="radio" name={"pagamento-"+tratamento} checked={metodo==="cartao"} onChange={()=>setMetodo("cartao")}/>Cartão</label>
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#D2D9C9] p-3"><input type="radio" name={"pagamento-"+tratamento} checked={metodo==="pix"} onChange={()=>setMetodo("pix")}/>Pix (-5%)</label>
        </div></fieldset>
        {erro && <p role="alert" className="text-sm text-red-700">{erro}</p>}
        <button type="submit" disabled={loading} className="w-full rounded-full bg-[#526B49] px-5 py-3 font-semibold text-white disabled:opacity-50">{loading?"Preparando pagamento...":"Continuar para pagamento seguro"}</button>
        <button type="button" className="w-full text-sm text-[#53634E] underline" onClick={()=>setAberto(false)}>Voltar</button>
      </form>}
  </div>;
}
