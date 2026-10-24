import { describe, expect, it } from 'vitest'
import { criarRng } from '../aleatorio.js'
import { contagem } from './contagem.js'

describe('gerador matematica.contagem', () => {
  it('a quantidade fica dentro de min/max e bate com o gabarito', () => {
    const rng = criarRng(10)
    for (let i = 0; i < 50; i++) {
      const item = contagem(rng, { min: 2, max: 6 })
      expect(item.gabarito).toBeGreaterThanOrEqual(2)
      expect(item.gabarito).toBeLessThanOrEqual(6)
      expect(item.dados.quantidade).toBe(item.gabarito)
    }
  })

  it('usa tipo "tracado-guiado" quando exigirNumeral é verdadeiro', () => {
    const rng = criarRng(1)
    const item = contagem(rng, { min: 1, max: 5, exigirNumeral: true })
    expect(item.tipo).toBe('tracado-guiado')
  })

  it('usa tipo "numerico" quando exigirNumeral não é passado', () => {
    const rng = criarRng(1)
    const item = contagem(rng, { min: 1, max: 5 })
    expect(item.tipo).toBe('numerico')
  })

  it('o enunciado mostra a mesma quantidade de símbolos do gabarito', () => {
    const rng = criarRng(99)
    const item = contagem(rng, { min: 3, max: 3 })
    const simbolo = item.dados.simbolo as string
    const vezes = item.enunciado.split(simbolo).length - 1
    expect(vezes).toBe(3)
  })
})
