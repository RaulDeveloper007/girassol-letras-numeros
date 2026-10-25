import { describe, expect, it } from 'vitest'
import { buscarBloco, carregarFase, FaseNaoEncontradaError, listarFasesDisponiveis, proximoBlocoId } from './loader.js'

describe('carregarFase', () => {
  it('carrega a fase 1 de matemática', async () => {
    const fase = await carregarFase('matematica', 1)
    expect(fase.disciplina).toBe('matematica')
    expect(fase.faseNumero).toBe(1)
    expect(fase.niveis.length).toBeGreaterThan(0)
  })

  it('usa cache na segunda chamada (mesma referência de objeto)', async () => {
    const primeira = await carregarFase('matematica', 1)
    const segunda = await carregarFase('matematica', 1)
    expect(segunda).toBe(primeira)
  })

  it('lança FaseNaoEncontradaError para uma fase inexistente', async () => {
    await expect(carregarFase('matematica', 99)).rejects.toBeInstanceOf(FaseNaoEncontradaError)
  })
})

describe('listarFasesDisponiveis', () => {
  it('lista as fases existentes de matemática em ordem', () => {
    expect(listarFasesDisponiveis('matematica')).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17])
  })

  it('lista as fases existentes de português em ordem', () => {
    expect(listarFasesDisponiveis('portugues')).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13])
  })

  it('lista as fases existentes de inglês em ordem', () => {
    expect(listarFasesDisponiveis('ingles')).toEqual([1, 2, 3, 4, 5])
  })
})

describe('buscarBloco / proximoBlocoId', () => {
  it('encontra um bloco pelo id e o nível que o contém', async () => {
    const fase = await carregarFase('matematica', 1)
    const resultado = buscarBloco(fase, 'mat-f01-n01-b02')
    expect(resultado?.bloco.id).toBe('mat-f01-n01-b02')
    expect(resultado?.nivel.numero).toBe(1)
  })

  it('retorna null para um bloco que não existe', async () => {
    const fase = await carregarFase('matematica', 1)
    expect(buscarBloco(fase, 'nao-existe')).toBeNull()
  })

  it('acha o próximo bloco na sequência declarada', async () => {
    const fase = await carregarFase('matematica', 1)
    expect(proximoBlocoId(fase, 'mat-f01-n01-b01')).toBe('mat-f01-n01-b02')
  })

  it('atravessa a fronteira entre níveis dentro da mesma fase', async () => {
    const fase = await carregarFase('matematica', 1)
    expect(proximoBlocoId(fase, 'mat-f01-n01-b03')).toBe('mat-f01-n02-b01')
  })

  it('retorna null quando é o último bloco da fase inteira', async () => {
    const fase = await carregarFase('matematica', 1)
    expect(proximoBlocoId(fase, 'mat-f01-n05-b02')).toBeNull()
  })
})
