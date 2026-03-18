import React from 'react';
import * as Icons from 'lucide-react';
import type { SpinnerProps } from '../../types/components';

const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className = ''
}) => {
  const sizeStyles: Record<string, number> = {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48
  };

  const colorStyles: Record<string, string> = {
    primary: 'text-primary-600',
    secondary: 'text-gray-600',
    white: 'text-white'
  };

  return (
    <Icons.Loader2
      className={`animate-spin ${colorStyles[color]} ${className}`}
      size={sizeStyles[size]}
    />
  );
};

export default Spinner;
