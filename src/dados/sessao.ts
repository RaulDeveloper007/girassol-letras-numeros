// Persistência de uma sessão de estudo (Folha -> Itens -> Tentativas).
// A geração dos itens em si continua vindo do motor de geração
// (src/geracao/montar-folha.ts); aqui só gravamos o resultado.
import { createId } from '../generators/shared/id.js'
import type { BlocoDeclarado, DisciplinaId } from '../curriculo/tipos.js'
import { montarFolha } from '../geracao/montar-folha.js'
import { obterBanco, type BancoPassoCerto } from './banco.js'
import type { Folha, Item, Tentativa } from './tipos.js'

export interface FolhaIniciada {
  folha: Folha
  itens: Item[]
}

export async function iniciarFolha(
  alunoId: string,
  bloco: BlocoDeclarado,
  quantidadeItens: number,
  disciplina: DisciplinaId,
  banco: BancoPassoCerto = obterBanco()
): Promise<FolhaIniciada> {
  const folhasAnteriores = await banco.folhas.where('[alunoId+blocoId]').equals([alunoId, bloco.id]).toArray()
  const ultimaFolha = folhasAnteriores.sort((a, b) => b.numeroDaTentativaNoBloco - a.numeroDaTentativaNoBloco)[0]
  const assinaturaAnterior = ultimaFolha ? await obterAssinaturaDaFolha(ultimaFolha.id, banco) : null

  const { itens: itensGerados } = montarFolha({ bloco, quantidadeItens, assinaturaParaEvitar: assinaturaAnterior })

  const folha: Folha = {
    id: createId(),
    alunoId,
    disciplina,
    blocoId: bloco.id,
    numeroDaTentativaNoBloco: (ultimaFolha?.numeroDaTentativaNoBloco ?? 0) + 1,
    itensIds: [],
    iniciadaEm: new Date().toISOString(),
    finalizadaEm: null,
    tempoPadraoSegundos: bloco.tempoPadraoSegundos,
    tempoGastoSegundos: null,
    notaPrimeiraTentativa: null,
    cicloDeRefazer: { ativo: false, itensPendentesIds: [] },
  }

  const itens: Item[] = itensGerados.map((itemGerado) => ({
    id: createId(),
    folhaId: folha.id,
    tipo: itemGerado.tipo,
    enunciado: itemGerado.enunciado,
    dados: itemGerado.dados,
    gabarito: itemGerado.gabarito,
    respostaPrimeiraTentativaId: null,
    respostaFinalId: null,
  }))
  folha.itensIds = itens.map((item) => item.id)

  await banco.transaction('rw', [banco.folhas, banco.itens], async () => {
    await banco.folhas.put(folha)
    await banco.itens.bulkPut(itens)
  })

  return { folha, itens }
}

/**
 * Teste de conclusão de nível: uma folha com 1 item de CADA bloco do
 * nível (não N itens de um só bloco, como numa folha normal). blocoId
 * guarda o bloco que disparou o teste (o último do nível), só como
 * referência -- a cobertura real está nos itens, um por bloco.
 */
export async function iniciarTesteDeConclusao(
  alunoId: string,
  blocosDoNivel: BlocoDeclarado[],
  blocoQueDisparouId: string,
  disciplina: DisciplinaId,
  banco: BancoPassoCerto = obterBanco()
): Promise<FolhaIniciada> {
  const itensGerados = blocosDoNivel.map((bloco) => montarFolha({ bloco, quantidadeItens: 1 }).itens[0]!)

  const folha: Folha = {
    id: createId(),
    alunoId,
    disciplina,
    blocoId: blocoQueDisparouId,
    numeroDaTentativaNoBloco: 0, // teste de conclusão não conta pro domínio de um bloco específico
    itensIds: [],
    iniciadaEm: new Date().toISOString(),
    finalizadaEm: null,
    tempoPadraoSegundos: blocosDoNivel.reduce((soma, bloco) => soma + bloco.tempoPadraoSegundos, 0),
    tempoGastoSegundos: null,
    notaPrimeiraTentativa: null,
    cicloDeRefazer: { ativo: false, itensPendentesIds: [] },
  }

  const itens: Item[] = itensGerados.map((itemGerado) => ({
    id: createId(),
    folhaId: folha.id,
    tipo: itemGerado.tipo,
    enunciado: itemGerado.enunciado,
    dados: itemGerado.dados,
    gabarito: itemGerado.gabarito,
    respostaPrimeiraTentativaId: null,
    respostaFinalId: null,
  }))
  folha.itensIds = itens.map((item) => item.id)

  await banco.transaction('rw', [banco.folhas, banco.itens], async () => {
    await banco.folhas.put(folha)
    await banco.itens.bulkPut(itens)
  })

  return { folha, itens }
}

async function obterAssinaturaDaFolha(folhaId: string, banco: BancoPassoCerto): Promise<string> {
  const itens = await banco.itens.where('folhaId').equals(folhaId).toArray()
  return itens.map((item) => `${item.enunciado}::${JSON.stringify(item.gabarito)}`).join('|')
}

export async function registrarTentativa(
  item: Item,
  resposta: unknown,
  corretoNaHora: boolean,
  tempoGastoSegundos: number,
  banco: BancoPassoCerto = obterBanco()
): Promise<Tentativa> {
  const tentativasAnteriores = await banco.tentativas.where('itemId').equals(item.id).count()

  const tentativa: Tentativa = {
    id: createId(),
    itemId: item.id,
    numero: tentativasAnteriores + 1,
    resposta,
    corretoNaHora,
    tempoGastoSegundos,
    criadoEm: new Date().toISOString(),
  }

  await banco.transaction('rw', [banco.tentativas, banco.itens], async () => {
    await banco.tentativas.put(tentativa)
    const atualizacao: Partial<Item> = { respostaFinalId: tentativa.id }
    if (tentativa.numero === 1) atualizacao.respostaPrimeiraTentativaId = tentativa.id
    await banco.itens.update(item.id, atualizacao)
  })

  return tentativa
}

export async function finalizarFolha(
  folhaId: string,
  dados: { notaPrimeiraTentativa: number; tempoGastoSegundos: number; houveRefazer: boolean; itensQueFalharamPrimeiro: string[] },
  banco: BancoPassoCerto = obterBanco()
): Promise<void> {
  await banco.folhas.update(folhaId, {
    finalizadaEm: new Date().toISOString(),
    notaPrimeiraTentativa: dados.notaPrimeiraTentativa,
    tempoGastoSegundos: dados.tempoGastoSegundos,
    cicloDeRefazer: { ativo: dados.houveRefazer, itensPendentesIds: dados.itensQueFalharamPrimeiro },
  })
}

export function listarFolhasPorBloco(alunoId: string, blocoId: string, banco: BancoPassoCerto = obterBanco()): Promise<Folha[]> {
  return banco.folhas.where('[alunoId+blocoId]').equals([alunoId, blocoId]).toArray()
}

function mesmoDiaLocal(isoA: string, data: Date): boolean {
  const a = new Date(isoA)
  return a.getFullYear() === data.getFullYear() && a.getMonth() === data.getMonth() && a.getDate() === data.getDate()
}

/**
 * Quantas folhas o aluno já concluiu HOJE nesta disciplina -- é o número
 * que a tela de prática compara com a cota diária (ver
 * progressao/cota-diaria.ts) pra decidir se ainda pode praticar ou se o
 * trabalho de hoje já acabou. Conta teste de conclusão e reforço também:
 * pro método, qualquer folha concluída é "um passo de hoje".
 */
export async function contarFolhasFinalizadasHoje(
  alunoId: string,
  disciplina: DisciplinaId,
  agora: Date = new Date(),
  banco: BancoPassoCerto = obterBanco()
): Promise<number> {
  const folhasDoAluno = await banco.folhas.where('alunoId').equals(alunoId).toArray()
  return folhasDoAluno.filter(
    (folha) => folha.disciplina === disciplina && folha.finalizadaEm !== null && mesmoDiaLocal(folha.finalizadaEm, agora)
  ).length
}
