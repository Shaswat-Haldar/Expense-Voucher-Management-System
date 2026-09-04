import React, { createContext, useState, useEffect } from 'react';
import { getMe, login as apiLogin, logout as apiLogout } from '../api/auth';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getMe();
        if (response.success) {
          setUser(response.data);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (email, password) => {
    const response = await apiLogin(email, password);
    if (response.success) {
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      setUser(response.data);
    }
    return response;
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch (_) {}
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
