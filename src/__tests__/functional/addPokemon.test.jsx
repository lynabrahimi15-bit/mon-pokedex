import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderApp } from './renderApp.jsx'
import * as service from '../../services/pokemonService.js'
import { usePokedexStore } from '../../store/usePokedexStore.js'

vi.mock('../../services/pokemonService.js')

describe('Parcours utilisateur : ajout via le formulaire (tests fonctionnels)', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    usePokedexStore.setState({ favorites: [], created: [] })
  })

  it("bloque l'envoi si le formulaire est invalide", async () => {
    const user = userEvent.setup()
    renderApp('/ajouter')

    await user.click(await screen.findByRole('button', { name: 'Ajouter le pokémon' }))

    expect(screen.getByText('Le nom doit contenir au moins 2 caractères.')).toBeInTheDocument()
    expect(service.createPokemon).not.toHaveBeenCalled()
  })

  it('envoie le POST, affiche la fiche puis le pokémon dans « Mes Pokémon »', async () => {
    service.createPokemon.mockImplementation(async (values) => ({
      id: 'perso-test',
      nom: values.nom,
      elements: [values.element],
      poids: Number(values.poids),
      taille: Number(values.taille),
      image: null,
      description: values.description,
    }))
    const user = userEvent.setup()
    renderApp('/ajouter')

    await user.type(await screen.findByLabelText('Nom *'), 'Dracolosse')
    await user.selectOptions(screen.getByLabelText('Élément *'), 'dragon')
    await user.type(screen.getByLabelText('Poids (kg) *'), '210')
    await user.type(screen.getByLabelText('Taille (m) *'), '2.2')
    await user.click(screen.getByRole('button', { name: 'Ajouter le pokémon' }))

    expect(service.createPokemon).toHaveBeenCalledWith(
      expect.objectContaining({ nom: 'Dracolosse', element: 'dragon', poids: '210', taille: '2.2' }),
    )
    // Redirection vers la fiche du nouveau pokémon
    expect(await screen.findByRole('heading', { name: 'Dracolosse' })).toBeInTheDocument()

    // Il apparaît dans "Mes Pokémon" grâce au store global
    await user.click(screen.getByRole('link', { name: /mes pokémon/i }))
    expect(await screen.findByText('Mes créations (1)')).toBeInTheDocument()
    expect(screen.getByText('Dracolosse')).toBeInTheDocument()
  })
})
