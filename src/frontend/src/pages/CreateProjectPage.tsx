import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProjectForm } from '../components/projects/ProjectForm';
import { ProjectInput, ProjectUpdateInput } from '../types/project';
import { ArrowLeft } from 'lucide-react';
import { uiTexts } from '../config/texts';

export function CreateProjectPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: ProjectInput | ProjectUpdateInput) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // TODO: Implementar llamada a API real
      console.log('Creating project:', data);

      // Simulación de creación exitosa
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Navegar a la página de proyectos
      navigate('/projects');
    } catch (err) {
      setError(uiTexts.createProject.createError);
      console.error('Error creating project:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/projects');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleCancel}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          title={uiTexts.buttons.back}
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{uiTexts.createProject.title}</h1>
          <p className="text-gray-500 mt-1">{uiTexts.createProject.subtitle}</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <ProjectForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}

export default CreateProjectPage;
