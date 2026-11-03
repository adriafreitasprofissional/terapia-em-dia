export type TratamentoId = "teste" | "social" | "profundo" | "avancado";
export type MetodoTratamento = "cartao" | "pix";

export const TRATAMENTOS = {
  teste: { id: "teste", titulo: "Fase Teste", duracao: "7 dias", dias: 7, sessoes: 1, semanas: 1, totalCentavos: 2700, descricao: "Uma consulta para conhecer o acompanhamento e o portal." },
  social: { id: "social", titulo: "Social", duracao: "1 mês", dias: 30, sessoes: 4, semanas: 4, totalCentavos: 39600, descricao: "Uma consulta por semana para iniciar o acompanhamento." },
  profundo: { id: "profundo", titulo: "Tratamento Profundo", duracao: "3 meses", dias: 90, sessoes: 24, semanas: 12, totalCentavos: 228000, descricao: "Duas consultas por semana ao longo de três meses." },
  avancado: { id: "avancado", titulo: "Tratamento Avançado", duracao: "6 meses", dias: 180, sessoes: 48, semanas: 24, totalCentavos: 408000, descricao: "Duas consultas por semana ao longo de seis meses." },
} as const;

export function tratamentoValido(id: unknown): id is TratamentoId {
  return typeof id === "string" && Object.prototype.hasOwnProperty.call(TRATAMENTOS, id);
}

export function valorTratamento(id: TratamentoId, metodo: MetodoTratamento): number {
  const total = TRATAMENTOS[id].totalCentavos;
  return metodo === "pix" ? Math.round(total * 0.95) : total;
}

export function reais(centavos: number): string {
  return (centavos / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
