// Modelo de dados do Dexie v2 -- ver ARQUITETURA.md seção 2. Nomes em
// português, igual ao resto dos motores novos (curriculo/geracao/correcao).
import type { DisciplinaId, TipoItem } from '../curriculo/tipos.js'

export interface Aluno {
  id: string
  nomeExibicao: string // só o primeiro nome
  idade: number
  avatarIcone: string
  criadoEm: string
}

export interface ProgressoDisciplina {
  alunoId: string
  disciplina: DisciplinaId
  faseAtual: number
  nivelAtual: number
  blocoAtualId: string
  statusDiagnostico: 'pendente' | 'em-andamento' | 'concluido'
  ultimaAtividadeEm: string
  // Blocos do nível atual que o teste de conclusão apontou como errados --
  // o aluno precisa zerá-los (uma folha 100% correta em cada) antes de
  // poder tentar o teste de conclusão de novo. Vazio fora desse fluxo.
  blocosDeReforcoPendentes: string[]
}

export interface Folha {
  id: string
  alunoId: string
  disciplina: DisciplinaId
  blocoId: string
  numeroDaTentativaNoBloco: number
  itensIds: string[]
  iniciadaEm: string
  finalizadaEm: string | null
  tempoPadraoSegundos: number
  tempoGastoSegundos: number | null
  notaPrimeiraTentativa: number | null
  cicloDeRefazer: {
    ativo: boolean
    itensPendentesIds: string[]
  }
}

export interface Item {
  id: string
  folhaId: string
  tipo: TipoItem
  enunciado: string
  dados: Record<string, unknown>
  gabarito: unknown
  respostaPrimeiraTentativaId: string | null
  respostaFinalId: string | null
}

export interface Tentativa {
  id: string
  itemId: string
  numero: number
  resposta: unknown
  corretoNaHora: boolean
  tempoGastoSegundos: number
  criadoEm: string
}

export interface Correcao {
  itemId: string
  metodo: 'numerico' | 'simbolico' | 'textual' | 'rubrica' | 'fala'
  correto: boolean
  detalhe?: string
  revisadoPeloOrientador: boolean
}

export interface TesteDeConclusao {
  id: string
  alunoId: string
  disciplina: DisciplinaId
  faseNumero: number
  nivelNumero: number
  itensIds: string[]
  resultado: 'aprovado' | 'reprovado' | 'em-andamento'
  blocoDeRevisaoGeradoId: string | null
  finalizadoEm: string | null
}

export interface TentativaDeFala {
  id: string
  itemId: string
  numero: number
  transcricao: string // SÓ a transcrição; nunca o áudio
  idioma: 'pt-BR' | 'en-US'
  camadaUsada: 1 | 2 | 3
  similaridade: number
  aceito: boolean
  encaminhadoParaOrientador: boolean
  criadoEm: string
}

export interface RegraDeAvanco {
  disciplina: DisciplinaId
  folhasConsecutivas: number
  toleranciaTempoPadrao: number
}

export interface RevisaoAgendada {
  alunoId: string
  blocoId: string
  proximaRevisaoEm: string
  intervaloAtualDias: number
}

export interface ComentarioOrientador {
  id: string
  alunoId: string
  texto: string
  criadoEm: string
  lidoPeloAluno: boolean
}

/** Linha única (singleton) -- "id" fixo só pra ter uma chave primária no Dexie. */
export interface ConfiguracoesOrientador {
  id: 'singleton'
  pinHash: string | null
  ultimoBackupEm: string | null
}
