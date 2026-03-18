import ReactMarkdown from 'react-markdown';

interface ReportTabProps {
  content: string;
  title: string;
}

export function ReportTab({ content, title }: ReportTabProps) {
  return (
    <div className="prose prose-sm max-w-none">
      <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
