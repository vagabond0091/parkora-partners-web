import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, JwtPayload } from '@/types/services/auth.types';
import { apiClient } from './apiClient';

/**
 * Decodes JWT token to extract payload
 */
const decodeJwt = (token: string): JwtPayload => {
  const [, payload] = token.split('.');
  const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
  return JSON.parse(decodeURIComponent(escape(json)));
};

export const AuthService = {
  /**
   * Authenticates a user with email and password.
   * @param credentials - Login credentials
   * @returns Login response with token
   */
  login: (credentials: LoginRequest): Promise<LoginResponse> =>
    apiClient.post<LoginResponse>('/auth/login', {
      body: credentials,
      auth: false,
    }),

  /**
   * Decodes JWT token to get user information.
   * @param token - JWT token string
   * @returns Decoded JWT payload
   */
  decodeToken: (token: string): JwtPayload => {
    return decodeJwt(token);
  },

  /**
   * Registers a new partner user.
   * @param data - Registration data
   * @returns Registration response
   */
  register: (data: RegisterRequest): Promise<RegisterResponse> =>
    apiClient.post<RegisterResponse>('/auth/register/partners', {
      body: data,
      auth: false,
    }),

  /**
   * Checks if JWT token is expired.
   * @param token - JWT token string
   * @returns true if token is expired, false otherwise
   */
  isTokenExpired: (token: string): boolean => {
    try {
      const payload = decodeJwt(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  },
};
