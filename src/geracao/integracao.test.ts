import { beforeAll, describe, expect, it } from 'vitest'
import { buscarBloco, carregarFase } from '../curriculo/loader.js'
import { montarFolha } from './montar-folha.js'
import { registrarTodosOsGeradores } from './registrar-todos.js'

beforeAll(() => {
  registrarTodosOsGeradores()
})

describe('integração currículo + geração', () => {
  it('monta uma folha de verdade a partir de um bloco declarado na Fase 1 de Matemática', async () => {
    const fase = await carregarFase('matematica', 1)
    const encontrado = buscarBloco(fase, 'mat-f01-n01-b02')
    expect(encontrado).not.toBeNull()

    const { itens } = montarFolha({ bloco: encontrado!.bloco, quantidadeItens: 8 })

    expect(itens).toHaveLength(8)
    for (const item of itens) {
      expect(typeof item.gabarito).toBe('number')
      expect(item.gabarito as number).toBeGreaterThanOrEqual(1)
      expect(item.gabarito as number).toBeLessThanOrEqual(10)
    }
  })
})
