import { pickOne, shuffle } from '../shared/random.js'

const THEMES = {
  colors: [
    { word: 'RED', icon: '🔴' },
    { word: 'BLUE', icon: '🔵' },
    { word: 'GREEN', icon: '🟢' },
    { word: 'YELLOW', icon: '🟡' },
    { word: 'ORANGE', icon: '🟠' },
    { word: 'PURPLE', icon: '🟣' },
    { word: 'BLACK', icon: '⚫' },
    { word: 'WHITE', icon: '⚪' },
    { word: 'BROWN', icon: '🟤' },
  ],
  numbers: [
    { word: 'ONE', icon: '1️⃣' },
    { word: 'TWO', icon: '2️⃣' },
    { word: 'THREE', icon: '3️⃣' },
    { word: 'FOUR', icon: '4️⃣' },
    { word: 'FIVE', icon: '5️⃣' },
    { word: 'SIX', icon: '6️⃣' },
    { word: 'SEVEN', icon: '7️⃣' },
    { word: 'EIGHT', icon: '8️⃣' },
    { word: 'NINE', icon: '9️⃣' },
    { word: 'TEN', icon: '🔟' },
  ],
  animals: [
    { word: 'CAT', icon: '🐱' },
    { word: 'DOG', icon: '🐶' },
    { word: 'BIRD', icon: '🐦' },
    { word: 'FISH', icon: '🐟' },
    { word: 'HORSE', icon: '🐴' },
    { word: 'COW', icon: '🐮' },
    { word: 'PIG', icon: '🐷' },
    { word: 'DUCK', icon: '🦆' },
    { word: 'FROG', icon: '🐸' },
    { word: 'RABBIT', icon: '🐰' },
    { word: 'LION', icon: '🦁' },
    { word: 'BEAR', icon: '🐻' },
    { word: 'MOUSE', icon: '🐭' },
    { word: 'SHEEP', icon: '🐑' },
    { word: 'MONKEY', icon: '🐵' },
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
