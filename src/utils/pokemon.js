/** Fonctions pures autour des données pokémon (faciles à tester). */

export const ELEMENTS = {
  normal: 'Normal',
  fire: 'Feu',
  water: 'Eau',
  grass: 'Plante',
  electric: 'Électrik',
  ice: 'Glace',
  fighting: 'Combat',
  poison: 'Poison',
  ground: 'Sol',
  flying: 'Vol',
  psychic: 'Psy',
  bug: 'Insecte',
  rock: 'Roche',
  ghost: 'Spectre',
  dragon: 'Dragon',
  dark: 'Ténèbres',
  steel: 'Acier',
  fairy: 'Fée',
}

const STATS = {
  hp: 'PV',
  attack: 'Attaque',
  defense: 'Défense',
  'special-attack': 'Att. Spé.',
  'special-defense': 'Déf. Spé.',
  speed: 'Vitesse',
}

export const CUSTOM_PREFIX = 'perso-'

export function translateElement(element) {
  return ELEMENTS[element] ?? element
}

export function capitalize(text = '') {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/** "https://pokeapi.co/api/v2/pokemon/25/" -> 25 */
export function getIdFromUrl(url) {
  const match = url?.match(/\/(\d+)\/?$/)
  return match ? Number(match[1]) : null
}

export function getTotalPages(count, limit) {
  return Math.max(1, Math.ceil(count / limit))
}

export function isCustomId(id) {
  return String(id).startsWith(CUSTOM_PREFIX)
}

/** 25 -> "#0025", pokémon créé -> "Perso" */
export function formatNumber(id) {
  return isCustomId(id) ? 'Perso' : `#${String(id).padStart(4, '0')}`
}

/** Transforme la réponse brute de PokéAPI en objet simple pour l'UI. */
export function formatPokemon(raw) {
  return {
    id: raw.id,
    nom: capitalize(raw.name),
    elements: raw.types.map((t) => t.type.name),
    image:
      raw.sprites?.other?.['official-artwork']?.front_default ?? raw.sprites?.front_default ?? null,
    poids: raw.weight / 10, // hectogrammes -> kg
    taille: raw.height / 10, // décimètres -> m
    capacites: raw.abilities.map((a) => a.ability.name),
    stats: raw.stats.map((s) => ({
      nom: STATS[s.stat.name] ?? s.stat.name,
      valeur: s.base_stat,
    })),
  }
}

/** 12.5 -> "12,5" (format français) */
export function formatDecimal(value) {
  return Number(value).toLocaleString('fr-FR', { maximumFractionDigits: 1 })
}

/** "shield-dust" -> "Shield Dust" */
export function formatAbility(name = '') {
  return name.split('-').map(capitalize).join(' ')
}
