import { Payment } from "mercadopago";
import { Resend } from "resend";
import { randomBytes, randomUUID } from "node:crypto";
import { mpClient } from "@/lib/mercadopago";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { TRATAMENTOS, tratamentoValido } from "./tratamentos";

type Pedido = {
  id: string; external_reference: string; treatment_id: string; payment_method: string;
  amount_cents: number; patient_name: string; patient_email: string; patient_whatsapp: string | null;
  status: string; access_email_sent_at: string | null; patient_id: string | null;
};

const PROFESSIONAL = "Ádria Freitas";
const SITE_URL = (process.env.THERAPY_SITE_URL || "https://adriafreitasterapeuta.com.br").replace(/\/+$/, "");
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, ch => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[ch] || ch));

async function enviarAcesso(pedido: Pedido) {
  if (pedido.access_email_sent_at) return;
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) throw new Error("Serviço de e-mail não configurado.");
  // Para pessoas que já usam o mesmo Supabase, um link de recuperação permite definir
  // ou recuperar a senha sem sobrescrever o acesso ao Clube do Tarô.
  const link = await supabaseAdmin.auth.admin.generateLink({
    type: "recovery", email: pedido.patient_email,
    options: { redirectTo: SITE_URL + "/auth/callback" },
  });
  if (link.error || !link.data?.properties?.action_link) throw new Error("Falha ao gerar link de acesso.");
  const nome = escapeHtml(pedido.patient_name);
  const nomeTratamento = tratamentoValido(pedido.treatment_id) ? TRATAMENTOS[pedido.treatment_id].titulo : "Tratamento";
  const content = '<div style="font-family:Arial,sans-serif;color:#293728;max-width:580px;margin:auto">' +
    '<h1 style="color:#354F32">Terapia em Dia</h1>' +
    '<p>Olá, ' + nome + '!</p>' +
    '<p>Seu pagamento foi confirmado e seu acompanhamento <strong>' + escapeHtml(nomeTratamento) + '</strong> foi liberado.</p>' +
    '<p>Para acessar seu espaço, defina ou recupere sua senha pelo link seguro abaixo:</p>' +
    '<p><a href="' + escapeHtml(link.data.properties.action_link) + '" style="display:inline-block;padding:14px 20px;background:#526B49;color:#fff;text-decoration:none;border-radius:12px">Definir senha e acessar</a></p>' +
    '<p>Depois, entre em <a href="' + SITE_URL + '/terapia">Terapia em Dia</a> com seu e-mail.</p>' +
    '<p>Se você já possui senha, pode entrar diretamente, sem criar outro cadastro.</p>' +
    '<p>Ádria Freitas · Terapia em Dia</p></div>';
  const result = await new Resend(process.env.RESEND_API_KEY).emails.send({
    from: process.env.EMAIL_FROM, to: pedido.patient_email,
    subject: "Acesso ao seu tratamento | Terapia em Dia", html: content,
  });
  if (result.error) throw new Error("Falha ao enviar e-mail de acesso.");
  const { error } = await supabaseAdmin.from("therapy_treatment_orders")
    .update({ access_email_sent_at: new Date().toISOString() }).eq("id", pedido.id).is("access_email_sent_at", null);
  if (error) console.error("Não foi possível registrar envio de e-mail", error.code);
}

async function provisionar(pedido: Pedido): Promise<string> {
  if (!tratamentoValido(pedido.treatment_id)) throw new Error("Tratamento não reconhecido.");
  const plano = TRATAMENTOS[pedido.treatment_id];
  const { data: existente, error: buscaErro } = await supabaseAdmin.from("club_clients")
    .select("id,email").ilike("email", pedido.patient_email).maybeSingle();
  if (buscaErro) throw buscaErro;
  let patientId = existente?.id as string | undefined;
  if (!patientId) {
    const novaSenha = randomBytes(32).toString("base64url");
    const { data: novo, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: pedido.patient_email, password: novaSenha, email_confirm: true,
      user_metadata: { display_name: pedido.patient_name },
    });
    if (authError || !novo.user?.id) throw new Error("Não foi possível criar o usuário de acesso: " + (authError?.code || "sem ID"));
    patientId = novo.user.id;
    const slug = "terapia-" + randomUUID().slice(0, 12);
    const { error: novoErro } = await supabaseAdmin.from("club_clients").insert({
      id: patientId, nome: pedido.patient_name, nome_referencia: pedido.patient_name.split(/\s+/)[0],
      email: pedido.patient_email, whatsapp: pedido.patient_whatsapp || "",
      slug, plano: "terapia", tipo_assinatura: "terapia", role: "cliente",
      produto: "Terapia em Dia", status: "ativo", acesso_app: true,
      data_inicio: new Date().toISOString().slice(0,10),
    });
    if (novoErro) throw novoErro;
  }
  const inicio = new Date();
  const fim = new Date(inicio.getTime() + plano.dias * 24 * 60 * 60 * 1000);
  const { error: contratoError } = await supabaseAdmin.from("therapy_treatment_contracts").upsert({
    order_id: pedido.id, patient_id: patientId, treatment_id: pedido.treatment_id,
    sessions_total: plano.sessoes, starts_at: inicio.toISOString(), ends_at: fim.toISOString(),
  }, { onConflict: "order_id", ignoreDuplicates: true });
  if (contratoError) throw contratoError;
  const { data: acessos, error: acessoBuscaErro } = await supabaseAdmin.from("therapy_client_access")
    .select("id, professional, active, expires_at").eq("client_id", patientId);
  if (acessoBuscaErro) throw acessoBuscaErro;
  const outros = (acessos || []).filter((a: { professional: string; active: boolean }) => a.active && a.professional !== PROFESSIONAL);
  if (outros.length) throw new Error("Paciente já vinculada a outro profissional. Requer revisão administrativa.");
  const acessoAtual = (acessos || []).find((a: { professional: string }) => a.professional === PROFESSIONAL);
  if (acessoAtual) {
    const atualExpiry = acessoAtual.expires_at ? new Date(acessoAtual.expires_at).getTime() : 0;
    const novoExpiry = new Date(fim).getTime();
    const { error } = await supabaseAdmin.from("therapy_client_access").update({
      active: true, expires_at: new Date(Math.max(atualExpiry, novoExpiry)).toISOString(),
    }).eq("id", acessoAtual.id);
    if (error) throw error;
  } else {
    const { error } = await supabaseAdmin.from("therapy_client_access").insert({
      client_id: patientId, professional: PROFESSIONAL, active: true,
      access_token: randomUUID(), expires_at: fim.toISOString(),
    });
    if (error) throw error;
  }
  return patientId;
}

export async function processarPagamentoTratamento(paymentId: string) {
  if (!/^[0-9]{1,30}$/.test(paymentId)) throw new Error("Identificador de pagamento inválido.");
  const pagamento = await new Payment(mpClient).get({ id: paymentId });
  const referencia = String(pagamento.external_reference || "");
  if (!referencia.startsWith("therapy-")) return;
  const { data, error } = await supabaseAdmin.from("therapy_treatment_orders")
    .select("*").eq("external_reference", referencia).maybeSingle();
  if (error || !data) throw new Error("Pedido terapêutico não encontrado.");
  const pedido = data as Pedido;
  if (pagamento.status !== "approved") return;
  if (pagamento.currency_id !== "BRL" ||
    Math.round(Number(pagamento.transaction_amount) * 100) !== pedido.amount_cents ||
    (pedido.payment_method === "pix" && pagamento.payment_method_id !== "pix") ||
    (pedido.payment_method === "cartao" && pagamento.payment_type_id !== "credit_card")) {
    throw new Error("Pagamento não corresponde ao método ou valor contratado.");
  }
  if (pedido.status === "paid") {
    await enviarAcesso(pedido);
    return;
  }
  const { data: lock, error: lockError } = await supabaseAdmin.from("therapy_treatment_orders")
    .update({ status: "processing", mp_payment_id: String(pagamento.id) })
    .eq("id", pedido.id).eq("status", "pending").select("id").maybeSingle();
  if (lockError) throw lockError;
  if (!lock) return;
  try {
    const id = await provisionar(pedido);
    const { error: pagoError } = await supabaseAdmin.from("therapy_treatment_orders").update({
      status: "paid", patient_id: id, paid_at: new Date().toISOString(),
    }).eq("id", pedido.id);
    if (pagoError) throw pagoError;
  } catch (error) {
    await supabaseAdmin.from("therapy_treatment_orders").update({ status: "pending" }).eq("id", pedido.id).eq("status", "processing");
    throw error;
  }
  // Caso o envio falhe, o pagamento continua confirmado. A notificação pode
  // ser reprocessada sem duplicar contratos e sem cobrar novamente.
  await enviarAcesso(pedido);
}
