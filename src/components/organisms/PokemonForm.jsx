import { useState } from 'react'
import Button from '../atoms/Button.jsx'
import Message from '../atoms/Message.jsx'
import FormField from '../molecules/FormField.jsx'
import { ELEMENTS } from '../../utils/pokemon.js'
import { validatePokemon } from '../../utils/validation.js'

const INITIAL_VALUES = { nom: '', element: '', poids: '', taille: '', image: '', description: '' }

/** Formulaire contrôlé. onSubmit(values) doit renvoyer une promesse. */
export default function PokemonForm({ onSubmit }) {
  const [values, setValues] = useState(INITIAL_VALUES)
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const validationErrors = validatePokemon(values)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setIsSubmitting(true)
    setSubmitError(null)
    try {
      await onSubmit(values)
    } catch (err) {
      setErrors(err.response?.data?.errors ?? {})
      setSubmitError("L'ajout a échoué. Vérifie les champs et réessaie.")
      setIsSubmitting(false)
    }
  }

  const fieldProps = (name) => ({
    id: name,
    name,
    value: values[name],
    onChange: handleChange,
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
  })

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      {submitError && <Message type="error">{submitError}</Message>}

      <FormField id="nom" label="Nom *" error={errors.nom}>
        <input type="text" placeholder="Ex : Dracolosse" {...fieldProps('nom')} />
      </FormField>

      <FormField id="element" label="Élément *" error={errors.element}>
        <select {...fieldProps('element')}>
          <option value="">— Choisir —</option>
          {Object.entries(ELEMENTS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </FormField>

      <div className="form__row">
        <FormField id="poids" label="Poids (kg) *" error={errors.poids}>
          <input type="number" min="0" step="0.1" {...fieldProps('poids')} />
        </FormField>
        <FormField id="taille" label="Taille (m) *" error={errors.taille}>
          <input type="number" min="0" step="0.1" {...fieldProps('taille')} />
        </FormField>
      </div>

      <FormField id="image" label="URL de l'image" error={errors.image}>
        <input type="url" placeholder="https://…" {...fieldProps('image')} />
      </FormField>

      <FormField id="description" label="Description" error={errors.description}>
        <textarea rows="3" {...fieldProps('description')} />
      </FormField>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Ajout en cours…' : 'Ajouter le pokémon'}
      </Button>
    </form>
  )
}
