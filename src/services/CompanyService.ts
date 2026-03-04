import { getApiUrl } from '@/config/env';
import { getAuthToken } from '@/utils/authUtils';
import type { GetPendingCompaniesParams, GetPendingCompaniesResponse } from '@/types/services/company.types';

const API_URL = getApiUrl();

export const CompanyService = {
  /**
   * Fetches paginated list of companies with pending verification status.
   * @param params - Pagination parameters (page and size)
   * @returns Promise resolving to paginated companies response
   */
  getPendingCompanies: async (params: GetPendingCompaniesParams = {}): Promise<GetPendingCompaniesResponse> => {
    const { page = 0, size = 10 } = params;
    const token = getAuthToken();

    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    const response = await fetch(`${API_URL}/companies/pending?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch pending companies';
      
      try {
        const errorData = await response.json();
        errorMessage = errorData?.message || 'Failed to fetch pending companies';
      } catch {
        try {
          const errorText = await response.text();
          try {
            const parsed = JSON.parse(errorText);
            errorMessage = parsed.message || 'Failed to fetch pending companies';
          } catch {
            errorMessage = errorText || 'Failed to fetch pending companies';
          }
        } catch {
          errorMessage = 'Failed to fetch pending companies';
        }
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  },
};
