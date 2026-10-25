# 07 — Matriz de paridade (Passo Certo vs. método Kumon)

Paridade avaliada contra o **método** documentado publicamente pelo Kumon
(passos mínimos, domínio antes do avanço, folha diária com tempo padrão,
correção até 100%, autoaprendizagem), não contra as telas do Kumon
Connect — sem acesso legítimo a uma conta, não há base para comparar
pixel a pixel, e não seria o objetivo (ver `02-inventario-funcional.md`,
seção final).

Status: **completo** (equivalente ou superior ao método) · **parcial**
(existe, mas com limite relevante) · **ausente** · **melhorado** (resolve
algo que o método original não cobre).

| Funcionalidade do método | Status | Observações |
|---|---|---|
| Passos mínimos entre folhas | Completo | Currículo declarativo em fase→nível→bloco; cada bloco muda um fator de dificuldade por vez (ver JSONs de `src/curriculo/`) |
| Exemplo resolvido antes da prática | Completo | Todo bloco carrega `exemploResolvido` com passo a passo, exibido no topo da folha |
| Domínio antes de avançar (100% + tempo padrão) | Completo | `progressao/dominio.ts`: N folhas consecutivas, 100% na 1ª tentativa, dentro do tempo padrão com tolerância de 1,2× |
| Correção até 100% (refazer só os errados) | Completo | Ciclo de refazer ao final da passada; nota registrada é da 1ª tentativa, não da folha refeita |
| Teste de conclusão de nível | Completo | Mistura 1 item de cada bloco do nível; exige 100%; reprovação não penaliza, só devolve à prática |
| Posicionamento inicial por diagnóstico (nunca por idade) | Completo | Diagnóstico adaptativo por busca binária; não existe mais mapeamento idade→nível no código atual |
| Revisão espaçada do que já foi dominado | Completo | Agendamento Leitner (1/3/7/14/30/60 dias), reinicia no erro |
| **Folha diária fixa, com bloqueio até o dia seguinte** | **Parcial — em revisão (PR #3)** | Era o maior gap identificado: o fluxo deixava escolher disciplina livremente e praticar sem limite. PR #3 adiciona tarefa diária por disciplina (`dados/tarefa-diaria.ts`, `progressao/tarefa-diaria.ts`) com bloqueio até o dia seguinte. **Ainda não mesclado em `main`** — sem `npm test` confirmado neste sandbox (sem acesso ao registro do npm) |
| Currículo sem teto de idade (do básico ao avançado) | Completo | Matemática: contagem → cálculo diferencial e integral (17 fases). Português: sílabas → produção escrita (13 fases). Inglês: Pré-A1 → B2/C1 (10 fases) |
| Autonomia do aluno (sem aula expositiva) | Completo | Nenhuma tela de "explicação" separada — só o exemplo resolvido + prática imediata |
| Reconhecimento de escrita manuscrita | **Parcial** | Implementado só para dígitos e símbolos de matemática (`,`, `/`, `-`). Não há reconhecimento de letras manuscritas para português/inglês — a resposta nesses casos depende do teclado grande, não da caligrafia |
| Reconhecimento de fala | **Parcial** | Só a Camada 1 (Web Speech API on-device) existe. Camada 2 (motor ASR offline em WebAssembly) e Camada 3 (online com aviso) estão especificadas em `ARQUITETURA.md` mas não implementadas — item de fala falha com diagnóstico explícito se a Camada 1 não estiver disponível, nunca é pulado ou trocado por digitação |
| Traçado guiado de letras / coordenação motora (pré-alfabetização) | **Ausente** | O currículo de Português começa direto em "Sílabas simples" (Fase 1) — não há fase de linhas, curvas e traçado de letras isoladas para quem ainda não lê, diferente do que o método previa para esse público |
| Acompanhamento do responsável (progresso, erros recorrentes) | Completo | Painel com posição por disciplina, revisão espaçada devida, fila de produções livres e de fala pendentes |
| Comentário do orientador para o aluno | **Parcial** | O responsável grava o comentário (`dashboard`), mas nenhuma tela do lado do aluno exibe esse comentário — fica só salvo no banco, sem efeito visível para quem devia lê-lo |
| Privacidade (nada sai do aparelho sem exportação manual) | Completo | 100% IndexedDB local; backup/restore manual em JSON é o único canal de saída |
| Identidade visual própria (sem nome/marca do Kumon) | Completo | Nome "Passo Certo", nomenclatura de níveis própria (fase/nível/bloco), sem referência a marca de terceiros |
| **Melhoria sobre o método original** | Melhorado | Cobertura de currículo multidisciplinar (3 línguas) e extensão até cálculo diferencial/integral em um único produto; método original é tipicamente vendido por disciplina separada |

## Lacunas priorizadas para fechar antes de considerar "paridade plena"

1. **Tarefa diária com bloqueio** — já em PR, falta merge + `npm test` local.
2. **Comentário do orientador não chega ao aluno** — gap pequeno, correção direta (exibir na entrada de `student-home` ou de `praticar`).
3. **Reconhecimento de escrita de letras** (português) — gap maior, exige dataset/modelo novo, não é um ajuste pontual.
4. **Camadas 2 e 3 de reconhecimento de fala** — gap maior, análise de desempenho no Redmi 9 pendente (já sinalizado em `ARQUITETURA.md`).
5. **Fase de pré-escrita em Português** (traçado de letras/coordenação motora) — decisão de produto: incluir ou assumir que o app começa depois dessa etapa.
