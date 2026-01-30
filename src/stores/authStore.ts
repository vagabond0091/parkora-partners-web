import { create } from 'zustand';
import type { AuthState } from '@/types/stores/auth.store.types';
import { AuthService } from '@/services/AuthService';

const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY || 'parkora_auth_token';

// Load initial state from localStorage and validate token
const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem(TOKEN_KEY);
  
  // If token exists, check if it's expired
  if (token) {
    try {
      if (AuthService.isTokenExpired(token)) {
        // Token is expired, clear it
        localStorage.removeItem(TOKEN_KEY);
        return null;
      }
      return token;
    } catch {
      // If token is invalid, clear it
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }
  }
  
  return null;
};

const storedToken = getStoredToken();

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: storedToken,
  isAuthenticated: !!storedToken,

  setUser: (user, token) => {
    // Save token to localStorage
    localStorage.setItem(TOKEN_KEY, token);
    
    set({ 
      user, 
      token, 
      isAuthenticated: true 
    });
  },

  logout: () => {
    // Clear localStorage
    localStorage.removeItem(TOKEN_KEY);
    
    set({ 
      user: null, 
      token: null, 
      isAuthenticated: false 
    });
  },
}));
