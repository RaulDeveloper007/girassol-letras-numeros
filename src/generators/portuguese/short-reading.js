import { pickOne } from '../shared/random.js'

const READINGS = [
  { text: 'A bola é azul. O gato pula a bola.', question: 'De que cor é a bola?', answer: 'AZUL' },
  { text: 'O sapo mora na lagoa. Ele gosta de pular.', question: 'Onde o sapo mora?', answer: 'LAGOA' },
  { text: 'A fada tem uma mala amarela.', question: 'De que cor é a mala da fada?', answer: 'AMARELA' },
  { text: 'O pato nada no lago todo dia.', question: 'O que o pato faz no lago?', answer: 'NADA' },
  { text: 'Ana tem um dado vermelho.', question: 'De que cor é o dado de Ana?', answer: 'VERMELHO' },
  { text: 'O gato dorme na caixa. Ele gosta de cochilar.', question: 'Onde o gato dorme?', answer: 'CAIXA' },
  { text: 'A galinha põe um ovo branco.', question: 'De que cor é o ovo?', answer: 'BRANCO' },
  { text: 'O urso come mel na floresta.', question: 'O que o urso come?', answer: 'MEL' },
  { text: 'A menina tem um balão verde.', question: 'De que cor é o balão?', answer: 'VERDE' },
  { text: 'O peixe nada no rio.', question: 'Onde o peixe nada?', answer: 'RIO' },
  { text: 'O menino joga bola no parque.', question: 'Onde o menino joga bola?', answer: 'PARQUE' },
  { text: 'A vaca come capim no campo.', question: 'O que a vaca come?', answer: 'CAPIM' },
  { text: 'O coelho pula no jardim.', question: 'Onde o coelho pula?', answer: 'JARDIM' },
  { text: 'A galinha tem cinco pintinhos.', question: 'Quantos pintinhos a galinha tem?', answer: 'CINCO' },
  { text: 'O cachorro late para o carteiro.', question: 'Para quem o cachorro late?', answer: 'CARTEIRO' },
  { text: 'A abelha faz mel na colmeia.', question: 'O que a abelha faz?', answer: 'MEL' },
  { text: 'O macaco gosta muito de banana.', question: 'O que o macaco gosta?', answer: 'BANANA' },
  { text: 'A borboleta voa no jardim florido.', question: 'Onde a borboleta voa?', answer: 'JARDIM' },
  { text: 'O passarinho canta todo dia no ninho.', question: 'Onde o passarinho canta?', answer: 'NINHO' },
  { text: 'A tartaruga anda muito devagar.', question: 'Como a tartaruga anda?', answer: 'DEVAGAR' },
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
