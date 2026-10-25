import { describe, expect, it } from 'vitest'
import { criarRng } from '../aleatorio.js'
import { interpretacaoTexto } from './interpretacao-texto.js'

describe('gerador portugues.interpretacao-texto', () => {
  it('o enunciado mostra o texto e a pergunta sorteados, e o gabarito é a resposta correspondente', () => {
    const rng = criarRng(1)
    const itens = [
      { texto: 'Marcos foi ao mercado comprar pão e leite.', pergunta: 'O que Marcos foi comprar?', resposta: 'pão e leite' },
      { texto: 'Ana tem um cachorro chamado Bob.', pergunta: 'Qual é o nome do cachorro da Ana?', resposta: 'bob' },
    ]
    for (let i = 0; i < 50; i++) {
      const item = interpretacaoTexto(rng, { itens })
      const escolhido = itens.find((it) => it.resposta === item.gabarito)
      expect(escolhido).toBeDefined()
      expect(item.enunciado).toContain(escolhido!.texto)
      expect(item.enunciado).toContain(escolhido!.pergunta)
    }
  })

  it('não é item de ortografia -- a correção normaliza acentos', () => {
    const rng = criarRng(2)
    const item = interpretacaoTexto(rng, {
      itens: [{ texto: 'texto', pergunta: 'pergunta', resposta: 'pão' }],
    })
    expect(item.dados.regrasTextuais).toMatchObject({ normalizarAcentos: true })
  })
})
