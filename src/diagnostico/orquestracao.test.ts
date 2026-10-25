import { describe, expect, it } from 'vitest'
import { listarBlocosLineares } from './orquestracao.js'

describe('listarBlocosLineares', () => {
  it('lista os blocos de matemática na ordem do currículo', async () => {
    const pontos = await listarBlocosLineares('matematica')
    expect(pontos.length).toBeGreaterThan(0)
    expect(pontos[0]?.bloco.id).toBe('mat-f01-n01-b01')
    expect(pontos.map((p) => p.bloco.id)).toContain('mat-f01-n01-b03')
  })

  it('lista os blocos de inglês na ordem do currículo', async () => {
    const pontos = await listarBlocosLineares('ingles')
    expect(pontos.length).toBeGreaterThan(0)
    expect(pontos[0]?.bloco.id).toBe('ing-f01-n01-b01')
  })

  it('nunca inclui um bloco de produção livre (não tem certo/errado síncrono pra calibrar)', async () => {
    const pontosPortugues = await listarBlocosLineares('portugues')
    const pontosIngles = await listarBlocosLineares('ingles')
    for (const pontos of [pontosPortugues, pontosIngles]) {
      expect(pontos.some((p) => p.bloco.tiposDeItem.includes('producao-livre'))).toBe(false)
    }
  })
})
