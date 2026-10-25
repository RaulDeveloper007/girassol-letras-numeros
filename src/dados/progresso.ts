import type { DisciplinaId } from '../curriculo/tipos.js'
import { carregarFase } from '../curriculo/loader.js'
import { obterBanco, type BancoPassoCerto } from './banco.js'
import type { ProgressoDisciplina } from './tipos.js'

async function primeiroBlocoDaFase1(disciplina: DisciplinaId): Promise<string> {
  const fase = await carregarFase(disciplina, 1)
  const primeiroBloco = fase.niveis[0]?.blocos[0]
  if (!primeiroBloco) throw new Error(`Fase 1 de "${disciplina}" não tem nenhum bloco declarado.`)
  return primeiroBloco.id
}

/**
 * Busca o progresso do aluno numa disciplina; se ainda não existir (aluno
 * novo), cria um registro inicial em Fase 1 · Nível 1, com diagnóstico
 * pendente -- a posição real só é decidida pelo diagnóstico adaptativo ou
 * pelo desempenho real, nunca pela idade (ver diagnostico/algoritmo.ts).
 */
export async function obterOuCriarProgresso(
  alunoId: string,
  disciplina: DisciplinaId,
  banco: BancoPassoCerto = obterBanco()
): Promise<ProgressoDisciplina> {
  const existente = await banco.progressoDisciplina.get([alunoId, disciplina])
  if (existente) return existente

  const progresso: ProgressoDisciplina = {
    alunoId,
    disciplina,
    faseAtual: 1,
    nivelAtual: 1,
    blocoAtualId: await primeiroBlocoDaFase1(disciplina),
    statusDiagnostico: 'pendente',
    ultimaAtividadeEm: new Date().toISOString(),
  }
  await banco.progressoDisciplina.put(progresso)
  return progresso
}

export function listarProgressoPorAluno(alunoId: string, banco: BancoPassoCerto = obterBanco()): Promise<ProgressoDisciplina[]> {
  return banco.progressoDisciplina.where('alunoId').equals(alunoId).toArray()
}

export function salvarProgresso(progresso: ProgressoDisciplina, banco: BancoPassoCerto = obterBanco()): Promise<[string, string]> {
  return banco.progressoDisciplina.put({ ...progresso, ultimaAtividadeEm: new Date().toISOString() })
}
