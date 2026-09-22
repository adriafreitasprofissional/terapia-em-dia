import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  try {
    const host = url ? new URL(url).hostname : "SEM URL";

    const resposta = await fetch(
      `${url}/auth/v1/settings`,
      {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
        cache: "no-store",
      }
    );

    const tipo =
      resposta.headers.get("content-type") || "";

    const texto = await resposta.text();

    return NextResponse.json({
      host,
      status: resposta.status,
      contentType: tipo,
      inicioResposta: texto.slice(0, 80),
    });
  } catch (error) {
    return NextResponse.json({
      erro:
        error instanceof Error
          ? error.message
          : "Erro desconhecido",
    });
  }
}
