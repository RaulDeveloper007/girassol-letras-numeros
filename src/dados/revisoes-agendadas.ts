// Persistência da revisão espaçada -- o cálculo em si (intervalo cresce a
// cada acerto, volta ao início em qualquer erro) é puro e já testado em
// src/progressao/revisao-espacada.ts; aqui só gravamos/consultamos o
// agendamento de cada aluno.
import { calcularProximaRevisao, proximoIntervaloDias } from '../progressao/revisao-espacada.js'
import { obterBanco, type BancoPassoCerto } from './banco.js'
import type { RevisaoAgendada } from './tipos.js'

export async function registrarResultadoDeRevisao(
  alunoId: string,
  blocoId: string,
  acertou: boolean,
  banco: BancoPassoCerto = obterBanco()
): Promise<RevisaoAgendada> {
  const existente = await banco.revisoesAgendadas.get([alunoId, blocoId])
  const intervaloAtual = existente?.intervaloAtualDias ?? 0

  const proximoIntervalo = proximoIntervaloDias(intervaloAtual, acertou)
  const proximaRevisao = calcularProximaRevisao(new Date(), proximoIntervalo)

  const agendamento: RevisaoAgendada = {
    alunoId,
    blocoId,
    proximaRevisaoEm: proximaRevisao.toISOString(),
    intervaloAtualDias: proximoIntervalo,
  }
  await banco.revisoesAgendadas.put(agendamento)
  return agendamento
}

export async function listarRevisoesDevidas(
  alunoId: string,
  agora: Date = new Date(),
  banco: BancoPassoCerto = obterBanco()
): Promise<RevisaoAgendada[]> {
  const todas = await banco.revisoesAgendadas.where('alunoId').equals(alunoId).toArray()
  return todas.filter((revisao) => new Date(revisao.proximaRevisaoEm) <= agora)
}
