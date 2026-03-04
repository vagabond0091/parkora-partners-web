/**
 * Company verification status from the API.
 */
export type VerificationStatus = 'PENDING' | 'UNDER_REVIEW' | 'REJECTED' | 'APPROVED';

/**
 * Company document response from the API.
 */
export interface CompanyDocumentResponse {
  id: string;
  documentType: string;
  documentStatus: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
}

/**
 * Company response from the API.
 */
export interface CompanyResponse {
  id: string;
  name: string;
  businessType: string;
  verificationStatus: VerificationStatus;
  hasDocumentsSubmitted: boolean;
  documents: CompanyDocumentResponse[];
}

/**
 * Paginated response wrapper.
 */
export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

/**
 * API response wrapper.
 */
export interface ApiResponse<T> {
  message: string;
  code: number;
  status: string;
  data: T | null;
}

/**
 * Request parameters for fetching pending companies.
 */
export interface GetPendingCompaniesParams {
  page?: number;
  size?: number;
}

/**
 * Response type for getPendingCompanies.
 */
export type GetPendingCompaniesResponse = ApiResponse<PaginatedResponse<CompanyResponse>>;
