import type { GetPendingCompaniesParams, GetPendingCompaniesResponse } from '@/types/services/company.types';
import { apiClient } from './apiClient';

export const CompanyService = {
  /**
   * Fetches paginated list of companies with pending verification status.
   * @param params - Pagination parameters (page and size)
   * @returns Promise resolving to paginated companies response
   */
  getPendingCompanies: (params: GetPendingCompaniesParams = {}): Promise<GetPendingCompaniesResponse> => {
    const { page = 0, size = 10 } = params;

    return apiClient.get<GetPendingCompaniesResponse>('/companies/pending', {
      params: {
        page: page.toString(),
        size: size.toString(),
      },
    });
  },
};
