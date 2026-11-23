import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/organisms/Navbar.jsx'
import Loader from './components/atoms/Loader.jsx'

// Code splitting : chaque page est un fichier JS séparé, téléchargé à la première visite.
const Home = lazy(() => import('./pages/Home.jsx'))
const PokeDetails = lazy(() => import('./pages/PokeDetails.jsx'))
const AddPokemon = lazy(() => import('./pages/AddPokemon.jsx'))
const MyPokemons = lazy(() => import('./pages/MyPokemons.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/poke/:id" element={<PokeDetails />} />
            <Route path="/ajouter" element={<AddPokemon />} />
            <Route path="/mes-pokemons" element={<MyPokemons />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <footer className="footer">
        Données : <a href="https://pokeapi.co">PokéAPI</a> — TP Développement frontend avancé
      </footer>
    </>
  )
}
