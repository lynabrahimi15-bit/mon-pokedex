import axios from 'axios'

/** Instance Axios pour l'API publique PokéAPI (GET). */
export const pokeApi = axios.create({
  baseURL: import.meta.env.VITE_POKEAPI_URL ?? 'https://pokeapi.co/api/v2',
  timeout: 10000,
})

/** Instance Axios pour l'API du projet (POST), servie par /api sur Vercel. */
export const appApi = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL ?? '/api',
  timeout: 10000,
})
