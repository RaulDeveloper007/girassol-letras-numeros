// KaTeX carregado sob demanda -- só pesa pra quem está numa fase que
// realmente usa notação matemática.
export async function renderizarMatematica(container, expressaoLatex, opcoes = {}) {
  const [{ default: katex }] = await Promise.all([import('katex'), import('katex/dist/katex.min.css')])

  try {
    katex.render(expressaoLatex, container, { throwOnError: false, displayMode: opcoes.exibicao ?? false })
  } catch {
    container.textContent = expressaoLatex
  }
}
