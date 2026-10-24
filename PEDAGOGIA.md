# Pedagogia: progressão de níveis e regra de avanço

## Princípio geral

Cada disciplina (Matemática, Português, Inglês) tem sua própria trilha de
**30 níveis**, organizados em **6 estágios temáticos** de 5 sub-níveis cada.
Os nomes dos estágios são próprios do app (sem relação com nenhuma marca de
terceiros) e acompanham o tema do girassol:

| Estágio    | Sub-níveis | Ideia geral |
|------------|:----------:|--------------|
| Semente    | 1–5        | primeiro contato com o conteúdo |
| Broto      | 6–10       | consolidação do básico |
| Folha      | 11–15      | primeira combinação de habilidades |
| Botão      | 16–20      | dificuldade intermediária |
| Flor       | 21–25      | consolidação avançada |
| Girassol   | 26–30      | mistura de tudo, maior exigência |

Cada aluno tem um nível independente **por disciplina** — uma criança pode
estar em "Flor" em Português e em "Semente" em Inglês, por exemplo.

## Regra de avanço de nível

O avanço acontece por **dois caminhos**, o que vier primeiro:

1. **Acerto total**: acertar todos os exercícios corrigíveis de uma folha
   já avança de nível na hora (exercícios de traçado, que não têm
   gabarito certo/errado, não entram nessa conta).
2. **Consistência**, configurável pelo responsável por disciplina no
   painel (padrão):

   > **3 folhas seguidas** no mesmo nível, com **acerto ≥ 80%** e
   > **tempo ≤ 7 minutos** cada.

   As 3 folhas precisam ser as 3 mais recentes feitas naquele nível — um
   resultado fraco "reseta" a contagem naturalmente, porque a folha
   seguinte vira a mais recente da janela.

O responsável pode alterar os três valores da regra de consistência
(quantidade de folhas, % de acerto mínimo, tempo máximo) ou subir/baixar o
nível manualmente a qualquer momento, pelo painel protegido por PIN.

Cada folha tem entre 5 e 10 exercícios (padrão: 8), sorteados conforme os
pesos do estágio atual (ver abaixo) — o mesmo conjunto exato de exercícios
não se repete em folhas consecutivas do mesmo nível.

## Matemática

| Estágio  | Conteúdo | Exemplo |
|----------|----------|---------|
| Semente  | Contagem (1 a 10) | "Quantos você vê? 🍎🍎🍎" |
| Broto    | Contagem (até 20) + sequências (passo 1) | "1, 2, 3, ❓, 5" |
| Folha    | Sequências (passo 1 ou 2) + adição sem reserva | "4 + 3 = ?" |
| Botão    | Adição com reserva + subtração sem reserva | "8 + 9 = ?", "15 − 4 = ?" |
| Flor     | Adição e subtração até 50, com reserva | "37 + 28 = ?" |
| Girassol | Tabuada (2, 3, 4, 5, 10) + adição/subtração até 80 | "7 × 6 = ?" |

## Português

| Estágio  | Conteúdo | Exemplo |
|----------|----------|---------|
| Semente  | Traçado das 5 vogais | "Trace a letra A" |
| Broto    | Traçado de consoantes + reconhecimento de sílaba | "Trace a letra B" |
| Folha    | Reconhecimento de sílaba + formação de palavra | "Junte: BO - LA" |
| Botão    | Formação de palavra + leitura curta | "O sapo mora na lagoa..." |
| Flor     | Leitura curta + ortografia | "Complete: C_DERNO" |
| Girassol | Leitura curta + ortografia + formação de palavra (mistura) | — |

## Inglês

Trilha nova, criada para o app. Crianças pequenas começam do zero
(estágio Semente); para as mais velhas, o app parte de um nível um pouco
mais avançado, já supondo algum contato prévio com o idioma na escola
(ver tabela de nível inicial por idade, abaixo) — ajustável pelo
responsável se não for o caso.

| Estágio  | Conteúdo | Exemplo |
|----------|----------|---------|
| Semente  | Alfabeto (traçado de letras) | "Trace the letter D" |
| Broto    | Vocabulário temático (cores, números) | "Listen and tap: RED" |
| Folha    | Vocabulário (animais) + palavras CVC | "Write the word: 🐱" |
| Botão    | Palavras CVC + frases curtas | "This is a cat. What animal is it?" |
| Flor     | Frases curtas + ortografia | "Complete: T_EE" |
| Girassol | Frases curtas + ortografia + palavras CVC (mistura) | — |

## Ajuste inicial recomendado

## Nível inicial por idade

Ao criar um perfil, o app pede o nome e a idade da criança e já calcula um
nível inicial por disciplina, com base numa correspondência aproximada com
a série escolar (`src/app/age-level-mapping.js`):

| Idade | Série aproximada | Matemática | Português | Inglês |
|:-----:|-------------------|:----------:|:---------:|:------:|
| até 5 | Educação Infantil | Semente (1) | Semente (1) | Semente (1) |
| 6     | 1º ano EF         | Broto (6)   | Broto (6)   | Semente (1) |
| 7     | 2º ano EF         | Folha (11)  | Folha (13)  | Semente (1) |
| 8     | 3º ano EF         | Botão (16)  | Botão (18)  | Broto (6)   |
| 9     | 4º ano EF         | Flor (21)   | Flor (23)   | Folha (11)  |
| 10    | 5º ano EF         | Flor (24)   | Flor (26)   | Folha (13)  |
| 11+   | 6º ano EF ou mais | Girassol (26) | Girassol (28) | Botão (16) |

É só um ponto de partida aproximado — o responsável pode corrigir o nível
manualmente no painel a qualquer momento, por disciplina, se a criança
estiver mais ou menos avançada do que a média da série.
