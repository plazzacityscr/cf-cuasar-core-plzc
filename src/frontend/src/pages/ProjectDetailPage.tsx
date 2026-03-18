import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProjectDetail } from '../components/projects/ProjectDetail';
import { ResultsViewer, Report } from '../components/results/ResultsViewer';
import { Project } from '../types/project';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { uiTexts } from '../config/texts';

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [isRunningWorkflow, setIsRunningWorkflow] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        // TODO: Implementar llamada a API real
        console.log('Fetching project:', id);

        // Simulación de datos
        await new Promise(resolve => setTimeout(resolve, 500));

        const mockProject: Project = {
          id: id,
          name: 'Análisis de mercado residencial',
          description: 'Análisis completo del mercado inmobiliario residencial en la zona norte',
          status: 'pending' as any,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          workflowId: 'wf-123',
          userId: 'user-456'
        };

        setProject(mockProject);

        // Si el proyecto está completado, cargar los resultados
        if (mockProject.status === 'completed') {
          loadReports(id);
        }
      } catch (err) {
        setError(uiTexts.projectDetail.loadError);
        console.error('Error fetching project:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const loadReports = (projectId: string) => {
    // TODO: Implementar llamada a API real
    console.log('Loading reports for project:', projectId);

    // Simulación de informes
    const mockReports: Report[] = [
      {
        id: 'resumen',
        title: 'Resumen Ejecutivo',
        content: '# Resumen Ejecutivo\n\nEste informe presenta un análisis completo del mercado inmobiliario...',
        status: 'success'
      },
      {
        id: 'analisis_mercado',
        title: 'Análisis de Mercado',
        content: '# Análisis de Mercado\n\nEl mercado actual muestra tendencias positivas...',
        status: 'success'
      }
    ];

    setReports(mockReports);
    setShowResults(true);
  };

  const handleRunWorkflow = async () => {
    if (!project) return;

    setIsRunningWorkflow(true);
    setError(null);

    try {
      // TODO: Implementar llamada a API real
      console.log('Running workflow for project:', project.id);

      // Simulación de ejecución
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Actualizar el estado del proyecto
      setProject({
        ...project,
        status: 'in_progress' as any
      });

      // Simular que el workflow se completa después de un tiempo
      setTimeout(() => {
        setProject((prev: Project | null) => prev ? { ...prev, status: 'completed' as any } : null);
        loadReports(project.id);
      }, 3000);
    } catch (err) {
      setError(uiTexts.projectDetail.runAnalysisError);
      console.error('Error running workflow:', err);
    } finally {
      setIsRunningWorkflow(false);
    }
  };

  const handleEdit = () => {
    navigate(`/projects/${id}/edit`);
  };

  const handleDelete = async () => {
    if (!confirm(uiTexts.projectDetail.deleteConfirm)) {
      return;
    }

    try {
      // TODO: Implementar llamada a API real
      console.log('Deleting project:', id);

      // Simulación de eliminación
      await new Promise(resolve => setTimeout(resolve, 500));

      // Navegar a la página de proyectos
      navigate('/projects');
    } catch (err) {
      setError(uiTexts.projectDetail.deleteError);
      console.error('Error deleting project:', err);
    }
  };

  const handleBack = () => {
    navigate('/projects');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
          <span className="text-gray-500">{uiTexts.projectDetail.loading}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-800">{error}</p>
        <button
          onClick={handleBack}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          {uiTexts.projectDetail.backToProjects}
        </button>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <p className="text-gray-500">{uiTexts.projectDetail.notFound}</p>
        <button
          onClick={handleBack}
          className="mt-4 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors"
        >
          {uiTexts.projectDetail.backToProjects}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft size={20} />
        {uiTexts.projectDetail.backToProjects}
      </button>

      {/* Project Detail */}
      <ProjectDetail
        project={project}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRunWorkflow={handleRunWorkflow}
        isRunning={isRunningWorkflow}
      />

      {/* Results Viewer */}
      {showResults && reports.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Resultados del Análisis</h2>
          <ResultsViewer
            reports={reports}
            onRetry={(reportId) => console.log('Retry report:', reportId)}
          />
        </div>
      )}
    </div>
  );
}

export default ProjectDetailPage;
