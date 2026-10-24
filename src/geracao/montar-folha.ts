import type { BlocoDeclarado } from '../curriculo/tipos.js'
import { criarRng, semeadorAleatorio } from './aleatorio.js'
import { obterGerador } from './registro.js'
import type { ItemGerado } from './tipos.js'

export interface FolhaGerada {
  itens: ItemGerado[]
  assinatura: string
}

function assinarFolha(itens: readonly ItemGerado[]): string {
  return itens.map((item) => `${item.enunciado}::${JSON.stringify(item.gabarito)}`).join('|')
}

function montarUmaVez(bloco: BlocoDeclarado, quantidadeItens: number, tentativasMaximasPorItem: number): FolhaGerada {
  const gerar = obterGerador(bloco.geradorId)
  const rng = criarRng(semeadorAleatorio())
  const enunciadosUsados = new Set<string>()
  const itens: ItemGerado[] = []

  for (let i = 0; i < quantidadeItens; i++) {
    let item: ItemGerado
    let tentativas = 0

    // Tenta não repetir o mesmo enunciado duas vezes dentro da mesma folha;
    // em blocos com pouquíssima variação possível, aceita repetir depois de
    // algumas tentativas em vez de travar.
    do {
      item = gerar(rng, bloco.parametrosGerador)
      tentativas++
    } while (enunciadosUsados.has(item.enunciado) && tentativas < tentativasMaximasPorItem)

    enunciadosUsados.add(item.enunciado)
    itens.push(item)
  }

  return { itens, assinatura: assinarFolha(itens) }
}

export interface OpcoesMontagem {
  bloco: BlocoDeclarado
  quantidadeItens: number
  assinaturaParaEvitar?: string | null
  tentativasMaximasPorItem?: number
  tentativasMaximasDeFolha?: number
}

/**
 * Monta uma folha de itens para um bloco. Evita repetir a assinatura da
 * folha anterior (mesmo bloco) tentando de novo algumas vezes antes de
 * desistir e aceitar a repetição.
 */
export function montarFolha(opcoes: OpcoesMontagem): FolhaGerada {
  const quantidadeItens = opcoes.quantidadeItens
  const tentativasMaximasPorItem = opcoes.tentativasMaximasPorItem ?? 8
  const tentativasMaximasDeFolha = opcoes.tentativasMaximasDeFolha ?? 5

  let resultado = montarUmaVez(opcoes.bloco, quantidadeItens, tentativasMaximasPorItem)
  let tentativas = 1

  while (
    opcoes.assinaturaParaEvitar &&
    resultado.assinatura === opcoes.assinaturaParaEvitar &&
    tentativas < tentativasMaximasDeFolha
  ) {
    resultado = montarUmaVez(opcoes.bloco, quantidadeItens, tentativasMaximasPorItem)
    tentativas++
  }

  return resultado
}
