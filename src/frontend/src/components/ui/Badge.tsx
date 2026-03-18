import React from 'react';
import type { BadgeProps } from '../../types/components';

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  dot = false
}) => {
  const variantStyles: Record<string, string> = {
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800'
  };

  const sizeStyles: Record<string, string> = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base'
  };

  if (dot) {
    const dotColorStyles: Record<string, string> = {
      primary: 'bg-primary-500',
      secondary: 'bg-gray-500',
      success: 'bg-green-500',
      warning: 'bg-yellow-500',
      danger: 'bg-red-500',
      info: 'bg-blue-500'
    };

    return (
      <span className="inline-flex items-center">
        <span className={`w-2 h-2 rounded-full ${dotColorStyles[variant]}`} />
      </span>
    );
  }

  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full
        ${variantStyles[variant]}
        ${sizeStyles[size]}
      `}
    >
      {children}
    </span>
  );
};

export default Badge;
