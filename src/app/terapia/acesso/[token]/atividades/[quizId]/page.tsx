"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import {
  useParams,
  useRouter,
} from "next/navigation";
import { therapyAccessToken } from "@/lib/therapy-session";
import { therapyLoginPath } from "@/lib/therapy-navigation";

type Pergunta = {
  id: string;
  type:
    | "single_choice"
    | "multiple_choice"
    | "short_text"
    | "long_text"
    | "scale";
  prompt: string;
  helper?: string | null;
  options?: string[];
  min?: number | null;
  max?: number | null;
  min_label?: string | null;
  max_label?: string | null;
};

type Quiz = {
  id: string;
  title: string;
  subtitle: string | null;
  instructions: string | null;
  questions: Pergunta[];
  resposta: {
    answers:
      | Record<
          string,
          unknown
        >
      | null;
    status: string;
    submitted_at: string | null;
  } | null;
};

export default function ResponderAtividadePage() {
  const params =
    useParams();

  const router =
    useRouter();

  const token =
    String(
      params?.token || ""
    );

  const quizId =
    String(
      params?.quizId || ""
    );

  const preview =
    token.startsWith(
      "preview-"
    );

  const [
    quiz,
    setQuiz,
  ] =
    useState<Quiz | null>(
      null
    );

  const [
    respostas,
    setRespostas,
  ] = useState<
    Record<
      string,
      unknown
    >
  >({});

  const [
    carregando,
    setCarregando,
  ] = useState(true);

  const [
    salvando,
    setSalvando,
  ] = useState(false);

  const [
    erro,
    setErro,
  ] = useState<
    string | null
  >(null);

  const [
    mensagem,
    setMensagem,
  ] = useState<
    string | null
  >(null);

  const ultimaVersaoSalvaRef =
    useRef<string>("{}");

  const concluida =
    quiz?.resposta
      ?.status ===
    "completed";

  useEffect(() => {
    async function carregar() {
      try {
        setCarregando(true);
        setErro(null);

        const headers:
          Record<
            string,
            string
          > = {};

        if (preview) {
          const accessToken = await therapyAccessToken();
          if (!accessToken) {
            router.replace(therapyLoginPath(`/terapia/acesso/${token}/atividades/${quizId}`));
            return;
          }
          headers.Authorization = `Bearer ${accessToken}`;
        }

        const response =
          await fetch(
            `/api/terapia/atividades?token=${encodeURIComponent(
              token
            )}&quizId=${encodeURIComponent(
              quizId
            )}`,
            {
              cache:
                "no-store",
              headers,
            }
          );

        if (preview && response.status === 401) {
          router.replace(therapyLoginPath(`/terapia/acesso/${token}/atividades/${quizId}`));
          return;
        }

        const data =
          await response.json();

        if (
          !response.ok
        ) {
          throw new Error(
            data?.error ||
              "Não foi possível abrir esta atividade."
          );
        }

        if (!data?.quiz) {
          throw new Error(
            "Atividade não encontrada."
          );
        }

        setQuiz(
          data.quiz
        );

        const salvas =
          data.quiz
            ?.resposta
            ?.answers;

        const respostasIniciais =
          salvas &&
            typeof salvas ===
              "object"
            ? salvas
            : {};

        ultimaVersaoSalvaRef.current =
          JSON.stringify(
            respostasIniciais
          );

        setRespostas(
          respostasIniciais
        );
      } catch (
        error
      ) {
        setErro(
          error instanceof
            Error
            ? error.message
            : "Erro ao abrir atividade."
        );
      } finally {
        setCarregando(
          false
        );
      }
    }

    if (
      token &&
      quizId
    ) {
      carregar();
    }
  }, [
    token,
    quizId,
    preview,
    router,
  ]);

  const perguntas =
    useMemo(
      () =>
        Array.isArray(
          quiz?.questions
        )
          ? quiz
              ?.questions ||
            []
          : [],
      [quiz]
    );

  function atualizar(
    id: string,
    valor: unknown
  ) {
    if (
      concluida
    ) {
      return;
    }

    setRespostas(
      (atual) => ({
        ...atual,
        [id]: valor,
      })
    );
  }

  function alternarMultipla(
    id: string,
    opcao: string
  ) {
    const atual =
      Array.isArray(
        respostas[id]
      )
        ? (respostas[
            id
          ] as string[])
        : [];

    const existe =
      atual.includes(
        opcao
      );

    atualizar(
      id,
      existe
        ? atual.filter(
            (item) =>
              item !==
              opcao
          )
        : [
            ...atual,
            opcao,
          ]
    );
  }

  async function salvar(
    action:
      | "save"
      | "submit",
    silencioso = false
  ): Promise<boolean> {
    if (preview) {
      if (!silencioso) {
        setMensagem(
          "Visualização do ADM: as respostas não são salvas."
        );
      }

      return false;
    }

    try {
      if (!silencioso) {
        setSalvando(true);
        setMensagem(null);
      }

      setErro(null);

      const response =
        await fetch(
          "/api/terapia/atividades",
          {
            method:
              "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body:
              JSON.stringify({
                token,
                quiz_id:
                  quizId,
                answers:
                  respostas,
                action,
              }),
          }
        );

      const texto =
        await response.text();

      let data: any = {};

      try {
        data = texto
          ? JSON.parse(texto)
          : {};
      } catch {
        throw new Error(
          "O servidor retornou uma resposta inválida ao salvar a atividade."
        );
      }

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Não foi possível salvar a atividade."
        );
      }

      ultimaVersaoSalvaRef.current =
        JSON.stringify(
          respostas
        );

      setQuiz(
        (atual) =>
          atual
            ? {
                ...atual,
                resposta:
                  data.resposta ||
                  atual.resposta,
              }
            : atual
      );

      if (!silencioso) {
        setMensagem(
          action === "submit"
            ? "Atividade concluída e enviada."
            : "Suas respostas foram salvas. Você pode continuar depois."
        );
      }

      return true;
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao salvar atividade."
      );

      return false;
    } finally {
      if (!silencioso) {
        setSalvando(false);
      }
    }
  }

  useEffect(() => {
    if (
      carregando ||
      preview ||
      concluida ||
      !token ||
      !quizId
    ) {
      return;
    }

    const versaoAtual =
      JSON.stringify(
        respostas
      );

    if (
      versaoAtual ===
      ultimaVersaoSalvaRef.current
    ) {
      return;
    }

    const timer =
      window.setTimeout(
        () => {
          void salvar(
            "save",
            true
          );
        },
        1200
      );

    return () => {
      window.clearTimeout(
        timer
      );
    };
  }, [
    respostas,
    carregando,
    preview,
    concluida,
    token,
    quizId,
  ]);

  if (
    carregando
  ) {
    return (
      <main className="min-h-screen bg-[#222F20] p-8 text-center text-[#D8DFD1]">
        Abrindo atividade...
      </main>
    );
  }

  if (
    erro ||
    !quiz
  ) {
    return (
      <main className="min-h-screen bg-[#222F20] p-6 text-[#F5F0E6]">
        <div className="mx-auto max-w-xl rounded-3xl border border-red-200 bg-[#1B271A] p-7 text-center text-red-200">
          {erro ||
            "Atividade não encontrada."}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#222F20] px-5 py-8 text-[#F5F0E6]">
      <div className="mx-auto max-w-3xl">
        {preview && (
          <div className="mb-5 rounded-2xl bg-[#5E7357] p-4 text-sm font-bold text-white">
            Visualização do ADM — teste à vontade; nenhuma resposta será salva.
          </div>
        )}

        <Link
          href={`/terapia/acesso/${token}/atividades`}
          className="text-sm font-bold text-[#D8DFD1]"
        >
          ← Minhas Atividades
        </Link>

        <section className="mt-7 rounded-3xl border border-[#D7C18C]/40 bg-[#1B271A] p-6 shadow-sm md:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#E3C993]">
            Atividade terapêutica
          </p>

          <h1 className="mt-3 text-3xl font-extrabold text-[#F5F0E6]">
            {quiz.title}
          </h1>

          {quiz.subtitle && (
            <p className="mt-3 text-sm leading-6 text-[#D8DFD1]">
              {quiz.subtitle}
            </p>
          )}

          {quiz.instructions && (
            <div className="mt-6 rounded-2xl bg-[#263825] p-5 text-sm leading-7 text-[#F5F0E6] whitespace-pre-line">
              {quiz.instructions}
            </div>
          )}

          {concluida && (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-[#263825] p-4 text-sm font-bold text-[#DDECCB]">
              ✓ Esta atividade já foi concluída.
            </div>
          )}
        </section>

        <div className="mt-6 space-y-5">
          {perguntas.map(
            (
              pergunta,
              index
            ) => {
              const valor =
                respostas[
                  pergunta.id
                ];

              return (
                <section
                  key={
                    pergunta.id
                  }
                  className="rounded-3xl border border-[#D7C18C]/40 bg-[#1B271A] p-6 shadow-sm"
                >
                  <p className="text-xs font-bold uppercase tracking-wide text-[#E3C993]">
                    Pergunta{" "}
                    {index + 1}
                  </p>

                  <h2 className="mt-2 text-lg font-extrabold text-[#F5F0E6]">
                    {
                      pergunta.prompt
                    }
                  </h2>

                  {pergunta.helper && (
                    <p className="mt-2 text-sm leading-6 text-[#D8DFD1]">
                      {
                        pergunta.helper
                      }
                    </p>
                  )}

                  {pergunta.type ===
                    "single_choice" && (
                    <div className="mt-5 grid gap-2">
                      {(pergunta.options ||
                        []).map(
                        (
                          opcao
                        ) => (
                          <label
                            key={
                              opcao
                            }
                            className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#D7C18C]/40 bg-[#263825] p-4"
                          >
                            <input
                              type="radio"
                              name={
                                pergunta.id
                              }
                              checked={
                                valor ===
                                opcao
                              }
                              disabled={
                                concluida
                              }
                              onChange={() =>
                                atualizar(
                                  pergunta.id,
                                  opcao
                                )
                              }
                              className="mt-1"
                            />

                            <span className="text-sm leading-6">
                              {
                                opcao
                              }
                            </span>
                          </label>
                        )
                      )}
                    </div>
                  )}

                  {pergunta.type ===
                    "multiple_choice" && (
                    <div className="mt-5 grid gap-2">
                      {(pergunta.options ||
                        []).map(
                        (
                          opcao
                        ) => (
                          <label
                            key={
                              opcao
                            }
                            className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#D7C18C]/40 bg-[#263825] p-4"
                          >
                            <input
                              type="checkbox"
                              checked={
                                Array.isArray(
                                  valor
                                ) &&
                                (
                                  valor as string[]
                                ).includes(
                                  opcao
                                )
                              }
                              disabled={
                                concluida
                              }
                              onChange={() =>
                                alternarMultipla(
                                  pergunta.id,
                                  opcao
                                )
                              }
                              className="mt-1"
                            />

                            <span className="text-sm leading-6">
                              {
                                opcao
                              }
                            </span>
                          </label>
                        )
                      )}
                    </div>
                  )}

                  {pergunta.type ===
                    "short_text" && (
                    <input
                      type="text"
                      value={
                        typeof valor ===
                        "string"
                          ? valor
                          : ""
                      }
                      disabled={
                        concluida
                      }
                      onChange={(
                        e
                      ) =>
                        atualizar(
                          pergunta.id,
                          e.target
                            .value
                        )
                      }
                      placeholder="Escreva no seu tempo..."
                      className="mt-5 w-full rounded-xl border border-[#D7C18C]/40 bg-[#1B271A] px-4 py-3 outline-none focus:border-[#8AA27A]"
                    />
                  )}

                  {pergunta.type ===
                    "long_text" && (
                    <textarea
                      value={
                        typeof valor ===
                        "string"
                          ? valor
                          : ""
                      }
                      disabled={
                        concluida
                      }
                      onChange={(
                        e
                      ) =>
                        atualizar(
                          pergunta.id,
                          e.target
                            .value
                        )
                      }
                      rows={5}
                      placeholder="Escreva apenas o que se sentir confortável para responder..."
                      className="mt-5 w-full rounded-xl border border-[#D7C18C]/40 bg-[#1B271A] px-4 py-3 outline-none focus:border-[#8AA27A]"
                    />
                  )}

                  {pergunta.type ===
                    "scale" && (
                    <div className="mt-5">
                      <div className="mb-2 flex justify-between gap-3 text-xs text-[#D8DFD1]">
                        <span>
                          {pergunta.min_label ||
                            pergunta.min ||
                            0}
                        </span>

                        <span>
                          {pergunta.max_label ||
                            pergunta.max ||
                            10}
                        </span>
                      </div>

                      <input
                        type="range"
                        min={
                          pergunta.min ??
                          0
                        }
                        max={
                          pergunta.max ??
                          10
                        }
                        value={
                          typeof valor ===
                          "number"
                            ? valor
                            : pergunta.min ??
                              0
                        }
                        disabled={
                          concluida
                        }
                        onChange={(
                          e
                        ) =>
                          atualizar(
                            pergunta.id,
                            Number(
                              e
                                .target
                                .value
                            )
                          )
                        }
                        className="w-full"
                      />

                      <p className="mt-2 text-center text-sm font-bold text-[#F5F0E6]">
                        {typeof valor ===
                        "number"
                          ? valor
                          : pergunta.min ??
                            0}
                      </p>
                    </div>
                  )}

                  {!concluida && (
                    <button
                      type="button"
                      onClick={() =>
                        setRespostas(
                          (
                            atual
                          ) => {
                            const novo = {
                              ...atual,
                            };

                            delete novo[
                              pergunta
                                .id
                            ];

                            return novo;
                          }
                        )
                      }
                      className="mt-4 text-xs font-bold text-[#D8DFD1]"
                    >
                      Pular esta pergunta
                    </button>
                  )}
                </section>
              );
            }
          )}
        </div>

        {mensagem && (
          <div className="mt-6 rounded-2xl border border-[#C7D4C0] bg-[#31452F] p-4 text-sm font-semibold text-[#F5F0E6]">
            {mensagem}
          </div>
        )}

        {!concluida && (
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              disabled={
                salvando
              }
              onClick={() =>
                salvar(
                  "save"
                )
              }
              className="rounded-xl border border-[#8AA27A] bg-[#1B271A] px-5 py-4 text-sm font-bold text-[#F5F0E6] disabled:opacity-50"
            >
              {salvando
                ? "Salvando..."
                : "Salvar e continuar depois"}
            </button>

            <button
              type="button"
              disabled={
                salvando
              }
              onClick={() =>
                salvar(
                  "submit"
                )
              }
              className="rounded-xl bg-[#5E7357] px-5 py-4 text-sm font-bold text-white disabled:opacity-50"
            >
              {salvando
                ? "Enviando..."
                : "Finalizar atividade"}
            </button>

            <button
              type="button"
              disabled={
                salvando
              }
              onClick={async () => {
                if (preview) {
                  router.push(
                    `/terapia/acesso/${token}/atividades`
                  );
                  return;
                }

                const salvou =
                  await salvar(
                    "save"
                  );

                if (salvou) {
                  router.push(
                    `/terapia/acesso/${token}/atividades`
                  );
                }
              }}
              className="sm:col-span-2 rounded-xl bg-[#31402D] px-5 py-3 text-sm font-bold text-[#F5F0E6]"
            >
              Parar por aqui e voltar
            </button>
          </div>
        )}
      </div>
    </main>
  );
}