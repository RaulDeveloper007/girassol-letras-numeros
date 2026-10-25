import { describe, expect, it } from 'vitest'
import { criarBancoParaTeste } from './banco.js'
import { listarTentativasDeFalaEncaminhadas, salvarTentativaDeFala } from './tentativas-de-fala.js'

function bancoDeTeste() {
  return criarBancoParaTeste(`teste-fala-${Math.random().toString(36).slice(2)}`)
}

describe('tentativas de fala', () => {
  it('salva a transcrição, nunca o áudio, e numera a tentativa automaticamente', async () => {
    const banco = bancoDeTeste()
    const primeira = await salvarTentativaDeFala(
      {
        itemId: 'item-1',
        transcricao: 'eu gosto de estudar',
        idioma: 'pt-BR',
        camadaUsada: 1,
        similaridade: 0.95,
        aceito: true,
        encaminhadoParaOrientador: false,
      },
      banco
    )
    expect(primeira.id).toBeTruthy()
    expect(primeira.numero).toBe(1)
    expect(primeira).not.toHaveProperty('audio')

    const segunda = await salvarTentativaDeFala(
      {
        itemId: 'item-1',
        transcricao: 'eu gosto de estudar',
        idioma: 'pt-BR',
        camadaUsada: 1,
        similaridade: 1,
        aceito: true,
        encaminhadoParaOrientador: false,
      },
      banco
    )
    expect(segunda.numero).toBe(2)
    banco.close()
  })

  it('lista só as tentativas encaminhadas pro orientador (esgotaram as 3 chances)', async () => {
    const banco = bancoDeTeste()
    await salvarTentativaDeFala(
      {
        itemId: 'item-aceito',
        transcricao: 'certo',
        idioma: 'pt-BR',
        camadaUsada: 1,
        similaridade: 1,
        aceito: true,
        encaminhadoParaOrientador: false,
      },
      banco
    )
    await salvarTentativaDeFala(
      {
        itemId: 'item-encaminhado',
        transcricao: 'errado de novo',
        idioma: 'pt-BR',
        camadaUsada: 1,
        similaridade: 0.2,
        aceito: false,
        encaminhadoParaOrientador: true,
      },
      banco
    )

    const encaminhadas = await listarTentativasDeFalaEncaminhadas(banco)
    expect(encaminhadas.map((t) => t.itemId)).toEqual(['item-encaminhado'])
    banco.close()
  })
})
