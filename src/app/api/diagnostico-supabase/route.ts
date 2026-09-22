import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  try {
    const resposta = await fetch(`${url}/auth/v1/settings`, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
      cache: "no-store",
    });

    return NextResponse.json({
      status: resposta.status,
      conexao: resposta.ok ? "OK" : "ERRO",
    });
  } catch (error) {
    return NextResponse.json({
      conexao: "FALHOU",
      erro: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
}
