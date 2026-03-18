import React from 'react';
import type { FormGroupProps } from '../../../types/components';

const FormGroup: React.FC<FormGroupProps> = ({
  children,
  className = '',
  error
}) => {
  return (
    <div className={`mb-4 ${error ? 'has-error' : ''} ${className}`}>
      {children}
    </div>
  );
};

export default FormGroup;
