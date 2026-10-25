import { describe, expect, it } from 'vitest'
import { criarRng } from '../aleatorio.js'
import { producaoLivre } from './producao-livre.js'

describe('gerador portugues.producao-livre', () => {
  it('o enunciado mostra a instrução e o tema sorteados, e nunca tem gabarito', () => {
    const rng = criarRng(1)
    const temas = [
      { tema: 'Meu animal de estimação', instrucao: 'Escreva um texto curto sobre o tema.' },
      { tema: 'Um dia diferente', instrucao: 'Conte uma pequena história sobre o tema.' },
    ]
    const rubrica = { id: 'r1', criterios: [{ id: 'tema', descricao: 'fala do tema', pontos: 2 }] }

    for (let i = 0; i < 50; i++) {
      const item = producaoLivre(rng, { temas, rubrica })
      const escolhido = temas.find((t) => item.enunciado.includes(t.tema))
      expect(escolhido).toBeDefined()
      expect(item.enunciado).toContain(escolhido!.instrucao)
      expect(item.gabarito).toBeNull()
      expect(item.dados.rubrica).toBe(rubrica)
      expect(item.tipo).toBe('producao-livre')
    }
  })
})
