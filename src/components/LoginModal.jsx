import { useState } from 'react';
import { useApp } from '../context/AppContext';
import './LoginModal.css';

export default function LoginModal({ open, onClose }) {
  const { login, userProfile } = useApp();
  const [tab, setTab] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    login(name || email.split('@')[0], email);
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); onClose(); }, 1200);
  };

  return (
    <div className="login-modal" id="login-modal" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="login-modal__box">
        <button className="login-modal__close" id="login-modal-close" onClick={onClose}>✕</button>

        <div className="login-modal__brand">
          <span>🌍</span>
          <h2>WanderPack</h2>
          <p>Adventure awaits — for 18–35s</p>
        </div>

        <div className="login-modal__tabs">
          <button
            className={`login-tab ${tab === 'login' ? 'login-tab--active' : ''}`}
            id="login-tab-btn"
            onClick={() => setTab('login')}
          >Log In</button>
          <button
            className={`login-tab ${tab === 'signup' ? 'login-tab--active' : ''}`}
            id="signup-tab-btn"
            onClick={() => setTab('signup')}
          >Sign Up</button>
        </div>

        {submitted ? (
          <div className="login-modal__success">
            <span>🎉</span>
            <h3>Welcome, {name || email.split('@')[0]}!</h3>
            <p>Your adventure begins now.</p>
          </div>
        ) : (
          <form className="login-modal__form" onSubmit={handleSubmit} id="login-form">
            {tab === 'signup' && (
              <div className="form-group">
                <label htmlFor="login-name-input">Full Name</label>
                <input
                  id="login-name-input"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}
            <div className="form-group">
              <label htmlFor="login-email-input">Email Address</label>
              <input
                id="login-email-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {tab === 'login' && (
              <div className="form-group">
                <label htmlFor="login-password-input">Password</label>
                <input id="login-password-input" type="password" placeholder="••••••••" />
              </div>
            )}

            <button type="submit" className="login-modal__submit" id="login-submit-btn">
              {tab === 'login' ? 'Log In' : 'Create Account'}
            </button>

            <p className="login-modal__alt">
              {tab === 'login' ? "Don't have an account? " : 'Already have one? '}
              <button type="button" onClick={() => setTab(tab === 'login' ? 'signup' : 'login')}>
                {tab === 'login' ? 'Sign Up' : 'Log In'}
              </button>
            </p>
          </form>
        )}

        <div className="login-modal__perks">
          {['Save wishlist trips', 'Track bookings', 'Get exclusive deals', 'Earn travel points'].map((p) => (
            <span key={p}>✓ {p}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
