import PokeCard from '../molecules/PokeCard.jsx'
import Message from '../atoms/Message.jsx'

export default function PokemonGrid({ pokemons, emptyMessage = 'Aucun pokemon disponible.' }) {
  if (pokemons.length === 0) return <Message>{emptyMessage}</Message>

  return (
    <ul className="grid">
      {pokemons.map((pokemon) => (
        <li key={pokemon.id}>
          <PokeCard
            id={pokemon.id}
            nom={pokemon.nom}
            image={pokemon.image}
            elements={pokemon.elements}
          />
        </li>
      ))}
    </ul>
  )
}
