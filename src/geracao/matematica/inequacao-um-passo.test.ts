import { describe, expect, it } from 'vitest'
import { criarRng } from '../aleatorio.js'
import { inequacaoUmPasso } from './inequacao-um-passo.js'

describe('gerador matematica.inequacao-um-passo', () => {
  it('o gabarito satisfaz a inequação, e o inteiro adjacente (mais próximo do limite) não satisfaz', () => {
    const rng = criarRng(1)
    for (let i = 0; i < 200; i++) {
      const item = inequacaoUmPasso(rng, { maxX: 15, maxA: 10 })
      const { a, limite, operador } = item.dados as { a: number; limite: number; operador: string }
      const gabarito = item.gabarito as number

      const satisfaz = (x: number) => {
        const soma = x + a
        if (operador === '>') return soma > limite
        if (operador === '≥') return soma >= limite
        if (operador === '<') return soma < limite
        return soma <= limite
      }

      expect(satisfaz(gabarito)).toBe(true)

      // Para "menor que satisfaz" (>, ≥), um a menos não deveria satisfazer;
      // para "maior que satisfaz" (<, ≤), um a mais não deveria satisfazer.
      const adjacenteInvalido = operador === '>' || operador === '≥' ? gabarito - 1 : gabarito + 1
      expect(satisfaz(adjacenteInvalido)).toBe(false)
    }
  })
})
