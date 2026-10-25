import { describe, expect, it } from 'vitest'
import { criarRng } from '../aleatorio.js'
import { interpretacaoOral } from './interpretacao-oral.js'

describe('gerador portugues.interpretacao-oral', () => {
  it('fala o texto seguido da pergunta, e espera a resposta certa em voz alta', () => {
    const rng = criarRng(1)
    const itens = [
      { texto: 'Ana adora animais. Ela tem um cachorro chamado Bob.', pergunta: 'Qual é o nome do cachorro?', resposta: 'bob' },
    ]
    const item = interpretacaoOral(rng, { itens })
    expect(item.dados.textoFala).toBe('Ana adora animais. Ela tem um cachorro chamado Bob. Qual é o nome do cachorro?')
    expect(item.dados.fraseAlvo).toBe('bob')
    expect(item.gabarito).toBe('bob')
    expect(item.tipo).toBe('fala-resposta')
  })
})
