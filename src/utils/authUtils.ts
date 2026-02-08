/**
 * Gets the authorization token from localStorage
 * @returns JWT token string or null if not found
 */
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY || 'parkora_auth_token';
  return localStorage.getItem(TOKEN_KEY);
};
