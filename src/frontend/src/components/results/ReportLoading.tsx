import Spinner from '../ui/Spinner';
import { uiTexts } from '../../config/texts';

interface ReportLoadingProps {
  message?: string;
}

export function ReportLoading({ message = uiTexts.loading.report }: ReportLoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Spinner size="lg" />
      <p className="mt-4 text-sm text-gray-500">{message}</p>
    </div>
  );
}
