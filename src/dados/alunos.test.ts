import { describe, expect, it } from 'vitest'
import { registrarTodosOsGeradores } from '../geracao/registrar-todos.js'
import { criarAluno, listarAlunos, obterAluno, removerAluno } from './alunos.js'
import { criarBancoParaTeste } from './banco.js'
import { obterOuCriarProgresso } from './progresso.js'
import { iniciarFolha, registrarTentativa } from './sessao.js'
import { salvarComentario } from './orientador.js'
import { registrarResultadoDeRevisao } from './revisoes-agendadas.js'

registrarTodosOsGeradores()

function bancoDeTeste() {
  return criarBancoParaTeste(`teste-alunos-${Math.random().toString(36).slice(2)}`)
}

describe('alunos', () => {
  it('cria um aluno com id, nome, idade e ícone, e consegue recuperá-lo', async () => {
    const banco = bancoDeTeste()
    const aluno = await criarAluno({ nomeExibicao: 'Ana', idade: 7, avatarIcone: '🌻' }, banco)
    expect(aluno.id).toBeTruthy()
    expect(aluno.criadoEm).toBeTruthy()

    const recuperado = await obterAluno(aluno.id, banco)
    expect(recuperado).toEqual(aluno)
    banco.close()
  })

  it('lista todos os alunos criados', async () => {
    const banco = bancoDeTeste()
    await criarAluno({ nomeExibicao: 'Ana', idade: 7, avatarIcone: '🌻' }, banco)
    await criarAluno({ nomeExibicao: 'Bia', idade: 30, avatarIcone: '🌸' }, banco)
    const alunos = await listarAlunos(banco)
    expect(alunos).toHaveLength(2)
    banco.close()
  })

  it('removerAluno apaga o aluno e tudo relacionado a ele (progresso, folhas, itens, comentários, revisões)', async () => {
    const banco = bancoDeTeste()
    const aluno = await criarAluno({ nomeExibicao: 'Ana', idade: 7, avatarIcone: '🌻' }, banco)

    await obterOuCriarProgresso(aluno.id, 'matematica', banco)
    const fase = await import('../curriculo/loader.js').then((m) => m.carregarFase('matematica', 1))
    const bloco = fase.niveis[0]!.blocos[0]!
    const { folha, itens } = await iniciarFolha(aluno.id, bloco, 1, 'matematica', banco)
    await registrarTentativa(itens[0]!, '1', true, 5, banco)
    await salvarComentario(aluno.id, 'Muito bem!', banco)
    await registrarResultadoDeRevisao(aluno.id, bloco.id, true, banco)

    await removerAluno(aluno.id, banco)

    expect(await obterAluno(aluno.id, banco)).toBeUndefined()
    expect(await banco.progressoDisciplina.where('alunoId').equals(aluno.id).count()).toBe(0)
    expect(await banco.folhas.where('alunoId').equals(aluno.id).count()).toBe(0)
    expect(await banco.itens.where('folhaId').equals(folha.id).count()).toBe(0)
    expect(await banco.tentativas.count()).toBe(0)
    expect(await banco.comentariosOrientador.where('alunoId').equals(aluno.id).count()).toBe(0)
    expect(await banco.revisoesAgendadas.where('alunoId').equals(aluno.id).count()).toBe(0)
    banco.close()
  })
})
