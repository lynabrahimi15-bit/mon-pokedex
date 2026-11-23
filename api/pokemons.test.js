import { describe, it, expect, vi } from 'vitest'
import handler from './pokemons.js'

function mockRes() {
  const res = { headers: {} }
  res.status = vi.fn(() => res)
  res.json = vi.fn(() => res)
  res.setHeader = vi.fn((k, v) => {
    res.headers[k] = v
  })
  return res
}

describe('API POST /api/pokemons (tests unitaires)', () => {
  it('crée un pokémon valide (201)', () => {
    const res = mockRes()
    handler({ method: 'POST', body: { nom: 'dracolosse', element: 'dragon', poids: '210', taille: '2.2' } }, res)
    expect(res.status).toHaveBeenCalledWith(201)
    const created = res.json.mock.calls[0][0]
    expect(created).toMatchObject({ nom: 'Dracolosse', elements: ['dragon'], poids: 210, taille: 2.2 })
    expect(created.id).toMatch(/^perso-/)
  })

  it('refuse des données invalides (422) et les autres méthodes (405)', () => {
    const res = mockRes()
    handler({ method: 'POST', body: { nom: '' } }, res)
    expect(res.status).toHaveBeenCalledWith(422)

    const res2 = mockRes()
    handler({ method: 'GET' }, res2)
    expect(res2.status).toHaveBeenCalledWith(405)
  })
})
