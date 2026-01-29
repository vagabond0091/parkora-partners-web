import { create } from 'zustand';
import type { AuthState } from '@/types/stores/auth.store.types';

const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY || 'parkora_auth_token';

// Load initial state from localStorage
const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: getStoredToken(),
  isAuthenticated: !!getStoredToken(),

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
