import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { STRINGS } from './i18n.js';

const AppContext = createContext(null);

const CITIES = ['Riyadh', 'Jeddah', 'Dubai', 'Abu Dhabi', 'Doha', 'London'];
const CURRENCIES = { Riyadh: 'sar', Jeddah: 'sar', Dubai: 'aed', 'Abu Dhabi': 'aed', Doha: 'usd', London: 'eur' };

export function AppProvider({ children }) {
  const [lang, setLang] = useState('en');
  const [city, setCity] = useState('Riyadh');
  const [orders, setOrders] = useState(() => {
    try { return JSON.parse(localStorage.getItem('orders') || '[]'); } catch { return []; }
  });
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
  });
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') return saved;
      return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    } catch { return 'dark'; }
  });

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  const t = useMemo(() => STRINGS[lang], [lang]);
  const currency = CURRENCIES[city] || 'sar';

  const formatPrice = (n) => {
    if (n === 0) return t.free;
    const symbol = t[currency];
    return `${symbol} ${n.toLocaleString(lang === 'ar' ? 'ar-SA' : 'en-US')}`;
  };

  const addOrder = (order) => {
    setOrders((prev) => [{ ...order, id: 'TKO-' + Math.random().toString(36).slice(2, 8).toUpperCase(), createdAt: new Date().toISOString() }, ...prev]);
  };

  const signIn = ({ email, name }) => {
    const display = name || (email ? email.split('@')[0] : 'You');
    setUser({ email: email || 'demo@tikko.com', name: display, initials: display.slice(0, 1).toUpperCase() });
  };
  const signUp = ({ email, name }) => signIn({ email, name });
  const signOut = () => setUser(null);

  const toggleTheme = () => setTheme((p) => p === 'dark' ? 'light' : 'dark');

  const value = {
    lang, setLang,
    city, setCity, cities: CITIES,
    currency,
    t, formatPrice,
    orders, addOrder,
    user, signIn, signUp, signOut,
    theme, setTheme, toggleTheme,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
