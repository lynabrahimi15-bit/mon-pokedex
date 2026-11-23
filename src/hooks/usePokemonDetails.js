import { useEffect, useState } from 'react'
import { getPokemon, getPokemonSpecies } from '../services/pokemonService.js'
import { isCustomId } from '../utils/pokemon.js'
import { usePokedexStore, selectCreatedById } from '../store/usePokedexStore.js'

async function loadDetails(id) {
  const pokemon = await getPokemon(id)
  // Description en français : bonus, on ne bloque pas la page si ça échoue.
  // Le nom reste en anglais partout (liste, fiche, recherche) pour rester cohérent.
  const species = await getPokemonSpecies(pokemon.id).catch(() => ({}))
  return { ...pokemon, description: species.description ?? '' }
}

/** Détail d'un pokémon : PokéAPI, ou le store pour un pokémon créé via le formulaire. */
export function usePokemonDetails(id) {
  const custom = isCustomId(id)
  const createdPokemon = usePokedexStore(selectCreatedById(id))
  const [result, setResult] = useState({ id: null, data: null, error: null })

  useEffect(() => {
    if (custom) return undefined
    let ignore = false
    loadDetails(id)
      .then((data) => {
        if (!ignore) setResult({ id, data, error: null })
      })
      .catch((err) => {
        if (ignore) return
        const error =
          err.response?.status === 404
            ? "Ce pokémon n'existe pas."
            : 'Impossible de charger ce pokémon. Réessaie plus tard.'
        setResult({ id, data: null, error })
      })
    return () => {
      ignore = true
    }
  }, [id, custom])

  if (custom) {
    return {
      data: createdPokemon ?? null,
      error: createdPokemon ? null : "Ce pokémon personnalisé n'existe pas (ou a été supprimé).",
      isLoading: false,
    }
  }

  const isLoading = result.id !== id
  return {
    data: isLoading ? null : result.data,
    error: isLoading ? null : result.error,
    isLoading,
  }
}
