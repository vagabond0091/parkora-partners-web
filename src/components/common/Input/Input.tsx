import { clsx } from 'clsx';
import type { InputProps } from '@/types/components/input.types';

export const Input = ({
  label,
  error,
  rightIcon,
  className,
  id,
  ...props
}: InputProps) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          className={clsx(
            'w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50',
            'text-gray-900 placeholder-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400',
            'transition-all duration-200',
            rightIcon && 'pr-12',
            error && 'border-red-400 focus:ring-red-500/20 focus:border-red-400',
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};
