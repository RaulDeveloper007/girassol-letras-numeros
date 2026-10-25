// Disciplina do método: um número FIXO de folhas por dia por disciplina,
// não "o quanto o aluno quiser agora". Depois da cota, a tela de prática
// bloqueia (ver screens/praticar/praticar.js) até o dia seguinte -- mesmo
// que o aluno já domine o conteúdo e queira continuar.
export const FOLHAS_POR_DIA_POR_DISCIPLINA = 3

export function cotaDiariaAtingida(folhasFinalizadasHoje: number): boolean {
  return folhasFinalizadasHoje >= FOLHAS_POR_DIA_POR_DISCIPLINA
}
