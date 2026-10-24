import { renderProfileSelect } from '../screens/profile-select/profile-select.js'
import { renderCreateProfile } from '../screens/profile-select/create-profile.js'
import { renderStudentHome } from '../screens/student-home/student-home.js'
import { renderSheet } from '../screens/sheet/sheet.js'
import { renderSheetResult } from '../screens/sheet-result/sheet-result.js'
import { renderGuardian } from '../screens/guardian/guardian.js'

const routes = {
  '#/': renderProfileSelect,
  '#/novo-aluno': renderCreateProfile,
  '#/aluno': renderStudentHome,
  '#/folha': renderSheet,
  '#/resultado': renderSheetResult,
  '#/responsavel': renderGuardian,
}

let rootEl = null
let currentCleanup = null

function resolveRoute() {
  const hash = window.location.hash || '#/'
  const render = routes[hash] ?? renderProfileSelect

  if (typeof currentCleanup === 'function') {
    currentCleanup()
  }

  rootEl.innerHTML = ''
  currentCleanup = render(rootEl) ?? null
}

export function navigateTo(hash) {
  window.location.hash = hash
}

export function startRouter(root) {
  rootEl = root
  window.addEventListener('hashchange', resolveRoute)
  resolveRoute()
}
