# Etapa 0 — Auditoria do código atual

Referência: prompt MAESTRIO de reestruturação (método de autoaprendizagem por
folhas diárias, currículo contínuo sem teto, 3 disciplinas, fala obrigatória).
Base auditada: `main` @ `cf6557c` (~2.500 linhas de JS, 0 testes).

## 1. Resumo executivo

O app atual é uma boa **casca técnica** (PWA, IndexedDB, canvas, teclado,
backup, PIN), mas o **núcleo pedagógico não segue o método**: o currículo é
raso (teto = tabuada simples / frases curtas), a progressão é por idade e por
"acertou tudo, sobe", não há exemplo resolvido, não há tempo padrão por folha,
não há ciclo de refazer até 100%, não há teste de conclusão nem revisão
espaçada, e não existe reconhecimento de fala.

Recomendação: **manter a casca e reescrever o núcleo** (currículo declarativo,
motor de progressão, motor de geração por habilidade, motor de correção) em
TypeScript com testes, conforme Etapas 2–6.

## 2. O que pode ser reaproveitado

| Módulo atual | Situação | Decisão |
|---|---|---|
| `src/components/writing-canvas.js` (219 l.) | Pointer Events, borracha, desfazer, limpar | **Reaproveitar**; acrescentar rejeição de palma (`pointerType === "pen"`), área de rascunho e verificação de trajeto para traçado |
| `src/components/big-keyboard.js` | Teclado numérico/alfabético grande | **Reaproveitar** nos níveis iniciais; níveis avançados passam a usar MathLive |
| `src/components/timer.js` | Cronômetro simples | **Reaproveitar**; acrescentar tempo padrão com faixas verde/amarelo/vermelho |
| `src/components/sound-effects.js` | Sons sintetizados | **Reaproveitar** |
| `src/data/db.js` + repos | IndexedDB nativo, 6 stores | **Migrar** para Dexie com novo esquema (versão 2) e migração dos perfis existentes |
| `src/app/backup.js` | Export/import JSON | **Reaproveitar** com versão de esquema no arquivo |
| `src/app/pin-hash.js`, `screens/guardian/pin-gate.js` | PIN do responsável | **Reaproveitar** |
| `src/generators/shared/random.js`, `signature.js` | RNG e assinatura de folha | **Reaproveitar**; a semente passa a ser persistida (folha reproduzível) |
| `public/sw.js`, manifest, ícones, workflow de deploy | PWA + GitHub Pages | **Reaproveitar**; acrescentar cache sob demanda para fases e modelos de voz |
| Telas `profile-select`, `student-home`, `sheet-result` | Fluxo básico | **Refatorar** para o novo fluxo (tarefa do dia, mapa do currículo) |

## 3. Lacunas em relação ao prompt

### 3.1 Filosofia pedagógica (E1)

| Requisito | Estado atual | Lacuna |
|---|---|---|
| Exemplo resolvido no topo da folha | Inexistente | Total |
| Passos mínimos (um fator por vez) | 30 níveis = 6 estágios × 5 subníveis, mas o gerador só varia por **estágio** (`STAGE_CONFIG[stage.stageName]`); os 5 subníveis de um estágio geram folhas idênticas em dificuldade | Total |
| Ponto de partida por diagnóstico, abaixo do limite | Nível inicial definido **pela idade** (`age-level-mapping.js`), o que contraria o método | Total — remover mapeamento por idade |
| Domínio antes de avançar | `complete-sheet.js` sobe de nível com **uma única folha 100%** (`perfectSheet`) ou com 3 folhas ≥ 80% | Crítica — regra contraria o método |
| Tempo padrão por folha | Só `maxTimeSeconds` global por disciplina | Total — tempo padrão por bloco |
| Correção até 100% (refazer só os errados; nota da 1ª tentativa) | Feedback "Tente de novo" por item, mas não há ciclo de refazer ao fim da folha nem distinção 1ª tentativa × conclusão | Total |
| Teste de conclusão por nível | Inexistente | Total |
| Revisão espaçada | Inexistente | Total |
| Tarefa do dia | Inexistente (folha avulsa) | Total |

### 3.2 Currículos (E3, E4, E5)

| Disciplina | Teto atual | Teto exigido | Cobertura estimada |
|---|---|---|---|
| Matemática | contagem, sequências, + e − até 80, tabuadas 2–5 e 10 | Fase 17 (cálculo integral e além) | ≈ Fases 1–4 parciais (~10%) |
| Português | traçado, sílabas, formação de palavras, leitura curta, ortografia básica | Fase 13 (produção dissertativa) | ≈ Fases 2–6 parciais (~15%) |
| Inglês | sons do alfabeto, vocabulário (cores, números, animais), CVC, frases curtas | Fase 10 (C1) | ≈ Fases 1–3 parciais (~10%) |

Faltam ainda: coordenação motora (Português Fase 1), letra cursiva, todos os
tipos de item de transformação/tradução/ditado no Inglês, e todo o conteúdo
de frações em diante na Matemática.

### 3.3 Motor de correção

- Comparação atual: `String(value).trim().toUpperCase() === expectedAnswer`.
- Faltam: verificação simbólica (equivalência algébrica, constante C em
  integrais), variantes textuais aceitas, regras de acento por item,
  contrações em inglês, produção livre com rubrica.

### 3.4 Voz (E2.6, E2.7, Etapa 1)

- Síntese: existe `speak-button.js`, mas sem escolha de voz local
  (`localService`), sem controle de velocidade e sem fallback.
- **Reconhecimento de fala: inexistente.** É requisito obrigatório — exige
  a Etapa 1 (ambiente) e o serviço em 3 camadas (on-device, Vosk/WASM,
  online com consentimento).

### 3.5 Qualidade e engenharia

- **Zero testes automatizados**; nenhum gabarito é verificado por teste.
- JavaScript sem tipos; o prompt pede TypeScript.
- Sem Dexie, KaTeX, MathLive, math.js/nerdamer, TensorFlow.js.
- Identidade própria já existe ("Girassol das Letras e Números", estágios
  Semente → Girassol) e não usa marcas de terceiros. **Ponto positivo** —
  pode ser mantida (ver seção 5).

### 3.6 Riscos identificados

1. Usuários já têm progresso salvo no esquema v1; a migração precisa
   preservar perfis e converter o nível atual em um ponto de partida
   provisório até o diagnóstico.
2. Modelos de reconhecimento de fala offline (pt-BR + en-US) somam dezenas
   de MB; precisam ficar fora do carregamento inicial (critério Lighthouse).
3. O Redmi 9 tem 3–4 GB de RAM; o motor WASM de fala deve ser carregado só
   nas folhas com fala e descarregado ao sair.

## 4. Plano proposto para as próximas etapas

| Etapa | Entrega | Depende de |
|---|---|---|
| 1 | Scripts `setup-voz-android.ps1` / `setup-voz-windows.ps1`, tela "Verificar voz", `SETUP_VOZ.md` | — (requer você com o Redmi 9 no cabo) |
| 2 | `ARQUITETURA.md`: esquema Dexie v2, formato YAML do currículo, migração v1 → v2 | Aprovação desta auditoria |
| 3–6 | Motores (currículo, geração, correção, folha digital), em TypeScript com Vitest | Etapa 2 |
| 7 | Diagnóstico adaptativo | Etapas 3–6 |
| 8–10 | Conteúdo por disciplina, em lotes com amostras para validação | Etapa 7 |
| 11–12 | Painel, revisão espaçada, otimização e publicação | Etapas 8–10 |

## 5. Decisões que preciso de você

1. **Nome e nomenclatura de níveis.** Manter "Girassol das Letras e Números"
   e os estágios Semente → Girassol (expandidos para cobrir até o cálculo),
   ou adotar um dos três nomes novos que proponho na Etapa 2?
2. **Migração.** Preservar os perfis atuais (recomendado) ou começar do zero?
3. **TypeScript.** Migrar tudo (recomendado, conforme o prompt) ou só os
   motores novos?
