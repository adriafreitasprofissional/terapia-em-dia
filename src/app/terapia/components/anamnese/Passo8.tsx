import ChoiceCard from "../ui/ChoiceCard";

type Props = {
  dados: any;
  setDados: (dados: any) => void;
};

const campo =
  "w-full rounded-2xl border border-[#D7C18C]/40 bg-[#263825] p-4 text-[#F5F0E6] outline-none placeholder:text-[#D8DFD1] focus:border-[#8AA27A]";

export default function Passo8({
  dados,
  setDados,
}: Props) {
  return (
    <div className="space-y-7">
      <div>
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#E3C993]">
          Última etapa
        </span>

        <h2 className="mt-2 text-3xl font-extrabold text-[#F5F0E6]">
          Para finalizar
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#D8DFD1]">
          Antes de enviar, deixe qualquer informação
          que considere importante para o seu
          acompanhamento.
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-[#F5F0E6]">
          Existe algo importante que não foi perguntado e que você gostaria que Ádria soubesse antes da primeira sessão?
        </label>

        <textarea
          rows={5}
          value={
            dados.observacoes || ""
          }
          onChange={(event) =>
            setDados({
              ...dados,
              observacoes:
                event.target.value,
            })
          }
          placeholder="Escreva aqui, se desejar."
          className={`${campo} resize-none`}
        />
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-[#F5F0E6]">
          Confirma que as informações fornecidas correspondem ao que você deseja compartilhar neste momento?
        </p>

        <ChoiceCard
          value={
            dados.consentimento
              ? "Confirmo"
              : ""
          }
          onChange={(value) =>
            setDados({
              ...dados,
              consentimento:
                value ===
                "Confirmo",
            })
          }
          options={["Confirmo"]}
        />
      </div>

      <div className="rounded-2xl border border-[#D7C18C]/40 bg-[#263825] p-5">
        <p className="text-xs leading-6 text-[#D8DFD1]">
          As informações deste formulário serão
          utilizadas para organizar e personalizar
          seu acompanhamento. O conteúdo é tratado
          como informação privada do atendimento.
          Em situações de urgência ou risco imediato,
          procure um serviço de emergência ou
          profissional de saúde habilitado.
        </p>
      </div>
    </div>
  );
}
