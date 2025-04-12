import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

interface AuthState {
  isAuthenticated: boolean;
  characterId: string | null;
  characterName: string | null;
  accessToken: string | null;
  scopes: string[];
}

interface AuthContextType {
  auth: AuthState;
  login: () => void;
  logout: () => void;
  updateAuthState: (token: string) => void;
}

const defaultAuthState: AuthState = {
  isAuthenticated: false,
  characterId: null,
  characterName: null,
  accessToken: null,
  scopes: [],
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>(() => {
    const token = localStorage.getItem('eve_token');
    if (token) {
      try {
        if (!authService.isTokenExpired(token)) {
          const characterInfo = authService.getCharacterInfo(token);
          return {
            isAuthenticated: true,
            characterId: characterInfo.sub,
            characterName: characterInfo.name,
            accessToken: token,
            scopes: characterInfo.scp || [],
          };
        }
      } catch (error) {
        console.error('Error processing stored token:', error);
      }
    }
    return defaultAuthState;
  });

  const login = () => {
    authService.login();
  };

  const logout = () => {
    setAuth(defaultAuthState);
    authService.logout();
  };

  // Update auth state when token changes
  const updateAuthState = (token: string) => {
    try {
      const characterInfo = authService.getCharacterInfo(token);
      setAuth({
        isAuthenticated: true,
        characterId: characterInfo.sub,
        characterName: characterInfo.name,
        accessToken: token,
        scopes: characterInfo.scp || [],
      });
      localStorage.setItem('eve_token', token);
    } catch (error) {
      console.error('Error updating auth state:', error);
      logout();
    }
  };

  const value = {
    auth,
    login,
    logout,
    updateAuthState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 