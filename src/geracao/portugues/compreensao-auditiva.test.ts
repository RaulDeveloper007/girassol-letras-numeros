import { describe, expect, it } from 'vitest'
import { criarRng } from '../aleatorio.js'
import { compreensaoAuditiva } from './compreensao-auditiva.js'

describe('gerador portugues.compreensao-auditiva', () => {
  it('fala a pergunta (não a resposta) e espera a resposta certa como fraseAlvo/gabarito', () => {
    const rng = criarRng(1)
    const perguntas = [
      { pergunta: 'Qual é a cor do céu num dia sem nuvens?', resposta: 'azul' },
      { pergunta: 'Que animal faz "miau"?', resposta: 'gato' },
    ]
    for (let i = 0; i < 50; i++) {
      const item = compreensaoAuditiva(rng, { perguntas })
      const escolhida = perguntas.find((p) => p.resposta === item.gabarito)
      expect(escolhida).toBeDefined()
      expect(item.dados.textoFala).toBe(escolhida!.pergunta)
      expect(item.dados.fraseAlvo).toBe(escolhida!.resposta)
      expect(item.tipo).toBe('fala-resposta')
    }
  })
})
