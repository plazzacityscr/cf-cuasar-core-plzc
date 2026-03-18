import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ResultsViewer, Report } from '../components/results/ResultsViewer';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { uiTexts } from '../config/texts';

export function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        // TODO: Implementar llamada a API real
        console.log('Fetching reports for project:', id);

        // Simulación de carga
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Simulación de informes
        const mockReports: Report[] = [
          {
            id: 'resumen',
            title: 'Resumen Ejecutivo',
            content: '# Resumen Ejecutivo\n\nEste informe presenta un análisis completo del mercado inmobiliario residencial en la zona norte de la ciudad.\n\n## Puntos Clave\n\n- El mercado muestra una tendencia alcista sostenida\n- Los precios promedio han aumentado un 15% en el último año\n- La demanda de propiedades de 2-3 habitaciones es la más alta\n\n## Conclusiones\n\nEl mercado presenta oportunidades de inversión interesantes, especialmente en el segmento residencial de gama media.',
            status: 'success'
          },
          {
            id: 'analisis_mercado',
            title: 'Análisis de Mercado',
            content: '# Análisis de Mercado\n\n## Tendencias Actuales\n\nEl mercado inmobiliario actual se caracteriza por:\n\n1. **Aumento de precios**: Los precios han subido un 15% interanual\n2. **Alta demanda**: La demanda supera la oferta en un 20%\n3. **Baja disponibilidad**: Solo 3 meses de inventario disponible\n\n## Segmentos de Mercado\n\n| Segmento | Precio Promedio | Variación Anual |\n|----------|----------------|----------------|\n| Económico | $120,000 | +10% |\n| Medio | $250,000 | +15% |\n| Premium | $500,000 | +20% |\n\n## Proyecciones\n\nSe espera que el mercado continúe su tendencia alcista en los próximos 12 meses, con un crecimiento estimado del 8-12%.',
            status: 'success'
          },
          {
            id: 'tendencias',
            title: 'Tendencias',
            content: '# Tendencias del Mercado\n\n## Tendencias Emergentes\n\n1. **Propiedades sustentables**: Aumento del 30% en demanda\n2. **Trabajo remoto**: Mayor interés en zonas suburbanas\n3. **Espacios exteriores**: Prioridad para compradores millennials\n\n## Tendencias Tecnológicas\n\n- Tours virtuales: +50% de uso\n- Plataformas digitales: 70% de búsquedas iniciales\n- Smart home: Valor agregado del 5-10%',
            status: 'success'
          },
          {
            id: 'competencia',
            title: 'Análisis de Competencia',
            content: '# Análisis de Competencia\n\n## Principales Competidores\n\n1. **Desarrollador A** - 25% de cuota de mercado\n2. **Desarrollador B** - 20% de cuota de mercado\n3. **Desarrollador C** - 15% de cuota de mercado\n\n## Ventajas Competitivas\n\n- Ubicación estratégica\n- Calidad de construcción\n- Precios competitivos\n- Servicios post-venta',
            status: 'success'
          },
          {
            id: 'oportunidades',
            title: 'Oportunidades de Inversión',
            content: '# Oportunidades de Inversión\n\n## Zonas con Mayor Potencial\n\n1. **Zona Norte** - Crecimiento proyectado: 18%\n2. **Zona Este** - Crecimiento proyectado: 15%\n3. **Zona Oeste** - Crecimiento proyectado: 12%\n\n## Tipos de Propiedad Recomendados\n\n- Departamentos de 2 habitaciones\n- Casas con terreno\n- Propiedades cerca de transporte público',
            status: 'success'
          },
          {
            id: 'riesgos',
            title: 'Análisis de Riesgos',
            content: '# Análisis de Riesgos\n\n## Riesgos del Mercado\n\n1. **Volatilidad de precios**: Nivel medio\n2. **Cambios regulatorios**: Nivel bajo\n3. **Tasas de interés**: Nivel medio-alto\n\n## Mitigación de Riesgos\n\n- Diversificación de inversiones\n- Análisis continuo del mercado\n- Estrategias de salida claras',
            status: 'success'
          },
          {
            id: 'recomendaciones',
            title: 'Recomendaciones',
            content: '# Recomendaciones\n\n## Acciones Inmediatas\n\n1. Realizar visitas a propiedades en zona norte\n2. Analizar ofertas de desarrolladores líderes\n3. Evaluar financiamiento disponible\n\n## Estrategia de Inversión\n\n- Invertir el 60% en propiedades de gama media\n- Reservar 30% para oportunidades emergentes\n- Mantener 10% en liquidez',
            status: 'success'
          },
          {
            id: 'proyecciones',
            title: 'Proyecciones',
            content: '# Proyecciones del Mercado\n\n## Proyección a 12 Meses\n\n- Crecimiento de precios: 8-12%\n- Aumento de demanda: 10-15%\n- Nuevos desarrollos: +20%\n\n## Proyección a 24 Meses\n\n- Crecimiento de precios: 15-20%\n- Estabilización del mercado\n- Mayor oferta de propiedades',
            status: 'success'
          },
          {
            id: 'conclusiones',
            title: 'Conclusiones',
            content: '# Conclusiones\n\n## Resumen Ejecutivo\n\nEl mercado inmobiliario residencial presenta oportunidades de inversión atractivas, con una tendencia alcista sostenida y proyecciones positivas para los próximos 24 meses.\n\n## Próximos Pasos\n\n1. Definir presupuesto de inversión\n2. Seleccionar zona objetivo\n3. Iniciar búsqueda de propiedades\n4. Evaluar opciones de financiamiento',
            status: 'success'
          }
        ];

        setReports(mockReports);
      } catch (err) {
        setError(uiTexts.results.loadError);
        console.error('Error fetching reports:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [id]);

  const handleRetry = async (reportId: string) => {
    setIsRetrying(true);
    try {
      // TODO: Implementar llamada a API real
      console.log('Retrying report:', reportId);
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err) {
      console.error('Error retrying report:', err);
    } finally {
      setIsRetrying(false);
    }
  };

  const handleBack = () => {
    // TODO: Navegar a la página de detalles del proyecto
    console.log('Navigate back to project:', id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
          <span className="text-gray-500">{uiTexts.results.loading}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft size={20} />
          {uiTexts.buttons.back}
        </button>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors mb-4"
        >
          <ArrowLeft size={20} />
          {uiTexts.results.backToProject}
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{uiTexts.results.title}</h1>
        <p className="text-gray-500 mt-1">{uiTexts.results.subtitle}</p>
      </div>

      {/* Results Viewer */}
      <ResultsViewer
        reports={reports}
        onRetry={handleRetry}
        isRetrying={isRetrying}
      />
    </div>
  );
}

export default ResultsPage;
