import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * En local, `npm run dev` ne lance que Vite : ce petit plugin sert la route
 * /api/pokemons avec le même fichier que la fonction serverless Vercel.
 * Résultat : une seule implémentation de l'API, en local comme en production.
 */
function localApi() {
  return {
    name: 'local-api',
    configureServer(server) {
      server.middlewares.use('/api/pokemons', async (req, res) => {
        res.status = (code) => {
          res.statusCode = code
          return res
        }
        res.json = (body) => {
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(body))
        }
        try {
          let raw = ''
          for await (const chunk of req) raw += chunk
          req.body = raw ? JSON.parse(raw) : {}
          const { default: handler } = await server.ssrLoadModule('/api/pokemons.js')
          handler(req, res)
        } catch {
          res.status(400).json({ message: 'Requête invalide' })
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), localApi()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
  },
})
