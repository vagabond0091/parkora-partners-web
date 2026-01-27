import type { LoginRequest, LoginResponse } from '@/types/services/auth.types';

const API_URL = 'http://localhost:8080/api/v1';

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
