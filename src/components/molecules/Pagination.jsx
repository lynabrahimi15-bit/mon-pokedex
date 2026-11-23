import Button from '../atoms/Button.jsx'

export default function Pagination({ page, totalPages, hasPrevious, hasNext, onPageChange }) {
  return (
    <nav className="pagination" aria-label="Pagination">
      <Button variant="secondary" disabled={!hasPrevious} onClick={() => onPageChange(page - 1)}>
        ← Page précédente
      </Button>
      <span className="pagination__info">
        Page {page} / {totalPages}
      </span>
      <Button variant="primary" disabled={!hasNext} onClick={() => onPageChange(page + 1)}>
        Page suivante →
      </Button>
    </nav>
  )
}
