import type { FuncaoGeradora } from './tipos.js'

const registro = new Map<string, FuncaoGeradora>()

export class GeradorNaoEncontradoError extends Error {
  constructor(geradorId: string) {
    super(`Gerador não registrado: "${geradorId}"`)
    this.name = 'GeradorNaoEncontradoError'
  }
}

export function registrarGerador(geradorId: string, funcao: FuncaoGeradora): void {
  registro.set(geradorId, funcao)
}

export function obterGerador(geradorId: string): FuncaoGeradora {
  const funcao = registro.get(geradorId)
  if (!funcao) throw new GeradorNaoEncontradoError(geradorId)
  return funcao
}

export function geradorRegistrado(geradorId: string): boolean {
  return registro.has(geradorId)
}

/** Só para os testes conseguirem partir de um registro limpo. */
export function limparRegistro(): void {
  registro.clear()
}
