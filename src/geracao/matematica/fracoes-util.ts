// Utilitários compartilhados pelos geradores de fração (Fases 6 e 7).

export function mdc(a: number, b: number): number {
  let x = Math.abs(a)
  let y = Math.abs(b)
  while (y !== 0) {
    const resto = x % y
    x = y
    y = resto
  }
  return x === 0 ? 1 : x
}

export function simplificarFracao(numerador: number, denominador: number): [number, number] {
  const divisor = mdc(numerador, denominador)
  return [numerador / divisor, denominador / divisor]
}
