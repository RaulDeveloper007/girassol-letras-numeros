import { pickOne } from '../shared/random.js'

const READINGS = [
  { text: 'A bola é azul. O gato pula a bola.', question: 'De que cor é a bola?', answer: 'AZUL' },
  { text: 'O sapo mora na lagoa. Ele gosta de pular.', question: 'Onde o sapo mora?', answer: 'LAGOA' },
  { text: 'A fada tem uma mala amarela.', question: 'De que cor é a mala da fada?', answer: 'AMARELA' },
  { text: 'O pato nada no lago todo dia.', question: 'O que o pato faz no lago?', answer: 'NADA' },
  { text: 'Ana tem um dado vermelho.', question: 'De que cor é o dado de Ana?', answer: 'VERMELHO' },
]

export function generateShortReading(rng) {
  const reading = pickOne(rng, READINGS)

  return {
    type: 'short-reading',
    interaction: 'answer',
    prompt: `${reading.text}\n${reading.question}`,
    speak: `${reading.text} ${reading.question}`,
    display: { kind: 'reading', text: reading.text, question: reading.question },
    expectedAnswer: reading.answer,
  }
}
