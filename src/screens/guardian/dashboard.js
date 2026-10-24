import { listStudents, deleteStudent } from '../../data/students-repo.js'
import { listProgressByStudent, saveProgress } from '../../data/subject-progress-repo.js'
import { listAttemptsByStudentSubject } from '../../data/attempts-repo.js'
import { getRules, saveRules } from '../../data/progression-rules-repo.js'
import { getStageInfo, MAX_LEVEL } from '../../levels/stage-names.js'
import { exportBackupData, downloadBackupFile, importBackupData } from '../../app/backup.js'
import { saveGuardianSettings } from '../../data/guardian-settings-repo.js'

const SUBJECTS = ['math', 'portuguese', 'english']
const SUBJECT_LABELS = { math: 'Matemática', portuguese: 'Português', english: 'Inglês' }

const ERROR_TYPE_LABELS = {
  counting: 'Contagem',
  sequence: 'Sequência',
  addition: 'Adição',
  subtraction: 'Subtração',
  multiplication: 'Tabuada',
  'letter-tracing': 'Traçado de letra',
  'syllable-recognition': 'Sílaba',
  'word-building': 'Formação de palavra',
  'short-reading': 'Leitura curta',
  spelling: 'Ortografia',
  'alphabet-sound': 'Alfabeto',
  'thematic-vocabulary': 'Vocabulário',
  'cvc-word': 'Palavra CVC',
  'short-phrase': 'Frase curta',
  'spelling-en': 'Ortografia (inglês)',
}

function formatMinutesSeconds(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

function renderSubjectPanel({ subject, progress, attempts, rules, studentId, onChange }) {
  const stage = getStageInfo(progress.level)
  const recent = [...attempts].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10)

  const avgAccuracy = recent.length
    ? Math.round(recent.reduce((sum, attempt) => sum + attempt.accuracyRate, 0) / recent.length)
    : null
  const avgTime = recent.length
    ? Math.round(recent.reduce((sum, attempt) => sum + attempt.elapsedSeconds, 0) / recent.length)
    : null

  const errorCounts = {}
  for (const attempt of recent) {
    for (const tag of attempt.recurrentErrorTags ?? []) {
      errorCounts[tag] = (errorCounts[tag] ?? 0) + 1
    }
  }
  const topErrors = Object.entries(errorCounts).sort((a, b) => b[1] - a[1]).slice(0, 3)

  const section = document.createElement('section')
  section.className = 'guardian-subject-panel'
  section.innerHTML = `
    <h2>${SUBJECT_LABELS[subject]}</h2>
    <p>Estágio atual: <strong>${stage.label}</strong></p>

    <div class="level-adjust">
      <span>Ajustar nível manualmente:</span>
      <div class="level-stepper">
        <button type="button" class="level-dec" aria-label="Diminuir nível">−</button>
        <span class="level-value">${progress.level}</span>
        <button type="button" class="level-inc" aria-label="Aumentar nível">+</button>
      </div>
    </div>

    <div class="guardian-stats">
      <p>Últimas ${recent.length} folha(s): acerto médio <strong>${avgAccuracy ?? '—'}${avgAccuracy !== null ? '%' : ''}</strong>,
         tempo médio <strong>${avgTime !== null ? formatMinutesSeconds(avgTime) : '—'}</strong></p>
      <p>${
        topErrors.length
          ? `Erros mais comuns: ${topErrors.map(([type, count]) => `${ERROR_TYPE_LABELS[type] ?? type} (${count}x)`).join(', ')}`
          : 'Sem erros recorrentes registrados.'
      }</p>
    </div>

    <details class="guardian-rules">
      <summary>Regra de avanço: ${rules.sheetsRequired} folha(s) seguidas, acerto ≥ ${rules.minAccuracy}%, tempo ≤ ${Math.round(rules.maxTimeSeconds / 60)} min</summary>
      <div class="rule-fields">
        <label>Folhas seguidas <input type="number" min="1" max="10" value="${rules.sheetsRequired}" class="rule-sheets" /></label>
        <label>Acerto mínimo (%) <input type="number" min="1" max="100" value="${rules.minAccuracy}" class="rule-accuracy" /></label>
        <label>Tempo máximo (min) <input type="number" min="1" max="60" value="${Math.round(rules.maxTimeSeconds / 60)}" class="rule-time" /></label>
        <button type="button" class="rule-save">Salvar regra</button>
      </div>
    </details>
  `

  let currentLevel = progress.level

  async function persistLevel() {
    section.querySelector('.level-value').textContent = String(currentLevel)
    await saveProgress({ studentId, subject, level: currentLevel, levelSince: new Date().toISOString() })
    onChange()
  }

  section.querySelector('.level-dec').addEventListener('click', () => {
    currentLevel = Math.max(1, currentLevel - 1)
    persistLevel()
  })
  section.querySelector('.level-inc').addEventListener('click', () => {
    currentLevel = Math.min(MAX_LEVEL, currentLevel + 1)
    persistLevel()
  })

  section.querySelector('.rule-save').addEventListener('click', async () => {
    const sheetsRequired = Number(section.querySelector('.rule-sheets').value) || rules.sheetsRequired
    const minAccuracy = Number(section.querySelector('.rule-accuracy').value) || rules.minAccuracy
    const maxTimeMinutes = Number(section.querySelector('.rule-time').value) || Math.round(rules.maxTimeSeconds / 60)
    await saveRules({ subject, sheetsRequired, minAccuracy, maxTimeSeconds: maxTimeMinutes * 60 })
    onChange()
  })

  return section
}

export function renderDashboard(container) {
  let students = []
  let selectedStudentId = null

  container.innerHTML = `<p class="placeholder-note">Carregando dados…</p>`

  async function render() {
    if (!selectedStudentId) {
      container.innerHTML = `<p class="placeholder-note">Nenhum aluno cadastrado ainda.</p>`
      return
    }

    const progressList = await listProgressByStudent(selectedStudentId)
    const progressBySubject = Object.fromEntries(progressList.map((p) => [p.subject, p]))
    const currentStudent = students.find((student) => student.id === selectedStudentId)

    container.innerHTML = `
      <div class="guardian-tabs" id="student-tabs">
        ${students
          .map(
            (student) =>
              `<button class="guardian-tab ${student.id === selectedStudentId ? 'is-active' : ''}" data-student="${student.id}">${student.avatarIcon} ${student.firstName}</button>`
          )
          .join('')}
      </div>
      <button type="button" id="remove-student" class="remove-student-button">🗑 Remover perfil de ${currentStudent?.firstName ?? 'aluno'}</button>
      <div id="subject-panels"></div>
      <div class="guardian-backup">
        <h2>Backup</h2>
        <p class="placeholder-note">Exporte para levar o progresso de um aparelho para outro, e importe para restaurar.</p>
        <button type="button" id="export-backup">⬇ Exportar backup (JSON)</button>
        <label class="import-label">
          ⬆ Importar backup (JSON)
          <input type="file" id="import-backup" accept="application/json" hidden />
        </label>
        <p class="placeholder-note" id="backup-status"></p>
      </div>
      <div class="guardian-backup">
        <h2>Diagnóstico técnico</h2>
        <p><a href="#/verificar-voz">🎤 Verificar voz (síntese e reconhecimento)</a></p>
        <p><a href="#/folha-digital">📄 Pré-visualizar Folha Digital (Passo Certo)</a></p>
      </div>
    `

    container.querySelectorAll('.guardian-tab').forEach((btn) => {
      btn.addEventListener('click', () => {
        selectedStudentId = btn.dataset.student
        render()
      })
    })

    container.querySelector('#remove-student').addEventListener('click', async () => {
      const confirmed = window.confirm(
        `Remover o perfil de ${currentStudent?.firstName ?? 'aluno'}? Isso não pode ser desfeito.`
      )
      if (!confirmed) return
      await deleteStudent(selectedStudentId)
      students = await listStudents()
      selectedStudentId = students[0]?.id ?? null
      render()
    })

    const panels = container.querySelector('#subject-panels')
    for (const subject of SUBJECTS) {
      const progress = progressBySubject[subject] ?? { level: 1 }
      const attempts = await listAttemptsByStudentSubject(selectedStudentId, subject)
      const rules = await getRules(subject)
      panels.appendChild(
        renderSubjectPanel({ subject, progress, attempts, rules, studentId: selectedStudentId, onChange: render })
      )
    }

    container.querySelector('#export-backup').addEventListener('click', async () => {
      const backup = await exportBackupData()
      downloadBackupFile(backup)
      await saveGuardianSettings({ lastBackupAt: new Date().toISOString() })
      container.querySelector('#backup-status').textContent = 'Backup exportado! Veja a pasta de downloads do navegador.'
    })

    container.querySelector('#import-backup').addEventListener('change', async (event) => {
      const file = event.target.files[0]
      if (!file) return
      const statusEl = container.querySelector('#backup-status')
      try {
        const text = await file.text()
        const backup = JSON.parse(text)
        await importBackupData(backup)
        statusEl.textContent = 'Backup importado com sucesso!'
        students = await listStudents()
        render()
      } catch (error) {
        statusEl.textContent = `Erro ao importar: ${error.message}`
      }
    })
  }

  async function init() {
    students = await listStudents()
    selectedStudentId = students[0]?.id ?? null
    render()
  }

  init()

  return () => {}
}
