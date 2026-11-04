"use client";

import {
  useEffect,
  useState,
} from "react";
import { adminFetch } from "../components/adminFetch";
import ListaPorAnoMes from "../components/ListaPorAnoMes";

export default function SessoesPage() {
  const [
    atendimentos,
    setAtendimentos,
  ] = useState<any[]>(
    []
  );

  const [
    mensagem,
    setMensagem,
  ] = useState<
    string | null
  >(null);

  async function carregar() {
    const response =
      await adminFetch(
        "/api/terapia/admin/agenda"
      );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data?.error ||
          "Erro ao carregar sessões."
      );
    }

    setAtendimentos(
      [...(
        data.atendimentos ||
        []
      )].sort(
        (a, b) =>
          new Date(
            b.scheduled_at
          ).getTime() -
          new Date(
            a.scheduled_at
          ).getTime()
      )
    );
  }

  useEffect(() => {
    carregar().catch(
      (error) =>
        setMensagem(
          error instanceof
            Error
            ? error.message
            : "Erro ao carregar sessões."
        )
    );
  }, []);

  async function alterarStatus(
    id: string,
    status: string
  ) {
    const response =
      await adminFetch(
        "/api/terapia/admin/agenda",
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body:
            JSON.stringify({
              id,
              status,
            }),
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      setMensagem(
        data?.error ||
          "Não foi possível atualizar."
      );

      return;
    }

    setMensagem(
      status ===
        "realizado"
        ? "Sessão marcada como realizada."
        : "Sessão cancelada."
    );

    await carregar();
  }

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8AA27A]">
        Terapia em Dia
      </p>

      <h1 className="mt-2 text-3xl font-extrabold text-[#5E7357]">
        Sessões
      </h1>

      <p className="mt-2 text-sm text-[#6C8465]">
        Histórico e controle
        básico dos seus
        atendimentos.
      </p>

      {mensagem && (
        <div className="mt-5 rounded-2xl border border-[#C7D4C0] bg-[#E8F0E4] p-4 text-sm font-semibold text-[#4F6548]">
          {mensagem}
        </div>
      )}

      <div className="mt-7">
        <p className="mb-4 text-sm text-[#D4DCCE]">Selecione o ano e o mês para consultar as sessões ({atendimentos.length}).</p>
        <ListaPorAnoMes
          itens={atendimentos}
          vazio="Nenhuma sessão registrada."
          renderItem={(item) => (
            <div className="rounded-2xl border border-[#D7C18C]/35 bg-[#1B271A] p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-bold text-[#F5F0E6]">{item.client_name}</p>
                  <p className="mt-1 text-sm text-[#D4DCCE]">{item.service_type} · {new Date(item.scheduled_at).toLocaleString("pt-BR")}</p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-[#D7C18C]">{item.status}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.meet_url && item.status !== "cancelado" && (
                    <a href={item.meet_url} target="_blank" rel="noreferrer"
                      className="rounded-xl bg-[#506A48] px-3 py-2 text-xs font-bold text-white">Entrar</a>
                  )}
                  {item.status === "agendado" && (
                    <>
                      <button type="button" onClick={() => alterarStatus(item.id, "realizado")}
                        className="rounded-xl border border-[#D7C18C]/60 px-3 py-2 text-xs font-bold text-[#F5F0E6]">Marcar realizada</button>
                      <button type="button" onClick={() => alterarStatus(item.id, "cancelado")}
                        className="rounded-xl border border-[#D7C18C]/35 px-3 py-2 text-xs font-bold text-[#C8D3C3]">Cancelar</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
}
