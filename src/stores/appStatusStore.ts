import { create } from 'zustand';
import type { AppStatusState } from '@/types/stores/appStatus.store.types';

export const useAppStatusStore = create<AppStatusState>((set) => ({
  isLoading: false,
  error: null,

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  reset: () => set({ isLoading: false, error: null }),
}));
