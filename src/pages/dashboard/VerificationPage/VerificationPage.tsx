import { useState } from 'react';
import { z } from 'zod';
import { Button } from '@/components/common/Button/Button';
import { useAppStatusStore } from '@/stores/appStatusStore';
import { verificationSchema } from '@/validation/verification.validation';

/**
 * Business verification page component.
 * Allows users to submit business documents and information for verification.
 */
export const VerificationPage = () => {
  const isLoading = useAppStatusStore((state) => state.isLoading);
  const setLoading = useAppStatusStore((state) => state.setLoading);
  const setError = useAppStatusStore((state) => state.setError);
  const clearError = useAppStatusStore((state) => state.clearError);

  const [formData, setFormData] = useState({
    businessLicense: null as File | null,
    taxDocument: null as File | null,
    additionalDocuments: [] as File[],
  });

  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [fileStatuses, setFileStatuses] = useState<Record<string, 'uploading' | 'success' | 'error'>>({});
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

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
    
    // Simulate upload progress
    setFileStatuses((prev) => ({ ...prev, [field]: 'uploading' }));
    setUploadProgress((prev) => ({ ...prev, [field]: 0 }));
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        const current = prev[field] || 0;
        if (current >= 100) {
          clearInterval(interval);
          setFileStatuses((prevStatus) => ({ ...prevStatus, [field]: 'success' }));
          return prev;
        }
        return { ...prev, [field]: current + 10 };
      });
    }, 200);
  };

  const handleRetryUpload = (field: string) => {
    const file = formData[field as keyof typeof formData];
    if (file) {
      // Reset status and retry
      setFileStatuses((prev) => ({ ...prev, [field]: 'uploading' }));
      setUploadProgress((prev) => ({ ...prev, [field]: 0 }));
      
      // Simulate retry upload
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          const current = prev[field] || 0;
          if (current >= 100) {
            clearInterval(interval);
            setFileStatuses((prevStatus) => ({ ...prevStatus, [field]: 'success' }));
            return prev;
          }
          return { ...prev, [field]: current + 10 };
        });
      }, 200);
    }
  };

  const handleAdditionalFilesChange = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const additionalDocumentsSchema = verificationSchema.shape.additionalDocuments;

    const validFiles: File[] = [];
    const errors: string[] = [];

    fileArray.forEach((file) => {
      const result = z.instanceof(File).safeParse(file);
      if (result.success) {
        validFiles.push(file);
      } else {
        errors.push(result.error.issues[0]?.message || 'Invalid file');
      }
    });

    if (validFiles.length > 0) {
      const currentFiles = [...formData.additionalDocuments, ...validFiles];
      const result = additionalDocumentsSchema.safeParse(currentFiles);
      
      if (!result.success) {
        const errorMessage = result.error.issues[0]?.message || 'Some files were rejected';
        setError(errorMessage);
        // Mark files as error
        validFiles.forEach((file) => {
          const fileKey = `additional_${file.name}_${file.size}`;
          setFileStatuses((prev) => ({ ...prev, [fileKey]: 'error' }));
        });
        return;
      }

      setFormData((prev) => ({
        ...prev,
        additionalDocuments: currentFiles,
      }));

      // Set upload status and simulate progress for each new file
      validFiles.forEach((file) => {
        const fileKey = `additional_${file.name}_${file.size}`;
        setFileStatuses((prev) => ({ ...prev, [fileKey]: 'uploading' }));
        setUploadProgress((prev) => ({ ...prev, [fileKey]: 0 }));
        
        // Simulate upload progress
        const interval = setInterval(() => {
          setUploadProgress((prev) => {
            const current = prev[fileKey] || 0;
            if (current >= 100) {
              clearInterval(interval);
              setFileStatuses((prevStatus) => ({ ...prevStatus, [fileKey]: 'success' }));
              return prev;
            }
            return { ...prev, [fileKey]: current + 10 };
          });
        }, 200);
      });
    }

    if (errors.length > 0 && validFiles.length === 0) {
      setError('All files were rejected. Only PDF, JPEG, or PNG files under 10MB are allowed.');
    }
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

  const removeAdditionalFile = (index: number) => {
    const fileToRemove = formData.additionalDocuments[index];
    if (fileToRemove) {
      const fileKey = `additional_${fileToRemove.name}_${fileToRemove.size}`;
      setFileStatuses((prev) => {
        const newStatuses = { ...prev };
        delete newStatuses[fileKey];
        return newStatuses;
      });
      setUploadProgress((prev) => {
        const newProgress = { ...prev };
        delete newProgress[fileKey];
        return newProgress;
      });
    }
    setFormData((prev) => ({
      ...prev,
      additionalDocuments: prev.additionalDocuments.filter((_, i) => i !== index),
    }));
  };

  const handleRetryAdditionalFile = (file: File) => {
    const fileKey = `additional_${file.name}_${file.size}`;
    setFileStatuses((prev) => ({ ...prev, [fileKey]: 'uploading' }));
    setUploadProgress((prev) => ({ ...prev, [fileKey]: 0 }));
    
    // Simulate retry upload
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        const current = prev[fileKey] || 0;
        if (current >= 100) {
          clearInterval(interval);
          setFileStatuses((prevStatus) => ({ ...prevStatus, [fileKey]: 'success' }));
          return prev;
        }
        return { ...prev, [fileKey]: current + 10 };
      });
    }, 200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
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

    setLoading(true);

    try {
      // TODO: Implement API call to submit verification documents
      // const formDataToSend = new FormData();
      // formDataToSend.append('businessLicense', result.data.businessLicense);
      // formDataToSend.append('taxDocument', result.data.taxDocument);
      // result.data.additionalDocuments?.forEach((file) => {
      //   formDataToSend.append('additionalDocuments', file);
      // });
      // await VerificationService.submitVerification(formDataToSend);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setVerificationStatus('pending');
      setError('Verification submitted successfully! Your documents are under review.');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit verification';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = () => {
    switch (verificationStatus) {
      case 'approved':
        return (
          <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 border border-green-200">
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 border border-red-200">
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-700 border border-yellow-200">
            Pending
          </span>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Business Verification
            </h1>
            <p className="text-gray-500">
              Complete your business verification to unlock full features.
            </p>
          </div>
          {getStatusBadge()}
        </div>

        {/* Status Message */}
        {verificationStatus === 'pending' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <p className="text-sm text-yellow-800">
              Your verification is currently under review. We'll notify you once it's complete.
            </p>
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

        {/* Verification Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Required Documents</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
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
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 16h3m0 0h3m-3 0v4"
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
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
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
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 16h3m0 0h3m-3 0v4"
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
          </div>

          {/* Additional Documents */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Additional Documents (Optional)</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Upload Additional Supporting Documents
              </label>
              <div className="relative">
                <label
                  className="flex flex-col items-center justify-center w-full rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50/60 px-6 py-6 text-center cursor-pointer transition-colors hover:border-purple-400 hover:bg-purple-50/40"
                >
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
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 16h3m0 0h3m-3 0v4"
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
                    PDF, JPEG, or PNG (max 10MB per file)
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    multiple
                    onChange={(e) => handleAdditionalFilesChange(e.target.files)}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  />
                </label>
              </div>
            </div>

            {formData.additionalDocuments.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Files Uploaded</h3>
                <div className="space-y-3">
                  {formData.additionalDocuments.map((file, index) => {
                    const fileKey = `additional_${file.name}_${file.size}`;
                    const status = fileStatuses[fileKey] || 'success';
                    return (
                      <div
                        key={`${file.name}-${file.size}-${index}`}
                        className={`flex items-center gap-3 p-3 rounded-lg border ${
                          status === 'error' 
                            ? 'border-red-300 bg-red-50' 
                            : 'border-gray-200 bg-white'
                        }`}
                      >
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
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(file.size)}
                          </p>
                          {status === 'uploading' && (
                            <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                              <div
                                className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress[fileKey] || 0}%` }}
                              />
                            </div>
                          )}
                          {status === 'error' && (
                            <button
                              type="button"
                              onClick={() => handleRetryAdditionalFile(file)}
                              className="mt-2 text-xs text-red-600 hover:text-red-700 font-medium"
                            >
                              Try again
                            </button>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAdditionalFile(index)}
                          className="shrink-0 text-red-500 hover:text-red-700 text-sm font-medium ml-2"
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex justify-center">
            <Button
              type="submit"
              isLoading={isLoading}
              className="!w-fit bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white hover:from-orange-600 hover:via-pink-600 hover:to-purple-700 focus:ring-purple-500"
            >
              Submit for Verification
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
