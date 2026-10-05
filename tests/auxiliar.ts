import type { Despesa } from "../src/tipos";

// Cria uma despesa válida para os testes. Só é preciso informar o que muda.
export function criarDespesa(parcial: Partial<Despesa> = {}): Despesa {
  return {
    id: "d1",
    descricao: "Despesa de teste",
    valor: 10,
    categoria: "alimentacao",
    mes: 1,
    ...parcial,
  };
}