import SliderInput from "../ui/SliderInput";
import ChoiceCard from "../ui/ChoiceCard";

type Props = {
  dados: any;
  setDados: (dados: any) => void;
};

export default function Passo3({
  dados,
  setDados,
}: Props) {
  return (
    <div className="space-y-7">
      <div>
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#E3C993]">
          Etapa 3
        </span>

        <h2 className="mt-2 text-3xl font-extrabold text-[#F5F0E6]">
          Como você está hoje
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#D8DFD1]">
          Não existe resposta certa. Use as escalas
          apenas para representar como você se percebe
          neste momento.
        </p>
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-[#F5F0E6]">
          Nível de ansiedade ou preocupação
        </p>

        <SliderInput
          value={Number(
            dados.ansiedade ?? 5
          )}
          leftLabel="Muito baixo"
          rightLabel="Muito alto"
          onChange={(value) =>
            setDados({
              ...dados,
              ansiedade: value,
            })
          }
        />
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-[#F5F0E6]">
          Nível de estresse
        </p>

        <SliderInput
          value={Number(
            dados.estresse ?? 5
          )}
          leftLabel="Muito baixo"
          rightLabel="Muito alto"
          onChange={(value) =>
            setDados({
              ...dados,
              estresse: value,
            })
          }
        />
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-[#F5F0E6]">
          Sensação de sobrecarga emocional
        </p>

        <SliderInput
          value={Number(
            dados.sobrecarga ?? 5
          )}
          leftLabel="Leve"
          rightLabel="Muito intensa"
          onChange={(value) =>
            setDados({
              ...dados,
              sobrecarga: value,
            })
          }
        />
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-[#F5F0E6]">
          Qualidade do sono
        </p>

        <SliderInput
          value={Number(
            dados.qualidadeSono ?? 5
          )}
          leftLabel="Muito ruim"
          rightLabel="Excelente"
          onChange={(value) =>
            setDados({
              ...dados,
              qualidadeSono:
                value,
            })
          }
        />
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-[#F5F0E6]">
          Com que frequência preocupações ocupam grande parte do seu dia?
        </p>

        <ChoiceCard
          value={
            dados.frequenciaPreocupacao ||
            ""
          }
          onChange={(value) =>
            setDados({
              ...dados,
              frequenciaPreocupacao:
                value,
            })
          }
          options={[
            "Raramente",
            "Alguns dias",
            "Muitas vezes",
            "Quase todos os dias",
          ]}
        />
      </div>
    </div>
  );
}
