import '../styles/autoavaliacao-rubrica.css'

/**
 * Produção livre (redação etc.): o aluno escreve a resposta e se
 * autoavalia contra a rubrica -- isso nunca é a nota final, só um
 * primeiro sinal pro próprio aluno. Toda produção livre vai pra fila do
 * responsável (ver correcao/rubrica.ts, necessitaRevisaoDoOrientador).
 */
export function criarAutoavaliacaoRubrica(container, { rubrica, onEnviar }) {
  const wrapper = document.createElement('div')
  wrapper.className = 'autoavaliacao-rubrica'

  const textarea = document.createElement('textarea')
  textarea.className = 'autoavaliacao-rubrica__texto'
  textarea.rows = 6
  textarea.placeholder = 'Escreva sua resposta aqui…'
  wrapper.appendChild(textarea)

  const tituloCriterios = document.createElement('p')
  tituloCriterios.className = 'field-label'
  tituloCriterios.textContent = 'Antes de enviar, confira:'
  wrapper.appendChild(tituloCriterios)

  const criteriosEl = document.createElement('div')
  criteriosEl.className = 'autoavaliacao-rubrica__criterios'
  wrapper.appendChild(criteriosEl)

  const pontuacoesPorCriterio = {}
  for (const criterio of rubrica.criterios) {
    pontuacoesPorCriterio[criterio.id] = 0
    const linha = document.createElement('label')
    linha.className = 'autoavaliacao-rubrica__criterio'
    linha.innerHTML = `<input type="checkbox" data-criterio="${criterio.id}" /><span>${criterio.descricao}</span>`
    criteriosEl.appendChild(linha)
  }

  criteriosEl.querySelectorAll('input[type="checkbox"]').forEach((input) => {
    input.addEventListener('change', () => {
      const criterio = rubrica.criterios.find((c) => c.id === input.dataset.criterio)
      pontuacoesPorCriterio[input.dataset.criterio] = input.checked ? criterio.pontos : 0
    })
  })

  const aviso = document.createElement('p')
  aviso.className = 'placeholder-note'
  aviso.textContent = 'Sua resposta vai para a revisão do responsável -- essa autoavaliação é só um primeiro sinal.'
  wrapper.appendChild(aviso)

  const botaoEnviar = document.createElement('button')
  botaoEnviar.type = 'button'
  botaoEnviar.textContent = 'Enviar para revisão'
  wrapper.appendChild(botaoEnviar)

  const erro = document.createElement('p')
  erro.className = 'form-error'
  wrapper.appendChild(erro)

  botaoEnviar.addEventListener('click', () => {
    const texto = textarea.value.trim()
    if (!texto) {
      erro.textContent = 'Escreva sua resposta antes de enviar.'
      return
    }
    erro.textContent = ''
    onEnviar?.({ texto, pontuacoesPorCriterio: { ...pontuacoesPorCriterio } })
  })

  container.appendChild(wrapper)

  return {
    destroy() {
      wrapper.remove()
    },
  }
}
