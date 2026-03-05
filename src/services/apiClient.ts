import { getApiUrl } from '@/config/env';
import { getAuthToken } from '@/utils/authUtils';
import type { RequestOptions, RequestOptionsWithBody } from '@/types/services/apiClient.types';

const API_URL = getApiUrl();

/**
 * Parses the error message from a failed response.
 * @param response - The failed fetch Response object
 * @param fallbackMessage - Default message when parsing fails
 * @returns The extracted error message string
 */
const parseErrorMessage = async (
  response: Response,
  fallbackMessage: string,
): Promise<string> => {
  try {
    const errorData = await response.json();
    return errorData?.message || fallbackMessage;
  } catch {
    try {
      const errorText = await response.text();
      try {
        const parsed = JSON.parse(errorText);
        return parsed.message || fallbackMessage;
      } catch {
        return errorText || fallbackMessage;
      }
    } catch {
      return fallbackMessage;
    }
  }
};

/**
 * Builds the full request headers including auth token when applicable.
 * @param options - Request options with optional custom headers and auth flag
 * @returns Merged headers object
 */
const buildHeaders = (options: RequestOptions = {}): Record<string, string> => {
  const { headers = {}, auth = true } = options;
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (auth) {
    const token = getAuthToken();
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  return { ...defaultHeaders, ...headers };
};

/**
 * Builds the full URL with optional query parameters.
 * @param endpoint - The API endpoint path (e.g. "/auth/login")
 * @param params - Optional query parameters
 * @returns The complete URL string
 */
const buildUrl = (endpoint: string, params?: Record<string, string>): string => {
  const url = `${API_URL}${endpoint}`;
  if (!params || Object.keys(params).length === 0) return url;

  const queryString = new URLSearchParams(params).toString();
  return `${url}?${queryString}`;
};

/**
 * Executes a fetch request and handles error responses.
 * @param url - The full request URL
 * @param init - The fetch RequestInit configuration
 * @returns The parsed JSON response
 */
const request = async <T>(url: string, init: RequestInit): Promise<T> => {
  const response = await fetch(url, init);

  if (!response.ok) {
    const errorMessage = await parseErrorMessage(response, 'Request failed');
    throw new Error(errorMessage);
  }

  return response.json();
};

/**
 * Centralized API client with convenience methods for all HTTP verbs.
 * Automatically handles base URL, auth headers, JSON serialization, and error parsing.
 *
 * @example
 * ```ts
 * const users = await apiClient.get<User[]>('/users');
 * const user = await apiClient.post<User>('/users', { body: newUser });
 * const updated = await apiClient.put<User>('/users/1', { body: updates });
 * const patched = await apiClient.patch<User>('/users/1', { body: partial });
 * await apiClient.del('/users/1');
 * ```
 */
export const apiClient = {
  /**
   * Sends a GET request.
   * @param endpoint - API endpoint path
   * @param options - Optional headers, auth flag, and query params
   * @returns Parsed JSON response
   */
  get: <T>(endpoint: string, options: RequestOptions = {}): Promise<T> =>
    request<T>(buildUrl(endpoint, options.params), {
      method: 'GET',
      headers: buildHeaders(options),
    }),

  /**
   * Sends a POST request.
   * @param endpoint - API endpoint path
   * @param options - Optional body, headers, auth flag, and query params
   * @returns Parsed JSON response
   */
  post: <T>(endpoint: string, options: RequestOptionsWithBody = {}): Promise<T> =>
    request<T>(buildUrl(endpoint, options.params), {
      method: 'POST',
      headers: buildHeaders(options),
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    }),

  /**
   * Sends a PUT request.
   * @param endpoint - API endpoint path
   * @param options - Optional body, headers, auth flag, and query params
   * @returns Parsed JSON response
   */
  put: <T>(endpoint: string, options: RequestOptionsWithBody = {}): Promise<T> =>
    request<T>(buildUrl(endpoint, options.params), {
      method: 'PUT',
      headers: buildHeaders(options),
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    }),

  /**
   * Sends a PATCH request.
   * @param endpoint - API endpoint path
   * @param options - Optional body, headers, auth flag, and query params
   * @returns Parsed JSON response
   */
  patch: <T>(endpoint: string, options: RequestOptionsWithBody = {}): Promise<T> =>
    request<T>(buildUrl(endpoint, options.params), {
      method: 'PATCH',
      headers: buildHeaders(options),
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    }),

  /**
   * Sends a DELETE request.
   * @param endpoint - API endpoint path
   * @param options - Optional body, headers, auth flag, and query params
   * @returns Parsed JSON response
   */
  delete: <T>(endpoint: string, options: RequestOptionsWithBody = {}): Promise<T> =>
    request<T>(buildUrl(endpoint, options.params), {
      method: 'DELETE',
      headers: buildHeaders(options),
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    }),
};
