import { renderProfileSelect } from '../screens/profile-select/profile-select.js'
import { renderStudentHome } from '../screens/student-home/student-home.js'
import { renderSheet } from '../screens/sheet/sheet.js'
import { renderSheetResult } from '../screens/sheet-result/sheet-result.js'
import { renderGuardian } from '../screens/guardian/guardian.js'

const routes = {
  '#/': renderProfileSelect,
  '#/aluno': renderStudentHome,
  '#/folha': renderSheet,
  '#/resultado': renderSheetResult,
  '#/responsavel': renderGuardian,
}

let rootEl = null

function resolveRoute() {
  const hash = window.location.hash || '#/'
  const render = routes[hash] ?? renderProfileSelect
  rootEl.innerHTML = ''
  render(rootEl)
}

export function navigateTo(hash) {
  window.location.hash = hash
}

export function startRouter(root) {
  rootEl = root
  window.addEventListener('hashchange', resolveRoute)
  resolveRoute()
}
