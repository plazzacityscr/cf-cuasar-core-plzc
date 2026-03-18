import Alert from '../ui/Alert';
import { XCircle } from 'lucide-react';
import { uiTexts } from '../../config/texts';

interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
}

export function ErrorMessage({ message, onDismiss }: ErrorMessageProps) {
  return (
    <Alert variant="danger">
      <div className="flex items-start">
        <XCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-red-800">{message}</p>
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 text-red-500 hover:bg-red-100 focus:ring-2 focus:ring-red-400"
          >
            <span className="sr-only">{uiTexts.buttons.close}</span>
            <XCircle className="w-5 h-5" />
          </button>
        )}
      </div>
    </Alert>
  );
}
