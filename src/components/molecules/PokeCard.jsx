import { memo } from 'react'
import { Link } from 'react-router-dom'
import TypeBadge from '../atoms/TypeBadge.jsx'
import PokemonImage from '../atoms/PokemonImage.jsx'
import FavoriteButton from './FavoriteButton.jsx'
import { formatNumber } from '../../utils/pokemon.js'

/** Carte d'un pokémon. memo() : pas de re-rendu si ses props ne changent pas. */
function PokeCard({ id, nom, image, elements }) {
  return (
    <article className="poke-card">
      <div className="poke-card__top">
        <span className="poke-card__num">{formatNumber(id)}</span>
        <FavoriteButton pokemon={{ id, nom, image, elements }} />
      </div>
      <Link
        to={`/poke/${id}`}
        className={`bubble bubble--${elements[0]}`}
        tabIndex={-1}
        aria-hidden="true"
      >
        <PokemonImage src={image} alt="" size={136} />
      </Link>
      <h3 className="poke-card__name">{nom}</h3>
      <div className="types">
        {elements.map((element) => (
          <TypeBadge key={element} type={element} />
        ))}
      </div>
      <Link to={`/poke/${id}`} className="btn btn--soft btn--block">
        Voir détails
      </Link>
    </article>
  )
}

export default memo(PokeCard)
