import { describe, expect, it } from 'vitest'
import { ALFABETO, caractereDoIndice, indiceDoCaractere } from './alfabeto.js'

describe('alfabeto de reconhecimento', () => {
  it('indiceDoCaractere e caractereDoIndice são inversos um do outro', () => {
    ALFABETO.forEach((caractere, indice) => {
      expect(indiceDoCaractere(caractere)).toBe(indice)
      expect(caractereDoIndice(indice)).toBe(caractere)
    })
  })

  it('indiceDoCaractere retorna -1 para um caractere fora do alfabeto (ex. uma letra)', () => {
    expect(indiceDoCaractere('a')).toBe(-1)
  })

  it('caractereDoIndice lança erro para um índice fora do alfabeto', () => {
    expect(() => caractereDoIndice(ALFABETO.length)).toThrow()
    expect(() => caractereDoIndice(-1)).toThrow()
  })
})
