import { useState, useEffect, useRef } from 'react';
import { trips } from '../data/trips';
import { useApp } from '../context/AppContext';
import './SearchModal.css';

export default function SearchModal({ open, onClose, onTripView, initialQuery }) {
  const { searchHistory, addSearch, clearSearchHistory } = useApp();
  const [query, setQuery] = useState(initialQuery || '');
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery(initialQuery || '');
    }
  }, [open, initialQuery]);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const q = query.toLowerCase();
    setResults(
      trips.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.destination.toLowerCase().includes(q) ||
          t.country.toLowerCase().includes(q) ||
          t.style.toLowerCase().includes(q)
      ).slice(0, 6)
    );
  }, [query]);

  const handleSearch = (term) => {
    addSearch(term);
    setQuery(term);
  };

  if (!open) return null;

  return (
    <div className="search-modal" id="search-modal" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="search-modal__box">
        <div className="search-modal__top">
          <div className="search-modal__field">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              ref={inputRef}
              id="search-modal-input"
              type="text"
              placeholder="Search destinations, trips, styles..."
              value={query}
              onChange={(e) => { setQuery(e.target.value); handleSearch(e.target.value); }}
            />
            {query && (
              <button className="search-modal__clear" onClick={() => setQuery('')} id="search-clear-btn">✕</button>
            )}
          </div>
          <button className="search-modal__close" id="search-modal-close" onClick={onClose}>Cancel</button>
        </div>

        {!query && searchHistory.length > 0 && (
          <div className="search-modal__history">
            <div className="search-modal__history-header">
              <span>Recent Searches</span>
              <button onClick={clearSearchHistory} id="clear-history-btn">Clear all</button>
            </div>
            {searchHistory.map((term) => (
              <button
                key={term}
                className="search-modal__history-item"
                onClick={() => handleSearch(term)}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                {term}
              </button>
            ))}
          </div>
        )}

        {!query && (
          <div className="search-modal__suggestions">
            <p className="search-modal__label">Popular Searches</p>
            <div className="search-modal__tags">
              {['Greece', 'Japan', 'Europe', 'Bali', 'Adventure', 'Explorer', 'Peru', 'Morocco'].map((tag) => (
                <button key={tag} className="search-modal__tag" onClick={() => handleSearch(tag)}>
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {results.length > 0 && (
          <div className="search-modal__results">
            <p className="search-modal__label">{results.length} result{results.length > 1 ? 's' : ''}</p>
            {results.map((trip) => (
              <button
                key={trip.id}
                className="search-modal__result"
                id={`search-result-${trip.id}`}
                onClick={() => { onTripView(trip); onClose(); }}
              >
                <img src={trip.image} alt={trip.title} />
                <div className="search-modal__result-info">
                  <strong>{trip.title}</strong>
                  <span>{trip.days} days · {trip.destination} · From ${trip.price.toLocaleString()}</span>
                </div>
                <span className="search-modal__result-badge" style={{ background: trip.badgeColor }}>{trip.badge}</span>
              </button>
            ))}
          </div>
        )}

        {query && results.length === 0 && (
          <div className="search-modal__no-results">
            <span>🔍</span>
            <p>No trips found for "<strong>{query}</strong>"</p>
            <p>Try a destination like Europe, Asia, or a travel style like Adventure.</p>
          </div>
        )}
      </div>
    </div>
  );
}
