import type { CriterioDominio } from '../curriculo/tipos.js'

export interface ResultadoFolha {
  notaPrimeiraTentativa: number // 0–100
  tempoSegundos: number
  tempoPadraoSegundos: number
}

export type ProximoPasso =
  | { tipo: 'repetir-bloco' }
  | { tipo: 'avancar-bloco'; proximoBlocoId: string }
  | { tipo: 'teste-de-conclusao' }

export interface ItemDeTeste {
  id: string
  correto: boolean
}

export type { CriterioDominio }
