/**
 * Partner data type for verification management.
 */
export interface Partner extends Record<string, unknown> {
  id: string;
  name: string;
  partnerId: string;
  submissionDate: string;
  type: 'Enterprise' | 'Standard';
  status: 'UNDER REVIEW' | 'PENDING' | 'APPROVED' | 'REJECTED';
}
