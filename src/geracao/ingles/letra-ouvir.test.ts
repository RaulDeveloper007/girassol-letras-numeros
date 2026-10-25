import { describe, expect, it } from 'vitest'
import { criarRng } from '../aleatorio.js'
import { letraOuvir } from './letra-ouvir.js'

describe('gerador ingles.letra-ouvir', () => {
  it('fala em en-US a letra sorteada do banco, e o gabarito é a mesma letra em minúsculas', () => {
    const rng = criarRng(1)
    const letras = ['A', 'B', 'C', 'D', 'E']
    for (let i = 0; i < 50; i++) {
      const item = letraOuvir(rng, { letras })
      const textoFala = item.dados.textoFala as string
      expect(letras).toContain(textoFala)
      expect(item.gabarito).toBe(textoFala.toLowerCase())
      expect(item.dados.idioma).toBe('en-US')
    }
  })
})
