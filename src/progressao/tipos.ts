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
  // Opcional: só precisa ser informado quando o chamador quer apurar
  // blocosComErro (reforço direcionado). avaliaTesteDeConclusao/itensErrados
  // não dependem dele.
  blocoId?: string
}

export type { CriterioDominio }
