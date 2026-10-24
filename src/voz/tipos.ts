export type CamadaReconhecimento = 1 | 2 | 3
export type IdiomaVoz = 'pt-BR' | 'en-US'

export interface ResultadoReconhecimento {
  transcricao: string
  camada: CamadaReconhecimento
}

export interface ReconhecedorDeFala {
  disponivel(): boolean
  reconhecer(idioma: IdiomaVoz): Promise<ResultadoReconhecimento>
}
