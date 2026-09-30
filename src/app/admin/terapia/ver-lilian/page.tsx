"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

const LILIAN_ID =
  "4b1927fe-9624-475e-9574-4e389a10d03c";

export default function VerLilianPage() {
  useEffect(() => {
    async function abrir() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        window.location.replace("/admin");
        return;
      }

      window.localStorage.setItem(
        "terapia_auth_access_token",
        session.access_token
      );

      window.localStorage.setItem(
        "terapia_preview_professional_id",
        LILIAN_ID
      );

      window.location.replace(
        "/terapia/admin"
      );
    }

    abrir();
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F4EC] p-8 text-center text-[#5E7357]">
      <p className="font-bold">
        Abrindo o aplicativo da Lilian...
      </p>
    </main>
  );
}