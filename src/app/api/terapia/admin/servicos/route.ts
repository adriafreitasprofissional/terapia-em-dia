import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getTherapyAdmin } from "../_auth";

export const runtime = "nodejs";
const LILIAN_ID = "4b1927fe-9624-475e-9574-4e389a10d03c";
const denied = () => NextResponse.json({error:"Acesso não autorizado."},{status:403});
const invalid = (error:string) => NextResponse.json({error},{status:400});

async function authorized(request:NextRequest, write:boolean) {
  const admin = await getTherapyAdmin(request);
  if(!admin || admin.id !== LILIAN_ID || (write && admin.preview_mode)) return null;
  return admin;
}
export async function GET(req:NextRequest){
  if(!await authorized(req,false)) return denied();
  const {data,error}=await supabaseAdmin.from("therapy_professional_services")
    .select("id,slug,title,description,price_cents,session_count,duration_minutes,service_category,active")
    .eq("professional_id",LILIAN_ID).order("created_at",{ascending:false});
  if(error) return NextResponse.json({error:"Não foi possível carregar os serviços."},{status:503});
  return NextResponse.json({services:data||[]},{headers:{"Cache-Control":"no-store"}});
}
export async function POST(req:NextRequest){
  if(!await authorized(req,true)) return denied();
  let body:Record<string,unknown>;
  try { body=await req.json(); }catch{ return invalid("Dados inválidos."); }
  const title=String(body.title||"").trim();
  const description=String(body.description||"").trim();
  const price_cents=Number(body.price_cents);
  const session_count=Number(body.session_count);
  const duration_minutes=Number(body.duration_minutes);
  const service_category=String(body.service_category||"sessao");
  const slug=title.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,90);
  if(title.length<3||title.length>120||description.length>1600||!slug||!Number.isSafeInteger(price_cents)||price_cents<100||price_cents>100000000||!Number.isInteger(session_count)||session_count<1||session_count>100||!Number.isInteger(duration_minutes)||duration_minutes<15||duration_minutes>240||!["sessao","tratamento"].includes(service_category)) return invalid("Confira nome, preço, duração e consultas.");
  const {data,error}=await supabaseAdmin.from("therapy_professional_services")
    .insert({professional_id:LILIAN_ID,slug,title,description,price_cents,session_count,duration_minutes,service_category,active:false})
    .select("id,slug,title,description,price_cents,session_count,duration_minutes,service_category,active").single();
  if(error) return NextResponse.json({error:error.code==="23505"?"Esse nome de serviço já foi cadastrado.":"Não foi possível criar o serviço."},{status:409});
  return NextResponse.json({service:data},{status:201});
}
export async function PATCH(req:NextRequest){
  if(!await authorized(req,true)) return denied();
  let body:Record<string,unknown>;
  try {body=await req.json();}catch{return invalid("Dados inválidos.");}
  const id=String(body.id||"");
  if(!/^[0-9a-f-]{36}$/i.test(id)||typeof body.active!=="boolean") return invalid("Serviço ou situação inválidos.");
  // A publicação depende de conexão Mercado Pago configurada: publicar catálogo sem habilitar checkout.
  const {data,error}=await supabaseAdmin.from("therapy_professional_services").update({active:body.active,updated_at:new Date().toISOString()})
    .eq("id",id).eq("professional_id",LILIAN_ID).select("id,active").maybeSingle();
  if(error||!data) return NextResponse.json({error:"Serviço não encontrado ou atualização indisponível."},{status:404});
  return NextResponse.json({service:data});
}
