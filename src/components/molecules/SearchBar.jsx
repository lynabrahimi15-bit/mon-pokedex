import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../atoms/Button.jsx'

/** Recherche par nom anglais ("pikachu") ou numéro ("25") -> fiche détail. */
export default function SearchBar() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  function handleSubmit(event) {
    event.preventDefault()
    const value = query.trim().toLowerCase()
    if (value) navigate(`/poke/${encodeURIComponent(value)}`)
  }

  return (
    <form className="search" role="search" onSubmit={handleSubmit}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <label htmlFor="search" className="sr-only">
        Rechercher un pokémon
      </label>
      <input
        id="search"
        type="search"
        placeholder="Nom anglais ou numéro (ex : pikachu, 25)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button type="submit" variant="accent">
        Rechercher
      </Button>
    </form>
  )
}
