import { clsx } from 'clsx';
import type { TextAreaProps } from '@/types/components/textArea.types';

export const TextArea = ({
  label,
  error,
  className,
  id,
  ...props
}: TextAreaProps) => {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium text-gray-300 mb-1.5"
        >
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <textarea
          id={textareaId}
          className={clsx(
            'w-full px-4 py-3 rounded-xl border border-gray-700 bg-[#232b3d]',
            'text-gray-200 placeholder-gray-500',
            'focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400',
            'transition-all duration-200 resize-y min-h-[100px]',
            error && 'border-red-400 focus:ring-red-500/20 focus:border-red-400',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};
