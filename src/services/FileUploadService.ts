import { getApiUrl } from '@/config/env';
import type { FileUploadRequest, FileUploadResponse, ApiResponse } from '@/types/services/fileUpload.types';

const API_URL = getApiUrl();

/**
 * Gets the authorization token from localStorage
 * @returns JWT token string or null
 */
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY || 'parkora_auth_token';
  return localStorage.getItem(TOKEN_KEY);
};

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
    formData.append('bucket', request.bucket);
    if (request.folder) {
      formData.append('folder', request.folder);
    }
    formData.append('file', request.file);

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

      xhr.open('POST', `${API_URL}/upload`);
      
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      xhr.send(formData);
    });
  },
};
