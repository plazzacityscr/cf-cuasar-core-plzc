import React from 'react';
import type { FormLabelProps } from '../../../types/components';

const FormLabel: React.FC<FormLabelProps> = ({
  children,
  required = false,
  htmlFor,
  className = ''
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-medium text-gray-700 mb-1 ${className}`}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
};

export default FormLabel;
