import { escolherInteiro, escolherUm } from '../aleatorio.js'
import type { FuncaoGeradora } from '../tipos.js'

export const fracaoComparar: FuncaoGeradora = (rng, parametros) => {
  const denominadores = (parametros.denominadores as number[] | undefined) ?? [2, 3, 4, 5, 6, 8, 10]

  const denominadorA = escolherUm(rng, denominadores)
  const numeradorA = escolherInteiro(rng, 1, denominadorA - 1)
  let denominadorB = escolherUm(rng, denominadores)
  let numeradorB = escolherInteiro(rng, 1, denominadorB - 1)

  // Evita empate (as duas frações valendo o mesmo) -- resorteia a segunda
  // até ser diferente, ou desiste depois de algumas tentativas.
  let tentativas = 0
  while (numeradorA / denominadorA === numeradorB / denominadorB && tentativas < 20) {
    denominadorB = escolherUm(rng, denominadores)
    numeradorB = escolherInteiro(rng, 1, denominadorB - 1)
    tentativas++
  }

  const fracaoA = `${numeradorA}/${denominadorA}`
  const fracaoB = `${numeradorB}/${denominadorB}`
  const maior = numeradorA / denominadorA > numeradorB / denominadorB ? fracaoA : fracaoB

  return {
    tipo: 'textual',
    enunciado: `Qual fração é maior: ${fracaoA} ou ${fracaoB}?`,
    dados: { fracaoA, fracaoB },
    gabarito: maior,
  }
}
