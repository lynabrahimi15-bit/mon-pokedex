import { Link } from 'react-router-dom'
import PageLayout from '../components/templates/PageLayout.jsx'

export default function NotFound() {
  const hero = (
    <div className="hero__center">
      <h1>Page introuvable</h1>
    </div>
  )

  return (
    <PageLayout hero={hero} narrow>
      <div className="panel center">
        <p>Ce pokémon s'est enfui… cette page n'existe pas.</p>
        <Link to="/" className="btn btn--primary">
          Revenir au Pokédex
        </Link>
      </div>
    </PageLayout>
  )
}
