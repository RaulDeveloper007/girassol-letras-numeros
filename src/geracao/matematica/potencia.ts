import { escolherUm } from '../aleatorio.js'
import type { FuncaoGeradora } from '../tipos.js'

function expoenteTexto(expoente: number): string {
  if (expoente === 2) return '²'
  if (expoente === 3) return '³'
  return `^${expoente}`
}

export const potencia: FuncaoGeradora = (rng, parametros) => {
  const bases = (parametros.bases as number[] | undefined) ?? [2, 3, 4, 5, 6, 7, 8, 9, 10]
  const expoentes = (parametros.expoentes as number[] | undefined) ?? [2, 3]

  const base = escolherUm(rng, bases)
  const expoente = escolherUm(rng, expoentes)

  return {
    tipo: 'numerico',
    enunciado: `${base}${expoenteTexto(expoente)} = ?`,
    dados: { base, expoente },
    gabarito: base ** expoente,
  }
}
