import { ELEMENTS } from './pokemon.js'

/**
 * Validation partagée entre le formulaire (front) et la fonction serverless (back) :
 * une seule source de vérité pour les règles métier.
 */
export function validatePokemon(values = {}) {
  const errors = {}
  const nom = String(values.nom ?? '').trim()
  const poids = Number(values.poids)
  const taille = Number(values.taille)

  if (nom.length < 2) errors.nom = 'Le nom doit contenir au moins 2 caractères.'
  else if (nom.length > 30) errors.nom = 'Le nom ne doit pas dépasser 30 caractères.'

  if (!Object.hasOwn(ELEMENTS, values.element)) errors.element = 'Choisis un élément.'

  if (values.poids === '' || values.poids == null || !(poids > 0) || poids > 1000) {
    errors.poids = 'Le poids doit être compris entre 0 et 1000 kg.'
  }
  if (values.taille === '' || values.taille == null || !(taille > 0) || taille > 100) {
    errors.taille = 'La taille doit être comprise entre 0 et 100 m.'
  }

  if (values.image && !/^https?:\/\/\S+$/.test(values.image)) {
    errors.image = "L'image doit être une URL commençant par http(s)://"
  }
  if (String(values.description ?? '').length > 300) {
    errors.description = 'La description ne doit pas dépasser 300 caractères.'
  }
  return errors
}
