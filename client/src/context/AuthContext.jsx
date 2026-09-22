import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('rst_token') || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      const stored = localStorage.getItem('rst_user');
      if (stored) setUser(JSON.parse(stored));
    }
  }, [token]);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const data = await api.post('/auth/login', { username, password });
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('rst_token', data.token);
      localStorage.setItem('rst_user', JSON.stringify(data.user));
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('rst_token');
    localStorage.removeItem('rst_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};
