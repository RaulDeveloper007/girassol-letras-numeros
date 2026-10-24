// RNG determinístico (mulberry32) — mesma semente sempre produz a mesma
// sequência. Isso é o que permite reproduzir uma folha (depurar um item
// gerado) e, combinado com a assinatura anti-repetição, variar o conteúdo
// de verdade entre folhas.
export type Rng = () => number

export function criarRng(semente: number): Rng {
  let estado = semente >>> 0
  return function rng() {
    estado |= 0
    estado = (estado + 0x6d2b79f5) | 0
    let t = Math.imul(estado ^ (estado >>> 15), 1 | estado)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function semeadorAleatorio(): number {
  return Math.floor(Math.random() * 2 ** 31)
}

export function escolherInteiro(rng: Rng, min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1))
}

export function escolherUm<T>(rng: Rng, itens: readonly T[]): T {
  const item = itens[escolherInteiro(rng, 0, itens.length - 1)]
  if (item === undefined) throw new Error('escolherUm: lista vazia')
  return item
}

export function embaralhar<T>(rng: Rng, itens: readonly T[]): T[] {
  const copia = [...itens]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = escolherInteiro(rng, 0, i)
    const temp = copia[i]!
    copia[i] = copia[j]!
    copia[j] = temp
  }
  return copia
}
