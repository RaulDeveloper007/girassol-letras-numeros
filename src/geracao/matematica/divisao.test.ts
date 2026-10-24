import { describe, expect, it } from 'vitest'
import { criarRng } from '../aleatorio.js'
import { divisao } from './divisao.js'

describe('gerador matematica.divisao', () => {
  it('a divisão exata sempre bate: divisor × gabarito === dividendo', () => {
    const rng = criarRng(1)
    for (let i = 0; i < 100; i++) {
      const item = divisao(rng, { divisores: [2, 3, 4, 5], quocienteMax: 10, comResto: false })
      const dividendo = item.dados.dividendo as number
      const divisor = item.dados.divisor as number
      expect(item.dados.resto).toBe(0)
      expect(divisor * (item.gabarito as number)).toBe(dividendo)
    }
  })

  it('com comResto, o gabarito continua sendo a parte inteira certa', () => {
    const rng = criarRng(2)
    for (let i = 0; i < 100; i++) {
      const item = divisao(rng, { divisores: [3, 4], quocienteMax: 10, comResto: true })
      const dividendo = item.dados.dividendo as number
      const divisor = item.dados.divisor as number
      expect(Math.floor(dividendo / divisor)).toBe(item.gabarito)
    }
  })

  it('usa o divisor pedido quando há uma única opção', () => {
    const rng = criarRng(3)
    const item = divisao(rng, { divisores: [6], quocienteMax: 5 })
    expect(item.dados.divisor).toBe(6)
  })
})
