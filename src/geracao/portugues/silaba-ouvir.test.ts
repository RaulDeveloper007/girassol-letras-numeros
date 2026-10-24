import { describe, expect, it } from 'vitest'
import { criarRng } from '../aleatorio.js'
import { silabaOuvir } from './silaba-ouvir.js'

describe('gerador portugues.silaba-ouvir', () => {
  it('o texto falado é a sílaba sorteada do banco, e o gabarito é a mesma sílaba em minúsculas', () => {
    const rng = criarRng(1)
    const silabas = ['BA', 'BE', 'BI', 'BO', 'BU']
    for (let i = 0; i < 50; i++) {
      const item = silabaOuvir(rng, { silabas })
      const textoFala = item.dados.textoFala as string
      expect(silabas).toContain(textoFala)
      expect(item.gabarito).toBe(textoFala.toLowerCase())
    }
  })

  it('o enunciado visível é uma instrução fixa, não o conteúdo a ser ouvido', () => {
    const rng = criarRng(2)
    const item = silabaOuvir(rng, { silabas: ['BA'] })
    expect(item.enunciado).toBe('Ouça com atenção e escreva a sílaba que você ouviu.')
  })
})
