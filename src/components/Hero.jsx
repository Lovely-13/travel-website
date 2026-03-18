import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import './Hero.css';

const slides = [
  {
    image: '/hero_greece.png',
    headline: 'Your Next Adventure',
    subheadline: 'Awaits You',
    tagline: 'Explore 200+ trips for 18-35s across 6 continents',
  },
  {
    image: '/hero_slider2.png',
    headline: 'Make Friends.',
    subheadline: 'Make Memories.',
    tagline: 'Group travel designed for young explorers',
  },
  {
    image: '/hero_slider3.png',
    headline: 'Beyond the',
    subheadline: 'Tourist Trail.',
    tagline: 'Local experiences, authentic moments, real adventure',
  },
];

export default function Hero({ onSearchOpen }) {
  const { addSearch } = useApp();
  const [current, setCurrent] = useState(0);
  const [searchVal, setSearchVal] = useState('');
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
        setAnimating(false);
      }, 400);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      addSearch(searchVal.trim());
      onSearchOpen(searchVal.trim());
    }
  };

  return (
    <section className="hero" id="hero-section">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`hero__bg ${i === current ? 'hero__bg--active' : ''} ${animating && i === current ? 'hero__bg--exit' : ''}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        />
      ))}

      <div className="hero__overlay" />

      <div className="hero__content">
        <div className={`hero__text ${animating ? 'hero__text--exit' : 'hero__text--enter'}`}>
          <p className="hero__eyebrow">🌍 Exclusively for 18–35s</p>
          <h1 className="hero__headline">
            {slides[current].headline}<br />
            <span className="hero__headline--accent">{slides[current].subheadline}</span>
          </h1>
          <p className="hero__tagline">{slides[current].tagline}</p>
        </div>

        <form className="hero__search" onSubmit={handleSearch} id="hero-search-form">
          <div className="hero__search-inner">
            <div className="hero__search-field">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                id="hero-search-input"
                type="text"
                placeholder="Where do you want to go?"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
              />
            </div>
            <div className="hero__search-divider" />
            <select className="hero__search-select" id="hero-duration-select">
              <option value="">Duration</option>
              <option value="1-7">1–7 Days</option>
              <option value="8-14">8–14 Days</option>
              <option value="15-21">15–21 Days</option>
              <option value="22+">22+ Days</option>
            </select>
            <div className="hero__search-divider" />
            <select className="hero__search-select" id="hero-style-select">
              <option value="">Travel Style</option>
              <option value="Explorer">Explorer</option>
              <option value="Adventure">Adventure</option>
              <option value="Classic">Classic</option>
              <option value="Wellness">Wellness</option>
            </select>
            <button type="submit" className="hero__search-btn" id="hero-search-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              Search
            </button>
          </div>
        </form>

        <div className="hero__stats">
          {[
            { value: '200+', label: 'Adventures' },
            { value: '6', label: 'Continents' },
            { value: '60+', label: 'Countries' },
            { value: '4.8★', label: 'Avg Rating' },
          ].map(({ value, label }) => (
            <div key={label} className="hero__stat">
              <span className="hero__stat-value">{value}</span>
              <span className="hero__stat-label">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="hero__dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`hero__dot ${i === current ? 'hero__dot--active' : ''}`}
            onClick={() => setCurrent(i)}
            id={`hero-dot-${i}`}
          />
        ))}
      </div>

      <div className="hero__scroll-hint">
        <div className="hero__scroll-arrow" />
        <span>Scroll to explore</span>
      </div>
    </section>
  );
}
