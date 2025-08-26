import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

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
        console.log('Invoking edge function get-diagnostic-results with submissionId:', submissionId);
        const { data: result, error: fnError } = await supabase.functions.invoke('get-diagnostic-results', {
          body: { submission_id: submissionId }
        });

        if (fnError) {
          console.error('Edge function error:', fnError);
          throw new Error('Error al obtener los resultados');
        }

        console.log('Edge function result:', result);

        if (!result?.success) {
          console.error('Result error:', (result as any)?.error);
          throw new Error((result as any)?.error || 'Error al cargar los datos');
        }

        setData((result as any).data);
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
