/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, logoutUser, getStoredUser, getStoredToken } from '../api/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());
  const [token, setToken] = useState(() => getStoredToken());
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);

  const isAuthenticated = Boolean(token);

  // Listen to 401 unauthorized events emitted from Axios interceptor
  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  const login = async (username, password) => {
    setIsLoadingAuth(true);
    try {
      const data = await loginUser(username, password);
      const accessToken = data.accessToken || data.token;
      setUser(data);
      setToken(accessToken);
      return data;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoadingAuth,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
