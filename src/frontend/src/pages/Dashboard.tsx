import Card from '../components/ui/Card';
import { ProjectStats } from '../types/project';
import { FolderOpen, Clock, CheckCircle, AlertCircle, XCircle, PauseCircle } from 'lucide-react';
import { uiTexts } from '../config/texts';

interface DashboardProps {
  stats: ProjectStats;
  recentProjects?: Array<{
    id: string;
    name: string;
    status: string;
    updatedAt: string;
  }>;
}

export function Dashboard({ stats, recentProjects }: DashboardProps) {
  const statCards = [
    {
      title: uiTexts.dashboard.stats.totalProjects,
      value: stats.total,
      icon: FolderOpen,
      color: 'bg-blue-100 text-blue-600',
      bgColor: 'bg-blue-50 border-blue-200'
    },
    {
      title: uiTexts.dashboard.stats.inProgress,
      value: stats.inProgress,
      icon: Clock,
      color: 'bg-yellow-100 text-yellow-600',
      bgColor: 'bg-yellow-50 border-yellow-200'
    },
    {
      title: uiTexts.dashboard.stats.completed,
      value: stats.completed,
      icon: CheckCircle,
      color: 'bg-green-100 text-green-600',
      bgColor: 'bg-green-50 border-green-200'
    },
    {
      title: uiTexts.dashboard.stats.failed,
      value: stats.failed,
      icon: XCircle,
      color: 'bg-red-100 text-red-600',
      bgColor: 'bg-red-50 border-red-200'
    }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{uiTexts.dashboard.title}</h1>
        <p className="text-gray-500 mt-1">{uiTexts.dashboard.subtitle}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className={`border ${stat.bgColor}`}>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border border-gray-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <PauseCircle className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{uiTexts.dashboard.stats.pending}</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="border border-gray-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{uiTexts.dashboard.stats.cancelled}</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.cancelled}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Projects */}
      {recentProjects && recentProjects.length > 0 && (
        <Card className="border border-gray-200">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{uiTexts.dashboard.recentProjects}</h2>
            <div className="space-y-3">
              {recentProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900">{project.name}</p>
                    <p className="text-sm text-gray-500">{uiTexts.dashboard.updated} {formatDate(project.updatedAt)}</p>
                  </div>
                  <span className="text-sm text-gray-500">{project.status}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

export default Dashboard;
