import { getApiUrl } from '@/config/env';
import type { FileUploadRequest, FileUploadResponse, ApiResponse, BatchFileUploadRequest, BatchFileUploadResponse } from '@/types/services/fileUpload.types';
import { DocumentType } from '@/types/services/fileUpload.types';
import { getAuthToken } from '@/utils/authUtils';

const API_URL = getApiUrl();

/**
 * Service for handling file uploads to Supabase Storage
 */
export const FileUploadService = {
  /**
   * Uploads a file to Supabase Storage via the backend API
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
          } catch (error) {
            reject(new Error('Failed to parse response'));
          }
        } else {
          let errorMessage = 'File upload failed';
          
          try {
            const errorData = JSON.parse(xhr.responseText);
            errorMessage = errorData?.message || errorMessage;
          } catch {
            try {
              errorMessage = xhr.responseText || errorMessage;
            } catch {
              errorMessage = 'File upload failed';
            }
          }
          
          reject(new Error(errorMessage));
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
   * Uploads multiple files in a single API call
   * @param request - Batch file upload request with all files
   * @param onProgress - Optional callback for upload progress (0-100)
   * @returns Batch file upload response with all file URLs and metadata
   */
  uploadBatch: async (
    request: BatchFileUploadRequest,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<BatchFileUploadResponse>> => {
    const formData = new FormData();

    // Append business license if present
    if (request.businessLicense) {
      formData.append('businessLicense', request.businessLicense);
      formData.append('businessLicenseDocumentType', DocumentType.BUSINESS_REGISTRATION);
    }

    // Append tax document if present
    if (request.taxDocument) {
      formData.append('taxDocument', request.taxDocument);
      formData.append('taxDocumentDocumentType', DocumentType.TAX_IDENTIFICATION);
    }

    // Append additional documents if present
    if (request.additionalDocuments && request.additionalDocuments.length > 0) {
      request.additionalDocuments.forEach((file, index) => {
        formData.append(`additionalDocuments[${index}]`, file);
      });
      formData.append('additionalDocumentsDocumentType', DocumentType.ADDITIONAL_DOCUMENT);
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
            // Wrap in ApiResponse for consistency with other endpoints
            const wrappedResponse: ApiResponse<BatchFileUploadResponse> = {
              data: response,
              errorCode: response.failedUploads > 0 ? 1 : 0,
              message: response.message,
              status: response.failedUploads > 0 ? 'partial_success' : 'success',
            };
            resolve(wrappedResponse);
          } catch (error) {
            reject(new Error('Failed to parse response'));
          }
        } else {
          let errorMessage = 'File upload failed';
          
          try {
            const errorData = JSON.parse(xhr.responseText);
            errorMessage = errorData?.message || errorMessage;
          } catch {
            try {
              errorMessage = xhr.responseText || errorMessage;
            } catch {
              errorMessage = 'File upload failed';
            }
          }
          
          reject(new Error(errorMessage));
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
};
