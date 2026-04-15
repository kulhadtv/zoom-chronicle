import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/axios';


const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(() => JSON.parse(localStorage.getItem('zc_user') || 'null'));
  const [loading, setLoading] = useState(false);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const res = await authAPI.login(credentials);
      localStorage.setItem('zc_token', res.data.token);
      localStorage.setItem('zc_user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('zc_token');
    localStorage.removeItem('zc_user');
    setUser(null);
  };

  const isAdmin   = user?.role === 'admin';
  // const isAuthor  = user?.role === 'author' || isAdmin;
  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);