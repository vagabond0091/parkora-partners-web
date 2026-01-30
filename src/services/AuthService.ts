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
      try {
        const errorData = await response.json().catch(() => null);
        // Extract message from error response if available
        const errorMessage = errorData?.message || errorData?.error || 'Login failed';
        throw new Error(errorMessage);
      } catch (parseError) {
        // If JSON parsing fails, try to get text
        const errorText = await response.text().catch(() => 'Login failed');
        // Try to parse as JSON if it looks like JSON
        try {
          const parsed = JSON.parse(errorText);
          throw new Error(parsed.message || parsed.error || 'Login failed');
        } catch {
          throw new Error(errorText || 'Login failed');
        }
      }
    }

    return response.json();
  },

  /**
   * Decodes JWT token to get user information
   */
  decodeToken: (token: string): JwtPayload => {
    return decodeJwt(token);
  },

  /**
   * Checks if JWT token is expired
   * @param token - JWT token string
   * @returns true if token is expired, false otherwise
   */
  isTokenExpired: (token: string): boolean => {
    try {
      const payload = decodeJwt(token);
      const currentTime = Math.floor(Date.now() / 1000); // Convert to seconds
      return payload.exp < currentTime;
    } catch {
      // If token is invalid, consider it expired
      return true;
    }
  },
};
