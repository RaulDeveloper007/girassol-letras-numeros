import { describe, expect, it } from 'vitest'
import { criarBancoParaTeste } from './banco.js'
import { listarProgressoPorAluno, obterOuCriarProgresso, salvarProgresso } from './progresso.js'

function bancoDeTeste() {
  return criarBancoParaTeste(`teste-progresso-${Math.random().toString(36).slice(2)}`)
}

describe('progresso', () => {
  it('cria progresso inicial em Fase 1 · Nível 1, com diagnóstico pendente, pra um aluno novo', async () => {
    const banco = bancoDeTeste()
    const progresso = await obterOuCriarProgresso('aluno-1', 'matematica', banco)
    expect(progresso.faseAtual).toBe(1)
    expect(progresso.nivelAtual).toBe(1)
    expect(progresso.blocoAtualId).toBe('mat-f01-n01-b01')
    expect(progresso.statusDiagnostico).toBe('pendente')
    banco.close()
  })

  it('não recria o progresso se já existir -- retorna o mesmo registro', async () => {
    const banco = bancoDeTeste()
    const primeiro = await obterOuCriarProgresso('aluno-1', 'matematica', banco)
    await salvarProgresso({ ...primeiro, faseAtual: 3, nivelAtual: 2 }, banco)

    const segundo = await obterOuCriarProgresso('aluno-1', 'matematica', banco)
    expect(segundo.faseAtual).toBe(3)
    expect(segundo.nivelAtual).toBe(2)
    banco.close()
  })

  it('listarProgressoPorAluno retorna o progresso de todas as disciplinas já iniciadas', async () => {
    const banco = bancoDeTeste()
    await obterOuCriarProgresso('aluno-1', 'matematica', banco)
    await obterOuCriarProgresso('aluno-1', 'portugues', banco)

    const lista = await listarProgressoPorAluno('aluno-1', banco)
    expect(lista.map((p) => p.disciplina).sort()).toEqual(['matematica', 'portugues'])
    banco.close()
  })
})
