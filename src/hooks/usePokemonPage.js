import { useEffect, useState } from 'react'
import { getPokemonPage } from '../services/pokemonService.js'

/**
 * Charge une page de pokémons (useState + useEffect).
 * On mémorise la page à laquelle correspond le résultat : si elle ne correspond
 * pas à la page demandée, c'est qu'un chargement est en cours.
 */
export function usePokemonPage(page) {
  const [result, setResult] = useState({ page: null, data: null, error: null })

  useEffect(() => {
    let ignore = false // évite d'afficher une réponse arrivée trop tard
    getPokemonPage(page)
      .then((data) => {
        if (!ignore) setResult({ page, data, error: null })
      })
      .catch(() => {
        if (!ignore) {
          setResult({ page, data: null, error: 'Impossible de charger les pokémons. Réessaie plus tard.' })
        }
      })
    return () => {
      ignore = true
    }
  }, [page])

  const isLoading = result.page !== page
  return {
    data: isLoading ? null : result.data,
    error: isLoading ? null : result.error,
    isLoading,
  }
}
