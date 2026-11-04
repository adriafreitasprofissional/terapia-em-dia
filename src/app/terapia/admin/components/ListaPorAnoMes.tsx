"use client";

import type { ReactNode } from "react";

type RegistroDatado = { id: string; scheduled_at: string };

type Props<T extends RegistroDatado> = {
  itens: T[];
  renderItem: (item: T) => ReactNode;
  vazio: string;
};

// Abertura nativa por interação; anos e meses começam sempre fechados.
// O conteúdo e as ações do registro só aparecem ao expandir o mês.
export default function ListaPorAnoMes<T extends RegistroDatado>({
  itens,
  renderItem,
  vazio,
}: Props<T>) {
  const anos = new Map<number, Map<number, T[]>>();
  for (const item of itens) {
    const data = new Date(item.scheduled_at);
    if (Number.isNaN(data.getTime())) continue;
    const ano = data.getFullYear();
    const mes = data.getMonth();
    if (!anos.has(ano)) anos.set(ano, new Map());
    const meses = anos.get(ano)!;
    if (!meses.has(mes)) meses.set(mes, []);
    meses.get(mes)!.push(item);
  }

  if (itens.length === 0) {
    return <p className="text-sm text-[#D4DCCE]">{vazio}</p>;
  }

  return (
    <div className="grid gap-3">
      {Array.from(anos.entries()).sort(([a], [b]) => b - a).map(([ano, meses]) => {
        const total = Array.from(meses.values()).reduce((n, lista) => n + lista.length, 0);
        return (
          <details key={ano} className="group/ano rounded-2xl border border-[#D7C18C]/40 bg-[#1B271A] p-3">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-xl px-3 py-3 font-semibold text-[#F5F0E6] marker:hidden [&::-webkit-details-marker]:hidden">
              <span>{ano} <span className="ml-2 text-sm font-normal text-[#C8D3C3]">({total} {total === 1 ? "registro" : "registros"})</span></span>
              <span className="text-xs text-[#D7C18C] group-open/ano:hidden">Expandir ▾</span>
              <span className="hidden text-xs text-[#D7C18C] group-open/ano:inline">Recolher ▴</span>
            </summary>
            <div className="mt-2 grid gap-2 pl-2 sm:pl-4">
              {Array.from(meses.entries()).sort(([a], [b]) => b - a).map(([mes, registros]) => (
                <details key={mes} className="group/mes rounded-xl border border-[#D7C18C]/25 bg-[#293A27] p-3">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-2 py-2 text-sm font-semibold text-[#F5F0E6] marker:hidden [&::-webkit-details-marker]:hidden">
                    <span className="capitalize">
                      {new Intl.DateTimeFormat("pt-BR", {month:"long"}).format(new Date(ano, mes, 1))}
                      <span className="ml-2 font-normal text-[#C8D3C3]">({registros.length})</span>
                    </span>
                    <span className="text-xs text-[#D7C18C] group-open/mes:hidden">Expandir ▾</span>
                    <span className="hidden text-xs text-[#D7C18C] group-open/mes:inline">Recolher ▴</span>
                  </summary>
                  <div className="mt-3 grid gap-3">
                    {registros.map(item => <div key={item.id}>{renderItem(item)}</div>)}
                  </div>
                </details>
              ))}
            </div>
          </details>
        );
      })}
    </div>
  );
}
