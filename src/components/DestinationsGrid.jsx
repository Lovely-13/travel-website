import { destinations } from '../data/trips';
import './DestinationsGrid.css';

export default function DestinationsGrid({ onDestinationClick }) {
  return (
    <section className="destinations" id="destinations-section">
      <div className="destinations__header">
        <p className="destinations__eyebrow">🗺️ Explore the world</p>
        <h2 className="destinations__title">Popular Destinations</h2>
        <p className="destinations__subtitle">Trips for 18–35s across 6 continents</p>
      </div>

      <div className="destinations__grid">
        {destinations.map((dest, i) => (
          <div
            key={dest.id}
            className={`dest-card ${i === 0 ? 'dest-card--large' : ''}`}
            id={`dest-card-${dest.id}`}
            onClick={() => onDestinationClick && onDestinationClick(dest.name)}
            style={{ '--i': i }}
          >
            <img src={dest.image} alt={dest.name} loading="lazy" />
            <div className="dest-card__overlay" />
            <div className="dest-card__info">
              <span className="dest-card__region">{dest.region}</span>
              <h3 className="dest-card__name">{dest.name}</h3>
              <span className="dest-card__count">{dest.trips} trips available</span>
            </div>
            <div className="dest-card__hover-btn">Explore →</div>
          </div>
        ))}
      </div>

      <div className="destinations__promo">
        <span>🎉</span>
        <p>New trips in Asia, Europe and beyond — <a href="#trips-section">find them right here</a></p>
        <span>🎉</span>
      </div>
    </section>
  );
}
