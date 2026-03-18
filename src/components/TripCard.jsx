import { useApp } from '../context/AppContext';
import './TripCard.css';

export default function TripCard({ trip, onView }) {
  const { toggleWishlist, isWishlisted, addToCart, isInCart } = useApp();
  const wishlisted = isWishlisted(trip.id);
  const inCart = isInCart(trip.id);
  const discount = Math.round(((trip.originalPrice - trip.price) / trip.originalPrice) * 100);

  return (
    <div className="trip-card" id={`trip-card-${trip.id}`}>
      <div className="trip-card__image-wrap" onClick={() => onView(trip)}>
        <img src={trip.image} alt={trip.title} className="trip-card__image" loading="lazy" />
        {trip.badge && (
          <span className="trip-card__badge" style={{ background: trip.badgeColor }}>
            {trip.badge}
          </span>
        )}
        {discount > 0 && (
          <span className="trip-card__discount">–{discount}%</span>
        )}
        <button
          className={`trip-card__heart ${wishlisted ? 'trip-card__heart--active' : ''}`}
          id={`wishlist-btn-${trip.id}`}
          onClick={(e) => { e.stopPropagation(); toggleWishlist(trip); }}
          title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={wishlisted ? '#e63946' : 'none'} stroke={wishlisted ? '#e63946' : '#fff'} strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
        <div className="trip-card__overlay" />
      </div>

      <div className="trip-card__body">
        <div className="trip-card__rating">
          <span className="stars">{'★'.repeat(Math.floor(trip.rating))}</span>
          <span className="rating-value">{trip.rating}</span>
          <span className="rating-count">({trip.reviews.toLocaleString()})</span>
        </div>

        <h3 className="trip-card__title" onClick={() => onView(trip)}>{trip.title}</h3>

        <div className="trip-card__meta">
          <span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
            {trip.days} Days
          </span>
          <span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            {trip.places} Places
          </span>
          <span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            {trip.countries} {trip.countries === 1 ? 'Country' : 'Countries'}
          </span>
        </div>

        <p className="trip-card__desc">{trip.description}</p>

        <div className="trip-card__footer">
          <div className="trip-card__price">
            <span className="trip-card__price-from">From</span>
            <span className="trip-card__price-amount">${trip.price.toLocaleString()}</span>
            {trip.originalPrice > trip.price && (
              <span className="trip-card__price-original">${trip.originalPrice.toLocaleString()}</span>
            )}
          </div>
          <div className="trip-card__actions">
            <button
              className={`trip-card__cart-btn ${inCart ? 'trip-card__cart-btn--added' : ''}`}
              id={`cart-btn-${trip.id}`}
              onClick={() => addToCart(trip)}
              title={inCart ? 'In cart' : 'Add to cart'}
            >
              {inCart ? '✓' : '+'}
            </button>
            <button
              className="trip-card__view-btn"
              id={`view-btn-${trip.id}`}
              onClick={() => onView(trip)}
            >
              View Trip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
