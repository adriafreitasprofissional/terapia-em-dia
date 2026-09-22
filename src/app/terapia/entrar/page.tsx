"use client";

import { useCallback, useEffect, useRef, useState } from "react";

function esperar(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function TerapiaEntrarPage() {
  const iniciou = useRef(false);

  const [erro, setErro] = useState<string | null>(null);
  const [status, setStatus] = useState("Abrindo seu espaço...");

  const abrirPortal = useCallback(async () => {
    setErro(null);
    setStatus("Abrindo seu espaço...");

    try {
      const accessToken =
        window.localStorage.getItem(
          "terapia_auth_access_token"
        );

      if (!accessToken) {
        window.location.replace("/terapia");
        return;
      }

      const profissional = await fetch(
        "/api/terapia/admin/me",
        {
          cache: "no-store",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (profissional.ok) {
        window.location.replace("/terapia/admin");
        return;
      }

      let ultimoErro: unknown = null;

      for (let tentativa = 1; tentativa <= 3; tentativa++) {
        try {
          setStatus(
            tentativa === 1
              ? "Abrindo seu espaço..."
              : "Tentando conectar novamente..."
          );

          const response = await fetch(
            "/api/terapia/acesso-logado",
            {
              cache: "no-store",
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(
              data?.error ||
                "Não foi possível abrir seu espaço."
            );
          }

          if (!data.access_token) {
            throw new Error(
              "Seu acesso ao Terapia em Dia não foi localizado."
            );
          }

          window.localStorage.setItem(
            "terapia_em_dia_access_token",
            data.access_token
          );

          window.location.replace(
            `/terapia/acesso/${data.access_token}`
          );

          return;
        } catch (error) {
          ultimoErro = error;

          if (tentativa < 3) {
            await esperar(800);
          }
        }
      }

      throw ultimoErro;
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível abrir seu espaço."
      );

      setStatus("");
    }
  }, []);

  useEffect(() => {
    if (iniciou.current) return;
    iniciou.current = true;

    abrirPortal();
  }, [abrirPortal]);

  if (erro) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F4EC] p-6">
        <div className="w-full max-w-md rounded-3xl border border-[#DCCFB8] bg-[#F7F1E4] p-6 text-center shadow-lg">
          <p className="text-lg font-extrabold text-[#5E7357]">
            Não foi possível abrir seu espaço
          </p>

          <p className="mt-3 text-sm leading-6 text-[#6C8465]">
            {erro}
          </p>

          <button
            type="button"
            onClick={abrirPortal}
            className="mt-5 w-full rounded-xl bg-[#5E7357] px-5 py-3 font-bold text-white"
          >
            Tentar novamente
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F4EC] p-8 text-center text-[#5E7357]">
      <div>
        <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-[#D7E1D2] border-t-[#5E7357]" />

        <p className="mt-4 font-bold">
          {status}
        </p>
      </div>
    </main>
  );
}
