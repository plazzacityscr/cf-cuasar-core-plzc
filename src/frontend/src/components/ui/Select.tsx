import React from 'react';
import * as Icons from 'lucide-react';
import type { SelectProps } from '../../types/components';

const Select: React.FC<SelectProps> = ({
  label,
  error,
  helperText,
  options,
  placeholder,
  className = '',
  id,
  ...rest
}) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = Boolean(error);

  const baseStyles = 'w-full px-4 py-2 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 appearance-none bg-white';
  const errorStyles = hasError
    ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500'
    : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500';
  const disabledStyles = rest.disabled ? 'bg-gray-100 cursor-not-allowed' : '';

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {rest.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          className={`${baseStyles} ${errorStyles} ${disabledStyles} pr-10 ${className}`}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option: { value: string; label: string }) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <Icons.ChevronDown size={16} className="text-gray-400" />
        </div>
      </div>
      {error && (
        <p id={`${selectId}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${selectId}-helper`} className="mt-1 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Select;
