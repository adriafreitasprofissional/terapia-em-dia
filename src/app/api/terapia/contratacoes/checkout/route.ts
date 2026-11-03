import { NextRequest, NextResponse } from "next/server";
import { Preference } from "mercadopago";
import { mpClient } from "@/lib/mercadopago";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { TRATAMENTOS, tratamentoValido, valorTratamento, type MetodoTratamento } from "@/lib/terapia/tratamentos";

export const runtime = "nodejs";

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: NextRequest) {
  if (process.env.THERAPY_TREATMENTS_CHECKOUT_ENABLED !== "true") {
    return errorResponse("As contratações online estão em preparação. Entre em contato para receber orientações.", 503);
  }
  if (!process.env.MERCADOPAGO_ACCESS_TOKEN || !process.env.MERCADOPAGO_WEBHOOK_SECRET) {
    return errorResponse("Pagamento temporariamente indisponível.", 503);
  }
  try {
    const data = await req.json();
    const tratamento = data?.tratamento;
    const metodo = data?.metodo as MetodoTratamento;
    const nome = String(data?.nome || "").trim().replace(/\s+/g, " ");
    const email = String(data?.email || "").trim().toLowerCase();
    const whatsapp = String(data?.whatsapp || "").trim();
    if (!tratamentoValido(tratamento) || (metodo !== "pix" && metodo !== "cartao")) {
      return errorResponse("Tratamento ou forma de pagamento inválidos.", 400);
    }
    if (nome.length < 2 || nome.length > 120 || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || whatsapp.length > 25) {
      return errorResponse("Confira nome, e-mail e telefone.", 400);
    }
    const pacote = TRATAMENTOS[tratamento];
    const totalCentavos = valorTratamento(tratamento, metodo);
    const ref = "therapy-" + crypto.randomUUID();
    const { error: insertError } = await supabaseAdmin.from("therapy_treatment_orders").insert({
      external_reference: ref, treatment_id: tratamento, payment_method: metodo,
      amount_cents: totalCentavos, patient_name: nome, patient_email: email,
      patient_whatsapp: whatsapp || null, status: "pending",
    });
    if (insertError) {
      console.error("Falha ao registrar pedido terapêutico", insertError.code);
      return errorResponse("Não foi possível preparar a contratação. Tente novamente.", 503);
    }
    const baseUrl = (process.env.THERAPY_SITE_URL || "https://adriafreitasterapeuta.com.br").replace(/\/+$/, "");
    const payment_methods = metodo === "pix" ? {
      excluded_payment_types: [{ id: "credit_card" }, { id: "debit_card" }, { id: "ticket" }, { id: "atm" }, { id: "prepaid_card" }],
      installments: 1,
    } : {
      excluded_payment_types: [{ id: "bank_transfer" }, { id: "ticket" }, { id: "atm" }, { id: "debit_card" }],
      installments: 12,
    };
    const preference = await new Preference(mpClient).create({
      body: {
        items: [{ id: "therapy-" + tratamento, title: "Terapia em Dia - " + pacote.titulo, quantity: 1, currency_id: "BRL", unit_price: totalCentavos / 100 }],
        payer: { name: nome, email },
        external_reference: ref,
        metadata: { produto: "terapia_em_dia", tratamento, metodo },
        payment_methods,
        back_urls: {
          success: baseUrl + "/tratamentos/retorno?resultado=sucesso",
          pending: baseUrl + "/tratamentos/retorno?resultado=pendente",
          failure: baseUrl + "/tratamentos/retorno?resultado=falha",
        },
        auto_return: "approved",
        notification_url: baseUrl + "/api/terapia/contratacoes/webhook",
      },
    });
    if (!preference.id || !preference.init_point) {
      return errorResponse("O Mercado Pago não retornou o link de pagamento.", 502);
    }
    await supabaseAdmin.from("therapy_treatment_orders")
      .update({ mp_preference_id: preference.id })
      .eq("external_reference", ref);
    return NextResponse.json({ url: preference.init_point }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Erro ao criar checkout de terapia", error instanceof Error ? error.message : "desconhecido");
    return errorResponse("Não foi possível iniciar o pagamento. Tente novamente.", 500);
  }
}
