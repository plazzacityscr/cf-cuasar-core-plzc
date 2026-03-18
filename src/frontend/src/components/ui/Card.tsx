import React from 'react';
import type { CardProps } from '../../types/components';

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  shadow = 'sm',
  bordered = true
}) => {
  const paddingStyles: Record<string, string> = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };

  const shadowStyles: Record<string, string> = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg'
  };

  const borderStyle = bordered ? 'border border-gray-200' : '';

  return (
    <div
      className={`
        bg-white rounded-lg
        ${paddingStyles[padding]}
        ${shadowStyles[shadow]}
        ${borderStyle}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
