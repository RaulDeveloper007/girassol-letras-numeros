import { describe, expect, it } from 'vitest'
import { segmentarEmCaracteres } from './segmentacao.js'

/** Monta uma grade de tinta a partir de linhas de texto ('#' = tinta, '.' = vazio). */
function gradeDeTexto(linhas: string[]): { tinta: Float32Array; largura: number; altura: number } {
  const altura = linhas.length
  const largura = linhas[0]!.length
  const tinta = new Float32Array(largura * altura)
  for (let y = 0; y < altura; y++) {
    for (let x = 0; x < largura; x++) {
      tinta[y * largura + x] = linhas[y]![x] === '#' ? 1 : 0
    }
  }
  return { tinta, largura, altura }
}

const OPCOES_PADRAO = { limiarDeTinta: 0.5, gapMinimoColunas: 1, larguraMinimaSegmento: 1 }

describe('segmentarEmCaracteres', () => {
  it('um único glifo contíguo gera uma única caixa', () => {
    const { tinta, largura, altura } = gradeDeTexto(['......', '.####.', '.####.', '......'])
    const caixas = segmentarEmCaracteres(tinta, largura, altura, OPCOES_PADRAO)
    expect(caixas).toEqual([{ minX: 1, maxX: 4, minY: 1, maxY: 2 }])
  })

  it('dois glifos separados por um vão largo geram duas caixas, da esquerda pra direita', () => {
    const { tinta, largura, altura } = gradeDeTexto(['..........', '.##...##..', '.##...##..', '..........'])
    const caixas = segmentarEmCaracteres(tinta, largura, altura, OPCOES_PADRAO)
    expect(caixas).toHaveLength(2)
    expect(caixas[0]).toEqual({ minX: 1, maxX: 2, minY: 1, maxY: 2 })
    expect(caixas[1]).toEqual({ minX: 6, maxX: 7, minY: 1, maxY: 2 })
  })

  it('um vão menor ou igual ao gap mínimo não separa -- os dois blocos ficam numa só caixa', () => {
    const { tinta, largura, altura } = gradeDeTexto(['.......', '.##.##.', '.##.##.', '.......'])
    const caixas = segmentarEmCaracteres(tinta, largura, altura, { ...OPCOES_PADRAO, gapMinimoColunas: 1 })
    expect(caixas).toEqual([{ minX: 1, maxX: 5, minY: 1, maxY: 2 }])
  })

  it('três glifos com vãos largos são segmentados em ordem, da esquerda pra direita', () => {
    const { tinta, largura, altura } = gradeDeTexto(['..............', '.##...##...##.', '..............'])
    const caixas = segmentarEmCaracteres(tinta, largura, altura, OPCOES_PADRAO)
    expect(caixas).toHaveLength(3)
    expect(caixas.map((c) => [c.minX, c.maxX])).toEqual([
      [1, 2],
      [6, 7],
      [11, 12],
    ])
  })

  it('um desenho vazio não gera nenhuma caixa', () => {
    const { tinta, largura, altura } = gradeDeTexto(['......', '......', '......'])
    expect(segmentarEmCaracteres(tinta, largura, altura, OPCOES_PADRAO)).toEqual([])
  })

  it('um resquício de tinta mais estreito que a largura mínima é descartado como ruído', () => {
    const { tinta, largura, altura } = gradeDeTexto(['..........', '.####..#..', '.####.....', '..........'])
    const caixas = segmentarEmCaracteres(tinta, largura, altura, { ...OPCOES_PADRAO, larguraMinimaSegmento: 2 })
    expect(caixas).toEqual([{ minX: 1, maxX: 4, minY: 1, maxY: 2 }])
  })

  it('a caixa Y respeita a extensão vertical real da tinta, não a altura toda da imagem', () => {
    const { tinta, largura, altura } = gradeDeTexto(['......', '......', '......', '.##...', '......'])
    const caixas = segmentarEmCaracteres(tinta, largura, altura, OPCOES_PADRAO)
    expect(caixas).toEqual([{ minX: 1, maxX: 2, minY: 3, maxY: 3 }])
  })
})
