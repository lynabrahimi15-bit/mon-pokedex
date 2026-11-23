import { useNavigate } from 'react-router-dom'
import PageLayout from '../components/templates/PageLayout.jsx'
import PokemonForm from '../components/organisms/PokemonForm.jsx'
import { createPokemon } from '../services/pokemonService.js'
import { usePokedexStore } from '../store/usePokedexStore.js'

export default function AddPokemon() {
  const navigate = useNavigate()
  const addCreated = usePokedexStore((state) => state.addCreated)

  async function handleSubmit(values) {
    const pokemon = await createPokemon(values) // POST /api/pokemons via Axios
    addCreated(pokemon)
    navigate(`/poke/${pokemon.id}`)
  }

  const hero = (
    <div className="hero__center">
      <h1>Ajouter un pokémon</h1>
      <p className="hero__subtitle">Crée ton propre pokémon : il apparaîtra dans « Mes Pokémon ».</p>
    </div>
  )

  return (
    <PageLayout hero={hero} narrow>
      <PokemonForm onSubmit={handleSubmit} />
    </PageLayout>
  )
}
