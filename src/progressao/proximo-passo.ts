import { avaliaCriterioDominio } from './dominio.js'
import type { CriterioDominio, ProximoPasso, ResultadoFolha } from './tipos.js'

export function decidirProximoPasso(params: {
  folhasRecentes: ResultadoFolha[]
  criterio: CriterioDominio
  proximoBlocoId: string | null // null = este é o último bloco do nível
}): ProximoPasso {
  const dominou = avaliaCriterioDominio(params.folhasRecentes, params.criterio)

  if (!dominou) return { tipo: 'repetir-bloco' }
  if (params.proximoBlocoId) return { tipo: 'avancar-bloco', proximoBlocoId: params.proximoBlocoId }
  return { tipo: 'teste-de-conclusao' }
}
