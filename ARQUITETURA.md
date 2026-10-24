# Arquitetura — Etapa 2

Decisões já tomadas antes deste documento (ver conversa de aprovação):

- **Nome**: o app passa a se chamar **Passo Certo**.
- **Nomenclatura de nível**: `Fase X · Nível Y` — numérico, sem letras/códigos
  (nada parecido com 7A/6A/A/B do Kumon).
- **Migração**: os dados salvos no app anterior ("Girassol das Letras e
  Números", schema v1) **não são preservados**. Todo perfil recomeça do zero
  no novo schema, com diagnóstico.
- **TypeScript**: só os motores novos (currículo, geração, correção,
  progressão, fala) nascem em TypeScript. UI/componentes que já funcionam
  (canvas, teclado, casca do PWA) continuam em JavaScript por enquanto.

---

## 1. Arquitetura alvo

```
┌─────────────────────────────────────────────────────────────┐
│ Casca PWA (JS, reaproveitada)                                │
│ Vite · manifest · service worker · router · telas/UI         │
└───────────────┬─────────────────────────────────────────────┘
                 │ chama
┌───────────────▼─────────────────────────────────────────────┐
│ Motores (TypeScript, novos)                                  │
│                                                                │
│  curriculo/     carrega o currículo declarativo (JSON),      │
│                 por disciplina e por fase, sob demanda       │
│                                                                │
│  progressao/    domínio antes de avançar, teste de conclusão,│
│                 revisão espaçada, tarefa do dia               │
│                                                                │
│  geracao/       geradores procedurais por habilidade,        │
│                 com semente determinística                    │
│                                                                │
│  correcao/      numérica/simbólica · textual · rubrica ·     │
│                 fala (delega ao serviço de voz)               │
│                                                                │
│  voz/           3 camadas de reconhecimento + síntese,        │
│                 expõe uma API única pra UI (não importa qual  │
│                 camada respondeu)                              │
└───────────────┬─────────────────────────────────────────────┘
                 │ lê/escreve
┌───────────────▼─────────────────────────────────────────────┐
│ Dados (Dexie, TypeScript, schema v2)                          │
└─────────────────────────────────────────────────────────────┘
```

**Por que separar assim**: a UI não precisa saber se uma resposta foi
corrigida por comparação simbólica ou se a fala caiu na Camada 1, 2 ou 3 do
reconhecimento — ela só chama `correcao.avaliar(item, resposta)` ou
`voz.reconhecer(idioma, itemEsperado)` e recebe um resultado no mesmo
formato. Isso também é o que permite testar os motores com Vitest sem
precisar de navegador/DOM.

**Carregamento sob demanda** (crítico pro Redmi 9): nada de currículo,
MathLive/KaTeX, modelo de voz em WASM (Camada 2) ou TensorFlow.js entra no
carregamento inicial. Cada um só é buscado quando a disciplina/fase/recurso
é efetivamente usado — mesmo padrão que já funciona hoje para o
reconhecimento de dígitos (import dinâmico, bundle principal continua leve).

**Service worker**: mantém a estratégia atual (HTML em network-first, JS/CSS
com hash em cache-first), e ganha uma cache própria para os recursos pesados
sob demanda (currículo por fase, modelos de voz), para que, uma vez
baixados, fiquem disponíveis offline sem precisar rebaixar.

---

## 2. Modelo de dados

Tipos em TypeScript (o que vai virar as tabelas do Dexie). Nomes em
português, conforme pedido no E2.

```ts
// --- Perfis e progresso ---------------------------------------------------

interface Aluno {
  id: string
  nomeExibicao: string      // só o primeiro nome
  avatarIcone: string
  criadoEm: string
}

type DisciplinaId = 'matematica' | 'portugues' | 'ingles'

interface ProgressoDisciplina {
  alunoId: string
  disciplina: DisciplinaId
  faseAtual: number
  nivelAtual: number
  blocoAtualId: string
  statusDiagnostico: 'pendente' | 'em-andamento' | 'concluido'
  ultimaAtividadeEm: string
}

// --- Currículo (metadados; o conteúdo pesado vive nos JSONs declarativos) -

interface Fase {
  disciplina: DisciplinaId
  numero: number
  titulo: string
}

interface Nivel {
  disciplina: DisciplinaId
  faseNumero: number
  numero: number
  titulo: string
}

interface Bloco {
  id: string
  disciplina: DisciplinaId
  faseNumero: number
  nivelNumero: number
  habilidade: string          // a ÚNICA variável que muda frente ao bloco anterior
  exemploResolvido: {
    enunciado: string
    passoAPasso: string[]
  }
  geradorId: string            // referência ao gerador procedural responsável
  parametrosGerador: Record<string, unknown>
  tempoPadraoSegundos: number
  criterioDominio: {
    folhasConsecutivas: number   // N, configurável pelo orientador
    acertoMinimo: 100            // sempre 100%, é o método
    dentroDoTempoPadrao: boolean
  }
  tiposDeItem: TipoItem[]
}

type TipoItem =
  | 'tracado-guiado' | 'reconhecimento-manuscrito' | 'selecao-imagem'
  | 'numerico' | 'simbolico' | 'textual'
  | 'escuta-escolha' | 'fala-repetir' | 'fala-leitura' | 'fala-resposta'
  | 'producao-livre'

// --- Sessão de estudo -------------------------------------------------------

interface Folha {
  id: string
  alunoId: string
  blocoId: string
  numeroDaTentativaNoBloco: number  // quantas folhas desse bloco o aluno já fez
  itensIds: string[]
  iniciadaEm: string
  finalizadaEm: string | null
  tempoPadraoSegundos: number
  notaPrimeiraTentativa: number | null  // % calculado só pela 1ª resposta de cada item
  cicloDeRefazer: {
    ativo: boolean
    itensPendentesIds: string[]
  }
}

interface Item {
  id: string
  folhaId: string
  tipo: TipoItem
  enunciado: string
  dados: Record<string, unknown>     // específico do gerador (ex.: operandos, frase-alvo)
  gabarito: unknown
  respostaPrimeiraTentativaId: string | null  // aponta pra Tentativa
  respostaFinalId: string | null
}

interface Tentativa {
  id: string
  itemId: string
  numero: number              // 1ª, 2ª, 3ª...
  resposta: unknown
  corretoNaHora: boolean
  tempoGastoSegundos: number
  criadoEm: string
}

interface Correcao {
  itemId: string
  metodo: 'numerico' | 'simbolico' | 'textual' | 'rubrica' | 'fala'
  correto: boolean
  detalhe?: string             // ex.: "forma equivalente aceita (2x+4 = 2(x+2))"
  revisadoPeloOrientador: boolean
}

interface TesteDeConclusao {
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

// --- Fala (nunca grava áudio — só o que a restrição permite) --------------

interface Audio {
  id: string
  itemId: string
  texto: string
  idioma: 'pt-BR' | 'en-US'
  velocidade: number
}

interface TentativaDeFala {
  id: string
  itemId: string
  numero: number                 // até 3 tentativas
  transcricao: string            // SÓ a transcrição; nunca o áudio
  idioma: 'pt-BR' | 'en-US'
  camadaUsada: 1 | 2 | 3
  similaridade: number           // distância de edição normalizada (0–1)
  aceito: boolean
  encaminhadoParaOrientador: boolean
  criadoEm: string
}

// --- Governança --------------------------------------------------------------

interface RegraDeAvanco {
  disciplina: DisciplinaId
  folhasConsecutivas: number
  toleranciaTempoPadrao: number  // ex.: 1.1 = até 10% acima do tempo padrão
}

interface RevisaoAgendada {
  alunoId: string
  blocoId: string
  proximaRevisaoEm: string
  intervaloAtualDias: number     // cresce a cada revisão bem-sucedida
}

interface ComentarioOrientador {
  id: string
  alunoId: string
  texto: string
  criadoEm: string
  lidoPeloAluno: boolean
}

interface ConfiguracoesOrientador {
  pinHash: string
  ultimoBackupEm: string | null
}
```

---

## 3. Currículo declarativo

**Formato: JSON** (não YAML — o navegador já sabe ler JSON nativamente, sem
precisar de nenhuma biblioteca nova; continua 100% declarativo, só muda a
sintaxe). Se preferir YAML mesmo assim, é só avisar.

**Um arquivo por fase**, carregado sob demanda:

```
src/curriculo/
├── matematica/
│   ├── fase-01.json
│   ├── fase-02.json
│   └── ... fase-17.json
├── portugues/
│   ├── fase-01.json
│   └── ... fase-13.json
└── ingles/
    ├── fase-01.json
    └── ... fase-10.json
```

Formato de cada arquivo (exemplo ilustrativo, não o conteúdo real — isso é
Etapa 8/9/10):

```json
{
  "disciplina": "matematica",
  "faseNumero": 2,
  "titulo": "Adição",
  "niveis": [
    {
      "numero": 1,
      "titulo": "Adição +1 a +10",
      "blocos": [
        {
          "id": "mat-f02-n01-b01",
          "habilidade": "soma de 1 dígito, sem reserva, resultado até 10",
          "exemploResolvido": {
            "enunciado": "3 + 4 = ?",
            "passoAPasso": [
              "Comece no 3.",
              "Conte mais 4 pra frente: 4, 5, 6, 7.",
              "3 + 4 = 7."
            ]
          },
          "geradorId": "matematica.adicao",
          "parametrosGerador": { "maxA": 9, "maxB": 1, "comReserva": false },
          "tempoPadraoSegundos": 420,
          "criterioDominio": { "folhasConsecutivas": 3, "acertoMinimo": 100, "dentroDoTempoPadrao": true },
          "tiposDeItem": ["numerico"]
        }
      ]
    }
  ]
}
```

Isso cobre o requisito de "passos mínimos" de forma literal: cada bloco
muda **um parâmetro** em relação ao anterior (aqui, `maxB` sobe de bloco pra
bloco antes de introduzir `comReserva: true`).

---

## 4. Fluxo de dados (resumo)

```
Diagnóstico (Etapa 7)
   → posiciona Aluno em Fase/Nível/Bloco inicial (nunca pela idade)
Bloco atual (lido do currículo declarativo)
   → Motor de Geração cria uma Folha com Itens
Aluno responde
   → traçado/reconhecimento manuscrito/seleção (iniciais)
   → teclado numérico/matemático/texto (intermediário/avançado)
   → fala, quando o tipo de item exige (nunca pulável)
Motor de Correção avalia cada Item
   → nota da 1ª tentativa é a que fica registrada
   → ciclo de refazer: só os itens errados, até 100%
Critério de domínio atingido em N folhas consecutivas?
   → sim: avança de bloco/nível
   → não: repete o bloco com uma folha NOVA (gerada de novo, não a mesma)
Fim do nível → Teste de Conclusão
   → aprovado: avança de nível
   → reprovado: gera Bloco de Revisão direcionado aos itens errados
Revisão espaçada
   → blocos dominados reaparecem em folhas de manutenção, intervalo crescente
```

---

## 5. O que muda em relação ao app atual

| Hoje (Girassol) | Passo Certo |
|---|---|
| Nível sobe com 1 folha 100% OU 3 folhas ≥80% | Só sobe com N folhas **consecutivas em 100%**, dentro do tempo padrão |
| Nível inicial pela idade | Nível inicial só pelo teste diagnóstico |
| Feedback por item, sem ciclo de refazer | Corrige, e o aluno refaz só o que errou até 100% |
| 6 estágios fixos por disciplina (teto) | Currículo declarativo, sem teto, carregado por fase |
| Sem exemplo resolvido | Toda folha nova começa com um exemplo resolvido |
| Cronômetro sem referência | Cronômetro com tempo padrão por bloco, cor verde/amarelo/vermelho |
| Sem teste de conclusão nem revisão espaçada | Os dois fazem parte do ciclo normal |
| Sem fala | Fala obrigatória (Português Fases 3–7/11–12, Inglês todas) |

---

Aguardando sua aprovação para seguir à **Etapa 3** (motor de currículo:
carregador declarativo + motor de progressão).
