import { useState, useEffect } from 'react';
import Button from '../components/ui/Button';
import { ProjectList } from '../components/projects/ProjectList';
import { Project, ProjectPagination, ProjectFilters } from '../types/project';
import { Plus, Grid, List } from 'lucide-react';
import { uiTexts } from '../config/texts';

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [pagination, setPagination] = useState<ProjectPagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [filters, setFilters] = useState<ProjectFilters>({});

  // TODO: Implementar llamada a API real
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        // Simulación de datos
        const mockProjects: Project[] = [
          {
            id: '1',
            name: 'Análisis de mercado residencial',
            description: 'Análisis completo del mercado inmobiliario residencial en la zona norte',
            status: 'pending' as any,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '2',
            name: 'Evaluación de propiedades comerciales',
            description: 'Evaluación de oportunidades en propiedades comerciales del centro',
            status: 'in_progress' as any,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            updatedAt: new Date(Date.now() - 86400000).toISOString()
          }
        ];

        setProjects(mockProjects);
        setPagination({
          page: 1,
          limit: 10,
          total: mockProjects.length,
          totalPages: 1
        });
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [filters]);

  const handleViewProject = (project: Project) => {
    // TODO: Navegar a la página de detalles
    console.log('View project:', project.id);
  };

  const handleEditProject = (project: Project) => {
    // TODO: Navegar a la página de edición
    console.log('Edit project:', project.id);
  };

  const handleDeleteProject = (project: Project) => {
    // TODO: Implementar eliminación
    console.log('Delete project:', project.id);
  };

  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, page });
  };

  const handleFilterChange = (newFilters: ProjectFilters) => {
    setFilters(newFilters);
    setPagination({ ...pagination, page: 1 });
  };

  const handleCreateProject = () => {
    // TODO: Navegar a la página de creación
    console.log('Create new project');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{uiTexts.projects.title}</h1>
          <p className="text-gray-500 mt-1">{uiTexts.projects.subtitle}</p>
        </div>
        <Button onClick={handleCreateProject}>
          <Plus size={20} className="mr-2" />
          {uiTexts.projects.newProject}
        </Button>
      </div>

      {/* View Toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setViewMode('list')}
          className={`p-2 rounded-lg transition-colors ${
            viewMode === 'list'
              ? 'bg-primary-100 text-primary-600'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
          title={uiTexts.projects.listView}
        >
          <List size={20} />
        </button>
        <button
          onClick={() => setViewMode('grid')}
          className={`p-2 rounded-lg transition-colors ${
            viewMode === 'grid'
              ? 'bg-primary-100 text-primary-600'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
          title={uiTexts.projects.gridView}
        >
          <Grid size={20} />
        </button>
      </div>

      {/* Project List */}
      <ProjectList
        projects={projects}
        pagination={pagination}
        loading={loading}
        onView={handleViewProject}
        onEdit={handleEditProject}
        onDelete={handleDeleteProject}
        onPageChange={handlePageChange}
        onFilterChange={handleFilterChange}
      />
    </div>
  );
}

export default ProjectsPage;
