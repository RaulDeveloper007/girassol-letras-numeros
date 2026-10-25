import { describe, expect, it } from 'vitest'
import { criarBancoParaTeste } from './banco.js'
import { listarTestesPorAluno, registrarTesteDeConclusao } from './testes-de-conclusao.js'

function bancoDeTeste() {
  return criarBancoParaTeste(`teste-conclusao-${Math.random().toString(36).slice(2)}`)
}

describe('testes de conclusao', () => {
  it('registra um teste de conclusão aprovado e consegue listá-lo pelo aluno/disciplina', async () => {
    const banco = bancoDeTeste()
    await registrarTesteDeConclusao(
      { alunoId: 'aluno-1', disciplina: 'matematica', faseNumero: 1, nivelNumero: 1, itensIds: ['i1', 'i2'], resultado: 'aprovado' },
      banco
    )

    const testes = await listarTestesPorAluno('aluno-1', 'matematica', banco)
    expect(testes).toHaveLength(1)
    expect(testes[0]?.resultado).toBe('aprovado')
    expect(testes[0]?.finalizadoEm).toBeTruthy()
    banco.close()
  })
})
