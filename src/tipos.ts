// Tipos usados em todo o projeto.

// Union type: uma categoria só pode ser UM destes quatro textos.
// Assim o TypeScript acusa erro se alguém digitar, por exemplo, "mercado".
export type Categoria = "alimentacao" | "transporte" | "lazer" | "moradia";

// Lista das categorias na ordem oficial. A ordem é usada nas linhas da matriz
// e do relatório (linha 0 = alimentacao, linha 1 = transporte, ...).
export const CATEGORIAS: Categoria[] = ["alimentacao", "transporte", "lazer", "moradia"];

// Uma despesa do controle de gastos.
export type Despesa = {
  // readonly: o id identifica a despesa para sempre. Se pudesse mudar,
  // removerDespesa poderia apagar a despesa errada.
  readonly id: string;
  // Texto curto que explica o gasto (ex.: "Mercado").
  descricao: string;
  // Valor em reais (ex.: 129.9).
  valor: number;
  // Uma das quatro categorias acima.
  categoria: Categoria;
  // Mês em que o gasto ocorreu, de 1 (janeiro) a 12 (dezembro).
  mes: number;
  // Opcional (?): nem toda despesa precisa de uma anotação extra.
  observacao?: string;
};
