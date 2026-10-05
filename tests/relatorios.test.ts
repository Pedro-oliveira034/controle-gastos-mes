import { describe, expect, it } from "vitest";
import { descricaoCategoria, matrizCategoriaMes, formatarRelatorio } from "../src/relatorio";
import { CATEGORIAS } from "../src/tipos";
import type { Categoria, Despesa } from "../src/tipos";
import { criarDespesa } from "./auxiliar";

describe("descricaoCategoria", () => {
  const casos: [Categoria, string][] = [
    ["alimentacao", "Alimentação"],
    ["transporte", "Transporte"],
    ["lazer", "Lazer"],
    ["moradia", "Moradia"],
  ];

  for (const [categoria, esperado] of casos) {
    it(`converte "${categoria}" em "${esperado}"`, () => {
      expect(descricaoCategoria(categoria)).toBe(esperado);
    });
  }

  it("trata todas as categorias de CATEGORIAS com um nome diferente do valor interno", () => {
    for (const categoria of CATEGORIAS) {
      const nome = descricaoCategoria(categoria);
      expect(nome).not.toBe(categoria);
      expect(nome.charAt(0)).toBe(nome.charAt(0).toUpperCase());
    }
  });
});

describe("matrizCategoriaMes", () => {
  it("devolve 4 linhas e 12 colunas preenchidas com zero quando não há despesas", () => {
    const matriz = matrizCategoriaMes([]);

    expect(matriz).toHaveLength(4);
    for (const linha of matriz) {
      expect(linha).toHaveLength(12);
      for (const celula of linha) {
        expect(celula).toBe(0);
      }
    }
  });

  it("mantém o formato 4x12 também quando há despesas", () => {
    const matriz = matrizCategoriaMes([
      criarDespesa({ categoria: "lazer", mes: 7, valor: 40 }),
      criarDespesa({ categoria: "moradia", mes: 12, valor: 900 }),
    ]);

    expect(matriz).toHaveLength(4);
    for (const linha of matriz) {
      expect(linha).toHaveLength(12);
    }
  });

  it("soma os valores da mesma categoria no mesmo mês", () => {
    const matriz = matrizCategoriaMes([
      criarDespesa({ id: "1", categoria: "alimentacao", mes: 1, valor: 10 }),
      criarDespesa({ id: "2", categoria: "alimentacao", mes: 1, valor: 15.5 }),
      criarDespesa({ id: "3", categoria: "alimentacao", mes: 2, valor: 4 }),
    ]);

    expect(matriz[0][0]).toBeCloseTo(25.5);
    expect(matriz[0][1]).toBeCloseTo(4);
    expect(matriz[0][2]).toBe(0);
  });

  it("coloca cada categoria na sua linha (ordem de CATEGORIAS) e o mês na coluna mes - 1", () => {
    const matriz = matrizCategoriaMes([criarDespesa({ categoria: "lazer", mes: 12, valor: 7 })]);
    const linhaLazer = CATEGORIAS.indexOf("lazer");

    expect(matriz[linhaLazer][11]).toBe(7);
    expect(matriz[0][11]).toBe(0);
  });

  it("deixa em zero as categorias sem despesas", () => {
    const matriz = matrizCategoriaMes([criarDespesa({ categoria: "transporte", mes: 3, valor: 50 })]);

    for (const celula of matriz[0]) {
      expect(celula).toBe(0);
    }
  });

  it("não modifica o array de entrada", () => {
    const original = [criarDespesa({ id: "1" }), criarDespesa({ id: "2", mes: 5 })];
    const copiaAntes = [...original];

    matrizCategoriaMes(original);

    expect(original).toEqual(copiaAntes);
  });
});

describe("formatarRelatorio", () => {
  const despesasExemplo: Despesa[] = [
    criarDespesa({ id: "1", descricao: "Mercado", valor: 100, categoria: "alimentacao", mes: 1 }),
    criarDespesa({ id: "2", descricao: "Restaurante", valor: 50.5, categoria: "alimentacao", mes: 3 }),
    criarDespesa({ id: "3", descricao: "Ônibus", valor: 80, categoria: "transporte", mes: 2 }),
    criarDespesa({ id: "4", descricao: "Cinema", valor: 200, categoria: "lazer", mes: 12 }),
    criarDespesa({ id: "5", descricao: "Aluguel", valor: 1000, categoria: "moradia", mes: 1 }),
  ];

  function obterLinha(texto: string, inicio: string): string {
    return texto.split("\n").find((linha) => linha.startsWith(inicio)) ?? "";
  }

  it("informa que não há despesas e mostra total geral zero quando a lista está vazia", () => {
    const texto = formatarRelatorio([]);

    expect(texto).toContain("Nenhuma despesa cadastrada");
    expect(texto).toContain("Total geral: R$ 0,00");
  });

  it("começa com um título em letras maiúsculas", () => {
    const titulo = formatarRelatorio(despesasExemplo).split("\n")[0];

    expect(titulo).toContain("RELATÓRIO");
    expect(titulo).toBe(titulo.toUpperCase());
  });

  it("mostra uma linha para cada uma das quatro categorias", () => {
    const texto = formatarRelatorio(despesasExemplo);

    for (const categoria of CATEGORIAS) {
      expect(texto).toContain(descricaoCategoria(categoria));
    }
  });

  it("mostra o cabeçalho de janeiro a dezembro", () => {
    const cabecalho = obterLinha(formatarRelatorio(despesasExemplo), "Categoria");

    expect(cabecalho).toContain("Jan");
    expect(cabecalho).toContain("Dez");
  });

  it("mostra o total anual de cada categoria", () => {
    const texto = formatarRelatorio(despesasExemplo);

    expect(obterLinha(texto, "Alimentação")).toContain("150,50");
    expect(obterLinha(texto, "Transporte")).toContain("80,00");
    expect(obterLinha(texto, "Lazer")).toContain("200,00");
    expect(obterLinha(texto, "Moradia")).toContain("1.000,00");
  });

  it("mostra o total geral e a maior despesa com descrição e valor", () => {
    const texto = formatarRelatorio(despesasExemplo);

    expect(texto).toContain("Total geral: R$ 1.430,50");
    expect(texto).toContain("Maior despesa: Aluguel (R$ 1.000,00)");
  });

  it("alinha as colunas: cabeçalho e linhas de categoria têm a mesma largura", () => {
    const texto = formatarRelatorio(despesasExemplo);
    const larguraCabecalho = obterLinha(texto, "Categoria").length;

    for (const categoria of CATEGORIAS) {
      expect(obterLinha(texto, descricaoCategoria(categoria)).length).toBe(larguraCabecalho);
    }
  });

  it("não modifica o array de entrada", () => {
    const copiaAntes = [...despesasExemplo];

    formatarRelatorio(despesasExemplo);

    expect(despesasExemplo).toEqual(copiaAntes);
  });
});
