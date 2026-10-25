// Liga a decisão pura (decidirProximoPasso) ao currículo real: o loader
// (curriculo/loader.ts) só sabe qual é o "próximo bloco da sequência" --
// não sabe que uma troca de NÍVEL precisa passar por um teste de conclusão
// antes. Essa política mora aqui, não no loader (que fica genérico) nem no
// motor puro de decisão (que não conhece a estrutura do currículo).
import { buscarBloco, proximoBlocoId } from '../curriculo/loader.js'
import type { FaseArquivo } from '../curriculo/tipos.js'
import { decidirProximoPasso } from './proximo-passo.js'
import type { CriterioDominio, ProximoPasso, ResultadoFolha } from './tipos.js'

function cruzaFronteiraDeNivel(fase: FaseArquivo, blocoAtualId: string, proximoId: string): boolean {
  const atual = buscarBloco(fase, blocoAtualId)
  const proximo = buscarBloco(fase, proximoId)
  if (!atual || !proximo) return false
  return atual.nivel.numero !== proximo.nivel.numero
}

export function decidirProximoPassoNoCurriculo(params: {
  fase: FaseArquivo
  blocoAtualId: string
  folhasRecentes: ResultadoFolha[]
  criterio: CriterioDominio
}): ProximoPasso {
  const idBruto = proximoBlocoId(params.fase, params.blocoAtualId)
  const cruzaNivel = idBruto === null || cruzaFronteiraDeNivel(params.fase, params.blocoAtualId, idBruto)

  return decidirProximoPasso({
    folhasRecentes: params.folhasRecentes,
    criterio: params.criterio,
    proximoBlocoId: cruzaNivel ? null : idBruto,
  })
}
