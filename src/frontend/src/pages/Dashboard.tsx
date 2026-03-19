import { uiTexts } from '../config/texts';

interface DashboardProps {
  stats: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    failed: number;
    cancelled: number;
  };
}

export function Dashboard({ stats }: DashboardProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">{uiTexts.dashboard.title}</h1>
      <p className="text-gray-500 mt-1">{uiTexts.dashboard.subtitle}</p>
      <div className="p-4 bg-white rounded-lg border">
        <p>Dashboard (próximamente)</p>
        <p className="text-sm text-gray-500 mt-2">Stats: {stats.total} proyectos</p>
      </div>
    </div>
  );
}

export default Dashboard;
