import { describe, expect, it } from 'vitest'
import {
  FOLHAS_ALVO_PADRAO,
  dataDeHojeLocal,
  folhasRestantesHoje,
  obterFolhasAlvoPorDia,
  tarefaConcluidaHoje,
} from './tarefa-diaria.js'
import type { ConfiguracoesOrientador } from '../dados/tipos.js'

function configDeTeste(parcial: Partial<ConfiguracoesOrientador> = {}): ConfiguracoesOrientador {
  return { id: 'singleton', pinHash: null, ultimoBackupEm: null, folhasPorDiaPorDisciplina: {}, ...parcial }
}

describe('dataDeHojeLocal', () => {
  it('usa o fuso local, não UTC -- 22h locais não viram o dia seguinte', () => {
    // 2026-03-10 22:30 no fuso local da máquina que roda o teste.
    const local = new Date(2026, 2, 10, 22, 30)
    expect(dataDeHojeLocal(local)).toBe('2026-03-10')
  })

  it('preenche mês e dia com zero à esquerda', () => {
    const local = new Date(2026, 0, 5, 8, 0)
    expect(dataDeHojeLocal(local)).toBe('2026-01-05')
  })
})

describe('obterFolhasAlvoPorDia', () => {
  it('usa o padrão quando o responsável não configurou a disciplina', () => {
    expect(obterFolhasAlvoPorDia('matematica', configDeTeste())).toBe(FOLHAS_ALVO_PADRAO)
  })

  it('usa o valor configurado pelo responsável quando existe', () => {
    const config = configDeTeste({ folhasPorDiaPorDisciplina: { matematica: 4 } })
    expect(obterFolhasAlvoPorDia('matematica', config)).toBe(4)
    expect(obterFolhasAlvoPorDia('portugues', config)).toBe(FOLHAS_ALVO_PADRAO)
  })
})

describe('folhasRestantesHoje / tarefaConcluidaHoje', () => {
  it('conta quantas faltam e não conclui antes da hora', () => {
    const estado = { folhasAlvo: 3, folhasConcluidas: 1 }
    expect(folhasRestantesHoje(estado)).toBe(2)
    expect(tarefaConcluidaHoje(estado)).toBe(false)
  })

  it('conclui quando bate a quantidade alvo', () => {
    const estado = { folhasAlvo: 2, folhasConcluidas: 2 }
    expect(folhasRestantesHoje(estado)).toBe(0)
    expect(tarefaConcluidaHoje(estado)).toBe(true)
  })

  it('nunca retorna negativo mesmo se concluídas passar do alvo (ex.: alvo reduzido no meio do dia)', () => {
    const estado = { folhasAlvo: 2, folhasConcluidas: 5 }
    expect(folhasRestantesHoje(estado)).toBe(0)
    expect(tarefaConcluidaHoje(estado)).toBe(true)
  })
})
