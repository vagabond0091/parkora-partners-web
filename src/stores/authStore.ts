import { create } from 'zustand';
import type { AuthState } from '@/types/stores/auth.store.types';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setUser: (user, token) => set({ 
    user, 
    token, 
    isAuthenticated: true 
  }),

  logout: () => set({ 
    user: null, 
    token: null, 
    isAuthenticated: false 
  }),
}));
