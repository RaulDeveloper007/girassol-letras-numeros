// Distância de edição (Levenshtein), usada tanto na correção textual
// (Português/Inglês) quanto na avaliação de similaridade de fala.
export function distanciaDeEdicao(a: string, b: string): number {
  const m = a.length
  const n = b.length

  if (m === 0) return n
  if (n === 0) return m

  let linhaAnterior: number[] = Array.from({ length: n + 1 }, (_, j) => j)

  for (let i = 1; i <= m; i++) {
    const linhaAtual: number[] = new Array(n + 1)
    linhaAtual[0] = i

    for (let j = 1; j <= n; j++) {
      const custo = a[i - 1] === b[j - 1] ? 0 : 1
      const substituicao = linhaAnterior[j - 1]! + custo
      const insercao = linhaAtual[j - 1]! + 1
      const remocao = linhaAnterior[j]! + 1
      linhaAtual[j] = Math.min(substituicao, insercao, remocao)
    }

    linhaAnterior = linhaAtual
  }

  return linhaAnterior[n]!
}

/** 1 = idênticos, 0 = completamente diferentes. */
export function similaridade(a: string, b: string): number {
  const maiorTamanho = Math.max(a.length, b.length)
  if (maiorTamanho === 0) return 1
  return 1 - distanciaDeEdicao(a, b) / maiorTamanho
}
