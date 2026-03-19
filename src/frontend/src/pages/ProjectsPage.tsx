import { useState, useEffect } from 'react';
import { uiTexts } from '../config/texts';

export function ProjectsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulación de carga
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">{uiTexts.projects.title}</h1>
      <p className="text-gray-500 mt-1">{uiTexts.projects.subtitle}</p>
      <div className="p-4 bg-white rounded-lg border">
        <p>Proyectos (próximamente)</p>
      </div>
    </div>
  );
}

export default ProjectsPage;
