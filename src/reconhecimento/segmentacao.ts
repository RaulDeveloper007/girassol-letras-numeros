export interface CaixaDelimitadora {
  minX: number
  maxX: number
  minY: number
  maxY: number
}

export interface OpcoesSegmentacao {
  /** Intensidade de tinta acima da qual um pixel conta como "desenhado". */
  limiarDeTinta?: number
  /** Nº de colunas vazias consecutivas que separa um glifo do próximo. */
  gapMinimoColunas?: number
  /** Segmentos mais estreitos que isso são descartados como ruído. */
  larguraMinimaSegmento?: number
}

/**
 * Agrupa a tinta de um desenho em "glifos" separados, da esquerda para a
 * direita -- é assim que viramos "17" ou "3/4" em caracteres individuais
 * pra classificar um por um. Colunas com tinta coladas formam um só
 * glifo; um vão de colunas vazias maior que gapMinimoColunas separa um
 * glifo do próximo.
 */
export function segmentarEmCaracteres(
  tinta: Float32Array,
  largura: number,
  altura: number,
  opcoes: OpcoesSegmentacao = {}
): CaixaDelimitadora[] {
  const limiarDeTinta = opcoes.limiarDeTinta ?? 0.1
  const gapMinimoColunas = opcoes.gapMinimoColunas ?? Math.max(2, Math.round(largura * 0.015))
  const larguraMinimaSegmento = opcoes.larguraMinimaSegmento ?? Math.max(2, Math.round(largura * 0.01))

  const colunaTemTinta: boolean[] = new Array(largura).fill(false)
  for (let x = 0; x < largura; x++) {
    for (let y = 0; y < altura; y++) {
      if (tinta[y * largura + x]! > limiarDeTinta) {
        colunaTemTinta[x] = true
        break
      }
    }
  }

  const faixasDeColuna: Array<[number, number]> = []
  let inicio = -1
  let vaziasConsecutivas = 0

  for (let x = 0; x < largura; x++) {
    if (colunaTemTinta[x]) {
      if (inicio === -1) inicio = x
      vaziasConsecutivas = 0
    } else if (inicio !== -1) {
      vaziasConsecutivas++
      if (vaziasConsecutivas > gapMinimoColunas) {
        faixasDeColuna.push([inicio, x - vaziasConsecutivas])
        inicio = -1
        vaziasConsecutivas = 0
      }
    }
  }
  if (inicio !== -1) {
    faixasDeColuna.push([inicio, largura - 1 - vaziasConsecutivas])
  }

  const caixas: CaixaDelimitadora[] = []
  for (const [minX, maxX] of faixasDeColuna) {
    if (maxX - minX + 1 < larguraMinimaSegmento) continue

    let minY = altura
    let maxY = -1
    for (let x = minX; x <= maxX; x++) {
      for (let y = 0; y < altura; y++) {
        if (tinta[y * largura + x]! > limiarDeTinta) {
          if (y < minY) minY = y
          if (y > maxY) maxY = y
        }
      }
    }
    if (maxY >= minY) caixas.push({ minX, maxX, minY, maxY })
  }

  return caixas
}
