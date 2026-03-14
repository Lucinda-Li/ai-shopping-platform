import { Link } from 'react-router-dom'
import './SearchResultPlaceholder.css'

/**
 * Placeholder for the search result page (not owned by you).
 * Links to product detail so you can test Product Details and AI Try-on.
 */
export function SearchResultPlaceholder() {
  return (
    <div className="page search-placeholder">
      <div className="search-placeholder__card">
        <h1>Search results (placeholder)</h1>
        <p>This page is the search result list. Click a product to open Product Details.</p>
        <Link to="/product/1" className="btn btn--cta">
          Open Product Details (demo)
        </Link>
      </div>
    </div>
  )
}
