/**
 * Gets the API URL from Vite environment variables
 * @returns The API URL string
 */
export const getApiUrl = (): string => {
  return import.meta.env?.VITE_API_URL || '';
};
