import { translateElement } from '../../utils/pokemon.js'

export default function TypeBadge({ type }) {
  return <span className={`badge badge--${type}`}>{translateElement(type)}</span>
}
