import '../../styles/sheet.css'
import { navigateTo } from '../../app/router.js'
import { getState } from '../../app/state.js'
import { createWritingCanvas } from '../../components/writing-canvas.js'
import { createSpeakButton } from '../../components/speak-button.js'
import { createTimer } from '../../components/timer.js'
import { renderExerciseDisplay } from './render-exercise-display.js'
import { buildMathSheet } from '../../levels/math-levels.js'
import { buildPortugueseSheet } from '../../levels/portuguese-levels.js'
import { buildEnglishSheet } from '../../levels/english-levels.js'

const SUBJECT_LABELS = {
  math: 'Matemática',
  portuguese: 'Português',
  english: 'Inglês',
}

const SHEET_BUILDERS = {
  math: buildMathSheet,
  portuguese: buildPortugueseSheet,
  english: buildEnglishSheet,
}

const SPEECH_LANG = {
  math: 'pt-BR',
  portuguese: 'pt-BR',
  english: 'en-US',
}

export function renderSheet(root) {
  const { activeStudentId, activeSubject, activeLevel } = getState()

  if (!activeStudentId || !activeSubject) {
    navigateTo('#/')
    return
  }

  const buildSheet = SHEET_BUILDERS[activeSubject]
  const level = activeLevel ?? 1
  const sheet = buildSheet({ level, size: 8 })

  let currentIndex = 0
  let writingCanvas = null

  root.innerHTML = `
    <main class="screen screen-sheet">
      <button class="back-button" id="go-back" aria-label="Voltar">←</button>
      <div class="sheet-header">
        <h1>${SUBJECT_LABELS[activeSubject]}</h1>
        <span class="sheet-stage">${sheet.stageName} · nível ${sheet.subLevel}</span>
        <span id="timer-slot"></span>
      </div>
      <p class="sheet-progress">Exercício <span id="exercise-pos"></span> de ${sheet.exercises.length}</p>
      <div id="exercise-area"></div>
      <div id="canvas-slot"></div>
      <div class="sheet-nav">
        <button id="go-prev">← Anterior</button>
        <button id="go-next">Próximo →</button>
      </div>
    </main>
  `

  const timer = createTimer(root.querySelector('#timer-slot'))

  function renderCurrentExercise() {
    const exercise = sheet.exercises[currentIndex]
    root.querySelector('#exercise-pos').textContent = String(currentIndex + 1)

    const area = root.querySelector('#exercise-area')
    area.innerHTML = `
      <p class="exercise-prompt">${exercise.prompt}</p>
      ${renderExerciseDisplay(exercise)}
    `

    const speakButton = createSpeakButton({ text: exercise.speak, lang: SPEECH_LANG[activeSubject] })
    area.querySelector('.exercise-prompt').after(speakButton)

    area.querySelectorAll('.choice-button').forEach((btn) => {
      btn.addEventListener('click', () => {
        area.querySelectorAll('.choice-button').forEach((b) => b.classList.remove('is-selected'))
        btn.classList.add('is-selected')
      })
    })

    if (writingCanvas) writingCanvas.destroy()
    writingCanvas = createWritingCanvas(root.querySelector('#canvas-slot'))

    root.querySelector('#go-prev').disabled = currentIndex === 0
    root.querySelector('#go-next').textContent =
      currentIndex === sheet.exercises.length - 1 ? 'Concluir →' : 'Próximo →'
  }

  root.querySelector('#go-back').addEventListener('click', () => navigateTo('#/aluno'))

  root.querySelector('#go-prev').addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex -= 1
      renderCurrentExercise()
    }
  })

  root.querySelector('#go-next').addEventListener('click', () => {
    if (currentIndex < sheet.exercises.length - 1) {
      currentIndex += 1
      renderCurrentExercise()
    } else {
      timer.stop()
      navigateTo('#/resultado')
    }
  })

  renderCurrentExercise()

  return () => {
    timer.destroy()
    if (writingCanvas) writingCanvas.destroy()
  }
}
