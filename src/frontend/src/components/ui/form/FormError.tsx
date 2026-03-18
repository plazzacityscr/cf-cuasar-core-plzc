import React from 'react';
import * as Icons from 'lucide-react';
import type { FormErrorProps } from '../../../types/components';

const FormError: React.FC<FormErrorProps> = ({
  children,
  className = ''
}) => {
  if (!children) return null;

  return (
    <div className={`flex items-center mt-1 text-sm text-red-600 ${className}`}>
      <Icons.AlertCircle size={14} className="mr-1 flex-shrink-0" />
      <span>{children}</span>
    </div>
  );
};

export default FormError;
