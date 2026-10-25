# 02 — Inventário funcional (Passo Certo)

Levantado a partir do código real em `main` (commit `987ea30`), não de uma
sessão navegada no Kumon Connect — não há conta legítima disponível para
isso (ver observação de acesso no fim deste documento). A referência de
comportamento é o método Kumon tal como descrito publicamente (passos
mínimos, domínio antes do avanço, tempo padrão, folha diária), não a
interface do app proprietário.

## Fluxos ponta a ponta

| Fluxo | Telas envolvidas | Observação |
|---|---|---|
| Cadastro de aluno | `profile-select` → `create-profile` | Sem conta/login; perfil local por aparelho |
| Diagnóstico de posicionamento | `diagnostico` | Busca binária adaptativa sobre os blocos da disciplina; converge em O(log N) perguntas + mínimo de confirmação |
| Tarefa diária (prática) | `student-home` → `praticar` | Ver F-14 — ainda em revisão (PR #3) |
| Correção e ciclo de refazer | `praticar` (interno) | Erro não passa para o próximo item isolado — vira fila de refazer ao fim da passada |
| Teste de conclusão de nível | `praticar` (modo teste) | Disparado automaticamente pelo motor de progressão, não pelo aluno |
| Acompanhamento do responsável | `guardian` → `pin-gate` → `dashboard` | PIN obrigatório após o primeiro cadastro |
| Backup/restauração | `dashboard` (seção Backup) | Exportação/importação manual em JSON; único jeito de dado sair do aparelho |
| Verificação de voz | `voice-check` | Diagnóstico técnico, não pedagógico — acessível pelo painel do responsável |

## Papéis de usuário

- **Aluno**: usa `student-home`/`praticar`; sem acesso ao PIN nem às configurações.
- **Responsável (orientador)**: acesso via PIN a progresso, filas de revisão, comentários e configuração da tarefa diária.

## Inventário por funcionalidade

| ID | Funcionalidade | Descrição | Tela(s) | Regra de negócio observada | Prioridade |
|---|---|---|---|---|---|
| F-01 | Currículo declarativo | 3 disciplinas em arquivos JSON por fase/nível/bloco | — (dados) | Matemática: 17 fases (contagem → cálculo diferencial e integral). Português: 13 fases (sílabas → produção escrita). Inglês: 10 fases (Pré-A1 → B2/C1) | MVP |
| F-02 | Exemplo resolvido | Cada bloco carrega um exemplo com passo a passo, mostrado antes dos itens | `praticar` | Não aparece no teste de conclusão (mistura blocos) | MVP |
| F-03 | Geração procedural de itens | Um gerador por habilidade (ex. `adicao.ts`, `fracao-operacao.ts`, `traducao.ts`) | — (motor) | Evita repetir a assinatura da folha anterior do mesmo bloco | MVP |
| F-04 | Folha com N itens | Sessão de prática com item a dia (padrão: 5 itens; produção livre: 1) | `praticar` | Avanço automático após cada resposta confirmada — sem botão "Próximo" manual | MVP |
| F-05 | Ciclo de refazer | Itens errados na passada voltam numa fila ao final da folha | `praticar` | A nota registrada é da **primeira tentativa**; o refazer garante 100% final, não a nota | MVP |
| F-06 | Cronômetro com tempo padrão | Cada bloco define `tempoPadraoSegundos`; exibido durante a folha | `praticar` (componente `cronometro-padrao`) | Comparado ao tempo gasto só na decisão de domínio, não trava a folha | MVP |
| F-07 | Correção numérica/simbólica | Avaliação exata (`numerico`) e por equivalência algébrica (`simbolico`) | — (motor `correcao/`) | Simbólico aceita formas equivalentes (ex. `2(x+1)` = `2x+2`) | MVP |
| F-08 | Correção textual | Normalização + variantes aceitas para respostas em português/inglês | — (motor `correcao/textual.ts`) | Regras de tolerância configuráveis por item (`regrasTextuais`) | MVP |
| F-09 | Correção por rubrica | Produção livre nunca tem gabarito automático | `praticar`, `dashboard` | Sempre enviada para revisão do responsável; nunca avança nível automaticamente | MVP |
| F-10 | Reconhecimento de fala | Itens de "escutar e repetir"/leitura em voz alta avaliados por similaridade de transcrição | `praticar` (componente `microfone`) | Só Camada 1 (Web Speech API) implementada; Camadas 2 (offline/WASM) e 3 (online com aviso) **ainda não existem** | MVP (parcial) |
| F-11 | Reconhecimento de escrita | Dígitos e símbolos matemáticos manuscritos (`,`, `/`, `-`) reconhecidos por modelo treinado on-device | `praticar` (botão "reconhecer escrita") | Cobre **só matemática** — não há reconhecimento de letras manuscritas para português/inglês | MVP (parcial) |
| F-12 | Domínio antes de avançar | N folhas consecutivas com 100% na primeira tentativa, dentro do tempo padrão (tolerância 1,2×) | — (motor `progressao/dominio.ts`) | Qualquer folha fora do critério reinicia a contagem da janela | MVP |
| F-13 | Teste de conclusão de nível | 1 item de cada bloco do nível; exige 100% | `praticar` (modo teste) | Reprovado não penaliza — só continua a prática normal | MVP |
| F-14 | Tarefa diária com bloqueio | Quantidade fixa de folhas por disciplina por dia; disciplina trava até o dia seguinte | `student-home`, `praticar` | **Em revisão, PR #3** — ver matriz de paridade | MVP |
| F-15 | Revisão espaçada | Agendamento tipo Leitner (1/3/7/14/30/60 dias) por bloco já dominado | `dashboard` (lista "devida hoje") | Erro na revisão volta ao intervalo inicial | V2 |
| F-16 | Diagnóstico adaptativo | Define o nível inicial real do aluno, nunca pela idade | `diagnostico` | Substitui qualquer mapeamento idade→nível | MVP |
| F-17 | Avanço manual pelo responsável | Botão "Avançar manualmente" por disciplina | `dashboard` | Ignora o critério de domínio — uso excepcional | V2 |
| F-18 | Comentário do orientador | Recado de texto livre, lido/não lido | `dashboard` | Exibido ao aluno na próxima sessão (não implementado na tela do aluno — ver matriz) | V2 |
| F-19 | PIN do responsável | Hash local, sem envio a servidor | `pin-gate` | Sem recuperação de PIN perdido (reset só via backup/reinstalação) | MVP |
| F-20 | Backup/restauração JSON | Exporta todas as tabelas do Dexie; importa com checagem de versão de esquema | `dashboard` | Único canal de saída de dados do aparelho | MVP |
| F-21 | PWA offline | Service worker cache-first (exceto o documento HTML, network-first) | — (app) | Reconhecimento de fala online (se a Camada 1 exigir rede no aparelho) é a única dependência de internet remanescente | MVP |

## Notificações

Nenhuma notificação push ou e-mail. O único mecanismo de aviso é o comentário do orientador (F-18), lido dentro do próprio app.

## Integrações externas

Nenhuma. Síntese e reconhecimento de voz usam APIs do navegador (Web Speech API), não serviços de terceiros com chave de API.

## Importação/exportação

Só o backup completo em JSON (F-20). Não há exportação parcial (por aluno ou por disciplina).

## Observação sobre acesso (Fase 1 da skill)

Não foi feito — nem deveria ser feito sem autorização — levantamento de telas a partir do Kumon Connect real: não há conta de aluno matriculado disponível para este projeto, e o app não tem versão demo pública. O que está documentado aqui e em `PEDAGOGIA.md`/`ARQUITETURA.md` é a reprodução do **método** descrito publicamente pelo Kumon (passos mínimos, domínio antes do avanço, folha diária, tempo padrão), não da interface do software proprietário.
