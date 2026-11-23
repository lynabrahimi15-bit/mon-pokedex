import { usePokedexStore, selectIsFavorite } from '../../store/usePokedexStore.js'

export default function FavoriteButton({ pokemon }) {
  const isFavorite = usePokedexStore(selectIsFavorite(pokemon.id))
  const toggleFavorite = usePokedexStore((state) => state.toggleFavorite)

  return (
    <button
      type="button"
      className={`fav-btn ${isFavorite ? 'fav-btn--active' : ''}`}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? `Retirer ${pokemon.nom} des favoris` : `Ajouter ${pokemon.nom} aux favoris`}
      onClick={() => toggleFavorite(pokemon)}
    >
      {isFavorite ? '★' : '☆'}
    </button>
  )
}
