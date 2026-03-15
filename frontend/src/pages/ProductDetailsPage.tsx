import { useState } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'
import './ProductDetailsPage.css'
import { CustomerReviewCard } from '../components/CustomerReviewCard'
import { useWishlist } from '../context/WishlistContext'
import type { Product, Review } from '../types/product'

// Mock data for development; replace with API later
const MOCK_PRODUCT: Product = {
  id: '1',
  name: 'Classic Puffer Jacket',
  brand: 'North Face',
  price: '$189.00',
  imageUrls: [
    'https://placehold.co/320x400/f0f8ff/1a5f8a?text=Front',
    'https://placehold.co/320x400/e8f4ff/1a5f8a?text=Back',
    'https://placehold.co/320x400/e0f0ff/1a5f8a?text=Detail',
    'https://placehold.co/320x400/d8ecff/1a5f8a?text=Side',
  ],
  officialUrl: 'https://www.thenorthface.com/',
  sizes: ['XS', 'S', 'M', 'L', 'XL'],
  foundOn: ['Brand site', 'Tmall', 'Shein'],
  aiSummary: '• Warm and wind-resistant.\n• Regular fit, mid-length.\n• Best for cold weather and city wear.',
}

const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1',
    productId: '1',
    imageUrl: 'https://placehold.co/120x120/c8e8ff/1a5f8a?text=Review',
    rating: 5,
    text: 'Exactly as described, very warm. Size M fits true to size.',
    fromCommunity: false,
  },
  {
    id: 'r2',
    productId: '1',
    imageUrl: 'https://placehold.co/120x120/c8e8ff/1a5f8a?text=Photo',
    rating: 4,
    text: 'Great jacket, found this discussion on Reddit and ordered. No regrets.',
    fromCommunity: true,
  },
]

/** 从路由 state 或 mock 得到当前商品，保证必填字段有默认值。
 * 有 state 时 officialUrl 一律用 state 的（来自搜索 API 的 link），避免误用 mock 的 North Face 链接。 */
function resolveProduct(stateProduct: Product | null | undefined): Product {
  const base = stateProduct ?? MOCK_PRODUCT
  const hasState = stateProduct != null
  return {
    ...base,
    id: base.id ?? MOCK_PRODUCT.id,
    name: base.name ?? MOCK_PRODUCT.name,
    brand: base.brand ?? MOCK_PRODUCT.brand,
    price: base.price ?? MOCK_PRODUCT.price,
    imageUrls: base.imageUrls?.length ? base.imageUrls : (base.imageUrl ? [base.imageUrl] : MOCK_PRODUCT.imageUrls),
    officialUrl: hasState ? (stateProduct!.officialUrl ?? '') : (base.officialUrl ?? MOCK_PRODUCT.officialUrl),
    sizes: base.sizes?.length ? base.sizes : MOCK_PRODUCT.sizes,
    foundOn: base.foundOn?.length ? base.foundOn : MOCK_PRODUCT.foundOn,
    aiSummary: base.aiSummary ?? MOCK_PRODUCT.aiSummary,
  }
}

export function ProductDetailsPage() {
  const { productId: _productId } = useParams<{ productId: string }>() 
  const location = useLocation()
  const stateProduct = (location.state as { product?: Product; searchQuery?: string } | null)?.product
  const searchQuery = (location.state as { searchQuery?: string } | null)?.searchQuery ?? ''
  const product = resolveProduct(stateProduct)
  const backToSearchUrl = searchQuery ? `/search?q=${encodeURIComponent(searchQuery)}` : '/search'
  const { isInWishlist, toggleWishlist } = useWishlist()
  const isWishlisted = isInWishlist(product.id)
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] ?? '')
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const reviews = MOCK_REVIEWS
  const images = product.imageUrls?.length ? product.imageUrls : (product.imageUrl ? [product.imageUrl] : [])
  const mainImage = images[selectedImageIndex] ?? images[0]

  const foundOnText = product.foundOn.length > 0
    ? `Found on: ${product.foundOn.join(' • ')}`
    : null

  return (
    <div className="page product-details-page">
      <header className="product-details-header">
        <Link to={backToSearchUrl} className="product-details-header__back" aria-label="Back to search results">
          ← Back
        </Link>
      </header>

      <main className="product-details-main">
        <div className="product-details-main__gallery">
          <img
            src={mainImage}
            alt={product.name}
            className="product-details-main__image"
          />
          {images.length > 1 && (
            <div className="product-details-main__thumbs">
              {images.map((url, i) => (
                <button
                  key={url}
                  type="button"
                  className={`product-details-main__thumb ${i === selectedImageIndex ? 'product-details-main__thumb--active' : ''}`}
                  onClick={() => setSelectedImageIndex(i)}
                  aria-label={`View image ${i + 1}`}
                >
                  <img src={url} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="product-details-main__info">
          <div className="product-details-main__title-row">
            <div>
              <h1 className="product-details-main__name">{product.name}</h1>
              <p className="product-details-main__brand">{product.brand}</p>
            </div>
            <button
              type="button"
              className={`wishlist-pill ${isWishlisted ? 'wishlist-pill--active' : ''}`}
              onClick={() => toggleWishlist(product)}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <span className="wishlist-pill__icon">{isWishlisted ? '♥' : '♡'}</span>
              <span className="wishlist-pill__label">
                {isWishlisted ? 'Saved to wishlist' : 'Add to wishlist'}
              </span>
            </button>
          </div>

          <p className="product-details-main__price">{product.price}</p>
          {foundOnText && (
            <p className="product-details-main__found-on">{foundOnText}</p>
          )}

          <div className="product-details-main__size">
            <label htmlFor="size-select">Select size:</label>
            <select
              id="size-select"
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="product-details-main__size-select"
            >
              {product.sizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <div className="product-details-main__actions">
            {/* 有有效原网址时新标签页打开；无链接时仅展示按钮不跳转，避免打开当前页造成“奇怪”体验 */}
            {product.officialUrl && product.officialUrl.startsWith('http') ? (
              <>
                <a
                  href={product.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--cta"
                >
                  Go to official website
                </a>
                <p className="product-details-main__hint">Opens in a new tab</p>
              </>
            ) : (
              <>
                <span className="btn btn--cta" style={{ cursor: 'not-allowed', opacity: 0.8 }} title="此商品暂无官网链接">
                  Go to official website
                </span>
                <p className="product-details-main__hint">此商品暂无官网链接（搜索来源未返回链接）</p>
              </>
            )}
            <Link
              to="/ai-tryon"
              state={{ product: { ...product, selectedSize } }}
              className="btn btn--secondary"
            >
              Try it on with AI
            </Link>
          </div>

          {product.aiSummary && (
            <section className="product-details-main__ai-summary">
              <h2 className="product-details-main__ai-summary-title">AI Summary</h2>
              <pre className="product-details-main__ai-summary-text">{product.aiSummary}</pre>
            </section>
          )}
        </div>
      </main>

      <section className="customer-reviews" id="customer-reviews">
        <h2 className="customer-reviews__title">Customer Reviews</h2>
        {reviews.length === 0 ? (
          <p className="customer-reviews__empty">
            No reviews yet. Be the first to try this item.
          </p>
        ) : (
          <div className="customer-reviews__grid">
            {reviews.map((review) => (
              <CustomerReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
