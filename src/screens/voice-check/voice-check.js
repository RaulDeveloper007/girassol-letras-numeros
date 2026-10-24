// Etapa 1.3 — Tela de diagnóstico de voz: lista as vozes de síntese
// disponíveis, testa a fala em pt-BR e en-US, e testa o reconhecimento de
// fala (Camada 1 — Web Speech API) nos dois idiomas. É a tela que confirma
// se a Etapa 1 (setup-voz-android.ps1 / setup-voz-windows.ps1) funcionou.

const TEST_PHRASES = {
  'pt-BR': 'A folha de hoje tem oito exercícios.',
  'en-US': 'Today\'s sheet has eight exercises.',
}

function speak(text, lang, onEnd) {
  if (!('speechSynthesis' in window)) {
    onEnd?.({ ok: false, reason: 'speechSynthesis indisponível neste navegador.' })
    return
  }
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = lang
  const voices = window.speechSynthesis.getVoices()
  const match = voices.find((v) => v.lang === lang) ?? voices.find((v) => v.lang.startsWith(lang.split('-')[0]))
  if (match) utterance.voice = match
  utterance.onend = () => onEnd?.({ ok: true, voice: match?.name ?? null, local: match?.localService ?? null })
  utterance.onerror = (e) => onEnd?.({ ok: false, reason: e.error })
  window.speechSynthesis.speak(utterance)
}

function getRecognitionCtor() {
  return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null
}

function testRecognition(lang, { onResult, onError, onEnd }) {
  const Ctor = getRecognitionCtor()
  if (!Ctor) {
    onError?.('SpeechRecognition indisponível neste navegador.')
    return null
  }
  const recognition = new Ctor()
  recognition.lang = lang
  recognition.interimResults = false
  recognition.maxAlternatives = 1

  recognition.onresult = (event) => {
    const transcript = event.results[0]?.[0]?.transcript ?? ''
    onResult?.(transcript)
  }
  recognition.onerror = (event) => onError?.(event.error)
  recognition.onend = () => onEnd?.()

  recognition.start()
  return recognition
}

function renderVoiceList(container) {
  const voices = window.speechSynthesis?.getVoices?.() ?? []
  if (voices.length === 0) {
    container.innerHTML = '<p>Nenhuma voz encontrada ainda (em alguns navegadores leva um instante — recarregue a página se a lista continuar vazia).</p>'
    return
  }

  const relevant = voices.filter((v) => v.lang.startsWith('pt') || v.lang.startsWith('en'))
  const rows = relevant
    .map(
      (v) =>
        `<tr><td>${v.name}</td><td>${v.lang}</td><td>${v.localService ? '✅ offline' : '⚠️ online'}</td></tr>`
    )
    .join('')

  container.innerHTML = `
    <table class="voice-table">
      <thead><tr><th>Voz</th><th>Idioma</th><th>Modo</th></tr></thead>
      <tbody>${rows || '<tr><td colspan="3">Nenhuma voz pt/en encontrada.</td></tr>'}</tbody>
    </table>
    <p class="voice-hint">Pelo menos uma linha de "pt" e uma de "en" devem aparecer como
    <strong>✅ offline</strong>. Se só houver "⚠️ online", volte à Etapa 1 e baixe os pacotes de voz
    do sistema (Redmi 9: Configurações de TTS; Windows: Configurações &gt; Hora e idioma &gt; Fala).</p>
  `
}

export function renderVoiceCheck(root) {
  root.innerHTML = `
    <div class="voice-check-screen">
      <h1>Verificar voz</h1>
      <p>Esta tela confirma se a Etapa 1 (síntese e reconhecimento de fala offline)
      foi concluída neste aparelho.</p>

      <section>
        <h2>1. Vozes de síntese instaladas</h2>
        <div id="voice-list">Carregando...</div>
      </section>

      <section>
        <h2>2. Teste de síntese de voz</h2>
        <div class="voice-check-row">
          <button id="test-tts-pt" type="button">🔊 Testar em Português</button>
          <button id="test-tts-en" type="button">🔊 Testar em Inglês</button>
        </div>
        <p id="tts-result" class="voice-result"></p>
      </section>

      <section>
        <h2>3. Teste de reconhecimento de fala</h2>
        <p>Toque no botão, aguarde o ícone ficar vermelho e fale a frase mostrada.</p>
        <div class="voice-check-row">
          <button id="test-asr-pt" type="button">🎤 Testar em Português</button>
          <button id="test-asr-en" type="button">🎤 Testar em Inglês</button>
        </div>
        <p id="asr-phrase" class="voice-phrase"></p>
        <p id="asr-result" class="voice-result"></p>
      </section>

      <section>
        <h2>Resumo</h2>
        <ul id="voice-summary">
          <li id="sum-tts-pt">⬜ Síntese pt-BR</li>
          <li id="sum-tts-en">⬜ Síntese en-US</li>
          <li id="sum-asr-pt">⬜ Reconhecimento pt-BR</li>
          <li id="sum-asr-en">⬜ Reconhecimento en-US</li>
        </ul>
        <p class="voice-hint">Marque no SETUP_VOZ.md os itens que ficaram ✅ neste aparelho.</p>
      </section>
    </div>
  `

  const voiceListEl = root.querySelector('#voice-list')
  const ttsResultEl = root.querySelector('#tts-result')
  const asrPhraseEl = root.querySelector('#asr-phrase')
  const asrResultEl = root.querySelector('#asr-result')

  function marcar(id, ok) {
    const el = root.querySelector(`#${id}`)
    if (el) el.textContent = el.textContent.replace(/^[⬜✅❌]/, ok ? '✅' : '❌')
  }

  // getVoices() costuma só preencher depois do evento 'voiceschanged'.
  renderVoiceList(voiceListEl)
  const onVoicesChanged = () => renderVoiceList(voiceListEl)
  window.speechSynthesis?.addEventListener?.('voiceschanged', onVoicesChanged)

  root.querySelector('#test-tts-pt').addEventListener('click', () => {
    ttsResultEl.textContent = 'Falando...'
    speak(TEST_PHRASES['pt-BR'], 'pt-BR', (r) => {
      ttsResultEl.textContent = r.ok
        ? `✅ OK — voz: ${r.voice ?? '(padrão)'} — ${r.local ? 'offline' : 'online'}`
        : `❌ Falhou: ${r.reason}`
      marcar('sum-tts-pt', r.ok)
    })
  })

  root.querySelector('#test-tts-en').addEventListener('click', () => {
    ttsResultEl.textContent = 'Speaking...'
    speak(TEST_PHRASES['en-US'], 'en-US', (r) => {
      ttsResultEl.textContent = r.ok
        ? `✅ OK — voz: ${r.voice ?? '(padrão)'} — ${r.local ? 'offline' : 'online'}`
        : `❌ Falhou: ${r.reason}`
      marcar('sum-tts-en', r.ok)
    })
  })

  function rodarTesteAsr(lang, sumId) {
    asrPhraseEl.textContent = `Fale: "${TEST_PHRASES[lang]}"`
    asrResultEl.textContent = '🔴 Ouvindo...'
    testRecognition(lang, {
      onResult: (transcript) => {
        asrResultEl.textContent = `✅ Reconhecido: "${transcript}"`
        marcar(sumId, true)
      },
      onError: (err) => {
        asrResultEl.textContent = `❌ Erro: ${err}`
        marcar(sumId, false)
      },
      onEnd: () => {
        if (asrResultEl.textContent === '🔴 Ouvindo...') {
          asrResultEl.textContent = '❌ Nada reconhecido (tente novamente, mais perto do microfone).'
          marcar(sumId, false)
        }
      },
    })
  }

  root.querySelector('#test-asr-pt').addEventListener('click', () => rodarTesteAsr('pt-BR', 'sum-asr-pt'))
  root.querySelector('#test-asr-en').addEventListener('click', () => rodarTesteAsr('en-US', 'sum-asr-en'))

  return () => {
    window.speechSynthesis?.removeEventListener?.('voiceschanged', onVoicesChanged)
    window.speechSynthesis?.cancel?.()
  }
}
