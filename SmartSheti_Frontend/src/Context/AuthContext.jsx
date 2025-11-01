import React, { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  // Try to restore auth state from localStorage (simple persistence)
  const [isLoggedIn, SetIsLoggedIn] = useState(() => {
    try {
      return localStorage.getItem('SmartSheti_isLoggedIn') === '1';
    } catch { return false }
  });
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('SmartSheti_user');
      return raw ? JSON.parse(raw) : null;
    } catch { return null }
  });

  useEffect(() => {
    try {
      localStorage.setItem('SmartSheti_isLoggedIn', isLoggedIn ? '1' : '0');
      if (user) localStorage.setItem('SmartSheti_user', JSON.stringify(user));
      else localStorage.removeItem('SmartSheti_user');
    } catch (e) { console.error('AuthContext persistence error', e); }
  }, [isLoggedIn, user]);

  const login = (userData) => {
    SetIsLoggedIn(true);
    setUser(userData);
  };

  const logout = () => {
    SetIsLoggedIn(false);
    setUser(null);
    try {
      localStorage.removeItem('SmartSheti_user');
      localStorage.removeItem('SmartSheti_isLoggedIn');
      localStorage.removeItem('token');
    } catch (e) { console.error('AuthContext logout persistence error', e); }
  };

  return (
  <AuthContext.Provider value={{ isLoggedIn, SetIsLoggedIn, user, setUser, login, logout }}>
    {children}
  </AuthContext.Provider>
  );
};
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);