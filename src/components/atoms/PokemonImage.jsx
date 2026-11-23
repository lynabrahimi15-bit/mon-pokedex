const FALLBACK = '/pokeball.svg'

/** Image avec chargement différé et image de secours si l'URL est cassée. */
export default function PokemonImage({ src, alt, size = 160, eager = false, className = '' }) {
  return (
    <img
      src={src || FALLBACK}
      alt={alt}
      width={size}
      height={size}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      className={className}
      onError={(e) => {
        if (!e.currentTarget.src.endsWith(FALLBACK)) e.currentTarget.src = FALLBACK
      }}
    />
  )
}
