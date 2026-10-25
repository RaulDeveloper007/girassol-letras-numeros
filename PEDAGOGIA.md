# Pedagogia: currículo, progressão e avaliação

## Princípio geral

Cada disciplina (Matemática, Português, Inglês) é uma trilha própria de
**Fases**, numeradas a partir de 1. Cada Fase tem um ou mais **Níveis**, e
cada Nível tem um ou mais **blocos de exercício**, cada um com uma
habilidade específica, um gerador procedural de itens e um critério de
domínio próprio. A exibição ao aluno e ao responsável usa sempre o formato
**"Fase X · Nível Y"** — nomenclatura própria do app, sem relação com
nenhuma marca de terceiros.

Todo perfil novo faz, logo na criação, um **diagnóstico adaptativo**
obrigatório (ver abaixo) nas três disciplinas, em sequência — é esse
diagnóstico, nunca a idade informada, que decide a Fase/Nível de
partida de cada uma. Não há cálculo de nível inicial por idade/série.
Cada aluno progride de forma independente, por disciplina — pode estar
na Fase 9 em Matemática e na Fase 2 em Português, por exemplo.

A trilha cobre, nas três disciplinas, do primeiro contato com o conteúdo
(contagem, sílabas, alfabeto) até um nível avançado (cálculo diferencial e
integral em Matemática; produção de texto em Português; conversação em
inglês nível B2/C1) — o app foi desenhado para acompanhar um aluno por toda
a vida escolar e além, não só a infância.

## Regra de avanço de nível

Dentro de um nível, o avanço de um bloco para o próximo acontece por
**critério de domínio configurável por bloco** (`criterioDominio` no
currículo), avaliado sobre as folhas mais recentes feitas naquele bloco.
Tipicamente: um número mínimo de **folhas consecutivas** com **acerto
mínimo** (frequentemente 100% nos blocos iniciais, mais tolerante nos
avançados) **dentro do tempo padrão** esperado para aquele bloco. Um
resultado fraco "reseta" a contagem naturalmente, porque a folha seguinte
vira a mais recente da janela.

Ao dominar o último bloco de um nível, o app aplica um **teste de
conclusão**: uma folha com um item de cada bloco daquele nível, todos ao
mesmo tempo (não um de cada vez). Só ao aprovar nesse teste o aluno avança
para o próximo nível (ou, se já era o último nível da fase, para a
primeira fase seguinte). Se reprovar, volta a praticar o(s) bloco(s) em que
errou até dominar de novo, e o teste é refeito.

Blocos do tipo **produção livre** (redação curta, resposta falada aberta)
não têm critério de domínio automático — são sempre enviados para revisão
do responsável, que decide manualmente quando avançar (botão "Avançar
manualmente" no painel).

Blocos já dominados entram em **revisão espaçada** (estilo Leitner): o app
agenda uma revisão futura automaticamente, com intervalo que cresce a cada
acerto e encurta a cada erro, para consolidar o que já foi aprendido sem
precisar repetir tudo o tempo todo.

O responsável pode, a qualquer momento pelo painel protegido por PIN,
avançar manualmente o nível de um aluno em qualquer disciplina.

## Diagnóstico adaptativo

Toda vez que um perfil é criado, o app aplica um **diagnóstico**
obrigatório nas três disciplinas, em sequência, antes de liberar a tela
inicial do aluno: uma busca binária por posição no currículo de cada
disciplina, que aplica alguns itens de blocos espaçados ao longo da
trilha para estimar rapidamente até onde o aluno já domina o conteúdo —
seja ele uma criança começando do zero (fica mesmo em Fase 1 · Nível 1)
ou alguém com conhecimento prévio (um filho mais velho, um adulto
retomando os estudos), sem obrigar ninguém a refazer do zero o que já
sabe. Blocos de produção livre nunca entram no diagnóstico (não têm
correção objetiva imediata).

O responsável também pode reabrir o diagnóstico de uma disciplina
específica a qualquer momento pelo painel protegido por PIN (por
exemplo, depois de uma pausa longa nos estudos) — nesse caso ele só
afeta a disciplina escolhida, não as três.

## Correção

- **Itens numéricos/alfabéticos**: comparação exata com o gabarito.
- **Itens matemáticos com múltiplas formas equivalentes** (ex.: fração
  simplificável, decimal vs. fração): verificação simbólica via `mathjs`,
  que aceita qualquer forma matematicamente equivalente à esperada, não só
  a forma literal do gabarito.
- **Itens de fala**: comparado o texto transcrito pelo reconhecimento de
  voz do navegador com o esperado.
- **Produção livre**: nunca corrigida automaticamente. O aluno faz uma
  autoavaliação assistida por rubrica (critérios simples, tipo
  sim/não) e o texto/áudio é sempre enviado para revisão do responsável.

## Matemática (17 fases)

| Fase | Conteúdo |
|:----:|----------|
| 1 | Contagem e reconhecimento de numerais |
| 2 | Adição (sem e com reserva, até 3 dígitos) |
| 3 | Subtração (sem e com empréstimo, até 3 dígitos) |
| 4 | Multiplicação (tabuada completa) |
| 5 | Divisão (exata e com resto) |
| 6 | Frações (reconhecimento, equivalência, comparação, simplificação) |
| 7 | Operações com frações (soma, subtração, multiplicação, divisão) |
| 8 | Números decimais (décimos, centésimos, operações) |
| 9 | Porcentagem |
| 10 | Geometria básica: perímetro e área (retângulo, triângulo) |
| 11 | Equações do 1º grau — um passo |
| 12 | Equações do 1º grau — dois passos |
| 13 | Potenciação e radiciação |
| 14 | Expressões algébricas (substituição, propriedade distributiva) |
| 15 | Sistemas lineares e inequações do 1º grau |
| 16 | Equações do 2º grau por fatoração |
| 17 | Cálculo diferencial e integral (derivada e integral de polinômios) |

## Português (13 fases)

| Fase | Conteúdo |
|:----:|----------|
| 1 | Sílabas simples (consoante por consoante) |
| 2 | Formação de palavras (2–3 sílabas, dígrafos) |
| 3 | Leitura em voz alta — palavras |
| 4 | Leitura em voz alta — frases curtas |
| 5 | Ortografia — ditado (acentos, til) |
| 6 | Leitura em voz alta — textos curtos |
| 7 | Compreensão auditiva |
| 8 | Ortografia avançada (S/SS/Ç/Z, C-QU/G-J) |
| 9 | Pontuação e maiúsculas |
| 10 | Interpretação de texto escrita (literal e inferencial) |
| 11 | Interpretação de texto oral |
| 12 | Leitura fluente — textos mais longos |
| 13 | Produção escrita (descritivo e narrativo curtos) |

## Inglês (10 fases)

Trilha nova, criada para o app, cobrindo aproximadamente de Pré-A1 a
B2/C1 do quadro comum europeu.

| Fase | Nível aproximado | Conteúdo |
|:----:|:---:|----------|
| 1 | Pré-A1 | Alfabeto |
| 2 | Pré-A1/A1 | Vocabulário básico (cores, números, animais) |
| 3 | A1 | Leitura em voz alta — palavras |
| 4 | A1 | Leitura em voz alta — frases curtas |
| 5 | A1/A2 | Compreensão auditiva básica |
| 6 | A2 | Gramática básica (to be, plural, artigos) |
| 7 | A2/B1 | Vocabulário intermediário (comida, casa, profissões) |
| 8 | B1 | Interpretação de texto em inglês |
| 9 | B1/B2 | Tempos verbais (presente simples/contínuo, passado simples) |
| 10 | B2/C1 | Produção escrita e conversação |

## Fonte da verdade

O conteúdo exato de cada fase — níveis, blocos, habilidades, parâmetros do
gerador, tempo padrão e critério de domínio — está declarado em
`src/curriculo/<disciplina>/fase-NN.json`. Esta tabela é um resumo para
leitura humana; em caso de qualquer divergência, o JSON é a referência
válida.
