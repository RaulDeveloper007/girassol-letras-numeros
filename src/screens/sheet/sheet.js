import '../../styles/sheet.css'
import { navigateTo } from '../../app/router.js'
import { getState, setState } from '../../app/state.js'
import { createWritingCanvas } from '../../components/writing-canvas.js'
import { createSpeakButton } from '../../components/speak-button.js'
import { createBigKeyboard } from '../../components/big-keyboard.js'
import { createTimer } from '../../components/timer.js'
import { renderExerciseDisplay } from './render-exercise-display.js'
import { buildMathSheet } from '../../levels/math-levels.js'
import { buildPortugueseSheet } from '../../levels/portuguese-levels.js'
import { buildEnglishSheet } from '../../levels/english-levels.js'
import { ensureProgress } from '../../data/subject-progress-repo.js'
import { getLastSheet } from '../../data/sheets-repo.js'
import { completeSheet } from '../../app/complete-sheet.js'

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
  const { activeStudentId, activeSubject } = getState()

  if (!activeStudentId || !activeSubject) {
    navigateTo('#/')
    return
  }

  let writingCanvas = null
  let currentKeyboard = null
  let timer = null
  let currentIndex = 0
  let exerciseStartedAt = Date.now()
  const exerciseResults = []
  let sheet = null

  root.innerHTML = `
    <main class="screen screen-sheet">
      <button class="back-button" id="go-back" aria-label="Voltar">←</button>
      <p class="placeholder-note">Preparando a folha…</p>
    </main>
  `
  root.querySelector('#go-back').addEventListener('click', () => navigateTo('#/aluno'))

  function renderShell() {
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
    root.querySelector('#go-back').addEventListener('click', () => navigateTo('#/aluno'))
    root.querySelector('#go-prev').addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex -= 1
        renderCurrentExercise()
      }
    })
    root.querySelector('#go-next').addEventListener('click', handleNext)
  }

  async function handleNext() {
    if (currentIndex < sheet.exercises.length - 1) {
      currentIndex += 1
      renderCurrentExercise()
      return
    }

    timer.stop()
    const elapsedSeconds = timer.getSeconds()
    const summary = await completeSheet({ studentId: activeStudentId, sheet, exerciseResults, elapsedSeconds })
    setState({ lastSheetSummary: { ...summary, subject: activeSubject } })
    navigateTo('#/resultado')
  }

  function renderCurrentExercise() {
    const exercise = sheet.exercises[currentIndex]
    const existingResult = exerciseResults[currentIndex] ?? null
    exerciseStartedAt = Date.now()

    root.querySelector('#exercise-pos').textContent = String(currentIndex + 1)

    const area = root.querySelector('#exercise-area')
    area.innerHTML = `
      <p class="exercise-prompt">${exercise.prompt}</p>
      ${renderExerciseDisplay(exercise)}
      <div class="exercise-feedback" id="exercise-feedback"></div>
      <div id="answer-area"></div>
    `

    const speakButton = createSpeakButton({ text: exercise.speak, lang: SPEECH_LANG[activeSubject] })
    area.querySelector('.exercise-prompt').after(speakButton)

    if (writingCanvas) writingCanvas.destroy()
    writingCanvas = createWritingCanvas(root.querySelector('#canvas-slot'))

    if (currentKeyboard) {
      currentKeyboard.destroy()
      currentKeyboard = null
    }

    function showFeedback(isCorrect) {
      const feedbackEl = area.querySelector('#exercise-feedback')
      if (isCorrect === null || isCorrect === undefined) {
        feedbackEl.textContent = ''
        feedbackEl.className = 'exercise-feedback'
        return
      }
      feedbackEl.textContent = isCorrect ? '✅ Muito bem!' : '❌ Tente de novo!'
      feedbackEl.className = `exercise-feedback ${isCorrect ? 'is-correct' : 'is-wrong'}`
    }

    function recordResult(result) {
      exerciseResults[currentIndex] = {
        ...result,
        timeSpentSeconds: Math.round((Date.now() - exerciseStartedAt) / 1000),
      }
      root.querySelector('#go-next').disabled = !exerciseResults[currentIndex].answered
    }

    if (exercise.interaction === 'trace') {
      const doneButton = document.createElement('button')
      doneButton.type = 'button'
      doneButton.className = 'trace-done-button'
      doneButton.textContent = existingResult?.answered ? 'Traçado concluído ✓' : 'Concluí o traçado ✓'
      doneButton.addEventListener('click', () => {
        recordResult({ graded: false, answered: true, isCorrect: null, studentAnswer: null })
        doneButton.textContent = 'Traçado concluído ✓'
      })
      area.querySelector('#answer-area').appendChild(doneButton)
    } else if (exercise.interaction === 'choice') {
      area.querySelectorAll('.choice-button').forEach((btn) => {
        if (existingResult?.studentAnswer === btn.dataset.value) btn.classList.add('is-selected')
        btn.addEventListener('click', () => {
          area.querySelectorAll('.choice-button').forEach((b) => b.classList.remove('is-selected'))
          btn.classList.add('is-selected')
          const isCorrect = btn.dataset.value === exercise.correctValue
          showFeedback(isCorrect)
          recordResult({ graded: true, answered: true, isCorrect, studentAnswer: btn.dataset.value })
        })
      })
      if (existingResult) showFeedback(existingResult.isCorrect)
    } else {
      const keyboardMode = exercise.subject === 'math' ? 'numeric' : 'alpha'
      currentKeyboard = createBigKeyboard(area.querySelector('#answer-area'), {
        mode: keyboardMode,
        onSubmit: (value) => {
          if (!value) return
          const isCorrect = String(value).trim().toUpperCase() === String(exercise.expectedAnswer).trim().toUpperCase()
          showFeedback(isCorrect)
          recordResult({ graded: true, answered: true, isCorrect, studentAnswer: value })
        },
      })
      if (existingResult?.studentAnswer) {
        currentKeyboard.setValue(existingResult.studentAnswer)
        showFeedback(existingResult.isCorrect)
      }
    }

    root.querySelector('#go-prev').disabled = currentIndex === 0
    root.querySelector('#go-next').disabled = !existingResult?.answered
    root.querySelector('#go-next').textContent =
      currentIndex === sheet.exercises.length - 1 ? 'Concluir →' : 'Próximo →'
  }

  async function init() {
    const buildSheetFn = SHEET_BUILDERS[activeSubject]
    const progress = await ensureProgress(activeStudentId, activeSubject)
    const lastSheet = await getLastSheet(activeStudentId, activeSubject)
    const excludeSignature = lastSheet && lastSheet.level === progress.level ? lastSheet.signature : null

    sheet = buildSheetFn({ level: progress.level, size: 8, excludeSignature })
    sheet.startedAt = new Date().toISOString()

    renderShell()
    timer = createTimer(root.querySelector('#timer-slot'))
    renderCurrentExercise()
  }

  init()

  return () => {
    if (timer) timer.destroy()
    if (writingCanvas) writingCanvas.destroy()
    if (currentKeyboard) currentKeyboard.destroy()
  }
}
