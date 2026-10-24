# Girassol das Letras e Números

Aplicativo (PWA) de folhas de exercícios diários de matemática, português e
inglês para crianças, com progressão por pequenos passos e domínio antes do
avanço. Funciona offline, aceita escrita à mão na tela (dedo, caneta ou
mouse), e roda instalado tanto no celular quanto no PC.

## Visão geral

- **Perfis de aluno** criados com nome e idade — o app já calibra o nível
  inicial por disciplina pela série escolar correspondente, e cada perfil
  evolui de forma independente.
- **Geradores procedurais de folhas** — nenhum exercício é fixo/copiado;
  tudo é sorteado dentro de regras de dificuldade por nível.
- **Sistema de níveis original**, em 6 estágios temáticos (Semente → Broto
  → Folha → Botão → Flor → Girassol), sem nomenclatura de terceiros.
- **Canvas de escrita manuscrita** (Pointer Events) com borracha, desfazer
  e limpar.
- **Resposta em duas camadas**: rascunho manuscrito livre + teclado grande
  (numérico ou alfabético) para confirmar a resposta.
- **Correção automática**, avanço sequencial entre exercícios, e regra de
  avanço de nível configurável (X folhas seguidas, acerto ≥ Y%, tempo ≤ Z).
- **Painel do responsável** protegido por PIN: histórico, acerto médio,
  tempo médio, erros recorrentes, ajuste manual de nível e edição da regra
  de avanço.
- **Backup em JSON** para levar o progresso entre o celular e o PC.
- **100% offline** depois da primeira visita (service worker cache-first),
  sem anúncios, rastreadores ou coleta de dados além do primeiro nome do
  aluno.

Veja `PEDAGOGIA.md` para a progressão detalhada de cada disciplina, e
`INSTALACAO.md` para instalar no Redmi 9 e no Windows 11.

## Stack técnica

- HTML, CSS e JavaScript puros, com [Vite](https://vite.dev/) só como
  ferramenta de build/dev (sem framework de UI).
- IndexedDB para todos os dados locais — nenhum servidor ou banco externo.
- Service worker com estratégia cache-first para funcionar offline.
- Web Speech API (pt-BR/en-US) para leitura em voz alta.

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
   `https://RaulDeveloper007.github.io/girassol-letras-numeros/`.

O GitHub Pages serve tudo por HTTPS automaticamente, o que é obrigatório
para o service worker funcionar.

## Estrutura de pastas

```
src/
├─ app/            orquestração (router, estado, correção, backup, PIN)
├─ components/      canvas de escrita, teclado grande, cronômetro, voz
├─ data/            repositórios sobre IndexedDB
├─ generators/      geradores procedurais de exercícios por disciplina
├─ levels/          configuração de níveis/estágios por disciplina
├─ screens/         telas do app
└─ styles/          CSS
public/
├─ manifest.webmanifest
├─ sw.js
└─ icons/
```
