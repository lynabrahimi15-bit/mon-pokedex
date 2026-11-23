import { NavLink } from 'react-router-dom'
import { usePokedexStore } from '../../store/usePokedexStore.js'

export default function Navbar() {
  const count = usePokedexStore((state) => state.favorites.length + state.created.length)

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <NavLink to="/" className="navbar__brand">
          <img src="/pokeball.svg" alt="" width="32" height="32" />
          Mon Pokédex
        </NavLink>
        <nav aria-label="Navigation principale">
          <ul className="navbar__links">
            <li>
              <NavLink to="/" end>
                Pokédex
              </NavLink>
            </li>
            <li>
              <NavLink to="/ajouter">Ajouter</NavLink>
            </li>
            <li>
              <NavLink to="/mes-pokemons">
                Mes Pokémon {count > 0 && <span className="pill">{count}</span>}
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
