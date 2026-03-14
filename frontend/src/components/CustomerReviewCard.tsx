import type { Review } from '../types/product'

interface CustomerReviewCardProps {
  review: Review
}

export function CustomerReviewCard({ review }: CustomerReviewCardProps) {
  return (
    <article className="review-card">
      <div className="review-card__media">
        {review.imageUrl ? (
          <img src={review.imageUrl} alt="Review" />
        ) : (
          <div className="review-card__placeholder" aria-hidden />
        )}
      </div>
      <div className="review-card__content">
        {review.fromCommunity && (
          <span className="review-card__tag" title="From community (e.g. Reddit, forums)">
            From community
          </span>
        )}
        <div className="review-card__stars" aria-label={`Rating: ${review.rating} out of 5`}>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={star <= review.rating ? 'review-card__star review-card__star--filled' : 'review-card__star'}
              aria-hidden
            >
              ★
            </span>
          ))}
        </div>
        <p className="review-card__text">{review.text}</p>
      </div>
    </article>
  )
}
