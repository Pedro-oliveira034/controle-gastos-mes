import { CATEGORIAS } from "./tipos";
import type { Despesa } from "./tipos";
import { adicionarDespesa, despesasDaCategoria, maiorDespesa, removerDespesa, totalGasto } from "./despesas";
import { descricaoCategoria, formatarRelatorio } from "./relatorio";

// Dados de exemplo: 9 despesas, as 4 categorias e 4 meses diferentes.
const despesas: Despesa[] = [
  { id: "1", descricao: "Compras no mercado", valor: 450.75, categoria: "alimentacao", mes: 1 },
  { id: "2", descricao: "Aluguel", valor: 1200, categoria: "moradia", mes: 1, observacao: "Vence todo dia 5" },
  { id: "3", descricao: "Passe do ônibus", valor: 180, categoria: "transporte", mes: 2 },
  { id: "4", descricao: "Cinema", valor: 64.9, categoria: "lazer", mes: 2 },
  { id: "5", descricao: "Aluguel", valor: 1200, categoria: "moradia", mes: 2 },
  { id: "6", descricao: "Restaurante", valor: 89.5, categoria: "alimentacao", mes: 3 },
  { id: "7", descricao: "Combustível", valor: 220, categoria: "transporte", mes: 3 },
  { id: "8", descricao: "Show", valor: 150, categoria: "lazer", mes: 6 },
  { id: "9", descricao: "Compras no mercado", valor: 380.2, categoria: "alimentacao", mes: 6 },
];

// Demonstração das funções de despesas.
const comNova = adicionarDespesa(despesas, {
  id: "10",
  descricao: "Streaming",
  valor: 39.9,
  categoria: "lazer",
  mes: 6,
  observacao: "Plano mensal",
});
const semUma = removerDespesa(comNova, "4");

console.log("Despesas originais:", despesas.length);
console.log("Depois de adicionar:", comNova.length);
console.log("Depois de remover o id 4:", semUma.length);
console.log("Despesas de Lazer:", despesasDaCategoria(semUma, "lazer").length);
console.log("Total gasto: R$", totalGasto(semUma).toFixed(2));
console.log("Maior despesa:", maiorDespesa(semUma)?.descricao);
console.log("Categorias:", CATEGORIAS.map(descricaoCategoria).join(", "));
console.log("");

// Relatório completo (usa a lista com todas as alterações acima).
console.log(formatarRelatorio(semUma));
