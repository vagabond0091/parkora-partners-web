import type { LoginRequest, LoginResponse } from '@/types/services/auth.types';

const API_URL = import.meta.env.VITE_API_URL;

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
};
