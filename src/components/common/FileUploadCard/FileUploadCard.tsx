import { Button } from '@/components/common/Button/Button';
import type { FileUploadCardProps } from '@/types/components/fileUploadCard.types';

/**
 * Reusable file upload card component.
 * Displays a file upload area with drag-and-drop support, file preview, status badges, and upload progress.
 */
export const FileUploadCard = ({
  field,
  label,
  required = false,
  file,
  existingDocument,
  uploadedFile,
  fileStatus,
  uploadProgress,
  error,
  disabled = false,
  onFileChange,
  onRemove,
  onRetry,
  getStatusBadge,
  formatFileSize,
}: FileUploadCardProps) => {
  const hasFile = file || existingDocument || uploadedFile;
  const fileName = file?.name || existingDocument?.originalFileName || existingDocument?.fileName || uploadedFile?.fileName || '';
  const fileSize = file?.size || existingDocument?.fileSize || uploadedFile?.fileSize || 0;
  const showUploadedBadge = !existingDocument && fileStatus === 'success' && uploadedFile;
  const showRemoveButton = file && fileStatus !== 'success';

  return (
    <div>
      <label className="block text-sm font-medium text-white mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <label
          className={`flex flex-col items-center justify-center w-full rounded-2xl border-2 border-dashed border-[#334155] bg-transparent px-6 py-6 text-center transition-colors group ${
            disabled
              ? 'opacity-50 cursor-not-allowed'
              : 'cursor-pointer hover:border-[#475569]'
          }`}
        >
          <svg
            className={`h-8 w-8 text-[#475569] mb-3 transition-colors ${
              disabled ? '' : 'group-hover:text-[#6D28D9]'
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
            <span className="text-sm text-white">Click to upload</span>
            <span className="text-sm text-[#475569]"> or drag and drop</span>
          </div>
          <span className="mt-1 text-xs font-light text-[#475569]">
            PDF, JPEG, or PNG (max 10MB)
          </span>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            data-field={field}
            onChange={(e) => onFileChange(e.target.files)}
            disabled={disabled}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
          />
        </label>
      </div>
      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
      {hasFile && (
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
                <p className="text-sm font-medium text-white truncate">{fileName}</p>
                {existingDocument && getStatusBadge(existingDocument.verificationStatus)}
                {showUploadedBadge && (
                  <span className="inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold text-amber-400 bg-[#343536] border border-amber-400">
                    Uploaded
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400">{formatFileSize(fileSize)}</p>
              {existingDocument?.rejectionReason && (
                <p className="mt-1 text-xs text-red-400">
                  {existingDocument.rejectionReason}
                </p>
              )}
              {fileStatus === 'uploading' && uploadProgress !== undefined && (
                <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress || 0}%` }}
                  />
                </div>
              )}
              {fileStatus === 'error' && onRetry && (
                <Button
                  type="button"
                  onClick={onRetry}
                  className="mt-2 text-xs text-red-600 hover:text-red-700 font-medium p-0 h-auto bg-transparent border-0"
                >
                  Try again
                </Button>
              )}
            </div>
            {showRemoveButton && (
              <Button
                type="button"
                onClick={onRemove}
                className="shrink-0 text-red-500 hover:text-red-700 text-sm font-medium p-0 h-auto bg-transparent border-0"
              >
                Remove
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
