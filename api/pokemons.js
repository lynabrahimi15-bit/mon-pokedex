import { validatePokemon } from '../src/utils/validation.js'
import { capitalize, CUSTOM_PREFIX } from '../src/utils/pokemon.js'

/**
 * Fonction serverless Vercel : POST /api/pokemons
 * Valide les données envoyées par le formulaire et renvoie le pokémon créé (201).
 * Le stockage est fait côté client (store Zustand persisté) : pas de base de données
 * à gérer pour ce TP.
 */
export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ message: 'Méthode non autorisée' })
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body ?? {})
  const errors = validatePokemon(body)
  if (Object.keys(errors).length > 0) {
    return res.status(422).json({ message: 'Données invalides', errors })
  }

  const pokemon = {
    id: `${CUSTOM_PREFIX}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    nom: capitalize(body.nom.trim()),
    elements: [body.element],
    poids: Number(body.poids),
    taille: Number(body.taille),
    image: body.image?.trim() || null,
    description: body.description?.trim() || '',
    createdAt: new Date().toISOString(),
  }
  return res.status(201).json(pokemon)
}
