"use client";

import {
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import {
  useParams,
  useRouter,
} from "next/navigation";
import { therapyAccessToken } from "@/lib/therapy-session";
import { therapyLoginPath } from "@/lib/therapy-navigation";

type Quiz = {
  id: string;
  title: string;
  subtitle: string | null;
  instructions: string | null;
  questions: any[];
  quiz_type: string;
  published_at: string | null;
  resposta: {
    status: string;
    submitted_at: string | null;
  } | null;
};

export default function AtividadesPage() {
  const params =
    useParams();
  const router = useRouter();

  const token =
    String(
      params?.token || ""
    );

  const preview =
    token.startsWith(
      "preview-"
    );

  const [
    quizzes,
    setQuizzes,
  ] = useState<Quiz[]>([]);

  const [
    carregando,
    setCarregando,
  ] = useState(true);

  const [
    erro,
    setErro,
  ] = useState<
    string | null
  >(null);

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
            router.replace(therapyLoginPath(`/terapia/acesso/${token}/atividades`));
            return;
          }
          headers.Authorization = `Bearer ${accessToken}`;
        }

        const response =
          await fetch(
            `/api/terapia/atividades?token=${encodeURIComponent(
              token
            )}`,
            {
              cache:
                "no-store",
              headers,
            }
          );

        if (preview && response.status === 401) {
          router.replace(therapyLoginPath(`/terapia/acesso/${token}/atividades`));
          return;
        }

        const data =
          await response.json();

        if (
          !response.ok
        ) {
          throw new Error(
            data?.error ||
              "Não foi possível carregar suas atividades."
          );
        }

        setQuizzes(
          Array.isArray(
            data?.quizzes
          )
            ? data.quizzes
            : []
        );
      } catch (
        error
      ) {
        setErro(
          error instanceof
            Error
            ? error.message
            : "Erro ao carregar atividades."
        );
      } finally {
        setCarregando(
          false
        );
      }
    }

    if (token) {
      carregar();
    }
  }, [
    token,
    preview,
    router,
  ]);

  return (
    <main className="min-h-screen bg-[#222F20] px-5 py-8 text-[#F5F0E6]">
      <div className="mx-auto max-w-3xl">
        {preview && (
          <div className="mb-5 rounded-2xl bg-[#5E7357] p-4 text-sm font-bold text-white">
            Visualização do ADM — nenhuma resposta será salva.
          </div>
        )}

        <Link
          href={`/terapia/acesso/${token}`}
          className="text-sm font-bold text-[#D8DFD1]"
        >
          ← Voltar ao meu portal
        </Link>

        <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-[#E3C993]">
          Terapia em Dia
        </p>

        <h1 className="mt-2 text-3xl font-extrabold text-[#F5F0E6]">
          Minhas Atividades
        </h1>

        <p className="mt-3 text-sm leading-6 text-[#D8DFD1]">
          Aqui ficam as atividades preparadas para acompanhar seu processo entre as sessões.
        </p>

        {carregando && (
          <div className="mt-7 rounded-2xl border border-[#D7C18C]/40 bg-[#1B271A] p-5 text-sm text-[#D8DFD1]">
            Carregando atividades...
          </div>
        )}

        {erro && (
          <div className="mt-7 rounded-2xl border border-red-200 bg-[#3A2424] p-5 text-sm text-red-200">
            {erro}
          </div>
        )}

        {!carregando &&
          !erro &&
          quizzes.length ===
            0 && (
            <div className="mt-7 rounded-3xl border border-[#D7C18C]/40 bg-[#1B271A] p-7 text-center shadow-sm">
              <p className="font-bold">
                Nenhuma atividade disponível agora.
              </p>

              <p className="mt-2 text-sm leading-6 text-[#D8DFD1]">
                Quando uma nova atividade for liberada, ela aparecerá aqui.
              </p>
            </div>
          )}

        <div className="mt-7 grid gap-4">
          {quizzes.map(
            (quiz) => {
              const concluida =
                quiz.resposta
                  ?.status ===
                "submitted";

              const emAndamento =
                quiz.resposta
                  ?.status ===
                "in_progress";

              return (
                <Link
                  key={
                    quiz.id
                  }
                  href={`/terapia/acesso/${token}/atividades/${quiz.id}`}
                  className="block rounded-3xl border border-[#D7C18C]/40 bg-[#1B271A] p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#8AA27A]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-extrabold text-[#F5F0E6]">
                        {
                          quiz.title
                        }
                      </h2>

                      {quiz.subtitle && (
                        <p className="mt-2 text-sm leading-6 text-[#D8DFD1]">
                          {
                            quiz.subtitle
                          }
                        </p>
                      )}
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-black ${
                        concluida
                          ? "bg-[#31452F] text-[#DDECCB]"
                          : emAndamento
                            ? "bg-[#31402D] text-[#F5F0E6]"
                            : "bg-[#31452F] text-[#F5F0E6]"
                      }`}
                    >
                      {concluida
                        ? "CONCLUÍDA"
                        : emAndamento
                          ? "EM ANDAMENTO"
                          : "NOVA"}
                    </span>
                  </div>

                  <p className="mt-5 text-sm font-bold text-[#E3C993]">
                    {concluida
                      ? "Ver atividade →"
                      : emAndamento
                        ? "Continuar →"
                        : "Começar →"}
                  </p>
                </Link>
              );
            }
          )}
        </div>
      </div>
    </main>
  );
}