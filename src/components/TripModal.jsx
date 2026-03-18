import { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import './TripModal.css';

export default function TripModal({ trip, onClose }) {
  const { toggleWishlist, isWishlisted, addToCart, isInCart } = useApp();

  useEffect(() => {
    if (!trip) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [trip]);

  if (!trip) return null;

  const wishlisted = isWishlisted(trip.id);
  const inCart = isInCart(trip.id);

  return (
    <div className="trip-modal" id="trip-modal" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="trip-modal__box">
        <div className="trip-modal__hero">
          <img src={trip.image} alt={trip.title} />
          <div className="trip-modal__hero-overlay" />
          <button className="trip-modal__close" id="trip-modal-close" onClick={onClose}>✕</button>
          {trip.badge && (
            <span className="trip-modal__badge" style={{ background: trip.badgeColor }}>{trip.badge}</span>
          )}
          <div className="trip-modal__hero-info">
            <h1 className="trip-modal__title">{trip.title}</h1>
            <div className="trip-modal__meta">
              <span>⭐ {trip.rating} ({trip.reviews.toLocaleString()} reviews)</span>
              <span>📅 {trip.days} Days</span>
              <span>📍 {trip.places} Places</span>
              <span>🌍 {trip.countries} {trip.countries === 1 ? 'Country' : 'Countries'}</span>
            </div>
          </div>
        </div>

        <div className="trip-modal__body">
          <div className="trip-modal__content">
            <div className="trip-modal__section">
              <h3>About This Trip</h3>
              <p>{trip.description}</p>
            </div>

            <div className="trip-modal__section">
              <h3>Highlights</h3>
              <ul className="trip-modal__highlights">
                {trip.highlights.map((h) => (
                  <li key={h}>
                    <span className="highlight-dot" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>

            <div className="trip-modal__tags">
              <span className="trip-modal__tag">✈️ {trip.destination}</span>
              <span className="trip-modal__tag">🎯 {trip.style}</span>
              <span className="trip-modal__tag">🧑‍🤝‍🧑 {trip.ageGroup}</span>
              <span className="trip-modal__tag">🌐 {trip.country}</span>
            </div>

            <div className="trip-modal__why">
              <h3>Why WanderPack?</h3>
              <div className="trip-modal__why-grid">
                {[
                  { icon: '💰', title: '$200 Deposit', desc: 'Lock your spot with just $200' },
                  { icon: '🔄', title: 'Free Changes', desc: 'Amend your trip up to 60 days before' },
                  { icon: '🧑‍🤝‍🧑', title: 'Group Travel', desc: 'Meet like-minded adventurers' },
                  { icon: '🌍', title: 'Expert Led', desc: 'Led by experienced local guides' },
                ].map(({ icon, title, desc }) => (
                  <div key={title} className="trip-modal__why-item">
                    <span>{icon}</span>
                    <div>
                      <strong>{title}</strong>
                      <p>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="trip-modal__sidebar">
            <div className="trip-modal__price-card">
              <div className="trip-modal__price">
                <span className="price-from">From</span>
                <span className="price-amount">${trip.price.toLocaleString()}</span>
                {trip.originalPrice > trip.price && (
                  <span className="price-original">${trip.originalPrice.toLocaleString()}</span>
                )}
              </div>
              <p className="trip-modal__price-note">Per person · AUD · Incl. taxes</p>

              <button
                className={`trip-modal__cart-btn ${inCart ? 'trip-modal__cart-btn--added' : ''}`}
                id="trip-modal-cart-btn"
                onClick={() => addToCart(trip)}
              >
                {inCart ? '✓ In Your Cart' : '🧳 Add to Cart'}
              </button>

              <button
                className={`trip-modal__wishlist-btn ${wishlisted ? 'trip-modal__wishlist-btn--active' : ''}`}
                id="trip-modal-wishlist-btn"
                onClick={() => toggleWishlist(trip)}
              >
                {wishlisted ? '❤️ Saved to Wishlist' : '🤍 Save to Wishlist'}
              </button>

              <div className="trip-modal__deposit-note">
                <strong>Only $200 deposit</strong> to secure your spot!
              </div>
            </div>

            <div className="trip-modal__contact">
              <p>💬 Have questions?</p>
              <button className="trip-modal__chat-btn" id="chat-btn">Chat with us</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
