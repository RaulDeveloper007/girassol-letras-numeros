# Passo Certo

Aplicativo (PWA) de folhas de exercícios diários de matemática, português e
inglês, para qualquer idade (crianças a adultos), com progressão por
pequenos passos e domínio antes do avanço, inspirado no método de
aprendizagem por maestria — mas com identidade, nomenclatura e conteúdo
próprios, sem marca ou material de terceiros. Funciona offline, aceita
escrita à mão na tela (dedo, caneta ou mouse) e fala (reconhecimento de voz
do navegador), e roda instalado tanto no celular quanto no PC.

## Visão geral

- **Perfis de aluno** criados com nome e idade (idade só para calibração
  visual do responsável — nunca decide o nível). Todo perfil novo começa na
  Fase 1 · Nível 1 de cada disciplina e avança pelo próprio desempenho.
- **Currículo declarativo em Fases e Níveis** (`src/curriculo/`): cada
  disciplina (Matemática, Português, Inglês) é uma sequência de Fases, cada
  Fase uma sequência de Níveis, cada Nível um ou mais blocos de exercício —
  carregado por `import.meta.glob` com code-splitting por fase.
- **Geradores procedurais de folhas** (`src/geracao/`) — nenhum exercício é
  fixo/copiado; tudo é sorteado de forma determinística (RNG com seed) dentro
  de regras de dificuldade por bloco, com montagem anti-repetição em relação
  às folhas recentes.
- **Correção automática** (`src/correcao/`): comparação exata para
  respostas objetivas, verificação simbólica de expressões matemáticas
  (via `mathjs`) para aceitar formas equivalentes, e rubrica de autoavaliação
  assistida para produção livre (sempre enviada para revisão do
  responsável — nunca autocorrigida).
- **Progressão por maestria** (`src/progressao/`): avança de bloco dentro de
  um nível conforme regra configurável (X folhas seguidas, acerto ≥ Y%,
  tempo ≤ Z); ao fim de um nível, aplica um teste de conclusão cobrindo
  todos os seus blocos antes de liberar o próximo nível ou fase; também
  agenda revisão espaçada (estilo Leitner) dos blocos já dominados.
- **Diagnóstico adaptativo** (`src/diagnostico/`): busca binária por posição
  inicial no currículo quando necessário, sem depender da idade informada.
- **Canvas de escrita manuscrita** (Pointer Events) com borracha, desfazer
  e limpar, **teclado grande** (numérico ou alfabético) para confirmar a
  resposta, e **reconhecimento de caligrafia** (`src/reconhecimento/`, nível
  1: dígitos multi-caractere, vírgula, barra e sinal de menos — via rede
  neural pequena treinada no próprio aparelho com fontes do sistema,
  TensorFlow.js, nunca envia nada pela rede) como entrada alternativa ao
  teclado, sempre pedindo confirmação antes de preencher.
- **Reconhecimento e leitura de voz** (`src/voz/`) via Web Speech API do
  navegador (camada 1; sem reconhecimento offline ainda — ver limitações
  abaixo) para exercícios de fala e leitura em voz alta.
- **Persistência local em IndexedDB** via Dexie (`src/dados/`): alunos,
  progresso por disciplina, folhas, itens, tentativas, correções, testes de
  conclusão, tentativas de fala, regras de avanço, revisões agendadas e
  comentários do responsável — nada sai do aparelho exceto por backup manual.
- **Painel do responsável** protegido por PIN: progresso real por
  disciplina (fase/nível/status de diagnóstico), avanço manual, fila de
  produções livres pendentes de revisão, fila de tentativas de fala
  encaminhadas, revisões espaçadas devidas, recado para o aluno, e
  backup/restauração em JSON.
- **100% offline** depois da primeira visita (service worker cache-first),
  sem anúncios, rastreadores ou coleta de dados além do primeiro nome e
  idade do aluno. Nenhuma gravação de áudio é armazenada — só transcrições.

Veja `PEDAGOGIA.md` para a progressão pedagógica detalhada,
`ARQUITETURA.md` para os detalhes técnicos de cada motor, e
`INSTALACAO.md` para instalar no celular e no PC.

## Stack técnica

- HTML, CSS e JavaScript/TypeScript, com [Vite](https://vite.dev/) como
  ferramenta de build/dev (sem framework de UI de terceiros). Os "motores"
  (currículo, geração, correção, progressão, diagnóstico, dados,
  reconhecimento) são TypeScript testado com Vitest; a camada de UI é
  JavaScript puro.
- Dexie sobre IndexedDB para todos os dados locais — nenhum servidor ou
  banco externo.
- Service worker com estratégia cache-first (navegação em network-first,
  para sempre pegar a versão publicada mais recente) para funcionar offline.
- Web Speech API (pt-BR/en-US) para leitura em voz alta e reconhecimento de
  fala.
- TensorFlow.js para o reconhecimento de caligrafia (treinado no navegador,
  a partir de fontes do sistema — nenhum modelo é baixado).
- KaTeX para renderização de expressões matemáticas.

## Rodando localmente

Pré-requisitos: [Node.js](https://nodejs.org/) 20+.

```bash
npm install
npm run dev
```

Abra o endereço que aparecer no terminal (`http://localhost:5173` por
padrão) no navegador do PC.

Para testar no celular pela mesma rede Wi-Fi:

```bash
npm run dev -- --host
```

e abra `http://<IP-do-PC>:5173` no Chrome do celular. Note que o service
worker só é registrado em build de produção (veja `src/main.js`) — em
desenvolvimento ele ficaria servindo versões antigas em cache dos arquivos.

Para gerar o build de produção localmente (o mesmo que o GitHub Actions
gera):

```bash
npm run build
npm run preview
```

Para checagem de tipos e testes:

```bash
npm run typecheck
npm run test
```

## Publicando no GitHub Pages

O repositório já inclui um workflow (`.github/workflows/deploy.yml`) que
builda o projeto com Vite e publica a pasta `dist/` no GitHub Pages a cada
push na branch `main`. Para ativar:

1. No GitHub, vá em **Settings → Pages** e defina **Source** como
   **GitHub Actions**.
2. Dê um `git push` para `main` (ou rode o workflow manualmente em
   **Actions → Deploy to GitHub Pages → Run workflow**).
3. O endereço publicado aparece em **Settings → Pages** e no resumo da
   execução do workflow, no formato
   `https://RaulDeveloper007.github.io/passo-certo/`.

O GitHub Pages serve tudo por HTTPS automaticamente, o que é obrigatório
para o service worker funcionar.

## Estrutura de pastas

```
src/
├─ app/            orquestração (router, estado, PIN)
├─ components/      canvas de escrita, teclado grande, cronômetro, microfone,
│                    botão de reconhecer escrita, autoavaliação de rubrica
├─ curriculo/       carregamento declarativo do currículo (fases/níveis/blocos)
├─ geracao/         geração procedural de itens de exercício, com RNG com seed
├─ correcao/        correção exata, simbólica (mathjs) e rubrica
├─ progressao/      regra de avanço, testes de conclusão, revisão espaçada
├─ diagnostico/     diagnóstico adaptativo de posição inicial no currículo
├─ dados/           esquema e repositórios Dexie/IndexedDB (fonte da verdade)
├─ reconhecimento/  reconhecimento de caligrafia (TensorFlow.js, nível 1)
├─ voz/             camada de reconhecimento e síntese de fala
├─ screens/         telas do app
└─ styles/          CSS
public/
├─ manifest.webmanifest
├─ sw.js
└─ icons/
```

## Limitações conhecidas

- Reconhecimento de fala tem só a camada 1 (Web Speech API do navegador);
  as camadas offline/fallback planejadas em `ARQUITETURA.md` não foram
  implementadas.
- Reconhecimento de caligrafia cobre só dígitos e símbolos matemáticos
  básicos (nível 1); letras e palavras manuscritas não são reconhecidas —
  nesses casos o teclado grande é a única entrada.
- Teste de conclusão reprovado faz o aluno repetir o mesmo bloco até dominar
  de novo, em vez de gerar um bloco de reforço direcionado aos erros
  específicos.
- A fila de tentativas de fala encaminhadas no painel do responsável é
  somente leitura (não há como marcá-las como revisadas ainda).
