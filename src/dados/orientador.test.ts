import { describe, expect, it } from 'vitest'
import { criarBancoParaTeste } from './banco.js'
import {
  listarComentarios,
  marcarComentarioLido,
  obterConfiguracoesOrientador,
  salvarComentario,
  salvarConfiguracoesOrientador,
} from './orientador.js'

function bancoDeTeste() {
  return criarBancoParaTeste(`teste-orientador-${Math.random().toString(36).slice(2)}`)
}

describe('configuracoes do orientador', () => {
  it('cria configurações padrão (sem PIN ainda) na primeira leitura', async () => {
    const banco = bancoDeTeste()
    const config = await obterConfiguracoesOrientador(banco)
    expect(config.pinHash).toBeNull()
    expect(config.ultimoBackupEm).toBeNull()
    banco.close()
  })

  it('salvarConfiguracoesOrientador faz merge parcial, sem perder os outros campos', async () => {
    const banco = bancoDeTeste()
    await salvarConfiguracoesOrientador({ pinHash: 'hash-123' }, banco)
    await salvarConfiguracoesOrientador({ ultimoBackupEm: '2026-01-01T00:00:00.000Z' }, banco)

    const config = await obterConfiguracoesOrientador(banco)
    expect(config.pinHash).toBe('hash-123')
    expect(config.ultimoBackupEm).toBe('2026-01-01T00:00:00.000Z')
    banco.close()
  })
})

describe('comentarios do orientador', () => {
  it('salva um comentário não lido e consegue marcá-lo como lido', async () => {
    const banco = bancoDeTeste()
    const comentario = await salvarComentario('aluno-1', 'Muito bem na lição de hoje!', banco)
    expect(comentario.lidoPeloAluno).toBe(false)

    await marcarComentarioLido(comentario.id, banco)
    const [lido] = await listarComentarios('aluno-1', banco)
    expect(lido?.lidoPeloAluno).toBe(true)
    banco.close()
  })
})
