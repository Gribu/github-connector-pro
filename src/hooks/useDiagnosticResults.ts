import { useState, useEffect } from 'react';

interface DiagnosticData {
  email: string;
  claridad_direccion: number;
  dominio_emocional: number;
  energia_enfoque: number;
  autoliderazgo: number;
  influencia_comunicacion: number;
  cambio_adaptabilidad: number;
  area_mas_baja: string;
  model_response?: string;
  entrenamientos_recomendados?: {
    nombre_entrenamiento: string;
    link_entrenamiento: string;
  };
}

export const useDiagnosticResults = (submissionId: string | null) => {
  const [data, setData] = useState<DiagnosticData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!submissionId) {
        setError('Submission ID requerido');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching diagnostic results for submissionId:', submissionId);
        
        // Fetch data from secure edge function
        const url = `https://gqqgaumrostovtwjghye.supabase.co/functions/v1/get-diagnostic-results?submission_id=${encodeURIComponent(submissionId)}`;
        
        console.log('Calling URL:', url);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Response error:', errorText);
          throw new Error('Error al obtener los resultados');
        }

        const result = await response.json();
        console.log('Response result:', result);
        
        if (!result.success) {
          console.error('Result error:', result.error);
          throw new Error(result.error || 'Error al cargar los datos');
        }

        console.log('Setting data:', result.data);
        setData(result.data);
      } catch (err) {
        console.error('Error fetching diagnostic results:', err);
        setError('Error al cargar los resultados del diagnóstico');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [submissionId]);

  return { data, loading, error };
};