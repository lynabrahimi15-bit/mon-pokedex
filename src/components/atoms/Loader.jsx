export default function Loader({ label = 'Chargement…' }) {
  return (
    <div className="loader" role="status">
      <img src="/pokeball.svg" alt="" className="loader__ball" width="48" height="48" />
      <p>{label}</p>
    </div>
  )
}
