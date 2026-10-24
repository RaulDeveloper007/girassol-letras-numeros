import { describe, expect, it } from 'vitest'
import { criarReconhecedorCamada1 } from './camada1-web-speech.js'

describe('criarReconhecedorCamada1 (ambiente sem navegador)', () => {
  it('disponivel() é false quando não há window/SpeechRecognition', () => {
    const reconhecedor = criarReconhecedorCamada1()
    expect(reconhecedor.disponivel()).toBe(false)
  })

  it('reconhecer() rejeita com um erro claro quando indisponível', async () => {
    const reconhecedor = criarReconhecedorCamada1()
    await expect(reconhecedor.reconhecer('pt-BR')).rejects.toThrow(/indisponível/)
  })
})
