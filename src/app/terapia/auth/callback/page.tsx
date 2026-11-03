"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TerapiaAuthCallbackPage() {
  const [erro, setErro] = useState("");
  useEffect(() => {
    let active = true;
    async function autenticar() {
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      if (code) {
        const result = await supabase.auth.exchangeCodeForSession(code);
        if (result.error) { if (active) setErro("O link não pôde ser validado. Solicite um novo acesso."); return; }
      } else {
        const hash = new URLSearchParams(window.location.hash.slice(1));
        const access_token = hash.get("access_token");
        const refresh_token = hash.get("refresh_token");
        if (access_token && refresh_token) {
          const result = await supabase.auth.setSession({ access_token, refresh_token });
          if (result.error) { if (active) setErro("O link expirou. Solicite um novo acesso."); return; }
        }
      }
      const { data } = await supabase.auth.getSession();
      if (!data.session) { if (active) setErro("Não foi possível validar este link. Solicite um novo acesso."); return; }
      window.location.replace("/terapia/auth/definir-senha");
    }
    void autenticar();
    return () => { active = false; };
  }, []);
  return <main className="flex min-h-screen items-center justify-center bg-[#F7F3EA] p-5 text-[#34472F]"><div className="max-w-md rounded-3xl bg-white p-8 text-center shadow-md"><h1 className="font-serif text-3xl">Terapia em Dia</h1><p className="mt-4">{erro || "Validando seu acesso seguro..."}</p><a href="/terapia" className="mt-6 inline-block text-sm underline">Ir para o login</a></div></main>;
}
