import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Gestion d'état moderne : store global Zustand, persisté dans le localStorage.
 * - favorites : pokémons mis en favori (depuis la liste ou la fiche)
 * - created   : pokémons créés via le formulaire
 * Les composants s'abonnent uniquement à la partie du state qu'ils utilisent
 * (sélecteurs), donc seuls eux se re-rendent quand elle change.
 */
export const usePokedexStore = create(
  persist(
    (set) => ({
      favorites: [],
      created: [],

      toggleFavorite: ({ id, nom, image, elements }) =>
        set((state) =>
          state.favorites.some((f) => f.id === id)
            ? { favorites: state.favorites.filter((f) => f.id !== id) }
            : { favorites: [...state.favorites, { id, nom, image, elements }] },
        ),

      addCreated: (pokemon) => set((state) => ({ created: [pokemon, ...state.created] })),

      removeCreated: (id) =>
        set((state) => ({
          created: state.created.filter((p) => p.id !== id),
          favorites: state.favorites.filter((f) => f.id !== id),
        })),
    }),
    { name: 'pokedex-storage' },
  ),
)

export const selectIsFavorite = (id) => (state) => state.favorites.some((f) => f.id === id)
export const selectCreatedById = (id) => (state) => state.created.find((p) => p.id === id)
