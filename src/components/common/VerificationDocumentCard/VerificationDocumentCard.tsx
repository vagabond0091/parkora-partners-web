import type { VerificationDocumentCardProps } from '@/types/components/verificationDocumentCard.types';

/**
 * Reusable card component for displaying verification documents.
 * Displays a document with icon, title, description, and action buttons.
 */
export const VerificationDocumentCard = ({
  title,
  description,
  onViewFile,
  onVerify,
  onFlag,
}: VerificationDocumentCardProps) => {
  return (
    <div className="bg-[#1b2335] rounded-xl border border-gray-800 px-5 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="shrink-0 w-10 h-10 flex items-center justify-center">
            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6M9 8h.01M5 4h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"
              />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white">{title}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onViewFile}
          className="shrink-0 text-[11px] font-semibold text-purple-400 hover:text-purple-300 transition-colors uppercase"
        >
          VIEW FILE
        </button>
      </div>
      <div className="mb-4 pl-[10px]">
        <p className="text-[11px] text-gray-400">{description}</p>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onVerify}
          className="flex-1 h-7 rounded-lg bg-[#064e3b] text-[10px] font-semibold text-green-100 hover:bg-[#047857] transition-colors"
        >
          VERIFY
        </button>
        <button
          type="button"
          onClick={onFlag}
          className="flex-1 h-7 rounded-lg bg-[#3f1d2b] text-[10px] font-semibold text-red-200 hover:bg-[#7f1d1d] transition-colors"
        >
          FLAG
        </button>
      </div>
    </div>
  );
};
