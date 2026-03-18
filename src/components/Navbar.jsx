import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import './Navbar.css';

export default function Navbar({ onSearchOpen, onCartOpen, onWishlistOpen, onLoginOpen }) {
  const { cart, wishlist, userProfile, logout } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Destinations', items: ['Europe', 'Asia', 'Americas', 'Africa', 'Oceania'] },
    { label: 'Deals', items: ['Last Minute', 'Early Bird', 'Group Discounts', 'Flash Sales'] },
    { label: 'Travel Styles', items: ['Explorer', 'Adventure', 'Classic', 'Wellness', 'Sailing', 'Festival'] },
    { label: 'About', items: ['Our Story', 'Why WanderPack', 'Reviews', 'Travel Blog'] },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__top">
        <span>✈️ Book now, travel later — $200 deposit secures your spot</span>
        <div className="navbar__top-links">
          <button onClick={onLoginOpen}>{userProfile.loggedIn ? `Hi, ${userProfile.name}` : 'Log in'}</button>
          {userProfile.loggedIn && <button onClick={logout}>Log out</button>}
          <button>Contact</button>
        </div>
      </div>

      <div className="navbar__main">
        <a href="#" className="navbar__logo" id="logo-link">
          <span className="logo-icon">🌍</span>
          <span className="logo-text">WanderPack</span>
        </a>

        <ul className="navbar__links">
          {navLinks.map((nav) => (
            <li
              key={nav.label}
              className="navbar__item"
              onMouseEnter={() => setActiveDropdown(nav.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <span className="navbar__link">
                {nav.label}
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </span>
              {activeDropdown === nav.label && (
                <div className="navbar__dropdown">
                  {nav.items.map((item) => (
                    <a key={item} href="#" className="navbar__dropdown-item">{item}</a>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>

        <div className="navbar__actions">
          <button id="search-btn" className="navbar__icon-btn" onClick={onSearchOpen} title="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </button>

          <button id="wishlist-btn" className="navbar__icon-btn navbar__icon-btn--badge" onClick={onWishlistOpen} title="Wishlist">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            {wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}
          </button>

          <button id="cart-btn" className="navbar__icon-btn navbar__icon-btn--badge" onClick={onCartOpen} title="Cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            {cart.length > 0 && <span className="badge">{cart.length}</span>}
          </button>

          <button className="navbar__cta" id="book-now-btn" onClick={onSearchOpen}>Find a Trip</button>

          <button className="navbar__hamburger" onClick={() => setMobileOpen(!mobileOpen)} id="mobile-menu-btn">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="navbar__mobile">
          {navLinks.map((nav) => (
            <div key={nav.label}>
              <p className="navbar__mobile-heading">{nav.label}</p>
              {nav.items.map((item) => (
                <a key={item} href="#" className="navbar__mobile-link" onClick={() => setMobileOpen(false)}>{item}</a>
              ))}
            </div>
          ))}
        </div>
      )}
    </nav>
  );
}
