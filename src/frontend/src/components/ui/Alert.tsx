import React from 'react';
import * as Icons from 'lucide-react';
import type { AlertProps } from '../../types/components';

const Alert: React.FC<AlertProps> = ({
  children,
  variant = 'info',
  dismissible = false,
  onDismiss,
  icon
}) => {
  const variantStyles: Record<string, string> = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    danger: 'bg-red-50 border-red-200 text-red-800'
  };

  const defaultIcons: Record<string, React.ReactNode> = {
    info: <Icons.Info size={20} className="text-blue-600" />,
    success: <Icons.CheckCircle size={20} className="text-green-600" />,
    warning: <Icons.AlertTriangle size={20} className="text-yellow-600" />,
    danger: <Icons.AlertCircle size={20} className="text-red-600" />
  };

  const displayIcon = icon || defaultIcons[variant];

  return (
    <div
      className={`
        relative flex items-start p-4 rounded-lg border
        ${variantStyles[variant]}
      `}
      role="alert"
    >
      <div className="flex-shrink-0">
        {displayIcon}
      </div>
      <div className="flex-1 ml-3">
        {children}
      </div>
      {dismissible && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 ml-3 p-1 rounded hover:bg-black hover:bg-opacity-10 transition-colors"
          aria-label="Cerrar alerta"
        >
          <Icons.X size={16} className="opacity-70" />
        </button>
      )}
    </div>
  );
};

export default Alert;
