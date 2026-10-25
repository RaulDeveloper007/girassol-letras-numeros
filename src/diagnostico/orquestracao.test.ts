import { describe, expect, it } from 'vitest'
import { listarBlocosLineares } from './orquestracao.js'

describe('listarBlocosLineares', () => {
  it('lista os blocos de matemática na ordem do currículo', async () => {
    const pontos = await listarBlocosLineares('matematica')
    expect(pontos.length).toBeGreaterThan(0)
    expect(pontos[0]?.bloco.id).toBe('mat-f01-n01-b01')
    expect(pontos.map((p) => p.bloco.id)).toContain('mat-f01-n01-b03')
  })

  it('retorna lista vazia para uma disciplina sem currículo ainda', async () => {
    expect(await listarBlocosLineares('ingles')).toEqual([])
  })

  it('nunca inclui um bloco de produção livre (não tem certo/errado síncrono pra calibrar)', async () => {
    const pontos = await listarBlocosLineares('portugues')
    const temProducaoLivre = pontos.some((p) => p.bloco.tiposDeItem.includes('producao-livre'))
    expect(temProducaoLivre).toBe(false)
  })
})
