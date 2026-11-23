import { describe, it, expect } from 'vitest'
import {
  formatAbility,
  formatDecimal,
  formatNumber,
  formatPokemon,
  getIdFromUrl,
  getTotalPages,
  isCustomId,
  translateElement,
} from './pokemon.js'

describe('utils/pokemon (tests unitaires)', () => {
  it("extrait l'id depuis une URL PokéAPI", () => {
    expect(getIdFromUrl('https://pokeapi.co/api/v2/pokemon/25/')).toBe(25)
    expect(getIdFromUrl('https://pokeapi.co/api/v2/pokemon/150')).toBe(150)
    expect(getIdFromUrl(undefined)).toBeNull()
  })

  it('calcule le nombre total de pages (minimum 1)', () => {
    expect(getTotalPages(1302, 12)).toBe(109)
    expect(getTotalPages(24, 12)).toBe(2)
    expect(getTotalPages(0, 12)).toBe(1)
  })

  it('traduit les éléments en français', () => {
    expect(translateElement('electric')).toBe('Électrik')
    expect(translateElement('grass')).toBe('Plante')
    expect(translateElement('inconnu')).toBe('inconnu')
  })

  it('formate le numéro et reconnaît les pokémons personnalisés', () => {
    expect(formatNumber(25)).toBe('#0025')
    expect(isCustomId('perso-abc')).toBe(true)
    expect(isCustomId(25)).toBe(false)
    expect(formatNumber('perso-abc')).toBe('Perso')
  })

  it('transforme la réponse brute de PokéAPI', () => {
    const raw = {
      id: 25,
      name: 'pikachu',
      weight: 60,
      height: 4,
      types: [{ type: { name: 'electric' } }],
      sprites: { other: { 'official-artwork': { front_default: 'pikachu.png' } } },
      abilities: [{ ability: { name: 'static' } }],
      stats: [{ stat: { name: 'hp' }, base_stat: 35 }],
    }
    expect(formatPokemon(raw)).toEqual({
      id: 25,
      nom: 'Pikachu',
      elements: ['electric'],
      image: 'pikachu.png',
      poids: 6,
      taille: 0.4,
      capacites: ['static'],
      stats: [{ nom: 'PV', valeur: 35 }],
    })
  })

  it('formate les mesures et les talents pour l\'affichage', () => {
    expect(formatDecimal(12.5)).toBe('12,5')
    expect(formatDecimal(6)).toBe('6')
    expect(formatAbility('shield-dust')).toBe('Shield Dust')
  })
})
