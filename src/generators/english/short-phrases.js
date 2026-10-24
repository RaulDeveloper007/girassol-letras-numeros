import { pickOne } from '../shared/random.js'

const PHRASES = [
  { text: 'This is a cat.', question: 'What animal is it?', answer: 'CAT' },
  { text: 'I like dogs.', question: 'What does the child like?', answer: 'DOGS' },
  { text: 'The sun is yellow.', question: 'What color is the sun?', answer: 'YELLOW' },
  { text: 'The bird can fly.', question: 'What animal can fly?', answer: 'BIRD' },
  { text: 'The dog is big.', question: 'What animal is big?', answer: 'DOG' },
  { text: 'I have a red ball.', question: 'What color is the ball?', answer: 'RED' },
  { text: 'The cat likes milk.', question: 'What does the cat like?', answer: 'MILK' },
  { text: 'She has a blue hat.', question: 'What color is the hat?', answer: 'BLUE' },
  { text: 'The fish can swim.', question: 'What animal can swim?', answer: 'FISH' },
  { text: 'I see a green frog.', question: 'What color is the frog?', answer: 'GREEN' },
  { text: 'The pig is pink.', question: 'What color is the pig?', answer: 'PINK' },
  { text: 'We have three apples.', question: 'How many apples?', answer: 'THREE' },
  { text: 'The horse runs fast.', question: 'What animal runs fast?', answer: 'HORSE' },
  { text: 'I have a small bag.', question: 'What size is the bag?', answer: 'SMALL' },
  { text: 'The duck is in the pond.', question: 'Where is the duck?', answer: 'POND' },
  { text: 'My bear is brown.', question: 'What color is the bear?', answer: 'BROWN' },
]

export function generateShortPhrase(rng) {
  const phrase = pickOne(rng, PHRASES)

  return {
    type: 'short-phrase',
    interaction: 'answer',
    prompt: `${phrase.text}\n${phrase.question}`,
    speak: `${phrase.text} ${phrase.question}`,
    display: { kind: 'reading', text: phrase.text, question: phrase.question },
    expectedAnswer: phrase.answer,
  }
}
