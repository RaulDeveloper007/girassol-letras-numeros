import { describe, expect, it } from 'vitest'
import { NenhumaCamadaDisponivelError, reconhecerFala } from './servico.js'

describe('reconhecerFala (ambiente sem navegador, nenhuma camada disponível)', () => {
  it('lança NenhumaCamadaDisponivelError', async () => {
    await expect(reconhecerFala('pt-BR')).rejects.toBeInstanceOf(NenhumaCamadaDisponivelError)
  })
})
