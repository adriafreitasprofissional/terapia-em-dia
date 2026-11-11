"use client";

import { useMemo, useState } from "react";

type Props = {
  blockedDates: string[];
  specialDates?: string[];
  onBlockDates: (dates: string[]) => Promise<void>;
  onUnblockDates: (dates: string[]) => Promise<void>;
  title?: string;
  subtitle?: string;
};

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function isoDate(year: number, monthIndex: number, day: number) {
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function monthTitle(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function parseLocal(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y, m - 1, d, 12, 0, 0);
}

export default function AvailabilityCalendar({
  blockedDates,
  specialDates = [],
  onBlockDates,
  onUnblockDates,
  title = "Bloqueios da agenda",
  subtitle = "Selecione um ou vários dias para bloquear ou liberar.",
}: Props) {
  const today = new Date();
  const [cursor, setCursor] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selected, setSelected] = useState<string[]>([]);
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");
  const [busy, setBusy] = useState(false);

  const blocked = useMemo(() => new Set(blockedDates), [blockedDates]);
  const special = useMemo(() => new Set(specialDates), [specialDates]);
  const selectedSet = useMemo(() => new Set(selected), [selected]);

  const days = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const cells: Array<string | null> = [];

    for (let i = 0; i < firstDay; i += 1) {
      cells.push(null);
    }

    for (let day = 1; day <= totalDays; day += 1) {
      cells.push(isoDate(year, month, day));
    }

    while (cells.length % 7 !== 0) {
      cells.push(null);
    }

    return cells;
  }, [cursor]);

  function toggle(date: string) {
    setSelected((current) =>
      current.includes(date)
        ? current.filter((item) => item !== date)
        : [...current, date]
    );
  }

  function selectRange() {
    if (!rangeStart || !rangeEnd) return;

    const start = parseLocal(rangeStart);
    const end = parseLocal(rangeEnd);

    if (start > end) return;

    const values: string[] = [];
    const current = new Date(start);

    while (current <= end) {
      values.push(
        isoDate(
          current.getFullYear(),
          current.getMonth(),
          current.getDate()
        )
      );
      current.setDate(current.getDate() + 1);
    }

    setSelected((currentSelection) =>
      Array.from(new Set([...currentSelection, ...values]))
    );

    setCursor(new Date(start.getFullYear(), start.getMonth(), 1));
  }

  async function blockSelected() {
    if (!selected.length) return;
    setBusy(true);

    try {
      await onBlockDates(selected);
      setSelected([]);
    } finally {
      setBusy(false);
    }
  }

  async function unblockSelected() {
    if (!selected.length) return;
    setBusy(true);

    try {
      await onUnblockDates(selected);
      setSelected([]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-3xl border border-[#D7C18C]/35 bg-[#222F20] p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-[#F5F0E6]">
            {title}
          </h2>
          <p className="mt-2 text-sm text-[#DFE4D6]">
            {subtitle}
          </p>
        </div>

        {selected.length > 0 && (
          <div className="rounded-full bg-[#31452F] px-4 py-2 text-xs font-bold text-[#F5F0E6]">
            {selected.length} {selected.length === 1 ? "dia selecionado" : "dias selecionados"}
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-3 rounded-2xl border border-[#D7C18C]/35 bg-[#1B271A] p-4 md:grid-cols-[1fr_1fr_auto]">
        <label className="text-xs font-bold uppercase tracking-wide text-[#D7C18C]">
          De
          <input
            type="date"
            value={rangeStart}
            onChange={(e) => setRangeStart(e.target.value)}
            className="mt-2 w-full rounded-xl border border-[#D7C18C]/45 bg-[#263825] px-3 py-3 text-sm text-[#F5F0E6] [color-scheme:dark]"
          />
        </label>

        <label className="text-xs font-bold uppercase tracking-wide text-[#D7C18C]">
          Até
          <input
            type="date"
            value={rangeEnd}
            onChange={(e) => setRangeEnd(e.target.value)}
            className="mt-2 w-full rounded-xl border border-[#D7C18C]/45 bg-[#263825] px-3 py-3 text-sm text-[#F5F0E6]"
          />
        </label>

        <button
          type="button"
          onClick={selectRange}
          className="self-end rounded-xl border border-[#D7C18C]/65 px-4 py-3 text-sm font-bold text-[#F5F0E6]"
        >
          Selecionar período
        </button>
      </div>

      <div className="mt-6 rounded-3xl border border-[#D7C18C]/35 bg-[#1B271A] p-4 sm:p-5">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() =>
              setCursor(
                new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1)
              )
            }
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D7C18C]/45 text-xl font-bold text-[#F5F0E6]"
            aria-label="Mês anterior"
          >
            ‹
          </button>

          <h3 className="text-center text-xl font-extrabold capitalize text-[#F5F0E6]">
            {monthTitle(cursor)}
          </h3>

          <button
            type="button"
            onClick={() =>
              setCursor(
                new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1)
              )
            }
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D7C18C]/45 text-xl font-bold text-[#F5F0E6]"
            aria-label="Próximo mês"
          >
            ›
          </button>
        </div>

        <div className="mt-5 grid grid-cols-7 gap-1.5 sm:gap-2">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="py-2 text-center text-[11px] font-black uppercase tracking-wide text-[#D7C18C]"
            >
              {day}
            </div>
          ))}

          {days.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="h-12 sm:h-14" />;
            }

            const isBlocked = blocked.has(date);
            const isSpecial = special.has(date);
            const isSelected = selectedSet.has(date);
            const local = parseLocal(date);
            const isToday =
              local.getFullYear() === today.getFullYear() &&
              local.getMonth() === today.getMonth() &&
              local.getDate() === today.getDate();

            return (
              <button
                key={date}
                type="button"
                onClick={() => toggle(date)}
                className={`relative flex h-12 min-h-12 items-center justify-center rounded-xl border p-1 text-base font-bold transition sm:h-14 ${
                  isSelected
                    ? "border-[#D7C18C] bg-[#506A48] text-[#F5F0E6] shadow"
                    : isBlocked
                    ? "border-[#B78A7E] bg-[#5A3834] text-[#F5C7BC]"
                    : isSpecial
                    ? "border-[#789877] bg-[#37513A] text-[#ECF5E8]"
                    : "border-[#D7C18C]/35 bg-[#263825] text-[#F5F0E6] hover:border-[#D7C18C]/65 hover:bg-[#31452F]"
                }`}
                title={
                  isBlocked
                    ? "Dia bloqueado"
                    : isSpecial
                    ? "Dia liberado como exceção"
                    : "Disponível para seleção"
                }
              >
                {local.getDate()}

                {isToday && (
                  <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-current" />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex flex-wrap gap-4 text-xs font-semibold text-[#DFE4D6]">
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded bg-[#263825] ring-1 ring-[#D7C18C]/45" />
            Normal
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded bg-[#5A3834] ring-1 ring-[#B78A7E]" />
            Bloqueado
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded bg-[#506A48]" />
            Selecionado
          </span>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={blockSelected}
          disabled={!selected.length || busy}
          className="rounded-xl bg-[#506A48] px-5 py-3 text-sm font-bold text-[#F5F0E6] shadow disabled:opacity-45"
        >
          {busy ? "Salvando..." : "Bloquear dias selecionados"}
        </button>

        <button
          type="button"
          onClick={unblockSelected}
          disabled={!selected.length || busy}
          className="rounded-xl border border-[#A87B73] px-5 py-3 text-sm font-bold text-[#F5C7BC] disabled:opacity-45"
        >
          Desbloquear selecionados
        </button>

        {selected.length > 0 && (
          <button
            type="button"
            onClick={() => setSelected([])}
            disabled={busy}
            className="rounded-xl border border-[#D7C18C]/45 px-5 py-3 text-sm font-bold text-[#DFE4D6]"
          >
            Limpar seleção
          </button>
        )}
      </div>
    </section>
  );
}
