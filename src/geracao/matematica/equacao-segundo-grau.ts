import { escolherInteiro } from '../aleatorio.js'
import type { FuncaoGeradora } from '../tipos.js'

export const equacaoSegundoGrau: FuncaoGeradora = (rng, parametros) => {
  const raizMax = Number(parametros.raizMax ?? 10)

  const r1 = escolherInteiro(rng, 1, raizMax)
  let r2 = escolherInteiro(rng, 1, raizMax)
  let tentativas = 0
  while (r2 === r1 && tentativas < 20) {
    r2 = escolherInteiro(rng, 1, raizMax)
    tentativas++
  }
  if (r2 === r1) {
    r2 = r1 >= raizMax ? r1 - 1 : r1 + 1
  }

  const somaRaizes = r1 + r2
  const produtoRaizes = r1 * r2
  const termoB = somaRaizes === 1 ? 'x' : `${somaRaizes}x`

  return {
    tipo: 'numerico',
    enunciado: `x² - ${termoB} + ${produtoRaizes} = 0. Qual é a maior das duas raízes?`,
    dados: { r1, r2, somaRaizes, produtoRaizes },
    gabarito: Math.max(r1, r2),
  }
}
