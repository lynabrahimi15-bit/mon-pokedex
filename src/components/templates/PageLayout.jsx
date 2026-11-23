/**
 * Template commun à toutes les pages (niveau "templates" de l'Atomic Design) :
 * un bandeau de couleur en haut (hero), puis le contenu dans une carte
 * qui vient se poser sur le bandeau.
 */
export default function PageLayout({ hero, children, narrow = false }) {
  return (
    <>
      <div className="hero">
        <div className={`container hero__inner ${narrow ? 'container--narrow' : ''}`}>{hero}</div>
      </div>
      <div className={`container page-content ${narrow ? 'container--narrow' : ''}`}>{children}</div>
    </>
  )
}
