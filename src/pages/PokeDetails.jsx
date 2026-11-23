import { Link, useNavigate, useParams } from 'react-router-dom'
import { usePokemonDetails } from '../hooks/usePokemonDetails.js'
import { usePokedexStore } from '../store/usePokedexStore.js'
import { formatAbility, formatDecimal, formatNumber, isCustomId } from '../utils/pokemon.js'
import PageLayout from '../components/templates/PageLayout.jsx'
import TypeBadge from '../components/atoms/TypeBadge.jsx'
import PokemonImage from '../components/atoms/PokemonImage.jsx'
import Loader from '../components/atoms/Loader.jsx'
import Message from '../components/atoms/Message.jsx'
import Button from '../components/atoms/Button.jsx'
import FavoriteButton from '../components/molecules/FavoriteButton.jsx'

// Échelle des barres : la grande majorité des stats de base sont sous 150
const STAT_SCALE = 150

export default function PokeDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: pokemon, isLoading, error } = usePokemonDetails(id)
  const removeCreated = usePokedexStore((state) => state.removeCreated)

  const hero = (
    <Button variant="back" onClick={() => navigate(-1)}>
      ← Retour
    </Button>
  )

  if (isLoading) {
    return (
      <PageLayout hero={hero}>
        <Loader label="Chargement du pokémon…" />
      </PageLayout>
    )
  }

  if (error) {
    return (
      <PageLayout hero={hero}>
        <div className="panel">
          <Message type="error">{error}</Message>
          <Link to="/" className="btn btn--primary">
            Revenir au Pokédex
          </Link>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout hero={hero}>
      <article className="details">
        <div className="details__visual">
          <div className={`bubble bubble--large bubble--${pokemon.elements[0]}`}>
            <PokemonImage src={pokemon.image} alt={pokemon.nom} size={290} eager />
          </div>
        </div>

        <div className="details__info">
          <div>
            <p className="details__num">{formatNumber(pokemon.id)}</p>
            <div className="details__title">
              <h1>{pokemon.nom}</h1>
              <FavoriteButton pokemon={pokemon} />
            </div>
          </div>

          <div className="types types--start">
            {pokemon.elements.map((element) => (
              <TypeBadge key={element} type={element} />
            ))}
          </div>

          {pokemon.description && <p className="details__description">{pokemon.description}</p>}

          <dl className="facts">
            <div className="fact">
              <dt>Poids</dt>
              <dd>{formatDecimal(pokemon.poids)} kg</dd>
            </div>
            <div className="fact">
              <dt>Taille</dt>
              <dd>{formatDecimal(pokemon.taille)} m</dd>
            </div>
            {pokemon.capacites && (
              <div className="fact fact--wide">
                <dt>Talents</dt>
                <dd className="chips">
                  {pokemon.capacites.map((talent) => (
                    <span key={talent} className="chip">
                      {formatAbility(talent)}
                    </span>
                  ))}
                </dd>
              </div>
            )}
          </dl>

          {pokemon.stats && (
            <>
              <h2>Statistiques</h2>
              <ul className="stats">
                {pokemon.stats.map((stat) => (
                  <li key={stat.nom}>
                    <span className="stats__label">{stat.nom}</span>
                    <strong>{stat.valeur}</strong>
                    <span className="stats__bar" aria-hidden="true">
                      <span style={{ width: `${Math.min(100, (stat.valeur / STAT_SCALE) * 100)}%` }} />
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {isCustomId(pokemon.id) && (
            <Button
              variant="danger"
              onClick={() => {
                removeCreated(pokemon.id)
                navigate('/mes-pokemons')
              }}
            >
              Supprimer ce pokémon
            </Button>
          )}
        </div>
      </article>
    </PageLayout>
  )
}
