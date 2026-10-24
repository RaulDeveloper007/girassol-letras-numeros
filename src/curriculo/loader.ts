import type { DisciplinaId, FaseArquivo } from './tipos.js'

// import.meta.glob faz o Vite code-splitar cada arquivo de fase no seu
// próprio chunk, carregado só quando chamado — nunca o currículo inteiro de
// uma vez. É isso que mantém o carregamento inicial leve no Redmi 9 mesmo
// com um currículo sem teto (17+13+10 fases).
const modulosDeFase = import.meta.glob<FaseArquivo>('./*/fase-*.json', {
  import: 'default',
})

const cache = new Map<string, FaseArquivo>()

function chaveDaFase(disciplina: DisciplinaId, faseNumero: number): string {
  const numeroFormatado = String(faseNumero).padStart(2, '0')
  return `./${disciplina}/fase-${numeroFormatado}.json`
}

export class FaseNaoEncontradaError extends Error {
  constructor(disciplina: DisciplinaId, faseNumero: number) {
    super(`Fase não encontrada no currículo: ${disciplina} fase ${faseNumero}`)
    this.name = 'FaseNaoEncontradaError'
  }
}

export async function carregarFase(disciplina: DisciplinaId, faseNumero: number): Promise<FaseArquivo> {
  const chave = chaveDaFase(disciplina, faseNumero)

  const emCache = cache.get(chave)
  if (emCache) return emCache

  const importar = modulosDeFase[chave]
  if (!importar) throw new FaseNaoEncontradaError(disciplina, faseNumero)

  const fase = await importar()
  cache.set(chave, fase)
  return fase
}

export function listarFasesDisponiveis(disciplina: DisciplinaId): number[] {
  const prefixo = `./${disciplina}/fase-`
  return Object.keys(modulosDeFase)
    .filter((caminho) => caminho.startsWith(prefixo))
    .map((caminho) => {
      const match = caminho.match(/fase-(\d+)\.json$/)
      return match ? Number(match[1]) : null
    })
    .filter((numero): numero is number => numero !== null)
    .sort((a, b) => a - b)
}

export function buscarBloco(fase: FaseArquivo, blocoId: string) {
  for (const nivel of fase.niveis) {
    const bloco = nivel.blocos.find((b) => b.id === blocoId)
    if (bloco) return { nivel, bloco }
  }
  return null
}

export function proximoBlocoId(fase: FaseArquivo, blocoAtualId: string): string | null {
  const todosOsBlocos = fase.niveis.flatMap((nivel) => nivel.blocos.map((bloco) => bloco.id))
  const indiceAtual = todosOsBlocos.indexOf(blocoAtualId)
  if (indiceAtual === -1 || indiceAtual === todosOsBlocos.length - 1) return null
  return todosOsBlocos[indiceAtual + 1] ?? null
}
