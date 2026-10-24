import { pickOne, pickInt } from '../shared/random.js'

const WORDS = [
  'CASA', 'LIVRO', 'JANELA', 'CADERNO', 'ESCOLA', 'FLOR', 'ARVORE', 'PRAIA',
  'BOLA', 'GATO', 'SAPO', 'PATO', 'FADA', 'MALA', 'DADO', 'RATO', 'VACA',
  'GALO', 'FOCA', 'BOTO', 'URSO', 'FOGO', 'BOLO', 'SUCO', 'PIPA', 'SOPA',
  'COPO', 'CARRO', 'TOMATE', 'CENOURA', 'CHUVA', 'FESTA', 'SAPATO', 'CAMISA',
  'GELO', 'MESA', 'PORTA', 'CADEIRA', 'COLHER', 'FACA', 'PIPOCA', 'ABACATE',
  'MANGA', 'LARANJA', 'MORANGO', 'UVA',
]

export function generateSpelling(rng) {
  const word = pickOne(rng, WORDS)
  const blankIndex = pickInt(rng, 1, word.length - 2)
  const masked = word
    .split('')
    .map((letter, i) => (i === blankIndex ? '_' : letter))
    .join('')

  return {
    type: 'spelling',
    interaction: 'answer',
    prompt: `Complete a palavra: ${masked}`,
    speak: 'Complete a palavra.',
    display: { kind: 'fill-blank', masked },
    expectedAnswer: word[blankIndex],
  }
}
