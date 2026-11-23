import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderApp } from './renderApp.jsx'
import * as service from '../../services/pokemonService.js'
import { usePokedexStore } from '../../store/usePokedexStore.js'

vi.mock('../../services/pokemonService.js')

const page1 = {
  pokemons: [
    { id: 1, nom: 'Bulbasaur', image: null, elements: ['grass', 'poison'] },
    { id: 4, nom: 'Charmander', image: null, elements: ['fire'] },
  ],
  total: 4,
  totalPages: 2,
  hasPrevious: false,
  hasNext: true,
}
const page2 = {
  pokemons: [{ id: 25, nom: 'Pikachu', image: null, elements: ['electric'] }],
  total: 4,
  totalPages: 2,
  hasPrevious: true,
  hasNext: false,
}

describe('Parcours utilisateur : liste, pagination, détail (tests fonctionnels)', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    usePokedexStore.setState({ favorites: [], created: [] })
    service.getPokemonPage.mockImplementation(async (page) => (page === 1 ? page1 : page2))
  })

  it('affiche la liste puis passe à la page suivante', async () => {
    const user = userEvent.setup()
    renderApp('/')

    expect(await screen.findByText('Bulbasaur')).toBeInTheDocument()
    expect(screen.getByText('Page 1 / 2')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /page précédente/i })).toBeDisabled()

    await user.click(screen.getByRole('button', { name: /page suivante/i }))

    expect(await screen.findByText('Pikachu')).toBeInTheDocument()
    expect(screen.getByText('Page 2 / 2')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /page suivante/i })).toBeDisabled()
    expect(service.getPokemonPage).toHaveBeenCalledWith(2)
  })

  it('ouvre la fiche détail depuis la liste', async () => {
    service.getPokemon.mockResolvedValue({
      id: 4,
      nom: 'Charmander',
      image: null,
      elements: ['fire'],
      poids: 8.5,
      taille: 0.6,
      capacites: ['blaze'],
      stats: [{ nom: 'PV', valeur: 39 }],
    })
    service.getPokemonSpecies.mockResolvedValue({ description: 'Une flamme brûle au bout de sa queue.' })

    const user = userEvent.setup()
    renderApp('/')
    await screen.findByText('Charmander')
    await user.click(screen.getAllByRole('link', { name: 'Voir détails' })[1])

    // level 1 = le titre de la fiche (la liste affiche aussi "Charmander" dans un h3)
    expect(await screen.findByRole('heading', { level: 1, name: 'Charmander' })).toBeInTheDocument()
    expect(screen.getByText('8,5 kg')).toBeInTheDocument()
    expect(screen.getByText('Une flamme brûle au bout de sa queue.')).toBeInTheDocument()
    expect(service.getPokemon).toHaveBeenCalledWith('4')
  })

  it("affiche les messages d'état : liste vide et erreur", async () => {
    service.getPokemonPage.mockResolvedValueOnce({ ...page1, pokemons: [] })
    const { unmount } = renderApp('/')
    expect(await screen.findByText('Aucun pokemon disponible.')).toBeInTheDocument()
    unmount()

    service.getPokemonPage.mockRejectedValueOnce(new Error('réseau'))
    renderApp('/')
    expect(await screen.findByRole('alert')).toHaveTextContent('Impossible de charger les pokémons')
  })
})
