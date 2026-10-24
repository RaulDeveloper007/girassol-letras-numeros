// Mapeamento aproximado de idade -> série escolar -> nível inicial por
// disciplina. É só um ponto de partida: o responsável pode ajustar
// manualmente a qualquer momento no painel (ver PEDAGOGIA.md).
const AGE_LEVEL_TABLE = [
  { maxAge: 5, math: 1, portuguese: 1, english: 1 }, // Educação Infantil
  { maxAge: 6, math: 6, portuguese: 6, english: 1 }, // 1º ano EF
  { maxAge: 7, math: 11, portuguese: 13, english: 1 }, // 2º ano EF
  { maxAge: 8, math: 16, portuguese: 18, english: 6 }, // 3º ano EF
  { maxAge: 9, math: 21, portuguese: 23, english: 11 }, // 4º ano EF
  { maxAge: 10, math: 24, portuguese: 26, english: 13 }, // 5º ano EF
  { maxAge: Infinity, math: 26, portuguese: 28, english: 16 }, // 6º ano+
]

export function getInitialLevelsForAge(age) {
  const row = AGE_LEVEL_TABLE.find((entry) => age <= entry.maxAge) ?? AGE_LEVEL_TABLE[AGE_LEVEL_TABLE.length - 1]
  return { math: row.math, portuguese: row.portuguese, english: row.english }
}
