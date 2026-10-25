import { describe, expect, it } from 'vitest'
import { criarBancoParaTeste } from './banco.js'
import { listarRevisoesDevidas, registrarResultadoDeRevisao } from './revisoes-agendadas.js'

function bancoDeTeste() {
  return criarBancoParaTeste(`teste-revisoes-${Math.random().toString(36).slice(2)}`)
}

describe('revisoes agendadas', () => {
  it('um acerto agenda a próxima revisão com o intervalo inicial (1 dia)', async () => {
    const banco = bancoDeTeste()
    const agendamento = await registrarResultadoDeRevisao('aluno-1', 'bloco-1', true, banco)
    expect(agendamento.intervaloAtualDias).toBe(1)
    banco.close()
  })

  it('acertos consecutivos crescem o intervalo; um erro volta pro início', async () => {
    const banco = bancoDeTeste()
    await registrarResultadoDeRevisao('aluno-1', 'bloco-1', true, banco) // 1
    await registrarResultadoDeRevisao('aluno-1', 'bloco-1', true, banco) // 3
    const terceiro = await registrarResultadoDeRevisao('aluno-1', 'bloco-1', true, banco) // 7
    expect(terceiro.intervaloAtualDias).toBe(7)

    const apósErro = await registrarResultadoDeRevisao('aluno-1', 'bloco-1', false, banco)
    expect(apósErro.intervaloAtualDias).toBe(1)
    banco.close()
  })

  it('listarRevisoesDevidas só retorna revisões cuja data já passou', async () => {
    const banco = bancoDeTeste()
    await registrarResultadoDeRevisao('aluno-1', 'bloco-vencido', true, banco)
    await registrarResultadoDeRevisao('aluno-1', 'bloco-futuro', true, banco)

    // Força o bloco-futuro pra bem mais tarde, simulando um agendamento que
    // ainda não venceu.
    await banco.revisoesAgendadas.update(['aluno-1', 'bloco-futuro'], {
      proximaRevisaoEm: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    })
    await banco.revisoesAgendadas.update(['aluno-1', 'bloco-vencido'], {
      proximaRevisaoEm: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    })

    const devidas = await listarRevisoesDevidas('aluno-1', new Date(), banco)
    expect(devidas.map((r) => r.blocoId)).toEqual(['bloco-vencido'])
    banco.close()
  })
})
