import { createId } from '../generators/shared/id.js'
import type { DisciplinaId } from '../curriculo/tipos.js'
import { obterBanco, type BancoPassoCerto } from './banco.js'
import type { TesteDeConclusao } from './tipos.js'

export async function registrarTesteDeConclusao(
  dados: {
    alunoId: string
    disciplina: DisciplinaId
    faseNumero: number
    nivelNumero: number
    itensIds: string[]
    resultado: 'aprovado' | 'reprovado'
  },
  banco: BancoPassoCerto = obterBanco()
): Promise<TesteDeConclusao> {
  const teste: TesteDeConclusao = {
    id: createId(),
    ...dados,
    blocoDeRevisaoGeradoId: null,
    finalizadoEm: new Date().toISOString(),
  }
  await banco.testesDeConclusao.put(teste)
  return teste
}

export function listarTestesPorAluno(
  alunoId: string,
  disciplina: DisciplinaId,
  banco: BancoPassoCerto = obterBanco()
): Promise<TesteDeConclusao[]> {
  return banco.testesDeConclusao.where('[alunoId+disciplina]').equals([alunoId, disciplina]).toArray()
}
