import { describe, expect, it } from "vitest";
import { adicionarDespesa, removerDespesa, despesasDaCategoria, totalGasto, maiorDespesa } from "../src/despesas";
import type { Despesa } from "../src/tipos";
import { criarDespesa } from "./auxiliar";

describe("adicionarDespesa", () => {
  it("adiciona uma despesa válida ao final da lista", () => {
    const existente = criarDespesa({ id: "a" });
    const nova = criarDespesa({ id: "b", valor: 25.5, categoria: "lazer", mes: 6 });

    const resultado = adicionarDespesa([existente], nova);

    expect(resultado).toEqual([existente, nova]);
  });

  it("não modifica o array original", () => {
    const original: Despesa[] = [criarDespesa({ id: "a" })];
    const copiaAntes = [...original];

    const resultado = adicionarDespesa(original, criarDespesa({ id: "b" }));

    expect(original).toHaveLength(1);
    expect(original).toEqual(copiaAntes);
    expect(resultado).not.toBe(original);
  });

  it("funciona com a lista vazia", () => {
    const nova = criarDespesa({ id: "b" });

    expect(adicionarDespesa([], nova)).toEqual([nova]);
  });

  it("aceita os meses limite 1 e 12", () => {
    expect(adicionarDespesa([], criarDespesa({ mes: 1 }))).toHaveLength(1);
    expect(adicionarDespesa([], criarDespesa({ mes: 12 }))).toHaveLength(1);
  });

  it("rejeita valor igual a zero", () => {
    expect(() => adicionarDespesa([], criarDespesa({ valor: 0 }))).toThrow("maior que zero");
  });

  it("rejeita valor negativo", () => {
    expect(() => adicionarDespesa([], criarDespesa({ valor: -5 }))).toThrow("maior que zero");
  });

  it("rejeita mês inferior a 1", () => {
    expect(() => adicionarDespesa([], criarDespesa({ mes: 0 }))).toThrow("entre 1 e 12");
  });

  it("rejeita mês superior a 12", () => {
    expect(() => adicionarDespesa([], criarDespesa({ mes: 13 }))).toThrow("entre 1 e 12");
  });
});

describe("removerDespesa", () => {
  const a = criarDespesa({ id: "a" });
  const b = criarDespesa({ id: "b" });
  const c = criarDespesa({ id: "c" });

  it("remove a despesa com o id informado", () => {
    const original = [a, b, c];

    const resultado = removerDespesa(original, "b");

    expect(resultado).toEqual([a, c]);
    expect(original).toEqual([a, b, c]);
  });

  it("devolve uma cópia igual quando o id não existe", () => {
    const original = [a, b];

    const resultado = removerDespesa(original, "inexistente");

    expect(resultado).toEqual(original);
    expect(resultado).not.toBe(original);
  });

  it("devolve lista vazia ao remover de uma lista vazia", () => {
    expect(removerDespesa([], "a")).toEqual([]);
  });
});

describe("despesasDaCategoria", () => {
  const mercado = criarDespesa({ id: "1", categoria: "alimentacao" });
  const onibus = criarDespesa({ id: "2", categoria: "transporte" });
  const padaria = criarDespesa({ id: "3", categoria: "alimentacao" });

  it("devolve somente as despesas da categoria pedida", () => {
    expect(despesasDaCategoria([mercado, onibus, padaria], "alimentacao")).toEqual([mercado, padaria]);
  });

  it("devolve lista vazia quando a categoria não tem despesas", () => {
    expect(despesasDaCategoria([mercado, onibus], "lazer")).toEqual([]);
  });

  it("devolve lista vazia quando a lista de entrada está vazia", () => {
    expect(despesasDaCategoria([], "moradia")).toEqual([]);
  });

  it("não modifica o array original", () => {
    const original = [mercado, onibus, padaria];

    despesasDaCategoria(original, "alimentacao");

    expect(original).toEqual([mercado, onibus, padaria]);
  });
});

describe("totalGasto", () => {
  it("soma os valores de todas as despesas", () => {
    const despesas = [
      criarDespesa({ id: "1", valor: 10 }),
      criarDespesa({ id: "2", valor: 20.5 }),
      criarDespesa({ id: "3", valor: 30 }),
    ];

    expect(totalGasto(despesas)).toBeCloseTo(60.5);
  });

  it("devolve 0 para uma lista vazia", () => {
    expect(totalGasto([])).toBe(0);
  });

  it("devolve o próprio valor quando há uma única despesa", () => {
    expect(totalGasto([criarDespesa({ valor: 99.9 })])).toBeCloseTo(99.9);
  });

  it("não modifica o array original", () => {
    const original = [criarDespesa({ id: "1", valor: 5 }), criarDespesa({ id: "2", valor: 7 })];
    const copiaAntes = [...original];

    totalGasto(original);

    expect(original).toEqual(copiaAntes);
  });
});

describe("maiorDespesa", () => {
  it("devolve a despesa de maior valor", () => {
    const pequena = criarDespesa({ id: "1", valor: 10 });
    const grande = criarDespesa({ id: "2", valor: 500 });
    const media = criarDespesa({ id: "3", valor: 80 });

    expect(maiorDespesa([pequena, grande, media])).toBe(grande);
  });

  it("devolve undefined para uma lista vazia", () => {
    expect(maiorDespesa([])).toBeUndefined();
  });

  it("devolve a primeira ocorrência quando há empate", () => {
    const primeira = criarDespesa({ id: "1", valor: 100 });
    const segunda = criarDespesa({ id: "2", valor: 100 });

    expect(maiorDespesa([primeira, segunda])).toBe(primeira);
  });

  it("devolve a única despesa quando há apenas uma", () => {
    const unica = criarDespesa({ id: "1", valor: 1 });

    expect(maiorDespesa([unica])).toBe(unica);
  });

  it("não modifica o array original", () => {
    const original = [criarDespesa({ id: "1", valor: 1 }), criarDespesa({ id: "2", valor: 2 })];
    const copiaAntes = [...original];

    maiorDespesa(original);

    expect(original).toEqual(copiaAntes);
  });
});
