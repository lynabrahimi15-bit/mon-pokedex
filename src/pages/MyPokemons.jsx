import { Link } from 'react-router-dom'
import { usePokedexStore } from '../store/usePokedexStore.js'
import PageLayout from '../components/templates/PageLayout.jsx'
import PokemonGrid from '../components/organisms/PokemonGrid.jsx'

export default function MyPokemons() {
  const favorites = usePokedexStore((state) => state.favorites)
  const created = usePokedexStore((state) => state.created)

  const hero = (
    <div className="hero__center">
      <h1>Mes Pokémon</h1>
      <p className="hero__subtitle">Tes favoris et les pokémons que tu as créés.</p>
    </div>
  )

  return (
    <PageLayout hero={hero}>
      <section className="panel">
        <h2>Mes favoris ({favorites.length})</h2>
        <PokemonGrid
          pokemons={favorites}
          emptyMessage="Aucun favori pour l'instant : clique sur ☆ depuis le Pokédex."
        />
      </section>

      <section className="panel">
        <div className="panel__header">
          <h2>Mes créations ({created.length})</h2>
          <Link to="/ajouter" className="btn btn--primary">
            + Ajouter un pokémon
          </Link>
        </div>
        <PokemonGrid pokemons={created} emptyMessage="Tu n'as encore créé aucun pokémon." />
      </section>
    </PageLayout>
  )
}
