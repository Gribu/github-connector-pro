import { useState, useEffect } from 'react';

interface DiagnosticData {
  email: string;
  claridad_direccion: number;
  dominio_emocional: number;
  energia_enfoque: number;
  autoliderazgo: number;
  influencia_comunicacion: number;
  conexion_proposito: number;
  area_mas_baja: string;
  entrenamientos_recomendados?: {
    nombre_entrenamiento: string;
    link_entrenamiento: string;
  };
}

export const useDiagnosticResults = (email: string | null, id: string | null, submissionId: string | null) => {
  const [data, setData] = useState<DiagnosticData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!email || !id || !submissionId) {
        setError('Parámetros de URL incompletos');
        setLoading(false);
        return;
      }

      try {
        // Simulated data for development - replace with actual API call
        const mockData: DiagnosticData = {
          email: email,
          claridad_direccion: Math.random() * 10,
          dominio_emocional: Math.random() * 10,
          energia_enfoque: Math.random() * 10,
          autoliderazgo: Math.random() * 10,
          influencia_comunicacion: Math.random() * 10,
          conexion_proposito: Math.random() * 10,
          area_mas_baja: 'dominio_emocional',
          entrenamientos_recomendados: {
            nombre_entrenamiento: 'Aprende a controlar lo que te frena',
            link_entrenamiento: 'https://entrenamiento.com/emociones'
          }
        };

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setData(mockData);
      } catch (err) {
        setError('Error al cargar los resultados del diagnóstico');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [email, id, submissionId]);

  return { data, loading, error };
};