import { escolherInteiro, escolherUm } from '../aleatorio.js'
import type { FuncaoGeradora } from '../tipos.js'

export const areaTriangulo: FuncaoGeradora = (rng, parametros) => {
  const baseMax = Number(parametros.baseMax ?? 12)
  const alturaMax = Number(parametros.alturaMax ?? 12)

  const base = escolherInteiro(rng, 2, baseMax)
  // Garante base × altura par (senão a área base×altura/2 não fica inteira).
  let altura: number
  if (base % 2 === 0) {
    altura = escolherInteiro(rng, 2, alturaMax)
  } else {
    const paresDisponiveis = Array.from({ length: Math.floor(alturaMax / 2) }, (_, i) => (i + 1) * 2)
    altura = escolherUm(rng, paresDisponiveis)
  }

  return {
    tipo: 'numerico',
    enunciado: `Um triângulo tem ${base} cm de base e ${altura} cm de altura. Qual é a área (em cm²)?`,
    dados: { base, altura },
    gabarito: (base * altura) / 2,
  }
}
