import Dexie, { type Table } from 'dexie'
import type {
  Aluno,
  ComentarioOrientador,
  ConfiguracoesOrientador,
  Correcao,
  Folha,
  Item,
  ProgressoDisciplina,
  RegraDeAvanco,
  RevisaoAgendada,
  TarefaDiaria,
  Tentativa,
  TentativaDeFala,
  TesteDeConclusao,
} from './tipos.js'

/**
 * Banco de dados do aluno, 100% local (IndexedDB via Dexie) -- nada sai do
 * aparelho a não ser por exportação manual (ver dados/backup.ts). Nenhuma
 * tabela grava áudio, só transcrição (ver TentativaDeFala).
 */
export class BancoPassoCerto extends Dexie {
  alunos!: Table<Aluno, string>
  progressoDisciplina!: Table<ProgressoDisciplina, [string, string]>
  folhas!: Table<Folha, string>
  itens!: Table<Item, string>
  tentativas!: Table<Tentativa, string>
  correcoes!: Table<Correcao, string>
  testesDeConclusao!: Table<TesteDeConclusao, string>
  tentativasDeFala!: Table<TentativaDeFala, string>
  regrasDeAvanco!: Table<RegraDeAvanco, string>
  revisoesAgendadas!: Table<RevisaoAgendada, [string, string]>
  comentariosOrientador!: Table<ComentarioOrientador, string>
  configuracoesOrientador!: Table<ConfiguracoesOrientador, string>
  tarefasDiarias!: Table<TarefaDiaria, [string, string, string]>

  constructor(nome = 'passo-certo-db') {
    super(nome)

    this.version(1).stores({
      alunos: 'id',
      progressoDisciplina: '[alunoId+disciplina], alunoId',
      folhas: 'id, alunoId, blocoId, [alunoId+blocoId]',
      itens: 'id, folhaId',
      tentativas: 'id, itemId',
      correcoes: 'itemId',
      testesDeConclusao: 'id, [alunoId+disciplina]',
      tentativasDeFala: 'id, itemId',
      regrasDeAvanco: 'disciplina',
      revisoesAgendadas: '[alunoId+blocoId], alunoId, proximaRevisaoEm',
      comentariosOrientador: 'id, alunoId',
      configuracoesOrientador: 'id',
    })

    // v2: tarefa diária (bloquinho fixo por dia -- ver dados/tipos.ts). Só
    // acrescenta uma tabela nova; nenhum dado existente precisa de
    // migração, então as tabelas da v1 não precisam ser redeclaradas.
    this.version(2).stores({
      tarefasDiarias: '[alunoId+disciplina+data], alunoId',
    })
  }
}

let instancia: BancoPassoCerto | null = null

/** Uma única instância compartilhada por toda a sessão do app. */
export function obterBanco(): BancoPassoCerto {
  if (!instancia) instancia = new BancoPassoCerto()
  return instancia
}

/** Só pros testes conseguirem partir de um banco isolado e limpo. */
export function criarBancoParaTeste(nome: string): BancoPassoCerto {
  return new BancoPassoCerto(nome)
}
