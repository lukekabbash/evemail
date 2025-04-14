import React, { createContext, useContext, useState, useCallback } from 'react';
import { authService } from '../services/authService';

interface Auth {
  isAuthenticated: boolean;
  accessToken: string | null;
  characterId: string | null;
  characterName: string | null;
  scopes: string[];
}

interface AuthContextType {
  auth: Auth;
  login: () => void;
  logout: () => void;
  handleCallback: () => Promise<void>;
  clearSSO: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<Auth>(() => {
    // Try to restore from localStorage
    const storedToken = localStorage.getItem('eve_token');
    if (storedToken) {
      try {
        const characterInfo = authService.getCharacterInfo(storedToken);
        if (!authService.isTokenExpired(storedToken)) {
          return {
            isAuthenticated: true,
            accessToken: storedToken,
            characterId: characterInfo.sub,
            characterName: characterInfo.name,
            scopes: characterInfo.scp,
          };
        }
      } catch (e) {
        // Invalid token, ignore
      }
    }
    return {
      isAuthenticated: false,
      accessToken: null,
      characterId: null,
      characterName: null,
      scopes: [],
    };
  });

  const login = useCallback(() => {
    authService.login();
  }, []);

  const logout = useCallback(() => {
    setAuth({
      isAuthenticated: false,
      accessToken: null,
      characterId: null,
      characterName: null,
      scopes: [],
    });
    localStorage.removeItem('eve_token');
    authService.logout();
  }, []);

  const clearSSO = useCallback(() => {
    setAuth({
      isAuthenticated: false,
      accessToken: null,
      characterId: null,
      characterName: null,
      scopes: [],
    });
    localStorage.removeItem('eve_token');
  }, []);

  const handleCallback = useCallback(async () => {
    try {
      const accessToken = authService.handleCallback();
      const characterInfo = authService.getCharacterInfo(accessToken);
      setAuth({
        isAuthenticated: true,
        accessToken,
        characterId: characterInfo.sub,
        characterName: characterInfo.name,
        scopes: characterInfo.scp,
      });
      localStorage.setItem('eve_token', accessToken);
    } catch (error) {
      console.error('Failed to handle authentication callback:', error);
      throw error;
    }
  }, []);

  return (
    <AuthContext.Provider value={{ auth, login, logout, handleCallback, clearSSO }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 