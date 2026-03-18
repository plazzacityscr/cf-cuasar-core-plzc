import Card from '../ui/Card';
import { StatusBadge } from './StatusBadge';
import { Project } from '../../types/project';
import { Calendar, FileText, Clock, AlertCircle } from 'lucide-react';
import { uiTexts } from '../../config/texts';

interface ProjectDetailProps {
  project: Project;
  onEdit?: () => void;
  onDelete?: () => void;
  onRunWorkflow?: () => void;
  isRunning?: boolean;
}

export function ProjectDetail({
  project,
  onEdit,
  onDelete,
  onRunWorkflow,
  isRunning = false
}: ProjectDetailProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const canRunWorkflow = project.status === 'pending' || project.status === 'failed';

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {project.name}
              </h1>
              <div className="flex items-center gap-2">
                <StatusBadge status={project.status} />
              </div>
            </div>
            <div className="flex gap-2">
              {onRunWorkflow && canRunWorkflow && (
                <button
                  onClick={onRunWorkflow}
                  disabled={isRunning}
                  className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  {isRunning ? uiTexts.actions.submitting : 'Ejecutar Análisis'}
                </button>
              )}
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  {uiTexts.buttons.edit}
                </button>
              )}
              {onDelete && (
                <button
                  onClick={onDelete}
                  className="inline-flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {uiTexts.buttons.delete}
                </button>
              )}
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-sm font-medium text-gray-500 mb-2">{uiTexts.projectForm.descriptionLabel}</h2>
            <p className="text-gray-900">{project.description}</p>
          </div>
        </div>
      </Card>

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Created At Card */}
        <Card>
          <div className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Fecha de Creación</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatDate(project.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Updated At Card */}
        <Card>
          <div className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{uiTexts.dashboard.updated}</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatDate(project.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Project ID Card */}
      <Card>
        <div className="p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Información del Sistema</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">ID del Proyecto:</span>
              <span className="text-sm font-mono text-gray-900">{project.id}</span>
            </div>
            {project.workflowId && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">ID del Workflow:</span>
                <span className="text-sm font-mono text-gray-900">{project.workflowId}</span>
              </div>
            )}
            {project.userId && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">ID del Usuario:</span>
                <span className="text-sm font-mono text-gray-900">{project.userId}</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
