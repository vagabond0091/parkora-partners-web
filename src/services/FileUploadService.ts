import { getApiUrl } from '@/config/env';
import type { FileUploadRequest, FileUploadResponse, ApiResponse, BatchFileUploadRequest, BatchFileUploadResponse, DocumentsResponse } from '@/types/services/fileUpload.types';
import { DocumentType } from '@/types/services/fileUpload.types';
import { getAuthToken } from '@/utils/authUtils';
import { apiClient } from './apiClient';

const API_URL = getApiUrl();

/**
 * Parses error message from XHR response text.
 * @param responseText - Raw XHR response text
 * @param fallbackMessage - Default message when parsing fails
 * @returns Extracted error message
 */
const parseXhrError = (responseText: string, fallbackMessage: string): string => {
  try {
    const errorData = JSON.parse(responseText);
    return errorData?.message || fallbackMessage;
  } catch {
    return responseText || fallbackMessage;
  }
};

/**
 * Service for handling file uploads to Supabase Storage
 */
export const FileUploadService = {
  /**
   * Uploads a file to Supabase Storage via the backend API.
   * @param request - File upload request parameters
   * @param onProgress - Optional callback for upload progress (0-100)
   * @returns File upload response with file URL and metadata
   */
  upload: async (
    request: FileUploadRequest,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<FileUploadResponse>> => {
    const formData = new FormData();
    formData.append('file', request.file);
    formData.append('documentType', request.documentType);

    const token = getAuthToken();
    const xhr = new XMLHttpRequest();

    return new Promise((resolve, reject) => {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          const progress = Math.round((e.loaded / e.total) * 100);
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response: ApiResponse<FileUploadResponse> = JSON.parse(xhr.responseText);
            resolve(response);
          } catch {
            reject(new Error('Failed to parse response'));
          }
        } else {
          reject(new Error(parseXhrError(xhr.responseText, 'File upload failed')));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Network error during file upload'));
      });

      xhr.addEventListener('abort', () => {
        reject(new Error('File upload was aborted'));
      });

      xhr.open('POST', `${API_URL}/storage/upload`);

      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      xhr.send(formData);
    });
  },

  /**
   * Uploads multiple files in a single API call.
   * @param request - Batch file upload request with all files
   * @param onProgress - Optional callback for upload progress (0-100)
   * @returns Batch file upload response with all file URLs and metadata
   */
  uploadBatch: async (
    request: BatchFileUploadRequest,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<BatchFileUploadResponse>> => {
    const formData = new FormData();

    if (request.businessLicense) {
      formData.append('businessLicense', request.businessLicense);
      formData.append('businessLicenseDocumentType', DocumentType.BUSINESS_REGISTRATION);
    }

    if (request.taxDocument) {
      formData.append('taxDocument', request.taxDocument);
      formData.append('taxDocumentDocumentType', DocumentType.TAX_IDENTIFICATION);
    }

    if (request.additionalDocument) {
      formData.append('additionalDocument', request.additionalDocument);
      formData.append('additionalDocumentDocumentType', DocumentType.ADDITIONAL_DOCUMENT);
    }

    const token = getAuthToken();
    const xhr = new XMLHttpRequest();

    return new Promise((resolve, reject) => {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          const progress = Math.round((e.loaded / e.total) * 100);
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response: BatchFileUploadResponse = JSON.parse(xhr.responseText);
            const wrappedResponse: ApiResponse<BatchFileUploadResponse> = {
              data: response,
              errorCode: response.failedUploads > 0 ? 1 : 0,
              message: response.message,
              status: response.failedUploads > 0 ? 'partial_success' : 'success',
            };
            resolve(wrappedResponse);
          } catch {
            reject(new Error('Failed to parse response'));
          }
        } else {
          reject(new Error(parseXhrError(xhr.responseText, 'File upload failed')));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Network error during file upload'));
      });

      xhr.addEventListener('abort', () => {
        reject(new Error('File upload was aborted'));
      });

      xhr.open('POST', `${API_URL}/storage/upload`);

      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      xhr.send(formData);
    });
  },

  /**
   * Fetches all documents for the current company.
   * @returns Documents response with all company documents
   */
  getDocuments: (): Promise<DocumentsResponse> =>
    apiClient.get<DocumentsResponse>('/documents'),
};
