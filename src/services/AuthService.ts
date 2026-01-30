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
        // Parse the error response JSON
        const errorData = await response.json();
        // Extract message from backend error response structure
        // Backend returns: { message, code, status, data }
        const errorMessage = errorData?.message || 'Login failed';
        throw new Error(errorMessage);
      } catch (error) {
        // If error is already an Error with message, re-throw it
        if (error instanceof Error && error.message !== 'Login failed') {
          throw error;
        }
        // Fallback if JSON parsing fails
        const errorText = await response.text().catch(() => 'Login failed');
        try {
          // Try to parse as JSON string
          const parsed = JSON.parse(errorText);
          throw new Error(parsed.message || 'Login failed');
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
