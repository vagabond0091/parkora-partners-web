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
}
