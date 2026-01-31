import { AuthService } from '@/services/AuthService';
import type { LoginRequest, LoginResponse } from '@/types/services/auth.types';

// Mock environment variable
const mockApiUrl = 'http://localhost:3000/api';

// Mock import.meta.env using type assertion
(import.meta as any).env = {
  VITE_API_URL: mockApiUrl,
};

// Mock global fetch
const mockFetch = jest.fn();
globalThis.fetch = mockFetch as unknown as typeof fetch;

describe('AuthService', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    mockFetch.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    // Arrange (shared)
    const mockCredentials: LoginRequest = {
      username: 'testuser',
      password: 'password123',
    };

    const mockSuccessResponse: LoginResponse = {
      data: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjMiLCJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJmaXJzdE5hbWUiOiJUZXN0IiwibGFzdE5hbWUiOiJVc2VyIiwicm9sZXMiOlsicGFydG5lcnMiXSwiZXhwIjoxNzM1NzA0MDAwfQ.signature',
      errorCode: 0,
      message: 'Login successful',
      status: 'SUCCESS',
    };

    // Positive Tests
    describe('positive cases', () => {
      it('should return login response with token when credentials are valid', async () => {
        // Arrange
        const mockResponse = {
          ok: true,
          json: jest.fn().mockResolvedValue(mockSuccessResponse),
        };
        mockFetch.mockResolvedValue(mockResponse);

        // Act
        const result = await AuthService.login(mockCredentials);

        // Assert
        expect(mockFetch).toHaveBeenCalledWith(
          `${mockApiUrl}/auth/login`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(mockCredentials),
          }
        );
        expect(result).toEqual(mockSuccessResponse);
        expect(result.data).toBe(mockSuccessResponse.data);
      });

      it('should send correct request body with credentials', async () => {
        // Arrange
        const mockResponse = {
          ok: true,
          json: jest.fn().mockResolvedValue(mockSuccessResponse),
        };
        mockFetch.mockResolvedValue(mockResponse);

        // Act
        await AuthService.login(mockCredentials);

        // Assert
        expect(mockFetch).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            body: JSON.stringify(mockCredentials),
          })
        );
      });
    });

    // Negative Tests
    describe('negative cases', () => {
      it('should throw error with message from backend when response is not ok', async () => {
        // Arrange
        const errorResponse = {
          message: 'Invalid username or password',
          code: 401,
          status: 'UNAUTHORIZED',
          data: null,
        };
        const mockResponse = {
          ok: false,
          json: jest.fn().mockResolvedValue(errorResponse),
        };
        mockFetch.mockResolvedValue(mockResponse);

        // Act & Assert
        await expect(AuthService.login(mockCredentials)).rejects.toThrow(
          'Invalid username or password'
        );
      });

      it('should throw default error message when backend message is missing', async () => {
        // Arrange
        const errorResponse = {
          code: 500,
          status: 'INTERNAL_SERVER_ERROR',
          data: null,
        };
        const mockResponse = {
          ok: false,
          json: jest.fn().mockResolvedValue(errorResponse),
        };
        mockFetch.mockResolvedValue(mockResponse);

        // Act & Assert
        await expect(AuthService.login(mockCredentials)).rejects.toThrow('Login failed');
      });

      it('should handle JSON parsing failure and extract message from text response', async () => {
        // Arrange
        const errorText = '{"message":"Invalid credentials","code":401}';
        const mockResponse = {
          ok: false,
          json: jest.fn().mockRejectedValue(new Error('JSON parse error')),
          text: jest.fn().mockResolvedValue(errorText),
        };
        mockFetch.mockResolvedValue(mockResponse);

        // Act & Assert
        await expect(AuthService.login(mockCredentials)).rejects.toThrow('Invalid credentials');
      });

      it('should throw error when text response parsing fails', async () => {
        // Arrange
        const mockResponse = {
          ok: false,
          json: jest.fn().mockRejectedValue(new Error('JSON parse error')),
          text: jest.fn().mockResolvedValue('Plain text error'),
        };
        mockFetch.mockResolvedValue(mockResponse);

        // Act & Assert
        await expect(AuthService.login(mockCredentials)).rejects.toThrow('Plain text error');
      });

      it('should throw default error when both json and text parsing fail', async () => {
        // Arrange
        const mockResponse = {
          ok: false,
          json: jest.fn().mockRejectedValue(new Error('JSON parse error')),
          text: jest.fn().mockRejectedValue(new Error('Text parse error')),
        };
        mockFetch.mockResolvedValue(mockResponse);

        // Act & Assert
        await expect(AuthService.login(mockCredentials)).rejects.toThrow('Login failed');
      });

      it('should throw error when fetch fails due to network error', async () => {
        // Arrange
        mockFetch.mockRejectedValue(new Error('Network error'));

        // Act & Assert
        await expect(AuthService.login(mockCredentials)).rejects.toThrow('Network error');
      });

      it('should handle 401 unauthorized error response', async () => {
        // Arrange
        const errorResponse = {
          message: 'Invalid username or password',
          code: 401,
          status: 'UNAUTHORIZED',
          data: null,
        };
        const mockResponse = {
          ok: false,
          status: 401,
          json: jest.fn().mockResolvedValue(errorResponse),
        };
        mockFetch.mockResolvedValue(mockResponse);

        // Act & Assert
        await expect(AuthService.login(mockCredentials)).rejects.toThrow(
          'Invalid username or password'
        );
      });

      it('should handle 400 bad request error response', async () => {
        // Arrange
        const errorResponse = {
          message: 'Validation failed',
          code: 400,
          status: 'BAD_REQUEST',
          data: null,
        };
        const mockResponse = {
          ok: false,
          status: 400,
          json: jest.fn().mockResolvedValue(errorResponse),
        };
        mockFetch.mockResolvedValue(mockResponse);

        // Act & Assert
        await expect(AuthService.login(mockCredentials)).rejects.toThrow('Validation failed');
      });
    });
  });
});
