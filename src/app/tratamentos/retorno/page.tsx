import Link from "next/link";
export default async function RetornoTratamentos({
  searchParams,
}: { searchParams: Promise<{ resultado?: string }> }) {
  const { resultado } = await searchParams;
  const aprovado = resultado === "sucesso";
  return <main className="flex min-h-screen items-center justify-center bg-[#F7F3EA] px-5 text-[#273926]">
    <div className="w-full max-w-lg rounded-[30px] border border-[#DDD4C5] bg-white p-9 text-center shadow-lg">
      <p className="font-serif text-3xl">Terapia em Dia</p>
      <h1 className="mt-5 text-2xl font-semibold">{aprovado ? "Pagamento recebido para verificação" : resultado === "pendente" ? "Pagamento em processamento" : "Pagamento não concluído"}</h1>
      <p className="mt-4 leading-7 text-[#586853]">{aprovado ? "A confirmação é feita diretamente pelo Mercado Pago. Assim que for aprovada e processada, enviaremos as instruções de acesso para o e-mail informado na contratação." : resultado === "pendente" ? "Assim que o Mercado Pago confirmar a operação, você receberá as orientações no seu e-mail." : "Você pode tentar novamente ou escolher outra forma de pagamento."}</p>
      <Link href="/tratamentos" className="mt-7 inline-block rounded-full bg-[#526B49] px-6 py-3 text-white">Voltar aos tratamentos</Link>
    </div>
  </main>;
}
