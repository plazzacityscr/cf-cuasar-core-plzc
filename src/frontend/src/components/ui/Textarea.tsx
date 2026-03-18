import React from 'react';
import type { TextareaProps } from '../../types/components';

const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  helperText,
  resize = 'vertical',
  className = '',
  id,
  ...rest
}) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = Boolean(error);

  const resizeStyles: Record<string, string> = {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x',
    both: 'resize'
  };

  const baseStyles = 'w-full px-4 py-2 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1';
  const errorStyles = hasError
    ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500'
    : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500';
  const disabledStyles = rest.disabled ? 'bg-gray-100 cursor-not-allowed' : '';

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {rest.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        className={`${baseStyles} ${errorStyles} ${disabledStyles} ${resizeStyles[resize]} ${className}`}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
        {...rest}
      />
      {error && (
        <p id={`${textareaId}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${textareaId}-helper`} className="mt-1 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Textarea;
