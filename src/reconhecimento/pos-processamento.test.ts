import { describe, expect, it } from 'vitest'
import { borrar, dilatar } from './pos-processamento.js'

function grade3x3ComCentro(): Float32Array {
  // 3x3, só o pixel central aceso.
  const g = new Float32Array(9)
  g[4] = 1
  return g
}

describe('dilatar', () => {
  it('com raio 0, devolve o buffer original sem alterar', () => {
    const entrada = grade3x3ComCentro()
    expect(dilatar(entrada, 3, 0)).toBe(entrada)
  })

  it('com raio 1, espalha o valor máximo pros vizinhos ortogonais e diagonais', () => {
    const saida = dilatar(grade3x3ComCentro(), 3, 1)
    // Todos os 9 pixels de uma grade 3x3 estão a <=1 de distância (em
    // chebyshev) do centro -- todos devem virar 1.
    expect(Array.from(saida)).toEqual(new Array(9).fill(1))
  })

  it('nunca diminui um valor existente (é um máximo, não uma média)', () => {
    const entrada = new Float32Array(9).fill(0.5)
    entrada[4] = 1
    const saida = dilatar(entrada, 3, 1)
    for (const v of saida) expect(v).toBeGreaterThanOrEqual(0.5)
  })
})

describe('borrar', () => {
  it('mantém os valores dentro de 0..1', () => {
    const saida = borrar(grade3x3ComCentro(), 3, 1)
    for (const v of saida) {
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThanOrEqual(1)
    }
  })

  it('espalha parte do valor do centro pros vizinhos (suaviza a borda)', () => {
    const saida = borrar(grade3x3ComCentro(), 3, 1)
    // O canto (0,0) só tem o centro como vizinho não-nulo entre os 4
    // pixels da sua janela 2x2 válida -- deve ficar > 0 (borrou) e < 1
    // (não virou o valor cheio do centro).
    expect(saida[0]).toBeGreaterThan(0)
    expect(saida[0]).toBeLessThan(1)
  })

  it('mais passes espalha a tinta mais longe (o raio efetivo do borrão cresce)', () => {
    // Um box blur 3x3 de raio 1 só alcança 1 pixel de distância por passe
    // -- um pixel a 2 de distância do pico fica 0 depois de 1 passe, e
    // passa a receber alguma tinta depois de 2.
    const tamanho = 7
    const meio = Math.floor(tamanho / 2)
    const centro = new Float32Array(tamanho * tamanho)
    centro[meio * tamanho + meio] = 1

    const umPasse = borrar(centro, tamanho, 1)
    const doisPasses = borrar(centro, tamanho, 2)
    const distante = meio * tamanho + (meio + 2)

    expect(umPasse[distante]).toBe(0)
    expect(doisPasses[distante]).toBeGreaterThan(0)
  })

  it('com 0 passes, devolve os valores originais', () => {
    const entrada = grade3x3ComCentro()
    expect(Array.from(borrar(entrada, 3, 0))).toEqual(Array.from(entrada))
  })
})
