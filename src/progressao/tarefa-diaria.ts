// Disciplina do "bloquinho diário": no método, o aluno recebe uma
// quantidade FIXA de folhas por disciplina por dia. Ele pode (e deve)
// refazer até dominar cada folha (ver dominio.ts), mas depois de concluir
// a quantidade do dia, a disciplina trava até o dia seguinte -- não é
// "pratique à vontade". Este módulo é só a decisão pura; a persistência
// (o que já foi feito HOJE) mora em dados/tarefa-diaria.ts.
import type { DisciplinaId } from '../curriculo/tipos.js'
import type { ConfiguracoesOrientador } from '../dados/tipos.js'

/** Quantidade padrão de folhas por dia quando o responsável não configurou nada. */
export const FOLHAS_ALVO_PADRAO = 2

export interface EstadoTarefaDiaria {
  folhasAlvo: number
  folhasConcluidas: number
}

/**
 * Data local do aparelho em "AAAA-MM-DD" -- de propósito NÃO usa
 * toISOString() (que é UTC): um aluno estudando às 22h num fuso UTC-3
 * não pode cair no dia seguinte por causa do fuso.
 */
export function dataDeHojeLocal(agora: Date = new Date()): string {
  const ano = agora.getFullYear()
  const mes = String(agora.getMonth() + 1).padStart(2, '0')
  const dia = String(agora.getDate()).padStart(2, '0')
  return `${ano}-${mes}-${dia}`
}

/**
 * Quantas folhas por dia valem pra essa disciplina -- configuração do
 * responsável (painel), com o padrão como fallback.
 */
export function obterFolhasAlvoPorDia(disciplina: DisciplinaId, configuracoes: ConfiguracoesOrientador): number {
  return configuracoes.folhasPorDiaPorDisciplina[disciplina] ?? FOLHAS_ALVO_PADRAO
}

export function folhasRestantesHoje(estado: EstadoTarefaDiaria): number {
  return Math.max(0, estado.folhasAlvo - estado.folhasConcluidas)
}

/** true quando a tarefa de hoje já foi cumprida -- disciplina trava até o dia seguinte. */
export function tarefaConcluidaHoje(estado: EstadoTarefaDiaria): boolean {
  return folhasRestantesHoje(estado) === 0
}
