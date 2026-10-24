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
