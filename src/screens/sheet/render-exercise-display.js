export function renderExerciseDisplay(exercise) {
  const { display } = exercise

  switch (display.kind) {
    case 'icon-grid':
      return `<div class="exercise-display exercise-display--icons">${display.icon.repeat(display.count)}</div>`

    case 'sequence':
      return `<div class="exercise-display exercise-display--sequence">${display.items.join('  ')}</div>`

    case 'equation':
      return `<div class="exercise-display exercise-display--equation">${display.a} ${display.operator} ${display.b} = ?</div>`

    case 'letter':
      return `<div class="exercise-display exercise-display--letter">${display.letter}</div>`

    case 'choice-text':
      return `<div class="exercise-display exercise-display--choices">${display.options
        .map((option) => `<button type="button" class="choice-button" data-value="${option}">${option}</button>`)
        .join('')}</div>`

    case 'choice-icon':
      return `<div class="exercise-display exercise-display--choices">${display.options
        .map((option) => `<button type="button" class="choice-button" data-value="${option.value}">${option.label}</button>`)
        .join('')}</div>`

    case 'syllable-scramble':
      return `<div class="exercise-display exercise-display--syllables">${display.syllables.join(' - ')} ${display.icon ?? ''}</div>`

    case 'reading':
      return `<div class="exercise-display exercise-display--reading"><p>${display.text}</p><p class="question">${display.question}</p></div>`

    case 'fill-blank':
      return `<div class="exercise-display exercise-display--fill-blank">${display.masked}</div>`

    case 'word-prompt':
      return `<div class="exercise-display exercise-display--word-prompt">${display.icon}</div>`

    default:
      return `<div class="exercise-display">${JSON.stringify(display)}</div>`
  }
}
