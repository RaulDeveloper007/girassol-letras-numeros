// Cada rota carrega sob demanda (import dinâmico) -- com o motor novo
// (currículo/geração/correção/progressão + Dexie) ligado de verdade à tela
// de prática, carregar tudo isso de uma vez no boot do app pesaria demais
// pra quem só quer trocar de perfil ou abrir o painel do responsável.
const routes = {
  '#/': () => import('../screens/profile-select/profile-select.js').then((m) => m.renderProfileSelect),
  '#/novo-aluno': () => import('../screens/profile-select/create-profile.js').then((m) => m.renderCreateProfile),
  '#/aluno': () => import('../screens/student-home/student-home.js').then((m) => m.renderStudentHome),
  '#/praticar': () => import('../screens/praticar/praticar.js').then((m) => m.renderPraticar),
  '#/responsavel': () => import('../screens/guardian/guardian.js').then((m) => m.renderGuardian),
  '#/verificar-voz': () => import('../screens/voice-check/voice-check.js').then((m) => m.renderVoiceCheck),
  '#/diagnostico': () => import('../screens/diagnostico/diagnostico.js').then((m) => m.renderDiagnostico),
}

let rootEl = null
let currentCleanup = null

async function resolveRoute() {
  const hash = window.location.hash || '#/'
  const carregarTela = routes[hash] ?? routes['#/']
  const render = await carregarTela()

  // Se o hash mudou de novo enquanto a tela estava carregando, não
  // desenha uma tela que já não é mais a atual.
  if ((window.location.hash || '#/') !== hash) return

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
