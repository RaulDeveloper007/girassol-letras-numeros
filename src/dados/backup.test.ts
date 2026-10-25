import { describe, expect, it } from 'vitest'
import { criarAluno } from './alunos.js'
import { criarBancoParaTeste } from './banco.js'
import { exportarBackup, importarBackup } from './backup.js'

function bancoDeTeste() {
  return criarBancoParaTeste(`teste-backup-${Math.random().toString(36).slice(2)}`)
}

describe('backup', () => {
  it('exporta todas as tabelas e consegue reimportar no mesmo estado', async () => {
    const bancoOrigem = bancoDeTeste()
    await criarAluno({ nomeExibicao: 'Ana', idade: 7, avatarIcone: '🌻' }, bancoOrigem)

    const backup = await exportarBackup(bancoOrigem)
    expect(backup.dados.alunos).toHaveLength(1)

    const bancoDestino = bancoDeTeste()
    await importarBackup(backup, bancoDestino)

    const alunosNoDestino = await bancoDestino.alunos.toArray()
    expect(alunosNoDestino).toEqual(backup.dados.alunos)

    bancoOrigem.close()
    bancoDestino.close()
  })

  it('rejeita um backup sem o campo "dados"', async () => {
    const banco = bancoDeTeste()
    await expect(importarBackup({}, banco)).rejects.toThrow('inválido')
    banco.close()
  })

  it('rejeita um backup de outra versão de esquema', async () => {
    const banco = bancoDeTeste()
    await expect(importarBackup({ versaoDoEsquema: 999, dados: {} }, banco)).rejects.toThrow('incompatível')
    banco.close()
  })
})
