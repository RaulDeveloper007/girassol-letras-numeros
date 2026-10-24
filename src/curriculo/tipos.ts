// Tipos do currículo declarativo (o conteúdo dos arquivos JSON em
// src/curriculo/<disciplina>/fase-NN.json). Ver ARQUITETURA.md seção 3.

export type DisciplinaId = 'matematica' | 'portugues' | 'ingles'

export type TipoItem =
  | 'tracado-guiado'
  | 'reconhecimento-manuscrito'
  | 'selecao-imagem'
  | 'numerico'
  | 'simbolico'
  | 'textual'
  | 'escuta-escolha'
  | 'fala-repetir'
  | 'fala-leitura'
  | 'fala-resposta'
  | 'producao-livre'

export interface ExemploResolvido {
  enunciado: string
  passoAPasso: string[]
}

export interface CriterioDominio {
  folhasConsecutivas: number
  acertoMinimo: 100
  dentroDoTempoPadrao: boolean
}

export interface BlocoDeclarado {
  id: string
  habilidade: string
  exemploResolvido: ExemploResolvido
  geradorId: string
  parametrosGerador: Record<string, unknown>
  tempoPadraoSegundos: number
  criterioDominio: CriterioDominio
  tiposDeItem: TipoItem[]
}

export interface NivelDeclarado {
  numero: number
  titulo: string
  blocos: BlocoDeclarado[]
}

export interface FaseArquivo {
  disciplina: DisciplinaId
  faseNumero: number
  titulo: string
  niveis: NivelDeclarado[]
}
