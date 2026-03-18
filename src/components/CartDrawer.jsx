import { useApp } from '../context/AppContext';
import './CartDrawer.css';

export default function CartDrawer({ open, onClose, onTripView }) {
  const { cart, removeFromCart, cartTotal } = useApp();

  return (
    <>
      <div className={`drawer-overlay ${open ? 'drawer-overlay--open' : ''}`} onClick={onClose} />
      <aside className={`cart-drawer ${open ? 'cart-drawer--open' : ''}`} id="cart-drawer">
        <div className="cart-drawer__header">
          <h2>Your Trip Cart</h2>
          <button id="cart-close-btn" onClick={onClose} className="drawer-close">✕</button>
        </div>

        {cart.length === 0 ? (
          <div className="cart-drawer__empty">
            <span>🧳</span>
            <p>Your cart is empty</p>
            <small>Save trips to start planning your adventure!</small>
          </div>
        ) : (
          <>
            <div className="cart-drawer__items">
              {cart.map((trip) => (
                <div key={trip.id} className="cart-item" id={`cart-item-${trip.id}`}>
                  <img src={trip.image} alt={trip.title} onClick={() => { onTripView(trip); onClose(); }} />
                  <div className="cart-item__info">
                    <h4 onClick={() => { onTripView(trip); onClose(); }}>{trip.title}</h4>
                    <p>{trip.days} Days · {trip.destination}</p>
                    <p className="cart-item__price">${trip.price.toLocaleString()}</p>
                    <p className="cart-item__date">Added: {new Date(trip.bookedAt).toLocaleDateString()}</p>
                  </div>
                  <button
                    className="cart-item__remove"
                    id={`cart-remove-${trip.id}`}
                    onClick={() => removeFromCart(trip.id)}
                    title="Remove"
                  >✕</button>
                </div>
              ))}
            </div>

            <div className="cart-drawer__footer">
              <div className="cart-drawer__total">
                <span>Total Estimate</span>
                <strong>${cartTotal.toLocaleString()}</strong>
              </div>
              <p className="cart-drawer__deposit">
                Only <strong>$200 deposit</strong> needed to lock in your spot!
              </p>
              <button className="cart-drawer__checkout" id="checkout-btn">
                Book Now — $200 Deposit
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
