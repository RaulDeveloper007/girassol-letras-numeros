// Persistência da tarefa do dia (ver progressao/tarefa-diaria.ts pra a
// decisão pura -- este arquivo só lê/escreve o estado "quanto já foi feito
// hoje" no Dexie).
import { dataDeHojeLocal, obterFolhasAlvoPorDia } from '../progressao/tarefa-diaria.js'
import type { DisciplinaId } from '../curriculo/tipos.js'
import { obterBanco, type BancoPassoCerto } from './banco.js'
import { obterConfiguracoesOrientador } from './orientador.js'
import type { TarefaDiaria } from './tipos.js'

/**
 * Busca a tarefa de hoje do aluno pra essa disciplina; se ainda não existe
 * (primeira folha do dia, ou primeira vez que o aluno estuda essa
 * disciplina), cria com o alvo configurado pelo responsável (ou o padrão).
 * Como a chave inclui a data, a tarefa de "ontem" simplesmente não é mais
 * encontrada aqui -- um novo registro "de hoje" nasce zerado, sem precisar
 * de nenhuma rotina de virada de dia.
 */
export async function obterOuCriarTarefaDeHoje(
  alunoId: string,
  disciplina: DisciplinaId,
  banco: BancoPassoCerto = obterBanco()
): Promise<TarefaDiaria> {
  const data = dataDeHojeLocal()
  const existente = await banco.tarefasDiarias.get([alunoId, disciplina, data])
  if (existente) return existente

  const configuracoes = await obterConfiguracoesOrientador(banco)
  const tarefa: TarefaDiaria = {
    alunoId,
    disciplina,
    data,
    folhasAlvo: obterFolhasAlvoPorDia(disciplina, configuracoes),
    folhasConcluidas: 0,
  }
  await banco.tarefasDiarias.put(tarefa)
  return tarefa
}

/**
 * Registra que uma folha foi concluída hoje nessa disciplina (chamado uma
 * vez por folha finalizada, nunca por item). Retorna a tarefa já
 * atualizada, pra a tela decidir na hora se a disciplina acabou de travar.
 */
export async function registrarFolhaConcluidaHoje(
  alunoId: string,
  disciplina: DisciplinaId,
  banco: BancoPassoCerto = obterBanco()
): Promise<TarefaDiaria> {
  const atual = await obterOuCriarTarefaDeHoje(alunoId, disciplina, banco)
  const atualizada: TarefaDiaria = { ...atual, folhasConcluidas: atual.folhasConcluidas + 1 }
  await banco.tarefasDiarias.put(atualizada)
  return atualizada
}
