import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "E-mail e senha sao obrigatorios." },
        { status: 400 }
      );
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !anonKey) {
      return NextResponse.json(
        {
          error:
            "Configuracao do Supabase nao encontrada.",
        },
        { status: 500 }
      );
    }

    const supabase = createClient(
      url,
      anonKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      }
    );

    const {
      data,
      error,
    } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (
      error ||
      !data.session?.access_token
    ) {
      return NextResponse.json(
        {
          error:
            error?.message ||
            "E-mail ou senha incorretos.",
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      access_token:
        data.session.access_token,
      refresh_token:
        data.session.refresh_token,
      user: data.user,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Nao foi possivel entrar.",
      },
      { status: 500 }
    );
  }
}
