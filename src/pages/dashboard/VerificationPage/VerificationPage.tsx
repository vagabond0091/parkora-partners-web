import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/common/Button/Button';
import { useAppStatusStore } from '@/stores/appStatusStore';
import { verificationSchema } from '@/validation/verification.validation';
import { FileUploadService } from '@/services/FileUploadService';
import type { FileUploadResponse } from '@/types/services/fileUpload.types';
import { DocumentType } from '@/types/services/fileUpload.types';

/**
 * Business verification page component.
 * Allows users to submit business documents and information for verification.
 */
export const VerificationPage = () => {
  const isLoading = useAppStatusStore((state) => state.isLoading);
  const setLoading = useAppStatusStore((state) => state.setLoading);
  const error = useAppStatusStore((state) => state.error);
  const setError = useAppStatusStore((state) => state.setError);
  const clearError = useAppStatusStore((state) => state.clearError);

  const [formData, setFormData] = useState({
    businessLicense: null as File | null,
    taxDocument: null as File | null,
    additionalDocument: null as File | null,
  });

  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [fileStatuses, setFileStatuses] = useState<Record<string, 'selected' | 'uploading' | 'success' | 'error'>>({});
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, FileUploadResponse>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSuccessMessageError, setIsSuccessMessageError] = useState<boolean>(false);
  const errorRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  /**
   * Scrolls to top of page when error or success message occurs
   */
  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (successMessage && successRef.current) {
      successRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [error, successMessage]);

  /**
   * Formats file size to human-readable format.
   * @param bytes - File size in bytes
   * @returns Formatted file size string
   */
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + sizes[i];
  };

  /**
   * Gets the document type based on the field name.
   * @param field - The field name
   * @returns The corresponding document type
   */
  const getDocumentType = (field: string): DocumentType => {
    if (field === 'businessLicense') {
      return DocumentType.BUSINESS_REGISTRATION;
    }
    if (field === 'taxDocument') {
      return DocumentType.TAX_IDENTIFICATION;
    }
    return DocumentType.ADDITIONAL_DOCUMENT;
  };

  const handleFileChange = (field: string, files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const fieldSchema = verificationSchema.shape[field as keyof typeof verificationSchema.shape];

    if (fieldSchema) {
      const result = fieldSchema.safeParse(file);
      if (!result.success) {
        const errorMessage = result.error.issues[0]?.message || 'Invalid file';
        setFieldErrors((prev) => ({
          ...prev,
          [field]: errorMessage,
        }));
        setFileStatuses((prev) => ({ ...prev, [field]: 'error' }));
        return;
      }
    }

    setFormData((prev) => ({ ...prev, [field]: file }));
    setFieldErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
    
    // Mark file as selected (not uploaded yet)
    setFileStatuses((prev) => ({ ...prev, [field]: 'selected' }));
    // Clear any previous upload data for this field
    setUploadedFiles((prev) => {
      const newFiles = { ...prev };
      delete newFiles[field];
      return newFiles;
    });
  };

  const handleRetryUpload = async (field: string) => {
    const file = formData[field as keyof typeof formData];
    if (file && file instanceof File) {
      // Reset status and retry
      setFileStatuses((prev) => ({ ...prev, [field]: 'uploading' }));
      setUploadProgress((prev) => ({ ...prev, [field]: 0 }));
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });

      try {
        const response = await FileUploadService.upload(
          {
            file: file,
            documentType: getDocumentType(field),
          },
          (progress) => {
            setUploadProgress((prev) => ({ ...prev, [field]: progress }));
          }
        );

        setUploadedFiles((prev) => ({ ...prev, [field]: response.data }));
        setFileStatuses((prev) => ({ ...prev, [field]: 'success' }));
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'File upload failed';
        setFieldErrors((prev) => ({
          ...prev,
          [field]: errorMessage,
        }));
        setFileStatuses((prev) => ({ ...prev, [field]: 'error' }));
      }
    }
  };

  const handleAdditionalFileChange = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const additionalDocumentSchema = verificationSchema.shape.additionalDocument;

    if (additionalDocumentSchema) {
      const result = additionalDocumentSchema.safeParse(file);
      if (!result.success) {
        const errorMessage = result.error.issues[0]?.message || 'Invalid file';
        setFieldErrors((prev) => ({
          ...prev,
          additionalDocument: errorMessage,
        }));
        setFileStatuses((prev) => ({ ...prev, additionalDocument: 'error' }));
        return;
      }
    }

    setFormData((prev) => ({ ...prev, additionalDocument: file }));
    setFieldErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.additionalDocument;
      return newErrors;
    });
    
    // Mark file as selected (not uploaded yet)
    setFileStatuses((prev) => ({ ...prev, additionalDocument: 'selected' }));
    // Clear any previous upload data for this field
    setUploadedFiles((prev) => {
      const newFiles = { ...prev };
      delete newFiles.additionalDocument;
      return newFiles;
    });
  };

  const removeFile = (field: 'businessLicense' | 'taxDocument') => {
    setFormData((prev) => ({
      ...prev,
      [field]: null,
    }));
    setFileStatuses((prev) => {
      const newStatuses = { ...prev };
      delete newStatuses[field];
      return newStatuses;
    });
    setUploadProgress((prev) => {
      const newProgress = { ...prev };
      delete newProgress[field];
      return newProgress;
    });
    setFieldErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const removeAdditionalFile = () => {
    setFormData((prev) => ({
      ...prev,
      additionalDocument: null,
    }));
    setFileStatuses((prev) => {
      const newStatuses = { ...prev };
      delete newStatuses.additionalDocument;
      return newStatuses;
    });
    setUploadProgress((prev) => {
      const newProgress = { ...prev };
      delete newProgress.additionalDocument;
      return newProgress;
    });
    setFieldErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.additionalDocument;
      return newErrors;
    });
  };

  const handleRetryAdditionalFile = async () => {
    const file = formData.additionalDocument;
    if (!file) return;

    setFileStatuses((prev) => ({ ...prev, additionalDocument: 'uploading' }));
    setUploadProgress((prev) => ({ ...prev, additionalDocument: 0 }));
    setFieldErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.additionalDocument;
      return newErrors;
    });

    try {
      const response = await FileUploadService.upload(
        {
          file: file,
          documentType: DocumentType.ADDITIONAL_DOCUMENT,
        },
        (progress) => {
          setUploadProgress((prev) => ({ ...prev, additionalDocument: progress }));
        }
      );

      setUploadedFiles((prev) => ({ ...prev, additionalDocument: response.data }));
      setFileStatuses((prev) => ({ ...prev, additionalDocument: 'success' }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'File upload failed';
      setFieldErrors((prev) => ({
        ...prev,
        additionalDocument: errorMessage,
      }));
      setFileStatuses((prev) => ({ ...prev, additionalDocument: 'error' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setSuccessMessage(null);
    setIsSuccessMessageError(false);
    setFieldErrors({});

    // Validate using Zod schema
    const result = verificationSchema.safeParse(formData);

    if (!result.success) {
      // Extract errors from Zod
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        if (path) {
          errors[path] = issue.message;
        }
      });
      setFieldErrors(errors);
      return;
    }

    // Check if all required files are selected
    if (!formData.businessLicense || !formData.taxDocument) {
      setError('Please select all required documents before submitting.');
      return;
    }

    setLoading(true);

    try {
      // Set all files to uploading status
      setFileStatuses((prev) => {
        const newStatuses = { ...prev };
        if (formData.businessLicense) newStatuses.businessLicense = 'uploading';
        if (formData.taxDocument) newStatuses.taxDocument = 'uploading';
        if (formData.additionalDocument) newStatuses.additionalDocument = 'uploading';
        return newStatuses;
      });

      setUploadProgress((prev) => {
        const newProgress = { ...prev };
        if (formData.businessLicense) newProgress.businessLicense = 0;
        if (formData.taxDocument) newProgress.taxDocument = 0;
        if (formData.additionalDocument) newProgress.additionalDocument = 0;
        return newProgress;
      });

      // Single batch upload call - sends all 3 parameters in one API call
      const response = await FileUploadService.uploadBatch(
        {
          businessLicense: formData.businessLicense || undefined,
          taxDocument: formData.taxDocument || undefined,
          additionalDocument: formData.additionalDocument || undefined,
        },
        (progress) => {
          // Update progress for all files
          setUploadProgress((prev) => {
            const newProgress = { ...prev };
            if (formData.businessLicense) newProgress.businessLicense = progress;
            if (formData.taxDocument) newProgress.taxDocument = progress;
            if (formData.additionalDocument) newProgress.additionalDocument = progress;
            return newProgress;
          });
        }
      );

      // Process response and update states
      // Map files by documentType from the API response
      const uploadResults: Record<string, FileUploadResponse> = {};
      const uploadedFilesArray = response.data.uploadedFiles || [];

      // Map files by their documentType field
      uploadedFilesArray.forEach((fileResponse: any) => {
        // Access documentType field - API returns it as a string
        const docType = fileResponse.documentType as string | undefined;
        
        // Check if file upload actually succeeded (has filePath/path and no error message)
        const hasFilePath = (fileResponse.filePath !== null && fileResponse.filePath !== undefined) ||
                           (fileResponse.path !== null && fileResponse.path !== undefined);
        const hasErrorMessage = fileResponse.message?.toLowerCase().includes('failed') || false;
        const isSuccess = hasFilePath && !hasErrorMessage;
        
        // Handle BUSINESS_LICENSE (API) vs BUSINESS_REGISTRATION (code) mismatch
        if (docType === 'BUSINESS_LICENSE' || docType === DocumentType.BUSINESS_REGISTRATION) {
          uploadResults.businessLicense = fileResponse as FileUploadResponse;
          setUploadedFiles((prev) => ({ ...prev, businessLicense: fileResponse as FileUploadResponse }));
          setFileStatuses((prev) => ({ ...prev, businessLicense: isSuccess ? 'success' : 'error' }));
          if (!isSuccess) {
            setFieldErrors((prev) => ({
              ...prev,
              businessLicense: fileResponse.message || 'File upload failed',
            }));
          }
        } else if (docType === DocumentType.TAX_IDENTIFICATION || docType === 'TAX_IDENTIFICATION') {
          uploadResults.taxDocument = fileResponse as FileUploadResponse;
          setUploadedFiles((prev) => ({ ...prev, taxDocument: fileResponse as FileUploadResponse }));
          setFileStatuses((prev) => ({ ...prev, taxDocument: isSuccess ? 'success' : 'error' }));
          if (!isSuccess) {
            setFieldErrors((prev) => ({
              ...prev,
              taxDocument: fileResponse.message || 'File upload failed',
            }));
          }
        } else if (docType === DocumentType.ADDITIONAL_DOCUMENT || docType === 'ADDITIONAL_DOCUMENT') {
          uploadResults.additionalDocument = fileResponse as FileUploadResponse;
          setUploadedFiles((prev) => ({ ...prev, additionalDocument: fileResponse as FileUploadResponse }));
          setFileStatuses((prev) => ({ ...prev, additionalDocument: isSuccess ? 'success' : 'error' }));
          if (!isSuccess) {
            setFieldErrors((prev) => ({
              ...prev,
              additionalDocument: fileResponse.message || 'File upload failed',
            }));
          }
        }
      });

      // Check if any uploads failed - treat as error if failedUploads > 0 or not all files succeeded
      const failedUploads = response.data.failedUploads ?? 0;
      const successfulUploads = response.data.successfulUploads ?? 0;
      const totalFiles = response.data.totalFiles ?? 0;
      const hasFailures = failedUploads > 0 || successfulUploads < totalFiles;
      
      // Also check individual file statuses to catch any failures
      const hasFileErrors = Object.values(fileStatuses).some((status) => status === 'error');
      const hasAnyFailures = hasFailures || hasFileErrors;
      
      if (hasAnyFailures) {
        const errorMessage = response.data.message || `Failed to upload ${failedUploads} file(s). Please try again.`;
        setError(errorMessage);
        setSuccessMessage(null);
        setIsSuccessMessageError(false);
        setLoading(false);
        // Scroll to top to show error
        if (errorRef.current) {
          errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        return;
      }

      // Check if the message indicates failures (even if hasFailures is false, the message might indicate partial success)
      const messageText = response.data.message || response.message || '';
      const messageIndicatesFailure = messageText.toLowerCase().includes('failed') || 
                                      messageText.toLowerCase().includes('fail') ||
                                      failedUploads > 0;

      // All files uploaded successfully (failedUploads === 0 and all files succeeded) - show success message
      // Always clear error first to ensure success message displays correctly
      clearError();
      setVerificationStatus('pending');
      // Use the success message from the API response, or fallback to default
      const successMsg = messageText || 'Verification submitted successfully! Your documents are under review.';
      setSuccessMessage(successMsg);
      setIsSuccessMessageError(messageIndicatesFailure);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit verification';
      setError(errorMessage);
      setSuccessMessage(null);
      setIsSuccessMessageError(false);
      
      // Mark all files as error
      setFileStatuses((prev) => {
        const newStatuses = { ...prev };
        if (formData.businessLicense) newStatuses.businessLicense = 'error';
        if (formData.taxDocument) newStatuses.taxDocument = 'error';
        if (formData.additionalDocument) newStatuses.additionalDocument = 'error';
        return newStatuses;
      });

      // Scroll to top to show error
      if (errorRef.current) {
        errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = () => {
    switch (verificationStatus) {
      case 'approved':
        return (
          <span className="inline-flex items-center rounded px-3 py-1 text-xs font-semibold text-white bg-green-600">
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center rounded px-3 py-1 text-xs font-semibold text-white bg-red-600">
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase text-amber-400 bg-[#343536] border border-amber-400 shadow-sm">
            PENDING
          </span>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-white">
            Business Verification
          </h1>
          {getStatusBadge()}
        </div>
        <p className="text-sm text-[#7090af]">
          Complete your business verification to unlock full features.
        </p>
      </div>

      {/* Status Message */}
      {verificationStatus === 'pending' && (
        <div className="bg-[#282f39] border border-[#403c34] rounded-xl p-4">
          <div className="flex items-start gap-3">
            <svg
              className="h-6 w-6 text-yellow-600 mt-0.5 shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </svg>
            <p className="text-sm text-[#b5b3b7]">
              Your verification is currently under review. We'll notify you once it's complete. You can still update documents if required.
            </p>
          </div>
        </div>
      )}

      {verificationStatus === 'approved' && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-sm text-green-800">
            Your business has been verified successfully! You now have access to all features.
          </p>
        </div>
      )}

      {verificationStatus === 'rejected' && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-800">
            Your verification was rejected. Please review your documents and submit again.
          </p>
        </div>
      )}

        {/* Success/Error Message */}
        {successMessage && (
          <div 
            ref={successRef} 
            className={`rounded-xl p-4 ${
              isSuccessMessageError 
                ? 'bg-red-50 border border-red-200' 
                : 'bg-green-50 border border-green-200'
            }`}
          >
            <div className="flex items-start gap-3">
              {isSuccessMessageError ? (
                <svg
                  className="h-5 w-5 text-red-600 mt-0.5 shrink-0"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5 text-green-600 mt-0.5 shrink-0"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <p className={`text-sm font-medium ${
                isSuccessMessageError ? 'text-red-800' : 'text-green-800'
              }`}>
                {successMessage}
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div ref={errorRef} className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <svg
                className="h-5 w-5 text-red-600 mt-0.5 shrink-0"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm text-red-800 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Verification Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Documents Card */}
          <div className="bg-[#0f172a] rounded-2xl shadow-sm p-8 space-y-6">
            <h2 className="text-lg font-semibold text-white">Required Documents</h2>
            
            <div>
              <label className="block text-sm font-medium text-white mb-1.5">
                Upload Business License <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <label className="flex flex-col items-center justify-center w-full rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50/60 px-6 py-6 text-center cursor-pointer transition-colors hover:border-purple-400 hover:bg-purple-50/40">
                  <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    Click to upload{' '}
                    <span className="font-normal text-gray-500">
                      or drag and drop
                    </span>
                  </span>
                  <span className="mt-1 text-xs text-gray-500">
                    PDF, JPEG, or PNG (max 10MB)
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    data-field="businessLicense"
                    onChange={(e) => handleFileChange('businessLicense', e.target.files)}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  />
                </label>
              </div>
              {fieldErrors.businessLicense && (
                <p className="mt-1.5 text-sm text-red-500">{fieldErrors.businessLicense}</p>
              )}
              {formData.businessLicense && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">File Uploaded</h3>
                  <div className={`flex items-center gap-3 p-3 rounded-lg border ${
                    fileStatuses.businessLicense === 'error' 
                      ? 'border-red-300 bg-red-50' 
                      : fileStatuses.businessLicense === 'success'
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-200 bg-white'
                  }`}>
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <svg
                        className="h-5 w-5 text-gray-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {formData.businessLicense.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(formData.businessLicense.size)}
                      </p>
                      {fileStatuses.businessLicense === 'uploading' && (
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress.businessLicense || 0}%` }}
                          />
                        </div>
                      )}
                      {fileStatuses.businessLicense === 'error' && (
                        <button
                          type="button"
                          onClick={() => handleRetryUpload('businessLicense')}
                          className="mt-2 text-xs text-red-600 hover:text-red-700 font-medium"
                        >
                          Try again
                        </button>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile('businessLicense')}
                      className="shrink-0 text-red-500 hover:text-red-700 text-sm font-medium ml-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1.5">
                Upload Tax Document <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <label className="flex flex-col items-center justify-center w-full rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50/60 px-6 py-6 text-center cursor-pointer transition-colors hover:border-purple-400 hover:bg-purple-50/40">
                  <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    Click to upload{' '}
                    <span className="font-normal text-gray-500">
                      or drag and drop
                    </span>
                  </span>
                  <span className="mt-1 text-xs text-gray-500">
                    PDF, JPEG, or PNG (max 10MB)
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    data-field="taxDocument"
                    onChange={(e) => handleFileChange('taxDocument', e.target.files)}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  />
                </label>
              </div>
              {fieldErrors.taxDocument && (
                <p className="mt-1.5 text-sm text-red-500">{fieldErrors.taxDocument}</p>
              )}
              {formData.taxDocument && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">File Uploaded</h3>
                  <div className={`flex items-center gap-3 p-3 rounded-lg border ${
                    fileStatuses.taxDocument === 'error' 
                      ? 'border-red-300 bg-red-50' 
                      : fileStatuses.taxDocument === 'success'
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-200 bg-white'
                  }`}>
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <svg
                        className="h-5 w-5 text-gray-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {formData.taxDocument.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(formData.taxDocument.size)}
                      </p>
                      {fileStatuses.taxDocument === 'uploading' && (
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress.taxDocument || 0}%` }}
                          />
                        </div>
                      )}
                      {fileStatuses.taxDocument === 'error' && (
                        <button
                          type="button"
                          onClick={() => handleRetryUpload('taxDocument')}
                          className="mt-2 text-xs text-red-600 hover:text-red-700 font-medium"
                        >
                          Try again
                        </button>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile('taxDocument')}
                      className="shrink-0 text-red-500 hover:text-red-700 text-sm font-medium ml-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Document Section */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">ADDITIONAL DOCUMENT</h2>
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">OPTIONAL</span>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white mb-1.5">
                Upload Additional Supporting Document
              </label>
              <div className="relative">
                <label className="flex flex-col items-center justify-center w-full rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50/60 px-6 py-6 text-center cursor-pointer transition-colors hover:border-purple-400 hover:bg-purple-50/40">
                  <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    Click to upload{' '}
                    <span className="font-normal text-gray-500">
                      or drag and drop
                    </span>
                  </span>
                  <span className="mt-1 text-xs text-gray-500">
                    PDF, JPEG, or PNG (max 10MB)
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleAdditionalFileChange(e.target.files)}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  />
                </label>
              </div>
              {fieldErrors.additionalDocument && (
                <p className="mt-1.5 text-sm text-red-500">{fieldErrors.additionalDocument}</p>
              )}
              {formData.additionalDocument && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">File Uploaded</h3>
                  <div className={`flex items-center gap-3 p-3 rounded-lg border ${
                    fileStatuses.additionalDocument === 'error' 
                      ? 'border-red-300 bg-red-50' 
                      : fileStatuses.additionalDocument === 'success'
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-200 bg-white'
                  }`}>
                    <div className="shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <svg
                        className="h-5 w-5 text-gray-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {formData.additionalDocument.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(formData.additionalDocument.size)}
                      </p>
                      {fileStatuses.additionalDocument === 'uploading' && (
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress.additionalDocument || 0}%` }}
                          />
                        </div>
                      )}
                      {fileStatuses.additionalDocument === 'error' && (
                        <button
                          type="button"
                          onClick={handleRetryAdditionalFile}
                          className="mt-2 text-xs text-red-600 hover:text-red-700 font-medium"
                        >
                          Try again
                        </button>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={removeAdditionalFile}
                      className="shrink-0 text-red-500 hover:text-red-700 text-sm font-medium ml-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex justify-center">
            <Button
              type="submit"
              isLoading={isLoading}
              className="!w-fit bg-[#6D28D9] text-white hover:bg-[#5B21B6] focus:ring-purple-500"
            >
              Submit for Verification
            </Button>
          </div>
        </form>
    </div>
  );
};
