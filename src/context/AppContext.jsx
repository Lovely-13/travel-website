import { createContext, useContext, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [wishlist, setWishlist] = useLocalStorage('wanderlust_wishlist', []);
  const [cart, setCart] = useLocalStorage('wanderlust_cart', []);
  const [searchHistory, setSearchHistory] = useLocalStorage('wanderlust_search_history', []);
  const [filters, setFilters] = useLocalStorage('wanderlust_filters', {
    destination: 'All',
    style: 'All',
    maxDays: 30,
    maxPrice: 6000,
  });
  const [recentlyViewed, setRecentlyViewed] = useLocalStorage('wanderlust_recently_viewed', []);
  const [userProfile, setUserProfile] = useLocalStorage('wanderlust_user', {
    name: '',
    email: '',
    currency: 'AUD',
    loggedIn: false,
  });

  const toggleWishlist = useCallback((trip) => {
    setWishlist((prev) => {
      const exists = prev.find((t) => t.id === trip.id);
      if (exists) return prev.filter((t) => t.id !== trip.id);
      return [...prev, trip];
    });
  }, [setWishlist]);

  const isWishlisted = useCallback((id) => wishlist.some((t) => t.id === id), [wishlist]);

  const addToCart = useCallback((trip) => {
    setCart((prev) => {
      const exists = prev.find((t) => t.id === trip.id);
      if (exists) return prev;
      return [...prev, { ...trip, bookedAt: new Date().toISOString(), travelers: 1 }];
    });
  }, [setCart]);

  const removeFromCart = useCallback((id) => {
    setCart((prev) => prev.filter((t) => t.id !== id));
  }, [setCart]);

  const isInCart = useCallback((id) => cart.some((t) => t.id === id), [cart]);

  const addSearch = useCallback((term) => {
    if (!term.trim()) return;
    setSearchHistory((prev) => {
      const filtered = prev.filter((s) => s.toLowerCase() !== term.toLowerCase());
      return [term, ...filtered].slice(0, 8);
    });
  }, [setSearchHistory]);

  const clearSearchHistory = useCallback(() => setSearchHistory([]), [setSearchHistory]);

  const addRecentlyViewed = useCallback((trip) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((t) => t.id !== trip.id);
      return [trip, ...filtered].slice(0, 6);
    });
  }, [setRecentlyViewed]);

  const login = useCallback((name, email) => {
    setUserProfile({ name, email, currency: 'AUD', loggedIn: true });
  }, [setUserProfile]);

  const logout = useCallback(() => {
    setUserProfile({ name: '', email: '', currency: 'AUD', loggedIn: false });
  }, [setUserProfile]);

  const cartTotal = cart.reduce((sum, t) => sum + t.price * (t.travelers || 1), 0);

  return (
    <AppContext.Provider value={{
      wishlist, toggleWishlist, isWishlisted,
      cart, addToCart, removeFromCart, isInCart, cartTotal,
      searchHistory, addSearch, clearSearchHistory,
      filters, setFilters,
      recentlyViewed, addRecentlyViewed,
      userProfile, login, logout,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
