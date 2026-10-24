import { pickOne, shuffle } from '../shared/random.js'

const THEMES = {
  colors: [
    { word: 'RED', icon: '🔴' },
    { word: 'BLUE', icon: '🔵' },
    { word: 'GREEN', icon: '🟢' },
    { word: 'YELLOW', icon: '🟡' },
  ],
  numbers: [
    { word: 'ONE', icon: '1️⃣' },
    { word: 'TWO', icon: '2️⃣' },
    { word: 'THREE', icon: '3️⃣' },
    { word: 'FOUR', icon: '4️⃣' },
  ],
  animals: [
    { word: 'CAT', icon: '🐱' },
    { word: 'DOG', icon: '🐶' },
    { word: 'BIRD', icon: '🐦' },
    { word: 'FISH', icon: '🐟' },
  ],
}

export function generateThematicVocabulary(rng, { themes = ['colors', 'numbers', 'animals'] } = {}) {
  const theme = pickOne(rng, themes)
  const bank = THEMES[theme]
  const correct = pickOne(rng, bank)
  const distractors = shuffle(rng, bank.filter((item) => item.word !== correct.word)).slice(0, 2)
  const options = shuffle(rng, [correct, ...distractors]).map((item) => ({ label: item.icon, value: item.word }))

  return {
    type: 'thematic-vocabulary',
    interaction: 'choice',
    prompt: 'Listen and tap the right picture.',
    speak: correct.word,
    display: { kind: 'choice-icon', options },
    correctValue: correct.word,
  }
}
