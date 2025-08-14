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
      if (!email || !submissionId) {
        setError('Parámetros de URL incompletos');
        setLoading(false);
        return;
      }

      try {
        // Fetch data from secure edge function
        const response = await fetch(
          `https://gqqgaumrostovtwjghye.supabase.co/functions/v1/get-diagnostic-results?email=${encodeURIComponent(email)}&submissionId=${encodeURIComponent(submissionId)}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );

        if (!response.ok) {
          throw new Error('Error al obtener los resultados');
        }

        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.error || 'Error al cargar los datos');
        }

        setData(result.data);
      } catch (err) {
        console.error('Error fetching diagnostic results:', err);
        setError('Error al cargar los resultados del diagnóstico');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [email, submissionId]);

  return { data, loading, error };
};