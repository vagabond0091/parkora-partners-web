import { useQuery } from '@tanstack/react-query';
import { CompanyService } from '@/services/CompanyService';
import type { GetPendingCompaniesParams } from '@/types/services/company.types';
import { verificationQueryKeys } from './verificationQueryKeys';

/**
 * Query hook for fetching pending companies with pagination.
 * @param params - Pagination parameters (page and size)
 * @returns Query result with pending companies data
 */
export const usePendingCompanies = (params: GetPendingCompaniesParams = {}) => {
  const { page = 0, size = 10 } = params;

  return useQuery({
    queryKey: verificationQueryKeys.pendingCompanies({ page, size }),
    queryFn: () => CompanyService.getPendingCompanies({ page, size }),
  });
};
