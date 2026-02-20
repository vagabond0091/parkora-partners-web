/**
 * Partner data type for verification management.
 */
export interface Partner {
  id: string;
  name: string;
  partnerId: string;
  submissionDate: string;
  type: 'Enterprise' | 'Standard';
  status: 'UNDER REVIEW' | 'PENDING' | 'APPROVED' | 'REJECTED';
}
