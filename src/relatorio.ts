import { CATEGORIAS } from "./tipos";
import type { Categoria, Despesa } from "./tipos";
import { maiorDespesa, totalGasto } from "./despesas";

/**
 * Converte o valor interno da categoria no nome exibido no relatório.
 */
export function descricaoCategoria(categoria: Categoria): string {
  // Como Categoria é um union type e todos os casos estão tratados,
  // o TypeScript sabe que a função sempre retorna um texto.
  switch (categoria) {
    case "alimentacao":
      return "Alimentação";
    case "transporte":
      return "Transporte";
    case "lazer":
      return "Lazer";
    case "moradia":
      return "Moradia";
  }
}

/**
 * Monta uma matriz 4x12: linhas = categorias (ordem de CATEGORIAS),
 * colunas = meses (janeiro a dezembro). Cada célula guarda a soma dos valores.
 */
export function matrizCategoriaMes(despesas: Despesa[]): number[][] {
  const matriz: number[][] = [];

  // 1) Cria 4 linhas com 12 zeros cada.
  for (let linha = 0; linha < CATEGORIAS.length; linha++) {
    const linhaNova: number[] = [];
    for (let coluna = 0; coluna < 12; coluna++) {
      linhaNova.push(0);
    }
    matriz.push(linhaNova);
  }

  // 2) Percorre as despesas e soma cada valor na célula certa.
  for (let i = 0; i < despesas.length; i++) {
    const despesa = despesas[i];

    // Descobre a linha: posição da categoria da despesa em CATEGORIAS.
    let linha = 0;
    while (CATEGORIAS[linha] !== despesa.categoria) {
      linha++;
    }

    // Descobre a coluna: o mês 1 vai para o índice 0, o mês 12 para o índice 11.
    const coluna = despesa.mes - 1;

    matriz[linha][coluna] += despesa.valor;
  }

  return matriz;
}

const NOMES_MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const LARGURA_ROTULO = 13;
const LARGURA_MES = 9;
const LARGURA_TOTAL = 12;

// Formata em reais, por exemplo "R$ 1.430,50".
function formatarMoeda(valor: number): string {
  const formatador = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
  // O Intl usa um espaço "especial" depois do R$; trocamos por espaço comum.
  return formatador.format(valor).replace(/\u00A0/g, " ");
}

// Formata só o número, por exemplo "1.430,50" (usado dentro da tabela).
function formatarNumero(valor: number): string {
  return new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(valor);
}

// Monta uma linha da tabela com colunas de largura fixa (alinhadas).
function montarLinha(rotulo: string, celulasMeses: string[], total: string): string {
  let linha = rotulo.padEnd(LARGURA_ROTULO);
  for (const celula of celulasMeses) {
    linha += celula.padStart(LARGURA_MES);
  }
  return linha + total.padStart(LARGURA_TOTAL);
}

/**
 * Monta o relatório completo (texto) para exibir no terminal.
 */
export function formatarRelatorio(despesas: Despesa[]): string {
  const titulo = "relatório de controle de gastos".toUpperCase();

  if (despesas.length === 0) {
    return [titulo, "", "Nenhuma despesa cadastrada.", "Total geral: " + formatarMoeda(0)].join("\n");
  }

  const matriz = matrizCategoriaMes(despesas);
  const cabecalho = montarLinha("Categoria", NOMES_MESES, "Total anual");
  const separador = "-".repeat(cabecalho.length);

  const linhas: string[] = [titulo, "=".repeat(cabecalho.length), cabecalho, separador];

  for (let i = 0; i < CATEGORIAS.length; i++) {
    const valoresMeses = matriz[i];
    const celulas: string[] = [];
    let totalCategoria = 0;

    for (const valor of valoresMeses) {
      // Mostra "-" nos meses sem gasto para facilitar a leitura.
      celulas.push(valor === 0 ? "-" : formatarNumero(valor));
      totalCategoria += valor;
    }

    linhas.push(montarLinha(descricaoCategoria(CATEGORIAS[i]), celulas, formatarNumero(totalCategoria)));
  }

  linhas.push(separador);
  linhas.push("Total geral: " + formatarMoeda(totalGasto(despesas)));

  const maior = maiorDespesa(despesas);
  if (maior !== undefined) {
    linhas.push(`Maior despesa: ${maior.descricao} (${formatarMoeda(maior.valor)})`);
  }

  return linhas.join("\n");
}
