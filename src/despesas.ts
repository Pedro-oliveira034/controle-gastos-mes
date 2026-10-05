import type { Categoria, Despesa } from "./tipos";

/**
 * Devolve um novo array com as despesas anteriores mais a nova.
 * Lança erro se o valor for <= 0 ou se o mês não estiver entre 1 e 12.
 */
export function adicionarDespesa(despesas: Despesa[], nova: Despesa): Despesa[] {
  if (nova.valor <= 0) {
    throw new Error("O valor da despesa deve ser maior que zero.");
  }
  if (nova.mes < 1 || nova.mes > 12) {
    throw new Error("O mês deve estar entre 1 e 12.");
  }

  // Retorna um novo array para não alterar a lista original de quem chamou a função.
  return [...despesas, nova];
}

/**
 * Devolve um novo array sem a despesa com o id informado.
 * Se o id não existir, devolve uma cópia com os mesmos elementos.
 */
export function removerDespesa(despesas: Despesa[], id: string): Despesa[] {
  // filter sempre cria um array novo, então a lista original nunca é alterada.
  return despesas.filter((despesa) => despesa.id !== id);
}

/**
 * Devolve apenas as despesas da categoria informada (array vazio se não houver).
 */
export function despesasDaCategoria(despesas: Despesa[], categoria: Categoria): Despesa[] {
  return despesas.filter((despesa) => despesa.categoria === categoria);
}

/**
 * Soma o valor de todas as despesas. Devolve 0 para lista vazia.
 */
export function totalGasto(despesas: Despesa[]): number {
  let total = 0;
  for (const despesa of despesas) {
    total += despesa.valor;
  }
  return total;
}

/**
 * Devolve a despesa de maior valor, ou undefined se a lista estiver vazia.
 * Em caso de empate, devolve a primeira ocorrência.
 */
export function maiorDespesa(despesas: Despesa[]): Despesa | undefined {
  let maior: Despesa | undefined = undefined;
  for (const despesa of despesas) {
    // Usamos ">" (e não ">=") para que, num empate, a primeira ocorrência seja mantida.
    if (maior === undefined || despesa.valor > maior.valor) {
      maior = despesa;
    }
  }
  return maior;
}
