"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
}

declare global {
  interface Navigator {
    standalone?: boolean;
  }
}

const UM_DIA = 24 * 60 * 60 * 1000;

export default function InstallAppPrompt() {
  const [mostrar, setMostrar] = useState(false);
  const [ehIOS, setEhIOS] = useState(false);
  const [ehDesktop, setEhDesktop] = useState(false);
  const [eventoInstalacao, setEventoInstalacao] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [marca, setMarca] =
    useState<"clube" | "terapia" | null>(null);
  const [mostrarAjuda, setMostrarAjuda] =
    useState(false);

  useEffect(() => {
    const host = window.location.hostname.toLowerCase();
    const path = window.location.pathname;

    const dominioClube =
      host === "magiaoriente.com.br" ||
      host === "www.magiaoriente.com.br";

    const dominioTerapia =
      host === "adriafreitasterapeuta.com.br" ||
      host === "www.adriafreitasterapeuta.com.br";

    const paginaClube =
      dominioClube && path === "/";

    const paginaTerapia =
      dominioTerapia &&
      (
        path === "/" ||
        path === "/terapia" ||
        path.startsWith("/terapia/acesso/") ||
        path.startsWith("/terapia/admin") ||
        path.startsWith("/profissional")
      );

    if (!paginaClube && !paginaTerapia) {
      return;
    }

    const marcaAtual =
      paginaTerapia ? "terapia" : "clube";

    setMarca(marcaAtual);

    const instalado =
      window.matchMedia("(display-mode: standalone)").matches ||
      navigator.standalone === true;

    if (instalado) {
      return;
    }

    const userAgent =
      window.navigator.userAgent.toLowerCase();

    const ios =
      /iphone|ipad|ipod/.test(userAgent);

    setEhIOS(ios);
    setEhDesktop(!/android|iphone|ipad|ipod/.test(userAgent));

    const chaveAdiar =
      marcaAtual === "terapia"
        ? "terapia_em_dia_instalar_depois"
        : "clube_taro_instalar_depois";

    const adiadoAte = Number(
      localStorage.getItem(chaveAdiar) || "0"
    );

    if (adiadoAte > Date.now()) {
      return;
    }

    function aoPedirInstalacao(event: Event) {
      event.preventDefault();

      setEventoInstalacao(
        event as BeforeInstallPromptEvent
      );

      setMostrar(true);
    }

    window.addEventListener(
      "beforeinstallprompt",
      aoPedirInstalacao
    );

    let timer: number | undefined;

    if (paginaTerapia) {
      timer = window.setTimeout(() => {
        setMostrar(true);
      }, 900);
    } else if (ios) {
      timer = window.setTimeout(() => {
        setMostrar(true);
      }, 900);
    }

    return () => {
      if (timer) {
        window.clearTimeout(timer);
      }

      window.removeEventListener(
        "beforeinstallprompt",
        aoPedirInstalacao
      );
    };
  }, []);

  async function instalar() {
    if (eventoInstalacao) {
      await eventoInstalacao.prompt();

      const escolha =
        await eventoInstalacao.userChoice;

      if (escolha.outcome === "accepted") {
        setMostrar(false);
      }

      setEventoInstalacao(null);
      return;
    }

    setMostrarAjuda(true);
  }

  function agoraNao() {
    if (!marca) {
      setMostrar(false);
      return;
    }

    const chaveAdiar =
      marca === "terapia"
        ? "terapia_em_dia_instalar_depois"
        : "clube_taro_instalar_depois";

    localStorage.setItem(
      chaveAdiar,
      String(Date.now() + UM_DIA)
    );

    setMostrar(false);
  }

  if (!mostrar || !marca) {
    return null;
  }

  const terapia =
    marca === "terapia";

  if (terapia) {
    return (
      <div className="fixed inset-0 z-[99999] flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center">
        <div className="w-full max-w-md rounded-[24px] border border-[#D7C18C]/40 bg-[#1B271A] p-6 text-[#F5F0E6] shadow-[0_30px_100px_rgba(0,0,0,.4)]">
          <img src="/terapia-icon-192-v2.png" alt="Terapia em Dia" width="80" height="80" className="mx-auto h-20 w-20 rounded-full border border-[#D7C18C]/50 p-1" />
          <p className="mt-5 text-center text-[11px] font-semibold uppercase tracking-[0.25em] text-[#D7C18C]">Terapia em Dia</p>
          <h2 className="mt-3 text-center font-serif text-2xl">Instalar o aplicativo</h2>
          <p className="mx-auto mt-3 max-w-sm text-center text-sm leading-6 text-[#D4DCCE]">
            Adicione o Terapia em Dia ao seu computador ou celular, com ícone próprio e acesso direto.
          </p>
          {eventoInstalacao ? (
            <button type="button" onClick={instalar} className="mt-6 w-full rounded-lg bg-[#D8C399] px-5 py-4 text-sm font-bold text-[#222F20] transition hover:bg-[#E8D5AD]">
              INSTALAR APLICATIVO
            </button>
          ) : (
            <div className="mt-6 rounded-xl border border-[#D7C18C]/30 bg-[#293A27] p-4 text-sm leading-7 text-[#F1E6D0]">
              {ehIOS ? (
                <p>No iPhone, abra o site no Safari, toque em <strong>Compartilhar</strong> e escolha <strong>Adicionar à Tela de Início</strong>.</p>
              ) : ehDesktop ? (
                <p>No Chrome do computador, clique nos <strong>três pontos (⋮)</strong> no canto superior direito. Procure <strong>Transmitir, salvar e compartilhar → Instalar página como app</strong> (ou <strong>Instalar Terapia em Dia</strong>). Se o navegador oferecer um ícone de instalação na barra de endereços, você também pode clicar nele.</p>
              ) : (
                <p>No navegador do celular, toque no menu <strong>⋮</strong> e escolha <strong>Instalar aplicativo</strong> ou <strong>Adicionar à tela inicial</strong>.</p>
              )}
              <p className="mt-3 text-xs text-[#C5CEBF]">A instalação depende das opções disponibilizadas pelo navegador. Você pode continuar a usar o site normalmente.</p>
            </div>
          )}
          {mostrarAjuda && eventoInstalacao && (
            <p className="mt-3 text-center text-sm text-[#F1E6D0]">Confira a solicitação de instalação que apareceu no navegador.</p>
          )}
          <button type="button" onClick={agoraNao} className="mt-4 w-full rounded-lg border border-[#D7C18C]/40 px-5 py-3 text-sm font-semibold text-[#E8D5AD] transition hover:bg-white/10">
            Agora não
          </button>
        </div>
      </div>
    );
  }

  // CLUBE DO TARÔ: comportamento preservado.
  return (
    <div className="fixed inset-0 z-[99999] flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-md overflow-hidden rounded-[30px] border border-[#d7b85c]/25 bg-[linear-gradient(160deg,#1b0d28_0%,#0f0918_58%,#09070f_100%)] p-6 text-white shadow-[0_30px_100px_rgba(0,0,0,.6)]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#e8cb73]/25 bg-[#e8cb73]/10 text-3xl shadow-[0_0_35px_rgba(232,203,115,.12)]">
          ✦
        </div>

        <p className="mt-5 text-center text-[11px] font-bold uppercase tracking-[0.28em] text-[#cdb8ec]">
          Clube do Tarô
        </p>

        <h2 className="mt-2 text-center font-serif text-3xl text-[#f1d88a]">
          Instale o Clube no seu celular
        </h2>

        <p className="mx-auto mt-3 max-w-sm text-center text-sm leading-6 text-[#ded3eb]">
          Tenha acesso rápido ao seu portal, direcionamentos e novidades como um aplicativo.
        </p>

        {ehIOS ? (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <p className="font-bold text-[#f1d88a]">
              No iPhone:
            </p>

            <div className="mt-3 space-y-3 text-sm leading-6 text-[#e4daef]">
              <p>1. Abra esta página no Safari.</p>
              <p>2. Toque no botão Compartilhar.</p>
              <p>3. Escolha “Adicionar à Tela de Início”.</p>
              <p>4. Toque em “Adicionar”.</p>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={instalar}
            className="mt-6 w-full rounded-full bg-[#d8b650] px-5 py-4 text-sm font-extrabold text-[#1b1021] transition hover:brightness-110"
          >
            INSTALAR CLUBE DO TARÔ
          </button>
        )}

        <button
          type="button"
          onClick={agoraNao}
          className="mt-4 w-full rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-[#c8b9d8] transition hover:bg-white/5"
        >
          Agora não
        </button>
      </div>
    </div>
  );
}
