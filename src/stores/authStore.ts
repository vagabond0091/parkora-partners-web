import { create } from 'zustand';
import type { AuthState, User } from '@/types/stores/auth.store.types';
import { AuthService } from '@/services/AuthService';

const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY || 'parkora_auth_token';

/**
 * Loads and validates a stored JWT token from localStorage.
 * @returns A valid token string if present and not expired, otherwise null.
 */
const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) {
    return null;
  }

  try {
    if (AuthService.isTokenExpired(token)) {
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }
    return token;
  } catch {
    localStorage.removeItem(TOKEN_KEY);
    return null;
  }
};

/**
 * Derives a User object from a stored JWT token.
 * @param token - Valid JWT token string
 * @returns Parsed user information or null if decoding fails
 */
const getStoredUser = (token: string | null): User | null => {
  if (!token) {
    return null;
  }

  try {
    const payload = AuthService.decodeToken(token);

    return {
      id: payload.userId,
      email: payload.email,
      name: `${payload.firstName} ${payload.lastName}`,
      roles: payload.roles,
    };
  } catch {
    return null;
  }
};

const storedToken = getStoredToken();
const storedUser = getStoredUser(storedToken);

export const useAuthStore = create<AuthState>((set) => ({
  user: storedUser,
  token: storedToken,
  isAuthenticated: !!storedToken && !!storedUser,

  setUser: (user, token) => {
    localStorage.setItem(TOKEN_KEY, token);

    set({
      user,
      token,
      isAuthenticated: true,
    });
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);

    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },
}));
