import type { LoginRequest, LoginResponse, JwtPayload } from '@/types/services/auth.types';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Decodes JWT token to extract payload
 */
const decodeJwt = (token: string): JwtPayload => {
  const [, payload] = token.split('.');
  const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
  return JSON.parse(decodeURIComponent(escape(json)));
};

export const AuthService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Login failed');
      throw new Error(errorText);
    }

    return response.json();
  },

  /**
   * Decodes JWT token to get user information
   */
  decodeToken: (token: string): JwtPayload => {
    return decodeJwt(token);
  },
};
