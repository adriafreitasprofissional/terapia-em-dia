import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terapia em Dia | Ádria Freitas",
  description: "Um espaço para profissionais e pacientes: acompanhe sua jornada ou conheça nossas soluções de terapia.",
};

export default function InicioTerapiaEmDia() {
  const links = [
    { href: "/terapia", texto: "Entrar no meu espaço" },
    { href: "/terapia-vitrine#planos", texto: "Conhecer o Terapia em Dia como Profissional" },
    { href: "/tratamentos", texto: "Conhecer o Terapia em Dia como Paciente" },
  ];
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#222F20] px-5 py-14 text-[#F3EEE4]">
      <div className="mx-auto w-full max-w-4xl text-center">
        <div className="mx-auto flex max-w-[690px] flex-col items-center justify-center gap-8 sm:flex-row sm:gap-10">
          <div className="relative h-44 w-44 shrink-0 overflow-hidden rounded-full border-2 border-[#D7C18C] bg-[#222F20] p-2 sm:h-48 sm:w-48">
            <Image src="/terapia-icon-512-v2.png" alt="Identidade Terapia em Dia — Ádria Freitas" fill priority sizes="192px" className="object-contain p-2" />
          </div>
          <div className="text-center sm:text-left">
            <h1 className="font-serif text-[4.2rem] leading-[.87] tracking-tight sm:text-[5.6rem]">
              Terapia<br />em <span className="italic text-[#D7C18C]">Dia.</span>
            </h1>
            <p className="mt-6 font-serif text-base leading-snug">
              Mais presença para cuidar.<br />Mais leveza para viver sua prática.
            </p>
          </div>
        </div>
        <nav aria-label="Acessos ao Terapia em Dia" className="mx-auto mt-12 grid max-w-[780px] gap-4 md:grid-cols-3">
          {links.map(({ href, texto }) => (
            <Link key={href} href={href} className="flex min-h-[74px] items-center justify-center gap-2 rounded-sm border border-[#E3D2A7] bg-[#D8C399] px-4 py-4 text-center text-sm font-semibold leading-5 text-[#1F291C] shadow-sm transition hover:bg-[#E8D4A9] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D8C399]">
              {texto}<span aria-hidden="true">↗</span>
            </Link>
          ))}
        </nav>
        <p className="mx-auto mt-9 max-w-xl text-sm leading-7 text-[#F1EAD9]">
          Seu espaço para acolher histórias, organizar encontros e acompanhar cada jornada com atenção.
        </p>
      </div>
    </main>
  );
}
