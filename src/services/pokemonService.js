import { pokeApi, appApi } from './api.js'
import { formatPokemon, getIdFromUrl, getTotalPages } from '../utils/pokemon.js'

export const PAGE_SIZE = 12

/**
 * Cache mémoire des requêtes GET (optimisation des performances) :
 * revenir sur une page déjà vue ne relance aucune requête réseau.
 * On stocke la promesse pour dédupliquer aussi les appels simultanés.
 */
const cache = new Map()

async function cachedGet(url, params) {
  const key = `${url}?${new URLSearchParams(params ?? {})}`
  if (!cache.has(key)) {
    const request = pokeApi.get(url, { params }).then((res) => res.data)
    cache.set(key, request)
    request.catch(() => cache.delete(key))
  }
  return cache.get(key)
}

export function clearCache() {
  cache.clear()
}

/** GET /pokemon?limit=X&offset=Y puis le détail de chaque pokémon de la page. */
export async function getPokemonPage(page = 1, limit = PAGE_SIZE) {
  const data = await cachedGet('/pokemon', { limit, offset: (page - 1) * limit })
  const pokemons = await Promise.all(data.results.map((p) => getPokemon(getIdFromUrl(p.url))))
  return {
    pokemons,
    total: data.count,
    totalPages: getTotalPages(data.count, limit),
    hasPrevious: Boolean(data.previous),
    hasNext: Boolean(data.next),
  }
}

/** GET /pokemon/:id (accepte aussi un nom : "pikachu"). */
export async function getPokemon(idOrName) {
  const raw = await cachedGet(`/pokemon/${String(idOrName).toLowerCase()}`)
  return formatPokemon(raw)
}

/** GET /pokemon-species/:id -> description en français. */
export async function getPokemonSpecies(id) {
  const raw = await cachedGet(`/pokemon-species/${id}`)
  const description =
    raw.flavor_text_entries
      ?.find((f) => f.language.name === 'fr')
      ?.flavor_text.replace(/[\n\f\r]/g, ' ') ?? ''
  return { description }
}

/** POST /api/pokemons */
export async function createPokemon(values) {
  const { data } = await appApi.post('/pokemons', values)
  return data
}
