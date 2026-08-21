import React, { createContext, useContext, useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const AppContext = createContext();

const DEMO_OFFICERS = [
  { id: "OFF-101", name: "Col. Rajesh Sharma", rank: "SDMA Relief Commissioner", pass: "officer101" },
  { id: "OFF-102", name: "Dr. Ananya Sen", rank: "NDMA Operations Chief", pass: "officer102" },
  { id: "OFF-103", name: "Capt. Vikram Malhotra", rank: "NDRF Sector Commander", pass: "officer103" }
];

export function AppProvider({ children }) {
  // Theme state: 'dark' | 'light' (defaults to 'dark')
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('storm_theme');
      return savedTheme === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  // Official officer auth state
  const [activeOfficer, setActiveOfficer] = useState(() => {
    try {
      const saved = localStorage.getItem('storm_officer');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Login modal open/close state
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Apply theme class and data-theme attribute directly to <html> and <body>
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    
    if (theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
      body.classList.add('light');
      body.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
      body.classList.add('dark');
      body.classList.remove('light');
      root.setAttribute('data-theme', 'dark');
    }
    
    localStorage.setItem('storm_theme', theme);
  }, [theme]);

  // Sync officer state from storage changes (e.g. login from another tab/page)
  useEffect(() => {
    const syncAuth = () => {
      try {
        const saved = localStorage.getItem('storm_officer');
        setActiveOfficer(saved ? JSON.parse(saved) : null);
      } catch {
        setActiveOfficer(null);
      }
    };
    window.addEventListener('storage', syncAuth);
    return () => window.removeEventListener('storage', syncAuth);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const loginOfficer = async (officerId, password) => {
    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ officerId, password })
      });
      const data = await response.json();
      if (response.ok && data.officer) {
        setActiveOfficer(data.officer);
        localStorage.setItem('storm_officer', JSON.stringify(data.officer));
        if (data.token) {
          localStorage.setItem('storm_officer_token', data.token);
        }
        window.dispatchEvent(new Event('storage'));
        return { success: true, officer: data.officer };
      }
      return { success: false, error: data.error || 'Invalid Officer ID or Password' };
    } catch (err) {
      return { success: false, error: 'Authentication server unreachable: ' + err.message };
    }
  };

  const logoutOfficer = () => {
    setActiveOfficer(null);
    localStorage.removeItem('storm_officer');
    localStorage.removeItem('storm_officer_token');
    window.dispatchEvent(new Event('storage'));
  };

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        activeOfficer,
        loginOfficer,
        logoutOfficer,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
        demoOfficers: DEMO_OFFICERS
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
