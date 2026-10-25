import type { CaixaDelimitadora } from './segmentacao.js'

function amostrarBilinear(tinta: Float32Array, largura: number, altura: number, x: number, y: number): number {
  const x0 = Math.floor(x)
  const y0 = Math.floor(y)
  const x1 = Math.min(x0 + 1, largura - 1)
  const y1 = Math.min(y0 + 1, altura - 1)
  const fx = x - x0
  const fy = y - y0

  const obter = (xi: number, yi: number) => (xi >= 0 && yi >= 0 && xi < largura && yi < altura ? tinta[yi * largura + xi]! : 0)

  const superior = obter(x0, y0) * (1 - fx) + obter(x1, y0) * fx
  const inferior = obter(x0, y1) * (1 - fx) + obter(x1, y1) * fx
  return superior * (1 - fy) + inferior * fy
}

/**
 * Recorta uma caixa delimitadora da grade de tinta e escala pro tamanho de
 * entrada do modelo (28x28 por padrão), centralizando o glifo com uma
 * margem -- mesma ideia do recorte clássico do MNIST, só que operando
 * direto sobre o buffer de tinta (sem precisar de um canvas intermediário).
 */
export function recortarEEscalar(
  tinta: Float32Array,
  largura: number,
  altura: number,
  caixa: CaixaDelimitadora,
  tamanhoSaida = 28,
  margem = 1.4
): Float32Array {
  const larguraCaixa = caixa.maxX - caixa.minX + 1
  const alturaCaixa = caixa.maxY - caixa.minY + 1
  const lado = Math.max(larguraCaixa, alturaCaixa) * margem

  const escala = tamanhoSaida / lado
  const larguraDestino = larguraCaixa * escala
  const alturaDestino = alturaCaixa * escala
  const deslocamentoX = (tamanhoSaida - larguraDestino) / 2
  const deslocamentoY = (tamanhoSaida - alturaDestino) / 2

  const saida = new Float32Array(tamanhoSaida * tamanhoSaida)

  for (let yDestino = 0; yDestino < tamanhoSaida; yDestino++) {
    for (let xDestino = 0; xDestino < tamanhoSaida; xDestino++) {
      const xRecorte = (xDestino - deslocamentoX) / escala
      const yRecorte = (yDestino - deslocamentoY) / escala
      if (xRecorte < 0 || yRecorte < 0 || xRecorte >= larguraCaixa || yRecorte >= alturaCaixa) continue

      const xOrigem = caixa.minX + xRecorte
      const yOrigem = caixa.minY + yRecorte
      saida[yDestino * tamanhoSaida + xDestino] = amostrarBilinear(tinta, largura, altura, xOrigem, yOrigem)
    }
  }

  return saida
}
