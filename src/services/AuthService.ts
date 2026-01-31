import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, JwtPayload } from '@/types/services/auth.types';
import { getApiUrl } from '@/config/env';

const API_URL = getApiUrl();

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
      let errorMessage = 'Login failed';
      
      try {
        // Try to parse as JSON first
        const errorData = await response.json();
        errorMessage = errorData?.message || 'Login failed';
      } catch {
        // JSON parsing failed, try text() as fallback
        try {
          const errorText = await response.text();
          try {
            // Try to parse text as JSON
            const parsed = JSON.parse(errorText);
            errorMessage = parsed.message || 'Login failed';
          } catch {
            // Not valid JSON, use text as error message
            errorMessage = errorText || 'Login failed';
          }
        } catch {
          // Both json() and text() failed, use default
          errorMessage = 'Login failed';
        }
      }
      
      throw new Error(errorMessage);
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
   * Registers a new user
   * @param data - Registration data
   * @returns Registration response
   */
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await fetch(`${API_URL}/auth/register/partners`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let errorMessage = 'Registration failed';
      
      try {
        // Try to parse as JSON first
        const errorData = await response.json();
        errorMessage = errorData?.message || 'Registration failed';
      } catch {
        // JSON parsing failed, try text() as fallback
        try {
          const errorText = await response.text();
          try {
            // Try to parse text as JSON
            const parsed = JSON.parse(errorText);
            errorMessage = parsed.message || 'Registration failed';
          } catch {
            // Not valid JSON, use text as error message
            errorMessage = errorText || 'Registration failed';
          }
        } catch {
          // Both json() and text() failed, use default
          errorMessage = 'Registration failed';
        }
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
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
