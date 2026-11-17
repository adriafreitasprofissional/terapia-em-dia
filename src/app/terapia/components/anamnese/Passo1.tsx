type Props = {
  dados: any;
  setDados: (dados: any) => void;
  nomeCliente: string;
  emailCliente: string;
};

const campo =
  "w-full rounded-2xl border border-[#D7C18C]/40 bg-[#263825] p-4 text-[#F5F0E6] outline-none placeholder:text-[#D8DFD1] focus:border-[#8AA27A]";

export default function Passo1({
  dados,
  setDados,
  nomeCliente,
  emailCliente,
}: Props) {
  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#E3C993]">
          Etapa 1
        </span>

        <h2 className="mt-2 text-3xl font-extrabold text-[#F5F0E6]">
          Sobre você
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#D8DFD1]">
          Vamos começar com algumas informações
          básicas para organizar seu acompanhamento.
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-[#F5F0E6]">
          Nome
        </label>

        <input
          value={nomeCliente}
          readOnly
          className={`${campo} cursor-not-allowed bg-[#31402D]`}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-[#F5F0E6]">
          Data de nascimento
        </label>

        <input
          type="date"
          value={
            dados.dataNascimento || ""
          }
          onChange={(event) =>
            setDados({
              ...dados,
              dataNascimento:
                event.target.value,
            })
          }
          className={campo}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-[#F5F0E6]">
          Telefone / WhatsApp
        </label>

        <input
          value={dados.telefone || ""}
          onChange={(event) =>
            setDados({
              ...dados,
              telefone:
                event.target.value,
            })
          }
          placeholder="Seu telefone"
          className={campo}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-[#F5F0E6]">
          E-mail
        </label>

        <input
          type="email"
          value={
            dados.email ||
            emailCliente ||
            ""
          }
          onChange={(event) =>
            setDados({
              ...dados,
              email:
                event.target.value,
            })
          }
          placeholder="Seu e-mail"
          className={campo}
        />
      </div>
    </div>
  );
}
