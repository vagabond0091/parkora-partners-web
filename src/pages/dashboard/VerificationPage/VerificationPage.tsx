import { useState } from 'react';
import { Button } from '@/components/common/Button/Button';
import { Input } from '@/components/common/Input/Input';
import { useAppStatusStore } from '@/stores/appStatusStore';

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
    businessRegistrationNumber: '',
    taxIdentificationNumber: '',
    businessLicense: null as File | null,
    taxDocument: null as File | null,
    additionalDocuments: [] as File[],
  });

  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    clearError();
  };

  const handleFileChange = (field: string, files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];

    if (file.size > maxSize) {
      setFieldErrors((prev) => ({
        ...prev,
        [field]: 'File size must be less than 10MB',
      }));
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      setFieldErrors((prev) => ({
        ...prev,
        [field]: 'File must be PDF, JPEG, or PNG',
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [field]: file }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleAdditionalFilesChange = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];

    const validFiles = fileArray.filter((file) => {
      if (file.size > maxSize) return false;
      if (!allowedTypes.includes(file.type)) return false;
      return true;
    });

    if (validFiles.length !== fileArray.length) {
      setError('Some files were rejected. Only PDF, JPEG, or PNG files under 10MB are allowed.');
    }

    setFormData((prev) => ({
      ...prev,
      additionalDocuments: [...prev.additionalDocuments, ...validFiles],
    }));
  };

  const removeAdditionalFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      additionalDocuments: prev.additionalDocuments.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setFieldErrors({});

    // Validation
    const errors: Record<string, string> = {};
    if (!formData.businessRegistrationNumber.trim()) {
      errors.businessRegistrationNumber = 'Business registration number is required';
    }
    if (!formData.taxIdentificationNumber.trim()) {
      errors.taxIdentificationNumber = 'Tax identification number is required';
    }
    if (!formData.businessLicense) {
      errors.businessLicense = 'Business license document is required';
    }
    if (!formData.taxDocument) {
      errors.taxDocument = 'Tax document is required';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);

    try {
      // TODO: Implement API call to submit verification documents
      // const formDataToSend = new FormData();
      // formDataToSend.append('businessRegistrationNumber', formData.businessRegistrationNumber);
      // formDataToSend.append('taxIdentificationNumber', formData.taxIdentificationNumber);
      // formDataToSend.append('businessLicense', formData.businessLicense);
      // formDataToSend.append('taxDocument', formData.taxDocument);
      // formData.additionalDocuments.forEach((file) => {
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
          {/* Business Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Business Information</h2>
            
            <Input
              label="Business Registration Number"
              type="text"
              placeholder="Enter your business registration number"
              value={formData.businessRegistrationNumber}
              onChange={(e) => handleInputChange('businessRegistrationNumber', e.target.value)}
              error={fieldErrors.businessRegistrationNumber}
              required
            />

            <Input
              label="Tax Identification Number"
              type="text"
              placeholder="Enter your tax identification number"
              value={formData.taxIdentificationNumber}
              onChange={(e) => handleInputChange('taxIdentificationNumber', e.target.value)}
              error={fieldErrors.taxIdentificationNumber}
              required
            />
          </div>

          {/* Required Documents */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Required Documents</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Business License <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange('businessLicense', e.target.files)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all duration-200"
                />
              </div>
              {fieldErrors.businessLicense && (
                <p className="mt-1.5 text-sm text-red-500">{fieldErrors.businessLicense}</p>
              )}
              {formData.businessLicense && (
                <p className="mt-1.5 text-sm text-gray-600">
                  Selected: {formData.businessLicense.name}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                PDF, JPEG, or PNG (max 10MB)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Tax Document <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange('taxDocument', e.target.files)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all duration-200"
                />
              </div>
              {fieldErrors.taxDocument && (
                <p className="mt-1.5 text-sm text-red-500">{fieldErrors.taxDocument}</p>
              )}
              {formData.taxDocument && (
                <p className="mt-1.5 text-sm text-gray-600">
                  Selected: {formData.taxDocument.name}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                PDF, JPEG, or PNG (max 10MB)
              </p>
            </div>
          </div>

          {/* Additional Documents */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Additional Documents (Optional)</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Additional Supporting Documents
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  multiple
                  onChange={(e) => handleAdditionalFilesChange(e.target.files)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all duration-200"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                PDF, JPEG, or PNG (max 10MB per file)
              </p>
            </div>

            {formData.additionalDocuments.length > 0 && (
              <div className="space-y-2">
                {formData.additionalDocuments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <span className="text-sm text-gray-700">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeAdditionalFile(index)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              isLoading={isLoading}
              className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white hover:from-orange-600 hover:via-pink-600 hover:to-purple-700 focus:ring-purple-500"
            >
              Submit for Verification
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
