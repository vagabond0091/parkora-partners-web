import type { FileUploadResponse, DocumentInfo } from '@/types/services/fileUpload.types';

export interface FileUploadCardProps {
  /**
   * Field name identifier (e.g., 'businessLicense', 'taxDocument', 'additionalDocument')
   */
  field: string;
  /**
   * Label text for the upload field
   */
  label: string;
  /**
   * Whether the field is required (shows red asterisk)
   */
  required?: boolean;
  /**
   * Current file from form data
   */
  file: File | null;
  /**
   * Existing document from API
   */
  existingDocument?: DocumentInfo;
  /**
   * Uploaded file response
   */
  uploadedFile?: FileUploadResponse;
  /**
   * Current upload status
   */
  fileStatus?: 'selected' | 'uploading' | 'success' | 'error';
  /**
   * Upload progress percentage (0-100)
   */
  uploadProgress?: number;
  /**
   * Field error message
   */
  error?: string;
  /**
   * Whether the input is disabled
   */
  disabled?: boolean;
  /**
   * Handler for file change
   */
  onFileChange: (files: FileList | null) => void;
  /**
   * Handler for removing file
   */
  onRemove: () => void;
  /**
   * Handler for retrying upload
   */
  onRetry?: () => void;
  /**
   * Function to get document status badge
   */
  getStatusBadge: (status: string) => React.ReactNode;
  /**
   * Function to format file size
   */
  formatFileSize: (bytes: number) => string;
}
