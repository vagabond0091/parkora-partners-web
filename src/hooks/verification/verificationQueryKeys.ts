/**
 * Query key factory for verification management queries.
 * Provides centralized query key management for React Query.
 */
export const verificationQueryKeys = {
  /**
   * Base key for all verification queries.
   */
  all: ['verification'] as const,

  /**
   * Key for pending companies queries.
   */
  pendingCompanies: (params?: { page?: number; size?: number }) =>
    [...verificationQueryKeys.all, 'pendingCompanies', params] as const,
};
