import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../../App.jsx'

/** Monte l'application complète (routes, navbar, store) sur une URL donnée. */
export function renderApp(url = '/') {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <App />
    </MemoryRouter>,
  )
}
