import ChoiceCard from "../ui/ChoiceCard";

type Props = {
  dados: any;
  setDados: (dados: any) => void;
};

const campo =
  "w-full rounded-2xl border border-[#D7C18C]/40 bg-[#263825] p-4 text-[#F5F0E6] outline-none placeholder:text-[#D8DFD1] focus:border-[#8AA27A]";

export default function Passo7({
  dados,
  setDados,
}: Props) {
  return (
    <div className="space-y-7">
      <div>
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#E3C993]">
          Etapa 7
        </span>

        <h2 className="mt-2 text-3xl font-extrabold text-[#F5F0E6]">
          Apoio e recursos pessoais
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#D8DFD1]">
          Reconhecer recursos que já existem em sua
          vida também faz parte do processo.
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-[#F5F0E6]">
          Com quem você sente que pode contar quando precisa de apoio?
        </label>

        <textarea
          rows={3}
          value={
            dados.redeApoio || ""
          }
          onChange={(event) =>
            setDados({
              ...dados,
              redeApoio:
                event.target.value,
            })
          }
          placeholder="Família, amigos, companheiro(a), profissionais, comunidade..."
          className={`${campo} resize-none`}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-[#F5F0E6]">
          O que costuma ajudar você a se sentir melhor em momentos difíceis?
        </label>

        <textarea
          rows={4}
          value={
            dados.recursosPessoais ||
            ""
          }
          onChange={(event) =>
            setDados({
              ...dados,
              recursosPessoais:
                event.target.value,
            })
          }
          placeholder="Ex.: conversar, caminhar, escrever, oração, música, silêncio, atividade física..."
          className={`${campo} resize-none`}
        />
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-[#F5F0E6]">
          Você possui alguma prática espiritual ou de autocuidado que considere importante para sua vida?
        </p>

        <ChoiceCard
          value={
            dados.praticaPessoal || ""
          }
          onChange={(value) =>
            setDados({
              ...dados,
              praticaPessoal: value,
            })
          }
          options={[
            "Não",
            "Sim",
            "Prefiro não informar",
          ]}
        />

        {dados.praticaPessoal ===
          "Sim" && (
          <textarea
            rows={3}
            value={
              dados.praticaDescricao ||
              ""
            }
            onChange={(event) =>
              setDados({
                ...dados,
                praticaDescricao:
                  event.target.value,
              })
            }
            placeholder="Se desejar, conte um pouco."
            className={`${campo} mt-3 resize-none`}
          />
        )}
      </div>
    </div>
  );
}
