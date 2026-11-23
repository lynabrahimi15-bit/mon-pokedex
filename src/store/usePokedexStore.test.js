import { describe, it, expect, beforeEach } from 'vitest'
import { usePokedexStore } from './usePokedexStore.js'

const pikachu = { id: 25, nom: 'Pikachu', image: 'p.png', elements: ['electric'] }

describe('store Zustand (tests unitaires)', () => {
  beforeEach(() => usePokedexStore.setState({ favorites: [], created: [] }))

  it('ajoute puis retire un favori', () => {
    usePokedexStore.getState().toggleFavorite(pikachu)
    expect(usePokedexStore.getState().favorites).toEqual([pikachu])
    usePokedexStore.getState().toggleFavorite(pikachu)
    expect(usePokedexStore.getState().favorites).toEqual([])
  })

  it('supprimer un pokémon créé le retire aussi des favoris', () => {
    const perso = { ...pikachu, id: 'perso-1' }
    usePokedexStore.getState().addCreated(perso)
    usePokedexStore.getState().toggleFavorite(perso)
    usePokedexStore.getState().removeCreated('perso-1')
    expect(usePokedexStore.getState()).toMatchObject({ created: [], favorites: [] })
  })
})
