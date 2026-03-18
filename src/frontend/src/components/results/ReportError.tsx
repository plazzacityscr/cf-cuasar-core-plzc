import Alert from '../ui/Alert';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { uiTexts } from '../../config/texts';

interface ReportErrorProps {
  message: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export function ReportError({ message, onRetry, isRetrying = false }: ReportErrorProps) {
  return (
    <div className="py-12">
      <Alert variant="danger">
        <div className="flex items-start">
          <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-red-800">{message}</p>
            {onRetry && (
              <button
                onClick={onRetry}
                disabled={isRetrying}
                className="mt-3 inline-flex items-center px-3 py-1.5 bg-red-100 text-red-800 rounded-md hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
                {isRetrying ? uiTexts.actions.retrying : uiTexts.buttons.retry}
              </button>
            )}
          </div>
        </div>
      </Alert>
    </div>
  );
}
