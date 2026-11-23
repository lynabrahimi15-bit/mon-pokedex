import { useSearchParams } from 'react-router-dom'
import { usePokemonPage } from '../hooks/usePokemonPage.js'
import PageLayout from '../components/templates/PageLayout.jsx'
import PokemonGrid from '../components/organisms/PokemonGrid.jsx'
import Pagination from '../components/molecules/Pagination.jsx'
import SearchBar from '../components/molecules/SearchBar.jsx'
import Loader from '../components/atoms/Loader.jsx'
import Message from '../components/atoms/Message.jsx'

export default function Home() {
  // La page courante vit dans l'URL (?page=2) : partageable et compatible avec "Retour".
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Math.max(1, Number.parseInt(searchParams.get('page'), 10) || 1)
  const { data, isLoading, error } = usePokemonPage(page)

  function goToPage(newPage) {
    setSearchParams({ page: String(newPage) })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const hero = (
    <div className="hero__center">
      <h1>Attrape-les tous&nbsp;!</h1>
      <p className="hero__subtitle">
        {data ? `${data.total} pokémons à découvrir` : 'Tous les pokémons de PokéAPI'}
      </p>
      <SearchBar />
    </div>
  )

  return (
    <PageLayout hero={hero}>
      {isLoading && <Loader label="Chargement des pokémons…" />}
      {error && <Message type="error">{error}</Message>}
      {data && (
        <>
          <PokemonGrid pokemons={data.pokemons} />
          <Pagination
            page={page}
            totalPages={data.totalPages}
            hasPrevious={data.hasPrevious}
            hasNext={data.hasNext}
            onPageChange={goToPage}
          />
        </>
      )}
    </PageLayout>
  )
}
