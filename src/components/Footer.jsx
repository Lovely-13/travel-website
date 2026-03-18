import { useState } from 'react';
import { useApp } from '../context/AppContext';
import './Footer.css';

export default function Footer() {
  const { userProfile } = useApp();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
    }
  };

  return (
    <footer className="footer" id="footer">
      <div className="footer__newsletter">
        <div className="footer__newsletter-inner">
          <div>
            <h3>Get Inspired. Get Moving.</h3>
            <p>Join 500,000+ adventurers and get exclusive deals, travel tips & new trip alerts.</p>
          </div>
          {subscribed ? (
            <div className="footer__subscribed">🎉 You're on the list! Adventures incoming.</div>
          ) : (
            <form className="footer__newsletter-form" onSubmit={handleSubscribe} id="newsletter-form">
              <input
                id="newsletter-email"
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" id="newsletter-submit">Subscribe</button>
            </form>
          )}
        </div>
      </div>

      <div className="footer__main">
        <div className="footer__brand">
          <div className="footer__logo">
            <span>🌍</span>
            <span>WanderPack</span>
          </div>
          <p>The world is calling — group adventures exclusively for 18–35s. Over 200 trips, 60+ countries, 6 continents.</p>
          <div className="footer__socials">
            {['Instagram', 'TikTok', 'Facebook', 'YouTube'].map((s) => (
              <a key={s} href="#" className="footer__social" aria-label={s}>{s[0]}</a>
            ))}
          </div>
          <div className="footer__award">
            ⭐ Rated 4.8/5 · 25,000+ Reviews
          </div>
        </div>

        <div className="footer__links">
          {[
            { title: 'Destinations', links: ['Europe', 'Asia', 'Americas', 'Africa', 'Oceania', 'Middle East'] },
            { title: 'Travel Styles', links: ['Explorer', 'Adventure', 'Classic', 'Wellness', 'Sailing', 'Festival'] },
            { title: 'Company', links: ['About Us', 'Careers', 'Press', 'Partners', 'Sustainability', 'Blog'] },
            { title: 'Support', links: ['FAQ', 'Contact Us', 'Book with Confidence', 'Accessibility', 'Terms', 'Privacy'] },
          ].map(({ title, links }) => (
            <div key={title} className="footer__col">
              <h4>{title}</h4>
              {links.map((l) => (
                <a key={l} href="#">{l}</a>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="footer__bottom">
        <p>© 2024 WanderPack Pty Ltd. All rights reserved. ABN 12 345 678 901</p>
        <div className="footer__payments">
          {['Visa', 'MC', 'PayPal', 'Amex'].map((p) => (
            <span key={p} className="footer__payment-badge">{p}</span>
          ))}
        </div>
      </div>
    </footer>
  );
}
