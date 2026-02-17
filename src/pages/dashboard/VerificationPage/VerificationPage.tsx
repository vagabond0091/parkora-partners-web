import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/common/Button/Button';
import { useAppStatusStore } from '@/stores/appStatusStore';
import { verificationSchema } from '@/validation/verification.validation';
import { FileUploadService } from '@/services/FileUploadService';
import type { FileUploadResponse, DocumentInfo } from '@/types/services/fileUpload.types';
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
  const [existingDocuments, setExistingDocuments] = useState<Record<string, DocumentInfo>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSuccessMessageError, setIsSuccessMessageError] = useState<boolean>(false);
  const errorRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const hasFetchedDocuments = useRef<boolean>(false);

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
   * Fetches existing documents and rehydrates the form
   */
  useEffect(() => {
    // Prevent duplicate calls (especially in React StrictMode)
    if (hasFetchedDocuments.current) {
      return;
    }

    const fetchDocuments = async () => {
      hasFetchedDocuments.current = true;
      try {
        setLoading(true);
        const response = await FileUploadService.getDocuments();
        
        if (response.data && Array.isArray(response.data)) {
          const documentsMap: Record<string, DocumentInfo> = {};
          
          response.data.forEach((doc: DocumentInfo) => {
            // Map API documentType to form field names
            if (doc.documentType === 'BUSINESS_LICENSE' || doc.documentType === DocumentType.BUSINESS_REGISTRATION) {
              documentsMap.businessLicense = doc;
              // Set file status to success if document exists
              setFileStatuses((prev) => ({ ...prev, businessLicense: 'success' }));
              // Create a FileUploadResponse-like object for display
              setUploadedFiles((prev) => ({
                ...prev,
                businessLicense: {
                  url: doc.filePath,
                  path: doc.filePath,
                  bucket: '',
                  fileName: doc.fileName,
                  fileSize: doc.fileSize,
                  contentType: doc.contentType,
                  documentType: DocumentType.BUSINESS_REGISTRATION,
                },
              }));
            } else if (doc.documentType === DocumentType.TAX_IDENTIFICATION || doc.documentType === 'TAX_IDENTIFICATION') {
              documentsMap.taxDocument = doc;
              setFileStatuses((prev) => ({ ...prev, taxDocument: 'success' }));
              setUploadedFiles((prev) => ({
                ...prev,
                taxDocument: {
                  url: doc.filePath,
                  path: doc.filePath,
                  bucket: '',
                  fileName: doc.fileName,
                  fileSize: doc.fileSize,
                  contentType: doc.contentType,
                  documentType: DocumentType.TAX_IDENTIFICATION,
                },
              }));
            } else if (doc.documentType === DocumentType.ADDITIONAL_DOCUMENT || doc.documentType === 'ADDITIONAL_DOCUMENT') {
              documentsMap.additionalDocument = doc;
              setFileStatuses((prev) => ({ ...prev, additionalDocument: 'success' }));
              setUploadedFiles((prev) => ({
                ...prev,
                additionalDocument: {
                  url: doc.filePath,
                  path: doc.filePath,
                  bucket: '',
                  fileName: doc.fileName,
                  fileSize: doc.fileSize,
                  contentType: doc.contentType,
                  documentType: DocumentType.ADDITIONAL_DOCUMENT,
                },
              }));
            }
          });
          
          setExistingDocuments(documentsMap);
          
          // Update verification status based on documents
          const hasRejected = response.data.some((doc: DocumentInfo) => doc.verificationStatus === 'REJECTED');
          const allVerified = response.data.every((doc: DocumentInfo) => doc.verificationStatus === 'VERIFIED');
          
          if (allVerified && response.data.length > 0) {
            setVerificationStatus('approved');
          } else if (hasRejected) {
            setVerificationStatus('rejected');
          } else if (response.data.length > 0) {
            setVerificationStatus('pending');
          }
        }
      } catch (err) {
        // Reset the flag on error so it can retry if needed
        hasFetchedDocuments.current = false;
        // Silently fail - don't show error if documents can't be fetched
        // This allows the form to still work for new submissions
        console.error('Failed to fetch documents:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  /**
   * Refetches documents from the API and updates the component state
   */
  const refetchDocuments = async () => {
    try {
      const response = await FileUploadService.getDocuments();
      
      if (response.data && Array.isArray(response.data)) {
        const documentsMap: Record<string, DocumentInfo> = {};
        
        response.data.forEach((doc: DocumentInfo) => {
          // Map API documentType to form field names
          if (doc.documentType === 'BUSINESS_LICENSE' || doc.documentType === DocumentType.BUSINESS_REGISTRATION) {
            documentsMap.businessLicense = doc;
            setFileStatuses((prev) => ({ ...prev, businessLicense: 'success' }));
            setUploadedFiles((prev) => ({
              ...prev,
              businessLicense: {
                url: doc.filePath,
                path: doc.filePath,
                bucket: '',
                fileName: doc.fileName,
                fileSize: doc.fileSize,
                contentType: doc.contentType,
                documentType: DocumentType.BUSINESS_REGISTRATION,
              },
            }));
          } else if (doc.documentType === DocumentType.TAX_IDENTIFICATION || doc.documentType === 'TAX_IDENTIFICATION') {
            documentsMap.taxDocument = doc;
            setFileStatuses((prev) => ({ ...prev, taxDocument: 'success' }));
            setUploadedFiles((prev) => ({
              ...prev,
              taxDocument: {
                url: doc.filePath,
                path: doc.filePath,
                bucket: '',
                fileName: doc.fileName,
                fileSize: doc.fileSize,
                contentType: doc.contentType,
                documentType: DocumentType.TAX_IDENTIFICATION,
              },
            }));
          } else if (doc.documentType === DocumentType.ADDITIONAL_DOCUMENT || doc.documentType === 'ADDITIONAL_DOCUMENT') {
            documentsMap.additionalDocument = doc;
            setFileStatuses((prev) => ({ ...prev, additionalDocument: 'success' }));
            setUploadedFiles((prev) => ({
              ...prev,
              additionalDocument: {
                url: doc.filePath,
                path: doc.filePath,
                bucket: '',
                fileName: doc.fileName,
                fileSize: doc.fileSize,
                contentType: doc.contentType,
                documentType: DocumentType.ADDITIONAL_DOCUMENT,
              },
            }));
          }
        });
        
        setExistingDocuments(documentsMap);
        
        // Update verification status based on documents
        const hasRejected = response.data.some((doc: DocumentInfo) => doc.verificationStatus === 'REJECTED');
        const allVerified = response.data.every((doc: DocumentInfo) => doc.verificationStatus === 'VERIFIED');
        
        if (allVerified && response.data.length > 0) {
          setVerificationStatus('approved');
        } else if (hasRejected) {
          setVerificationStatus('rejected');
        } else if (response.data.length > 0) {
          setVerificationStatus('pending');
        }
      }
    } catch (err) {
      // Silently fail - don't show error if documents can't be fetched
      // The uploaded files are already in uploadedFiles state
      console.error('Failed to refetch documents:', err);
    }
  };

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
    // Clear rejected status from existing documents when a new file is selected
    const wasRejected = existingDocuments[field]?.verificationStatus === 'REJECTED';
    setExistingDocuments((prev) => {
      const newDocuments = { ...prev };
      delete newDocuments[field];
      return newDocuments;
    });
    // Reset verification status to pending if a rejected file was replaced and no other rejected files remain
    if (wasRejected && verificationStatus === 'rejected') {
      const remainingDocuments = { ...existingDocuments };
      delete remainingDocuments[field];
      const hasOtherRejected = Object.values(remainingDocuments).some(
        (doc) => doc?.verificationStatus === 'REJECTED'
      );
      if (!hasOtherRejected) {
        setVerificationStatus('pending');
      }
    }
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
        // Clear formData and progress when upload succeeds
        setFormData((prev) => ({ ...prev, [field]: null }));
        setUploadProgress((prev) => {
          const newProgress = { ...prev };
          delete newProgress[field];
          return newProgress;
        });
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
    // Clear rejected status from existing documents when a new file is selected
    const wasRejected = existingDocuments.additionalDocument?.verificationStatus === 'REJECTED';
    setExistingDocuments((prev) => {
      const newDocuments = { ...prev };
      delete newDocuments.additionalDocument;
      return newDocuments;
    });
    // Reset verification status to pending if a rejected file was replaced and no other rejected files remain
    if (wasRejected && verificationStatus === 'rejected') {
      const remainingDocuments = { ...existingDocuments };
      delete remainingDocuments.additionalDocument;
      const hasOtherRejected = Object.values(remainingDocuments).some(
        (doc) => doc?.verificationStatus === 'REJECTED'
      );
      if (!hasOtherRejected) {
        setVerificationStatus('pending');
      }
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
      // Clear formData and progress when upload succeeds
      setFormData((prev) => ({ ...prev, additionalDocument: null }));
      setUploadProgress((prev) => {
        const newProgress = { ...prev };
        delete newProgress.additionalDocument;
        return newProgress;
      });
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

    // Check if all required files exist (either in formData or existingDocuments)
    const hasBusinessLicense = formData.businessLicense || existingDocuments.businessLicense;
    const hasTaxDocument = formData.taxDocument || existingDocuments.taxDocument;

    if (!hasBusinessLicense || !hasTaxDocument) {
      setError('Please select all required documents before submitting.');
      return;
    }

    // Validate only new files using Zod schema (skip validation for already uploaded files)
    // Only validate files that are in formData (new files), not ones in existingDocuments
    const errors: Record<string, string> = {};

    // Validate each field individually if it's a new file (in formData)
    // Skip validation for files that exist in existingDocuments
    if (formData.businessLicense) {
      const fieldSchema = verificationSchema.shape.businessLicense;
      const result = fieldSchema.safeParse(formData.businessLicense);
      if (!result.success) {
        errors.businessLicense = result.error.issues[0]?.message || 'Invalid file';
      }
    }

    if (formData.taxDocument) {
      const fieldSchema = verificationSchema.shape.taxDocument;
      const result = fieldSchema.safeParse(formData.taxDocument);
      if (!result.success) {
        errors.taxDocument = result.error.issues[0]?.message || 'Invalid file';
      }
    }

    if (formData.additionalDocument) {
      const fieldSchema = verificationSchema.shape.additionalDocument;
      if (fieldSchema) {
        const result = fieldSchema.safeParse(formData.additionalDocument);
        if (!result.success) {
          errors.additionalDocument = result.error.issues[0]?.message || 'Invalid file';
        }
      }
    }

    // If there are validation errors, set them and return
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);

    try {
      // Check if there are any new files to upload
      const hasNewFiles = formData.businessLicense || formData.taxDocument || formData.additionalDocument;

      // Set all files to uploading status (only for new files)
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
      // Only upload files that are in formData (new files), not already uploaded ones
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
            if (isSuccess) {
              // Clear formData and progress when upload succeeds
              setFormData((prev) => ({ ...prev, businessLicense: null }));
              setUploadProgress((prev) => {
                const newProgress = { ...prev };
                delete newProgress.businessLicense;
                return newProgress;
              });
            } else {
              setFieldErrors((prev) => ({
                ...prev,
                businessLicense: fileResponse.message || 'File upload failed',
              }));
            }
          } else if (docType === DocumentType.TAX_IDENTIFICATION || docType === 'TAX_IDENTIFICATION') {
            uploadResults.taxDocument = fileResponse as FileUploadResponse;
            setUploadedFiles((prev) => ({ ...prev, taxDocument: fileResponse as FileUploadResponse }));
            setFileStatuses((prev) => ({ ...prev, taxDocument: isSuccess ? 'success' : 'error' }));
            if (isSuccess) {
              // Clear formData and progress when upload succeeds
              setFormData((prev) => ({ ...prev, taxDocument: null }));
              setUploadProgress((prev) => {
                const newProgress = { ...prev };
                delete newProgress.taxDocument;
                return newProgress;
              });
            } else {
              setFieldErrors((prev) => ({
                ...prev,
                taxDocument: fileResponse.message || 'File upload failed',
              }));
            }
          } else if (docType === DocumentType.ADDITIONAL_DOCUMENT || docType === 'ADDITIONAL_DOCUMENT') {
            uploadResults.additionalDocument = fileResponse as FileUploadResponse;
            setUploadedFiles((prev) => ({ ...prev, additionalDocument: fileResponse as FileUploadResponse }));
            setFileStatuses((prev) => ({ ...prev, additionalDocument: isSuccess ? 'success' : 'error' }));
            if (isSuccess) {
              // Clear formData and progress when upload succeeds
              setFormData((prev) => ({ ...prev, additionalDocument: null }));
              setUploadProgress((prev) => {
                const newProgress = { ...prev };
                delete newProgress.additionalDocument;
                return newProgress;
              });
            } else {
              setFieldErrors((prev) => ({
                ...prev,
                additionalDocument: fileResponse.message || 'File upload failed',
              }));
            }
          }
        });

      // Handle case where no new files were uploaded (all files already exist)
      if (!hasNewFiles) {
        // All files are already uploaded, show success message
        clearError();
        setVerificationStatus('pending');
        setSuccessMessage('Verification submitted successfully! Your documents are under review.');
        setIsSuccessMessageError(false);
        // Refetch documents to ensure we have the latest verification status
        await refetchDocuments();
        setLoading(false);
        return;
      }

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
      
      // Refetch documents to get complete DocumentInfo with verificationStatus
      await refetchDocuments();
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

  /**
   * Gets the verification status badge for a document
   * @param status - The verification status
   * @returns JSX element for the status badge
   */
  const getDocumentStatusBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold text-white bg-green-600">
            Verified
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold text-white bg-red-600">
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold text-amber-400 bg-[#343536] border border-amber-400">
            Pending
          </span>
        );
    }
  };

  /**
   * Checks if a file input should be disabled
   * Disables when the file is successfully uploaded and not rejected
   * @param field - The field name to check
   * @returns True if the input should be disabled
   */
  const isInputDisabled = (field: 'businessLicense' | 'taxDocument' | 'additionalDocument'): boolean => {
    const hasUploadedFile = fileStatuses[field] === 'success' || existingDocuments[field] !== undefined;
    const isRejected = existingDocuments[field]?.verificationStatus === 'REJECTED';
    
    // If file is uploaded and not rejected, disable the input
    return hasUploadedFile && !isRejected;
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
        <div className="bg-red-100 border border-red-200 rounded-xl p-4">
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
                : 'bg-[#282f39] border border-[#403c34]'
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
                  className="h-5 w-5 text-green-500 mt-0.5 shrink-0"
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
                isSuccessMessageError ? 'text-red-800' : 'text-white'
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
                <label className={`flex flex-col items-center justify-center w-full rounded-2xl border-2 border-dashed border-[#334155] bg-transparent px-6 py-6 text-center transition-colors group ${
                  isInputDisabled('businessLicense') 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'cursor-pointer hover:border-[#475569]'
                }`}>
                  <svg
                    className={`h-8 w-8 text-[#475569] mb-3 transition-colors ${
                      isInputDisabled('businessLicense') 
                        ? '' 
                        : 'group-hover:text-[#6D28D9]'
                    }`}
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
                  <div>
                    <span className="text-sm text-white">
                      Click to upload</span>
                    <span className="text-sm text-[#475569]"> or drag and drop</span>
                  </div>
                  <span className="mt-1 text-xs font-light text-[#475569]">
                    PDF, JPEG, or PNG (max 10MB)
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    data-field="businessLicense"
                    onChange={(e) => handleFileChange('businessLicense', e.target.files)}
                    disabled={isInputDisabled('businessLicense')}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
                  />
                </label>
              </div>
              {fieldErrors.businessLicense && (
                <p className="mt-1.5 text-sm text-red-500">{fieldErrors.businessLicense}</p>
              )}
              {(formData.businessLicense || existingDocuments.businessLicense || uploadedFiles.businessLicense) && (
                <div className="mt-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-[#282f39] border border-[#403c34]">
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
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-white truncate">
                          {formData.businessLicense?.name || existingDocuments.businessLicense?.originalFileName || existingDocuments.businessLicense?.fileName || uploadedFiles.businessLicense?.fileName}
                        </p>
                        {existingDocuments.businessLicense && getDocumentStatusBadge(existingDocuments.businessLicense.verificationStatus)}
                        {!existingDocuments.businessLicense && fileStatuses.businessLicense === 'success' && uploadedFiles.businessLicense && (
                          <span className="inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold text-amber-400 bg-[#343536] border border-amber-400">
                            Uploaded
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">
                        {formData.businessLicense ? formatFileSize(formData.businessLicense.size) : existingDocuments.businessLicense ? formatFileSize(existingDocuments.businessLicense.fileSize) : uploadedFiles.businessLicense ? formatFileSize(uploadedFiles.businessLicense.fileSize || 0) : ''}
                      </p>
                      {existingDocuments.businessLicense?.rejectionReason && (
                        <p className="mt-1 text-xs text-red-400">
                          {existingDocuments.businessLicense.rejectionReason}
                        </p>
                      )}
                      {fileStatuses.businessLicense === 'uploading' && uploadProgress.businessLicense !== undefined && (
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
                    {formData.businessLicense && fileStatuses.businessLicense !== 'success' && (
                      <button
                        type="button"
                        onClick={() => removeFile('businessLicense')}
                        className="shrink-0 text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1.5">
                Upload Tax Document <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <label className={`flex flex-col items-center justify-center w-full rounded-2xl border-2 border-dashed border-[#334155] bg-transparent px-6 py-6 text-center transition-colors group ${
                  isInputDisabled('taxDocument') 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'cursor-pointer hover:border-[#475569]'
                }`}>
                  <svg
                    className={`h-8 w-8 text-[#475569] mb-3 transition-colors ${
                      isInputDisabled('taxDocument') 
                        ? '' 
                        : 'group-hover:text-[#6D28D9]'
                    }`}
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
                  <div>
                  <span className="text-sm text-white">
                  Click to upload</span><span className="text-sm text-[#475569]"> or drag and drop</span>
                  </div>
                
                  <span className="mt-1 text-xs font-light text-[#475569]">
                    PDF, JPEG, or PNG (max 10MB)
                  
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    data-field="taxDocument"
                    onChange={(e) => handleFileChange('taxDocument', e.target.files)}
                    disabled={isInputDisabled('taxDocument')}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
                  />
                </label>
              </div>
              {fieldErrors.taxDocument && (
                <p className="mt-1.5 text-sm text-red-500">{fieldErrors.taxDocument}</p>
              )}
              {(formData.taxDocument || existingDocuments.taxDocument || uploadedFiles.taxDocument) && (
                <div className="mt-4 mb-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-[#282f39] border border-[#403c34]">
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
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-white truncate">
                          {formData.taxDocument?.name || existingDocuments.taxDocument?.originalFileName || existingDocuments.taxDocument?.fileName || uploadedFiles.taxDocument?.fileName}
                        </p>
                        {existingDocuments.taxDocument && getDocumentStatusBadge(existingDocuments.taxDocument.verificationStatus)}
                        {!existingDocuments.taxDocument && fileStatuses.taxDocument === 'success' && uploadedFiles.taxDocument && (
                          <span className="inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold text-amber-400 bg-[#343536] border border-amber-400">
                            Uploaded
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">
                        {formData.taxDocument ? formatFileSize(formData.taxDocument.size) : existingDocuments.taxDocument ? formatFileSize(existingDocuments.taxDocument.fileSize) : uploadedFiles.taxDocument ? formatFileSize(uploadedFiles.taxDocument.fileSize || 0) : ''}
                      </p>
                      {existingDocuments.taxDocument?.rejectionReason && (
                        <p className="mt-1 text-xs text-red-400">
                          {existingDocuments.taxDocument.rejectionReason}
                        </p>
                      )}
                      {fileStatuses.taxDocument === 'uploading' && uploadProgress.taxDocument !== undefined && (
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
                    {formData.taxDocument && fileStatuses.taxDocument !== 'success' && (
                      <button
                        type="button"
                        onClick={() => removeFile('taxDocument')}
                        className="shrink-0 text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Additional Document Section */}
            <div className="pt-6 mt-10 border-t border-[#1b2335]">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white">ADDITIONAL DOCUMENT</h2>
                <span className="text-[10px] font-semibold text-[#94a3b8] bg-[#1e293b] px-3 py-1 rounded-[5px]">OPTIONAL</span>
               
              </div>
              <div className="pt-1">
                <label className="block text-sm font-medium text-[#c7d4e1] mb-1.5">
                Upload Additional Supporting Document
              </label>
              </div>
            </div>
            
            <div>
             
              <div className="relative">
                <label className={`flex flex-col items-center justify-center w-full rounded-2xl border-2 border-dashed border-[#334155] bg-transparent px-6 py-6 text-center transition-colors group ${
                  isInputDisabled('additionalDocument') 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'cursor-pointer hover:border-[#475569]'
                }`}>
                  <svg
                    className={`h-8 w-8 text-[#475569] mb-3 transition-colors ${
                      isInputDisabled('additionalDocument') 
                        ? '' 
                        : 'group-hover:text-[#6D28D9]'
                    }`}
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
                  <div>
                    <span className="text-sm text-white">
                      Click to upload</span>
                    <span className="text-sm text-[#475569]"> or drag and drop</span>
                  </div>
                  <span className="mt-1 text-xs font-light text-[#475569]">
                    PDF, JPEG, or PNG (max 10MB)
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleAdditionalFileChange(e.target.files)}
                    disabled={isInputDisabled('additionalDocument')}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
                  />
                </label>
              </div>
              {fieldErrors.additionalDocument && (
                <p className="mt-1.5 text-sm text-red-500">{fieldErrors.additionalDocument}</p>
              )}
              {(formData.additionalDocument || existingDocuments.additionalDocument || uploadedFiles.additionalDocument) && (
                <div className="mt-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-[#282f39] border border-[#403c34]">
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
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-white truncate">
                          {formData.additionalDocument?.name || existingDocuments.additionalDocument?.originalFileName || existingDocuments.additionalDocument?.fileName || uploadedFiles.additionalDocument?.fileName}
                        </p>
                        {existingDocuments.additionalDocument && getDocumentStatusBadge(existingDocuments.additionalDocument.verificationStatus)}
                        {!existingDocuments.additionalDocument && fileStatuses.additionalDocument === 'success' && uploadedFiles.additionalDocument && (
                          <span className="inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold text-amber-400 bg-[#343536] border border-amber-400">
                            Uploaded
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">
                        {formData.additionalDocument ? formatFileSize(formData.additionalDocument.size) : existingDocuments.additionalDocument ? formatFileSize(existingDocuments.additionalDocument.fileSize) : uploadedFiles.additionalDocument ? formatFileSize(uploadedFiles.additionalDocument.fileSize || 0) : ''}
                      </p>
                      {existingDocuments.additionalDocument?.rejectionReason && (
                        <p className="mt-1 text-xs text-red-400">
                          {existingDocuments.additionalDocument.rejectionReason}
                        </p>
                      )}
                      {fileStatuses.additionalDocument === 'uploading' && uploadProgress.additionalDocument !== undefined && (
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
                    {formData.additionalDocument && fileStatuses.additionalDocument !== 'success' && (
                      <button
                        type="button"
                        onClick={removeAdditionalFile}
                        className="shrink-0 text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Remove
                      </button>
                    )}
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
