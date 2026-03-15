import { Link, useNavigate } from 'react-router-dom'
import { useWishlist } from '../context/WishlistContext'
import type { Product } from '../types/product'
import '../theme.css'

const styles: Record<string, React.CSSProperties> = {
  page: {
    background: '#ffffff',
    minHeight: '100vh',
    fontFamily: "var(--font-sans)",
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem 2rem',
    borderBottom: '1px solid var(--color-border-subtle)',
    background: 'white',
  },
  back: {
    color: 'var(--color-text-muted)',
    textDecoration: 'none',
    fontSize: '0.95rem',
    fontWeight: 500,
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: 'var(--color-navy)',
  },
  main: {
    padding: '2rem',
    maxWidth: 1100,
    margin: '0 auto',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '1.25rem',
  },
  card: {
    border: '1px solid var(--color-border-subtle)',
    borderRadius: 14,
    overflow: 'hidden',
    background: 'white',
    position: 'relative',
  },
  cardImg: {
    width: '100%',
    aspectRatio: '1',
    background: '#F0F7FC',
    overflow: 'hidden',
  },
  cardImgImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  cardInfo: {
    padding: '12px 14px',
  },
  cardBrand: {
    fontSize: 11,
    color: 'var(--color-text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: 4,
  },
  cardName: {
    fontSize: 14,
    fontWeight: 500,
    color: 'var(--color-navy)',
    marginBottom: 6,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  cardPrice: {
    fontSize: 14,
    fontWeight: 600,
    color: 'var(--color-primary)',
  },
  cardActions: {
    display: 'flex',
    gap: 8,
    marginTop: 10,
  },
  btn: {
    flex: 1,
    padding: '8px 12px',
    fontSize: 13,
    fontWeight: 500,
    border: '1px solid var(--color-border)',
    borderRadius: 8,
    background: 'white',
    color: 'var(--color-navy)',
    cursor: 'pointer',
    textDecoration: 'none',
    textAlign: 'center' as const,
  },
  btnRemove: {
    padding: '8px 12px',
    fontSize: 13,
    border: 'none',
    borderRadius: 8,
    background: 'transparent',
    color: 'var(--color-text-muted)',
    cursor: 'pointer',
  },
  empty: {
    textAlign: 'center',
    padding: '4rem 2rem',
    color: 'var(--color-text-muted)',
    fontSize: 16,
  },
}

function getProductImageUrl(p: Product): string | undefined {
  if (p.imageUrls?.length) return p.imageUrls[0]
  return p.imageUrl
}

export function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist()
  const navigate = useNavigate()

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <Link to="/home" style={styles.back} aria-label="Back to home">
          ← Back
        </Link>
        <h1 style={styles.title}>Wishlist</h1>
        <span style={{ width: 60 }} />
      </header>

      <main style={styles.main}>
        {wishlist.length === 0 ? (
          <p style={styles.empty}>
            Your wishlist is empty. Add items from product pages with the heart icon.
          </p>
        ) : (
          <div style={styles.grid}>
            {wishlist.map((product) => {
              const imgUrl = getProductImageUrl(product)
              return (
                <article key={product.id} style={styles.card}>
                  <div
                    style={styles.cardImg}
                    onClick={() =>
                      navigate(`/product/${product.id}`, {
                        state: { product, searchQuery: '' },
                      })
                    }
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) =>
                      e.key === 'Enter' &&
                      navigate(`/product/${product.id}`, {
                        state: { product, searchQuery: '' },
                      })
                    }
                  >
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={product.name}
                        style={styles.cardImgImg}
                      />
                    ) : null}
                  </div>
                  <div style={styles.cardInfo}>
                    <div style={styles.cardBrand}>{product.brand}</div>
                    <div style={styles.cardName}>{product.name}</div>
                    <div style={styles.cardPrice}>{product.price}</div>
                    <div style={styles.cardActions}>
                      <button
                        type="button"
                        style={styles.btn}
                        onClick={() =>
                          navigate(`/product/${product.id}`, {
                            state: { product, searchQuery: '' },
                          })
                        }
                      >
                        View
                      </button>
                      <button
                        type="button"
                        style={styles.btnRemove}
                        onClick={() => removeFromWishlist(product.id)}
                        aria-label="Remove from wishlist"
                        title="Remove from wishlist"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
