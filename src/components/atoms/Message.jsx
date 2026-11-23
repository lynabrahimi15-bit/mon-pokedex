/** Message d'information ou d'erreur (rôle "alert" pour les lecteurs d'écran). */
export default function Message({ type = 'info', children }) {
  return (
    <p className={`message message--${type}`} role={type === 'error' ? 'alert' : undefined}>
      {children}
    </p>
  )
}
