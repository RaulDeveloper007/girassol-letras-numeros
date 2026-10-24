import type { TipoItem } from '../curriculo/tipos.js'
import type { Rng } from './aleatorio.js'

export interface ItemGerado {
  tipo: TipoItem
  enunciado: string
  dados: Record<string, unknown>
  gabarito: unknown
}

export type FuncaoGeradora = (rng: Rng, parametros: Record<string, unknown>) => ItemGerado
