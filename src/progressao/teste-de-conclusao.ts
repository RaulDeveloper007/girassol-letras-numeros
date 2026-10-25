import type { ItemDeTeste } from './tipos.js'

export type ResultadoTeste = 'aprovado' | 'reprovado'

/**
 * Teste de conclusão de nível: aprovado só com 100% (mesmo critério de
 * domínio das folhas). Reprovado -> os itens errados viram a base do bloco
 * de revisão direcionado.
 */
export function avaliaTesteDeConclusao(itens: ItemDeTeste[]): ResultadoTeste {
  if (itens.length === 0) throw new Error('Teste de conclusão sem itens.')
  return itens.every((item) => item.correto) ? 'aprovado' : 'reprovado'
}

export function itensErrados(itens: ItemDeTeste[]): string[] {
  return itens.filter((item) => !item.correto).map((item) => item.id)
}

/**
 * Blocos distintos que tiveram pelo menos um item errado no teste de
 * conclusão, na ordem em que apareceram -- essa lista vira a fila de
 * reforço direcionado que o aluno precisa zerar antes de tentar o teste de
 * conclusão de novo (ver orquestracao do reforço em praticar.js). Reprovar
 * o teste nunca deveria mandar o aluno de volta pra praticar TODOS os
 * blocos do nível -- só os que ele realmente errou.
 */
export function blocosComErro(itens: ItemDeTeste[]): string[] {
  const vistos = new Set<string>()
  const ordem: string[] = []
  for (const item of itens) {
    if (item.correto || !item.blocoId || vistos.has(item.blocoId)) continue
    vistos.add(item.blocoId)
    ordem.push(item.blocoId)
  }
  return ordem
}
