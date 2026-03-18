import { useState } from 'react';
import { ReportTab } from './ReportTab';
import { ReportLoading } from './ReportLoading';
import { ReportError } from './ReportError';
import { reportConfigs } from '../../config/reports';
import { uiTexts } from '../../config/texts';

export interface Report {
  id: string;
  title: string;
  content: string;
  status: 'loading' | 'error' | 'success';
  error?: string;
}

interface ResultsViewerProps {
  reports: Report[];
  onRetry?: (reportId: string) => void;
  isRetrying?: boolean;
}

const TABS = reportConfigs;

export function ResultsViewer({ reports, onRetry, isRetrying }: ResultsViewerProps) {
  const [activeTab, setActiveTab] = useState('resumen');

  const activeReport = reports.find(r => r.id === activeTab);

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Tabs Header */}
      <div className="border-b border-gray-200">
        <nav className="flex overflow-x-auto" role="tablist">
          {TABS.map((tab) => {
            const report = reports.find(r => r.id === tab.id);
            const isLoading = report?.status === 'loading';
            const isError = report?.status === 'error';

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
                  ${activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
                role="tab"
                aria-selected={activeTab === tab.id}
              >
                {tab.label}
                {isLoading && (
                  <span className="ml-2 w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                )}
                {isError && (
                  <span className="ml-2 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {!activeReport || activeReport.status === 'loading' ? (
          <ReportLoading message={uiTexts.loading.report} />
        ) : activeReport.status === 'error' ? (
          <ReportError
            message={activeReport.error || uiTexts.results.loadError}
            onRetry={() => onRetry?.(activeReport.id)}
            isRetrying={isRetrying}
          />
        ) : (
          <ReportTab content={activeReport.content} title={activeReport.title} />
        )}
      </div>
    </div>
  );
}
