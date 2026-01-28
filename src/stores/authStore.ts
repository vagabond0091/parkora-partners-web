import { create } from 'zustand';
import type { AuthState } from '@/types/stores/auth.store.types';

const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY || 'parkora_auth_token';
const USER_KEY = import.meta.env.VITE_USER_KEY || 'parkora_auth_user';

// Load initial state from localStorage
const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
};

const getStoredUser = (): AuthState['user'] => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(USER_KEY);
  if (!stored || stored === 'undefined' || stored === 'null') return null;
  
  try {
    return JSON.parse(stored);
  } catch {
    // If JSON is invalid, clear it and return null
    localStorage.removeItem(USER_KEY);
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: getStoredUser(),
  token: getStoredToken(),
  isAuthenticated: !!getStoredToken(),

  setUser: (user, token) => {
    // Save to localStorage
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    
    set({ 
      user, 
      token, 
      isAuthenticated: true 
    });
  },

  logout: () => {
    // Clear localStorage
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    
    set({ 
      user: null, 
      token: null, 
      isAuthenticated: false 
    });
  },
}));
