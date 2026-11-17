import ChoiceCard from "../ui/ChoiceCard";

type Props = {
  dados: any;
  setDados: (dados: any) => void;
};

const campo =
  "w-full rounded-2xl border border-[#D7C18C]/40 bg-[#263825] p-4 text-[#F5F0E6] outline-none placeholder:text-[#D8DFD1] focus:border-[#8AA27A]";

export default function Passo4({
  dados,
  setDados,
}: Props) {
  return (
    <div className="space-y-7">
      <div>
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#E3C993]">
          Etapa 4
        </span>

        <h2 className="mt-2 text-3xl font-extrabold text-[#F5F0E6]">
          História emocional e familiar
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#D8DFD1]">
          Compartilhe apenas o que se sentir
          confortável para registrar agora.
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-[#F5F0E6]">
          Como você descreveria sua relação com sua família hoje?
        </label>

        <textarea
          rows={4}
          value={
            dados.relacaoFamilia || ""
          }
          onChange={(event) =>
            setDados({
              ...dados,
              relacaoFamilia:
                event.target.value,
            })
          }
          placeholder="Conte sobre proximidade, conflitos, responsabilidades, cobranças ou vínculos importantes."
          className={`${campo} resize-none`}
        />
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-[#F5F0E6]">
          Você percebe padrões emocionais ou relacionais que se repetem em sua vida?
        </p>

        <ChoiceCard
          value={
            dados.padroesRepetidos || ""
          }
          onChange={(value) =>
            setDados({
              ...dados,
              padroesRepetidos: value,
            })
          }
          options={[
            "Não percebo",
            "Talvez",
            "Sim",
          ]}
        />

        {dados.padroesRepetidos ===
          "Sim" && (
          <textarea
            rows={3}
            value={
              dados.padroesDescricao || ""
            }
            onChange={(event) =>
              setDados({
                ...dados,
                padroesDescricao:
                  event.target.value,
              })
            }
            placeholder="Quais padrões você percebe?"
            className={`${campo} mt-3 resize-none`}
          />
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-[#F5F0E6]">
          Há acontecimentos do passado que você sente que ainda influenciam sua vida atual?
        </label>

        <textarea
          rows={4}
          value={
            dados.passadoInfluencia || ""
          }
          onChange={(event) =>
            setDados({
              ...dados,
              passadoInfluencia:
                event.target.value,
            })
          }
          placeholder="Você pode responder de forma breve. Os detalhes poderão ser trabalhados durante as sessões."
          className={`${campo} resize-none`}
        />
      </div>
    </div>
  );
}
