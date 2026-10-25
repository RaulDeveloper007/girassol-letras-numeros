import { createId } from '../generators/shared/id.js'
import { obterBanco, type BancoPassoCerto } from './banco.js'
import type { Aluno } from './tipos.js'

export async function criarAluno(
  dados: { nomeExibicao: string; idade: number; avatarIcone: string },
  banco: BancoPassoCerto = obterBanco()
): Promise<Aluno> {
  const aluno: Aluno = {
    id: createId(),
    nomeExibicao: dados.nomeExibicao,
    idade: dados.idade,
    avatarIcone: dados.avatarIcone,
    criadoEm: new Date().toISOString(),
  }
  await banco.alunos.put(aluno)
  return aluno
}

export function listarAlunos(banco: BancoPassoCerto = obterBanco()): Promise<Aluno[]> {
  return banco.alunos.toArray()
}

export function obterAluno(id: string, banco: BancoPassoCerto = obterBanco()): Promise<Aluno | undefined> {
  return banco.alunos.get(id)
}

export async function removerAluno(id: string, banco: BancoPassoCerto = obterBanco()): Promise<void> {
  // Remove tudo relacionado ao aluno, não só o registro dele -- senão
  // sobram progresso/folhas/comentários órfãos no banco.
  const folhasDoAluno = await banco.folhas.where('alunoId').equals(id).toArray()
  const folhasIds = folhasDoAluno.map((f) => f.id)
  const itensDasFolhasDoAluno = folhasIds.length > 0 ? await banco.itens.where('folhaId').anyOf(folhasIds).toArray() : []
  const itensIds = itensDasFolhasDoAluno.map((i) => i.id)

  await banco.transaction(
    'rw',
    [
      banco.alunos,
      banco.progressoDisciplina,
      banco.folhas,
      banco.itens,
      banco.tentativas,
      banco.correcoes,
      banco.testesDeConclusao,
      banco.tentativasDeFala,
      banco.revisoesAgendadas,
      banco.comentariosOrientador,
    ],
    async () => {
      await banco.alunos.delete(id)
      await banco.progressoDisciplina.where('alunoId').equals(id).delete()
      await banco.folhas.where('alunoId').equals(id).delete()
      if (itensIds.length > 0) {
        await banco.itens.bulkDelete(itensIds)
        await banco.tentativas.where('itemId').anyOf(itensIds).delete()
        await banco.correcoes.bulkDelete(itensIds)
        await banco.tentativasDeFala.where('itemId').anyOf(itensIds).delete()
      }
      await banco.testesDeConclusao.where('alunoId').equals(id).delete()
      await banco.revisoesAgendadas.where('alunoId').equals(id).delete()
      await banco.comentariosOrientador.where('alunoId').equals(id).delete()
    }
  )
}
