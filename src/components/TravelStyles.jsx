import { travelStyles } from '../data/trips';
import './TravelStyles.css';

export default function TravelStyles({ onStyleClick }) {
  return (
    <section className="travel-styles" id="styles-section">
      <div className="travel-styles__inner">
        <div className="travel-styles__header">
          <p className="ts-eyebrow">🎒 Your journey, your way</p>
          <h2 className="ts-title">Travel Styles</h2>
          <p className="ts-subtitle">Pick the adventure that suits you</p>
        </div>

        <div className="ts-grid">
          {travelStyles.map((style) => (
            <button
              key={style.id}
              className="ts-card"
              id={`style-card-${style.id}`}
              onClick={() => onStyleClick && onStyleClick(style.name)}
              style={{ '--accent': style.color }}
            >
              <div className="ts-card__icon">{style.icon}</div>
              <h3 className="ts-card__name">{style.name}</h3>
              <p className="ts-card__desc">{style.description}</p>
              <div className="ts-card__arrow">→</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
