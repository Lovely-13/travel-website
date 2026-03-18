import { useState } from 'react';
import { trips } from '../data/trips';
import { useApp } from '../context/AppContext';
import TripCard from './TripCard';
import './TripsSection.css';

const DESTINATIONS = ['All', 'Europe', 'Asia', 'Americas', 'Africa'];
const STYLES = ['All', 'Explorer', 'Adventure', 'Classic', 'Wellness'];
const SORT = ['Featured', 'Price: Low–High', 'Price: High–Low', 'Rating', 'Duration'];

export default function TripsSection({ onTripView }) {
  const { filters, setFilters } = useApp();
  const [sort, setSort] = useState('Featured');
  const [visible, setVisible] = useState(6);

  const filtered = trips
    .filter((t) => filters.destination === 'All' || t.destination === filters.destination)
    .filter((t) => filters.style === 'All' || t.style === filters.style)
    .filter((t) => t.days <= (filters.maxDays || 30))
    .filter((t) => t.price <= (filters.maxPrice || 6000));

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'Price: Low–High') return a.price - b.price;
    if (sort === 'Price: High–Low') return b.price - a.price;
    if (sort === 'Rating') return b.rating - a.rating;
    if (sort === 'Duration') return a.days - b.days;
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  return (
    <section className="trips-section" id="trips-section">
      <div className="trips-section__header">
        <div>
          <p className="trips-section__eyebrow">✈️ Find your adventure</p>
          <h2 className="trips-section__title">Trending Trips</h2>
        </div>
        <p className="trips-section__subtitle">
          {sorted.length} trips found — book with just a $200 deposit
        </p>
      </div>

      <div className="trips-section__filters">
        <div className="filter-group">
          <label>Destination</label>
          <div className="filter-pills">
            {DESTINATIONS.map((d) => (
              <button
                key={d}
                className={`filter-pill ${filters.destination === d ? 'filter-pill--active' : ''}`}
                id={`filter-dest-${d}`}
                onClick={() => setFilters((f) => ({ ...f, destination: d }))}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label>Style</label>
          <div className="filter-pills">
            {STYLES.map((s) => (
              <button
                key={s}
                className={`filter-pill ${filters.style === s ? 'filter-pill--active' : ''}`}
                id={`filter-style-${s}`}
                onClick={() => setFilters((f) => ({ ...f, style: s }))}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group filter-group--right">
          <label>Max Duration: {filters.maxDays} days</label>
          <input
            type="range" min={5} max={30} step={1}
            value={filters.maxDays || 30}
            onChange={(e) => setFilters((f) => ({ ...f, maxDays: +e.target.value }))}
            className="filter-range"
            id="filter-days-range"
          />
        </div>

        <div className="filter-group filter-group--right">
          <label>Max Price: ${(filters.maxPrice || 6000).toLocaleString()}</label>
          <input
            type="range" min={1000} max={6000} step={100}
            value={filters.maxPrice || 6000}
            onChange={(e) => setFilters((f) => ({ ...f, maxPrice: +e.target.value }))}
            className="filter-range"
            id="filter-price-range"
          />
        </div>

        <div className="filter-group filter-group--sort">
          <label>Sort by</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="filter-select"
            id="sort-select"
          >
            {SORT.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="trips-section__grid">
        {sorted.slice(0, visible).map((trip) => (
          <TripCard key={trip.id} trip={trip} onView={onTripView} />
        ))}
      </div>

      {sorted.length === 0 && (
        <div className="trips-section__empty">
          <p>No trips match your filters. Try adjusting the options above!</p>
          <button
            className="trips-section__reset"
            onClick={() => setFilters({ destination: 'All', style: 'All', maxDays: 30, maxPrice: 6000 })}
          >
            Reset Filters
          </button>
        </div>
      )}

      {visible < sorted.length && (
        <div className="trips-section__load-more">
          <button
            className="trips-section__load-btn"
            id="load-more-btn"
            onClick={() => setVisible((v) => v + 3)}
          >
            Load More Trips ({sorted.length - visible} remaining)
          </button>
        </div>
      )}
    </section>
  );
}
