import { useApp } from '../context/AppContext';
import TripCard from './TripCard';
import './WishlistDrawer.css';

export default function WishlistDrawer({ open, onClose, onTripView }) {
  const { wishlist } = useApp();

  return (
    <>
      <div className={`drawer-overlay ${open ? 'drawer-overlay--open' : ''}`} onClick={onClose} />
      <aside className={`wishlist-drawer ${open ? 'wishlist-drawer--open' : ''}`} id="wishlist-drawer">
        <div className="wishlist-drawer__header">
          <h2>❤️ My Wishlist</h2>
          <button id="wishlist-close-btn" onClick={onClose} className="drawer-close">✕</button>
        </div>

        {wishlist.length === 0 ? (
          <div className="wishlist-drawer__empty">
            <span>💛</span>
            <p>Your wishlist is empty</p>
            <small>Tap the heart on any trip to save it here!</small>
          </div>
        ) : (
          <div className="wishlist-drawer__list">
            <p className="wishlist-drawer__count">{wishlist.length} saved trip{wishlist.length > 1 ? 's' : ''}</p>
            <div className="wishlist-drawer__grid">
              {wishlist.map((trip) => (
                <TripCard key={trip.id} trip={trip} onView={(t) => { onTripView(t); onClose(); }} />
              ))}
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
