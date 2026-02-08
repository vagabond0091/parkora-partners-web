/**
 * Document type for file uploads
 */
export const DocumentType = {
  BUSINESS_REGISTRATION: 'BUSINESS_REGISTRATION',
  TAX_IDENTIFICATION: 'TAX_IDENTIFICATION',
  ADDITIONAL_DOCUMENT: 'ADDITIONAL_DOCUMENT',
} as const;

/**
 * Document type values
 */
export type DocumentType = typeof DocumentType[keyof typeof DocumentType];

/**
 * Response from file upload API
 */
export interface FileUploadResponse {
  url: string;
  path: string;
  bucket: string;
  folder?: string;
  fileName: string;
  fileSize: number;
  contentType: string;
}

/**
 * API response wrapper for file upload
 */
export interface ApiResponse<T> {
  data: T;
  errorCode: number;
  message: string;
  status: string;
}

/**
 * File upload request parameters
 */
export interface FileUploadRequest {
  file: File;
  documentType: DocumentType;
}

/**
 * Batch file upload request parameters
 */
export interface BatchFileUploadRequest {
  businessLicense?: File;
  taxDocument?: File;
  additionalDocuments?: File[];
}

/**
 * Batch file upload response
 */
export interface BatchFileUploadResponse {
  businessLicense?: FileUploadResponse;
  taxDocument?: FileUploadResponse;
  additionalDocuments?: FileUploadResponse[];
}
