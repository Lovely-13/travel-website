import { useState, useEffect } from 'react';
import { Routes, Route, Link, NavLink, useNavigate, useParams, useLocation, HashRouter } from 'react-router-dom';
import { trips, destinations, travelStyles } from './data/trips';
import './App.css';

/* ─────────────────────────── localStorage hook ─────────────────────────── */
function useLS(key, init) {
  const [val, setVal] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key)) ?? init; }
    catch { return init; }
  });
  const save = (v) => {
    const next = v instanceof Function ? v(val) : v;
    setVal(next);
    localStorage.setItem(key, JSON.stringify(next));
  };
  return [val, save];
}

/* ─────────────────────────── Navbar ─────────────────────────── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [wishlist] = useLS('wp_wishlist', []);
  const navigate = useNavigate();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <nav className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <Link to="/" className="nav__logo" id="nav-logo">
        <span className="nav__logo-icon">🌍</span>
        <span className="nav__logo-text">WanderPack</span>
      </Link>

      <ul className="nav__links">
        {[['/', 'Home'], ['/trips', 'Trips'], ['/destinations', 'Destinations'], ['/wishlist', 'Wishlist']].map(([to, label]) => (
          <li key={to}>
            <NavLink to={to} end className={({ isActive }) => isActive ? 'nav__link nav__link--active' : 'nav__link'} id={`nav-${label.toLowerCase()}`}>
              {label}
              {label === 'Wishlist' && wishlist.length > 0 && <span className="nav__badge">{wishlist.length}</span>}
            </NavLink>
          </li>
        ))}
      </ul>

      <button className="nav__cta" id="nav-find-trip" onClick={() => navigate('/trips')}>Find a Trip</button>

      <button className="nav__burger" id="nav-burger" onClick={() => setMobileOpen(!mobileOpen)}>
        <span /><span /><span />
      </button>

      {mobileOpen && (
        <div className="nav__mobile">
          {[['/', 'Home'], ['/trips', 'Trips'], ['/destinations', 'Destinations'], ['/wishlist', 'Wishlist']].map(([to, label]) => (
            <Link key={to} to={to} className="nav__mobile-link" onClick={() => setMobileOpen(false)}>{label}</Link>
          ))}
        </div>
      )}
    </nav>
  );
}

/* ─────────────────────────── Trip Card ─────────────────────────── */
function TripCard({ trip }) {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useLS('wp_wishlist', []);
  const isWished = wishlist.some(t => t.id === trip.id);

  const toggleWish = (e) => {
    e.stopPropagation();
    setWishlist(isWished ? wishlist.filter(t => t.id !== trip.id) : [...wishlist, trip]);
  };

  const discount = Math.round(((trip.originalPrice - trip.price) / trip.originalPrice) * 100);

  return (
    <article className="card" id={`trip-${trip.id}`} onClick={() => navigate(`/trip/${trip.slug}`)}>
      <div className="card__img-wrap">
        <img src={trip.image} alt={trip.title} loading="lazy" className="card__img" />
        {trip.badge && <span className="card__badge" style={{ background: trip.badgeColor }}>{trip.badge}</span>}
        {discount > 0 && <span className="card__discount">–{discount}%</span>}
        <button className={`card__heart ${isWished ? 'card__heart--on' : ''}`} id={`wish-${trip.id}`}
          onClick={toggleWish} title={isWished ? 'Unsave' : 'Save'}>
          {isWished ? '❤️' : '🤍'}
        </button>
      </div>
      <div className="card__body">
        <div className="card__rating">
          <span className="card__stars">{'★'.repeat(Math.floor(trip.rating))}</span>
          <span className="card__rv">{trip.rating} · {trip.reviews.toLocaleString()} reviews</span>
        </div>
        <h3 className="card__title">{trip.title}</h3>
        <div className="card__meta">
          <span>📅 {trip.days} days</span>
          <span>📍 {trip.places} places</span>
          <span>🌐 {trip.countries} {trip.countries > 1 ? 'countries' : 'country'}</span>
        </div>
        <p className="card__desc">{trip.description.slice(0, 100)}…</p>
        <div className="card__footer">
          <div className="card__price">
            <span className="card__from">From</span>
            <span className="card__amt">${trip.price.toLocaleString()}</span>
            {trip.originalPrice > trip.price && <span className="card__orig">${trip.originalPrice.toLocaleString()}</span>}
          </div>
          <button className="card__btn" id={`view-${trip.id}`} onClick={(e) => { e.stopPropagation(); navigate(`/trip/${trip.slug}`); }}>
            View Trip →
          </button>
        </div>
      </div>
    </article>
  );
}

/* ─────────────────────────── Page: Home ─────────────────────────── */
function HomePage() {
  const navigate = useNavigate();
  const [slide, setSlide] = useState(0);
  const [query, setQuery] = useState('');

  const slides = [
    { img: `${import.meta.env.BASE_URL}hero_greece.png`, h: 'Your Next Adventure', sub: 'Awaits You' },
    { img: `${import.meta.env.BASE_URL}hero_slider2.png`, h: 'Make Friends.', sub: 'Make Memories.' },
    { img: `${import.meta.env.BASE_URL}hero_slider3.png`, h: 'Beyond the', sub: 'Tourist Trail.' },
  ];

  useEffect(() => {
    const id = setInterval(() => setSlide(s => (s + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/trips?q=${encodeURIComponent(query)}`);
  };

  const featuredTrips = trips.filter(t => [1, 2, 3].includes(t.id));

  return (
    <>
      {/* ── Hero ── */}
      <section className="hero" id="hero">
        {slides.map((s, i) => (
          <div key={i} className={`hero__bg ${i === slide ? 'hero__bg--on' : ''}`}
            style={{ backgroundImage: `url(${s.img})` }} />
        ))}
        <div className="hero__overlay" />
        <div className="hero__content">
          <p className="hero__eyebrow">🌍 Exclusively for 18–35s</p>
          <h1 className="hero__h1">{slides[slide].h}<br /><span className="hero__accent">{slides[slide].sub}</span></h1>
          <p className="hero__sub">200+ group adventures across 6 continents</p>

          <form className="hero__search" onSubmit={handleSearch} id="hero-search">
            <input id="hero-q" type="text" placeholder="Where to? (Greece, Japan, Bali…)"
              value={query} onChange={e => setQuery(e.target.value)} />
            <button type="submit" id="hero-search-btn">🔍 Search</button>
          </form>

          <div className="hero__stats">
            {[['200+', 'Adventures'], ['6', 'Continents'], ['60+', 'Countries'], ['4.8★', 'Rating']].map(([v, l]) => (
              <div key={l} className="hero__stat"><span className="hero__stat-val">{v}</span><span className="hero__stat-lbl">{l}</span></div>
            ))}
          </div>
        </div>

        <div className="hero__dots">
          {slides.map((_, i) => (
            <button key={i} className={`hero__dot ${i === slide ? 'hero__dot--on' : ''}`}
              id={`dot-${i}`} onClick={() => setSlide(i)} />
          ))}
        </div>
      </section>

      {/* ── Why us ── */}
      <section className="why" id="why">
        <div className="why__inner">
          {[
            { icon: '💰', title: '$200 Deposit', desc: 'Lock your spot with just $200 today' },
            { icon: '🔄', title: 'Free Changes', desc: 'Amend your trip up to 60 days before' },
            { icon: '🧑‍🤝‍🧑', title: 'Group Travel', desc: 'Go with like-minded adventurers 18–35' },
            { icon: '🌍', title: 'Expert Guided', desc: 'Led by experienced local guides' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="why__item">
              <span className="why__icon">{icon}</span>
              <strong>{title}</strong>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Trips ── */}
      <section className="section" id="featured-trips">
        <div className="section__head">
          <div><p className="section__eye">✈️ Trending Now</p><h2 className="section__h2">Featured Adventures</h2></div>
          <Link to="/trips" className="section__more" id="view-all-trips">View all trips →</Link>
        </div>
        <div className="grid-3">
          {featuredTrips.map(t => <TripCard key={t.id} trip={t} />)}
        </div>
      </section>

      {/* ── Destinations Preview ── */}
      <section className="section bg-light" id="dest-preview">
        <div className="section__head">
          <div><p className="section__eye">🗺️ Explore the world</p><h2 className="section__h2">Popular Destinations</h2></div>
          <Link to="/destinations" className="section__more" id="view-all-dests">View all →</Link>
        </div>
        <div className="dest-grid">
          {destinations.slice(0, 4).map((d, i) => (
            <div key={d.id} className={`dest-card ${i === 0 ? 'dest-card--tall' : ''}`}
              id={`dest-${d.id}`} onClick={() => navigate(`/trips?dest=${d.name}`)}>
              <img src={d.image} alt={d.name} loading="lazy" />
              <div className="dest-card__over" />
              <div className="dest-card__info">
                <span className="dest-card__region">{d.region}</span>
                <h3>{d.name}</h3>
                <span>{d.trips} trips</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Travel Styles ── */}
      <section className="section dark-section" id="styles">
        <div className="section__head">
          <div><p className="section__eye" style={{ color: '#c8ff00' }}>🎒 Your journey, your way</p><h2 className="section__h2 white">Travel Styles</h2></div>
        </div>
        <div className="styles-grid">
          {travelStyles.map(s => (
            <button key={s.id} className="style-card" id={`style-${s.id}`}
              onClick={() => navigate(`/trips?style=${s.name}`)}
              style={{ '--col': s.color }}>
              <span className="style-card__icon">{s.icon}</span>
              <strong>{s.name}</strong>
              <p>{s.description}</p>
            </button>
          ))}
        </div>
      </section>

      {/* ── Newsletter ── */}
      <NewsletterBanner />

      <Footer />
    </>
  );
}

/* ─────────────────────────── Page: Trips ─────────────────────────── */
function TripsPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initQ = params.get('q') || '';
  const initDest = params.get('dest') || 'All';
  const initStyle = params.get('style') || 'All';

  const [filters, setFilters] = useLS('wp_filters', { dest: 'All', style: 'All', maxPrice: 6000 });
  const [query, setQuery] = useState(initQ);
  const [sort, setSort] = useState('Featured');

  // Apply URL params on mount
  useEffect(() => {
    if (initDest !== 'All') setFilters(f => ({ ...f, dest: initDest }));
    if (initStyle !== 'All') setFilters(f => ({ ...f, style: initStyle }));
  }, []);

  const DESTS = ['All', 'Europe', 'Asia', 'Americas', 'Africa'];
  const STYLES = ['All', 'Explorer', 'Adventure', 'Classic', 'Wellness'];

  const filtered = trips
    .filter(t => filters.dest === 'All' || t.destination === filters.dest)
    .filter(t => filters.style === 'All' || t.style === filters.style)
    .filter(t => t.price <= filters.maxPrice)
    .filter(t => !query || t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.destination.toLowerCase().includes(query.toLowerCase()) ||
      t.country.toLowerCase().includes(query.toLowerCase()));

  const sorted = [...filtered].sort((a, b) =>
    sort === 'Price ↑' ? a.price - b.price :
      sort === 'Price ↓' ? b.price - a.price :
        sort === 'Rating' ? b.rating - a.rating : 0
  );

  return (
    <main className="page" id="trips-page">
      <div className="page__hero page__hero--sm">
        <h1>Browse Adventures</h1>
        <p>Find your perfect group trip — {trips.length} options across 6 continents</p>
      </div>

      <div className="trips-layout">
        {/* Sidebar */}
        <aside className="trips-sidebar" id="trips-sidebar">
          <div className="sidebar__group">
            <label>Search</label>
            <input className="sidebar__input" id="trips-search" type="text" placeholder="Destination, country…"
              value={query} onChange={e => setQuery(e.target.value)} />
          </div>

          <div className="sidebar__group">
            <label>Destination</label>
            {DESTS.map(d => (
              <button key={d} className={`sidebar__pill ${filters.dest === d ? 'sidebar__pill--on' : ''}`}
                id={`fdest-${d}`} onClick={() => setFilters(f => ({ ...f, dest: d }))}>{d}</button>
            ))}
          </div>

          <div className="sidebar__group">
            <label>Travel Style</label>
            {STYLES.map(s => (
              <button key={s} className={`sidebar__pill ${filters.style === s ? 'sidebar__pill--on' : ''}`}
                id={`fstyle-${s}`} onClick={() => setFilters(f => ({ ...f, style: s }))}>{s}</button>
            ))}
          </div>

          <div className="sidebar__group">
            <label>Max Price: ${filters.maxPrice.toLocaleString()}</label>
            <input type="range" min={1000} max={6000} step={100}
              value={filters.maxPrice} id="price-range"
              onChange={e => setFilters(f => ({ ...f, maxPrice: +e.target.value }))}
              className="sidebar__range" />
          </div>

          <button className="sidebar__reset" id="reset-filters"
            onClick={() => { setFilters({ dest: 'All', style: 'All', maxPrice: 6000 }); setQuery(''); }}>
            Reset Filters
          </button>
        </aside>

        {/* Results */}
        <div className="trips-results">
          <div className="trips-results__bar">
            <span>{sorted.length} trip{sorted.length !== 1 ? 's' : ''} found</span>
            <select value={sort} onChange={e => setSort(e.target.value)} id="sort-select" className="trips-results__sort">
              <option>Featured</option>
              <option>Price ↑</option>
              <option>Price ↓</option>
              <option>Rating</option>
            </select>
          </div>

          {sorted.length > 0 ? (
            <div className="grid-3">
              {sorted.map(t => <TripCard key={t.id} trip={t} />)}
            </div>
          ) : (
            <div className="empty-state" id="no-results">
              <span>🔍</span>
              <p>No trips match your filters.</p>
              <button onClick={() => { setFilters({ dest: 'All', style: 'All', maxPrice: 6000 }); setQuery(''); }}>
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}

/* ─────────────────────────── Page: Destinations ─────────────────────────── */
function DestinationsPage() {
  const navigate = useNavigate();
  return (
    <main className="page" id="destinations-page">
      <div className="page__hero">
        <p className="page__hero-eye">🗺️ Where to next?</p>
        <h1>Popular Destinations</h1>
        <p>Group trips for 18–35s across 6 continents</p>
      </div>

      <section className="section">
        <div className="dest-full-grid">
          {destinations.map(d => (
            <div key={d.id} className="dest-full-card" id={`dest-full-${d.id}`}
              onClick={() => navigate(`/trips?dest=${d.name}`)}>
              <img src={d.image} alt={d.name} loading="lazy" />
              <div className="dest-full-card__over" />
              <div className="dest-full-card__body">
                <span className="dest-full-card__region">{d.region}</span>
                <h3>{d.name}</h3>
                <p>{d.description}</p>
                <span className="dest-full-card__count">{d.trips} trips available →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Travel styles */}
      <section className="section dark-section" id="styles-dest">
        <div className="section__head">
          <div>
            <p className="section__eye" style={{ color: '#c8ff00' }}>Your journey, your way</p>
            <h2 className="section__h2 white">Browse by Travel Style</h2>
          </div>
        </div>
        <div className="styles-grid">
          {travelStyles.map(s => (
            <button key={s.id} className="style-card" id={`dest-style-${s.id}`}
              onClick={() => navigate(`/trips?style=${s.name}`)}
              style={{ '--col': s.color }}>
              <span className="style-card__icon">{s.icon}</span>
              <strong>{s.name}</strong>
              <p>{s.description}</p>
            </button>
          ))}
        </div>
      </section>

      <NewsletterBanner />
      <Footer />
    </main>
  );
}

/* ─────────────────────────── Page: Trip Detail ─────────────────────────── */
function TripDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const trip = trips.find(t => t.slug === slug);
  const [wishlist, setWishlist] = useLS('wp_wishlist', []);
  const [cart, setCart] = useLS('wp_cart', []);

  if (!trip) return (
    <main className="page"><div className="empty-state"><span>😕</span><p>Trip not found.</p>
      <button onClick={() => navigate('/trips')}>Browse Trips</button></div></main>
  );

  const isWished = wishlist.some(t => t.id === trip.id);
  const inCart = cart.some(t => t.id === trip.id);
  const related = trips.filter(t => t.destination === trip.destination && t.id !== trip.id).slice(0, 3);

  const toggleWish = () => setWishlist(isWished ? wishlist.filter(t => t.id !== trip.id) : [...wishlist, trip]);
  const addCart = () => {
    if (!inCart) setCart([...cart, { ...trip, addedAt: new Date().toISOString() }]);
  };

  return (
    <main className="page" id="trip-detail-page">
      {/* Hero */}
      <div className="detail-hero">
        <img src={trip.image} alt={trip.title} className="detail-hero__img" />
        <div className="detail-hero__over" />
        <button className="detail-back" id="detail-back" onClick={() => navigate(-1)}>← Back</button>
        {trip.badge && <span className="detail-badge" style={{ background: trip.badgeColor }}>{trip.badge}</span>}
        <div className="detail-hero__info">
          <h1 className="detail-hero__title">{trip.title}</h1>
          <div className="detail-hero__meta">
            <span>⭐ {trip.rating} ({trip.reviews.toLocaleString()} reviews)</span>
            <span>📅 {trip.days} Days</span>
            <span>📍 {trip.places} Places</span>
            <span>🌐 {trip.countries} {trip.countries > 1 ? 'Countries' : 'Country'}</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="detail-body">
        <div className="detail-content">
          <div className="detail-section">
            <h2>About This Trip</h2>
            <p>{trip.description}</p>
          </div>

          <div className="detail-section">
            <h2>Trip Highlights</h2>
            <ul className="detail-highlights">
              {trip.highlights.map(h => <li key={h}><span className="hl-dot" />{h}</li>)}
            </ul>
          </div>

          <div className="detail-section detail-inc">
            <div>
              <h2>✅ What's Included</h2>
              <ul>{trip.included.map(i => <li key={i}>{i}</li>)}</ul>
            </div>
            <div>
              <h2>❌ Not Included</h2>
              <ul className="not-inc">{trip.notIncluded.map(i => <li key={i}>{i}</li>)}</ul>
            </div>
          </div>

          <div className="detail-section">
            <h2>Tags</h2>
            <div className="detail-tags">
              {[trip.destination, trip.style, trip.country, `${trip.days} days`].map(tag => (
                <span key={tag} className="detail-tag">{tag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="detail-sidebar">
          <div className="detail-price-card">
            <div className="dpc__price">
              <span className="dpc__from">From</span>
              <span className="dpc__amt">${trip.price.toLocaleString()}</span>
              {trip.originalPrice > trip.price && <span className="dpc__orig">${trip.originalPrice.toLocaleString()}</span>}
            </div>
            <p className="dpc__note">Per person · incl. taxes</p>

            <button id="add-cart-btn" className={`dpc__cart ${inCart ? 'dpc__cart--done' : ''}`} onClick={addCart}>
              {inCart ? '✓ Saved to Cart' : '🧳 Add to Cart'}
            </button>
            <button id="add-wish-btn" className={`dpc__wish ${isWished ? 'dpc__wish--on' : ''}`} onClick={toggleWish}>
              {isWished ? '❤️ In Wishlist' : '🤍 Add to Wishlist'}
            </button>

            <div className="dpc__deposit">Only <strong>$200 deposit</strong> to lock your spot!</div>

            <div className="dpc__perks">
              {['Free changes up to 60 days', 'Small group experience', 'Expert local guide included'].map(p => (
                <div key={p} className="dpc__perk">✓ {p}</div>
              ))}
            </div>
          </div>

          <div className="detail-contact">
            <p>💬 Questions? We're here 24/7</p>
            <a href="mailto:hello@wanderpack.com" className="detail-contact__btn" id="contact-link">Chat with Us</a>
          </div>
        </aside>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="section" id="related-trips">
          <div className="section__head">
            <div><p className="section__eye">You might also like</p><h2 className="section__h2">Similar Adventures</h2></div>
          </div>
          <div className="grid-3">
            {related.map(t => <TripCard key={t.id} trip={t} />)}
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}

/* ─────────────────────────── Page: Wishlist ─────────────────────────── */
function WishlistPage() {
  const [wishlist, setWishlist] = useLS('wp_wishlist', []);
  const [cart, setCart] = useLS('wp_cart', []);
  const navigate = useNavigate();

  const remove = (id) => setWishlist(wishlist.filter(t => t.id !== id));
  const addCart = (trip) => {
    if (!cart.some(t => t.id === trip.id))
      setCart([...cart, { ...trip, addedAt: new Date().toISOString() }]);
  };

  const cartTotal = cart.reduce((s, t) => s + t.price, 0);

  return (
    <main className="page" id="wishlist-page">
      <div className="page__hero page__hero--sm">
        <h1>❤️ My Wishlist</h1>
        <p>{wishlist.length} saved trip{wishlist.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="wishlist-layout">
        {/* Wishlist items */}
        <div className="wishlist-main">
          {wishlist.length === 0 ? (
            <div className="empty-state" id="wishlist-empty">
              <span>💛</span>
              <p>Your wishlist is empty</p>
              <small>Tap the heart ❤️ on any trip to save it here</small>
              <button onClick={() => navigate('/trips')} id="browse-trips-btn">Browse Trips</button>
            </div>
          ) : (
            <div className="wishlist-grid">
              {wishlist.map(trip => (
                <div key={trip.id} className="wl-card" id={`wl-${trip.id}`}>
                  <img src={trip.image} alt={trip.title} onClick={() => navigate(`/trip/${trip.slug}`)} />
                  <div className="wl-card__body">
                    <h3 onClick={() => navigate(`/trip/${trip.slug}`)}>{trip.title}</h3>
                    <p>{trip.days} days · {trip.destination} · {trip.style}</p>
                    <div className="wl-card__price">${trip.price.toLocaleString()}</div>
                    <div className="wl-card__actions">
                      <button className="wl-card__cart" id={`wl-cart-${trip.id}`} onClick={() => addCart(trip)}>
                        {cart.some(t => t.id === trip.id) ? '✓ In Cart' : '+ Add to Cart'}
                      </button>
                      <button className="wl-card__remove" id={`wl-remove-${trip.id}`} onClick={() => remove(trip.id)}>Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart summary */}
        {cart.length > 0 && (
          <aside className="cart-summary" id="cart-summary">
            <h3>🧳 Your Cart</h3>
            {cart.map(t => (
              <div key={t.id} className="cs-item" id={`cs-${t.id}`}>
                <img src={t.image} alt={t.title} />
                <div>
                  <strong>{t.title}</strong>
                  <p>${t.price.toLocaleString()}</p>
                </div>
                <button className="cs-remove" id={`cs-remove-${t.id}`}
                  onClick={() => setCart(cart.filter(c => c.id !== t.id))}>✕</button>
              </div>
            ))}
            <div className="cs-total">
              <span>Total</span>
              <strong>${cartTotal.toLocaleString()}</strong>
            </div>
            <button className="cs-book" id="book-all-btn">Book Now — $200 Deposit</button>
            <p className="cs-note">Only $200 per trip to lock your spot</p>
          </aside>
        )}
      </div>

      <Footer />
    </main>
  );
}

/* ─────────────────────────── Shared: Newsletter ─────────────────────────── */
function NewsletterBanner() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [subs, setSubs] = useLS('wp_newsletter', { subscribed: false, email: '' });

  const submit = (e) => {
    e.preventDefault();
    setSubs({ subscribed: true, email });
    setDone(true);
  };

  return (
    <section className="newsletter" id="newsletter">
      <div className="newsletter__inner">
        <div className="newsletter__text">
          <h2>Get Inspired. <span>Get Moving.</span></h2>
          <p>Join 500,000+ adventurers — exclusive deals & new trips in your inbox.</p>
        </div>
        {done || subs.subscribed ? (
          <div className="newsletter__done" id="newsletter-done">🎉 You're on the list! Adventures incoming.</div>
        ) : (
          <form className="newsletter__form" onSubmit={submit} id="newsletter-form">
            <input id="nl-email" type="email" placeholder="your@email.com" value={email}
              onChange={e => setEmail(e.target.value)} required />
            <button type="submit" id="nl-submit">Subscribe</button>
          </form>
        )}
      </div>
    </section>
  );
}

/* ─────────────────────────── Shared: Footer ─────────────────────────── */
function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="footer__top">
        <div className="footer__brand">
          <div className="footer__logo">🌍 WanderPack</div>
          <p>Group travel adventures exclusively for 18–35 year olds across 6 continents.</p>
          <p className="footer__rating">⭐ 4.8/5 · 25,000+ verified reviews</p>
        </div>
        <div className="footer__cols">
          {[
            ['Destinations', ['Europe', 'Asia', 'Americas', 'Africa', 'Oceania']],
            ['Travel Styles', ['Explorer', 'Adventure', 'Classic', 'Wellness', 'Sailing']],
            ['Company', ['About Us', 'Careers', 'Blog', 'Press', 'Sustainability']],
            ['Support', ['FAQ', 'Contact Us', 'Book with Confidence', 'Terms', 'Privacy']],
          ].map(([title, links]) => (
            <div key={title} className="footer__col">
              <h4>{title}</h4>
              {links.map(l => <a key={l} href="#">{l}</a>)}
            </div>
          ))}
        </div>
      </div>
      <div className="footer__bottom">
        <p>© 2024 WanderPack Pty Ltd · ABN 12 345 678 901</p>
        <div className="footer__pays">
          {['Visa', 'MC', 'PayPal', 'Amex'].map(p => <span key={p}>{p}</span>)}
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────── App Root ─────────────────────────── */
export default function App() {
  return (
    <HashRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/trips" element={<TripsPage />} />
        <Route path="/destinations" element={<DestinationsPage />} />
        <Route path="/trip/:slug" element={<TripDetailPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
      </Routes>
    </HashRouter>
  );
}
