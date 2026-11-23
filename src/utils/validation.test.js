import { describe, it, expect } from 'vitest'
import { validatePokemon } from './validation.js'

const valid = { nom: 'Dracolosse', element: 'dragon', poids: '210', taille: '2.2' }

describe('validatePokemon (tests unitaires)', () => {
  it("n'a aucune erreur pour des données valides", () => {
    expect(validatePokemon(valid)).toEqual({})
  })

  it('signale chaque champ invalide', () => {
    const errors = validatePokemon({ nom: 'a', element: 'lave', poids: '-1', taille: '', image: 'pas-une-url' })
    expect(Object.keys(errors).sort()).toEqual(['element', 'image', 'nom', 'poids', 'taille'])
  })
})
