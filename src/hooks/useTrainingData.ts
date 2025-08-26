import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface TrainingData {
  nombre_entrenamiento: string;
  descripcion: string;
}

export const useTrainingData = (submissionId: string | null) => {
  const [data, setData] = useState<TrainingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTraining = async () => {
      if (!submissionId) {
        setError('Submission ID requerido');
        setLoading(false);
        return;
      }

      try {
        // First get the diagnostic result to find the training ID
        const { data: diagnostic, error: diagnosticError } = await supabase
          .from('respuestas_diagnostico')
          .select('id_entrenamiento')
          .eq('submission_id', submissionId)
          .single();

        if (diagnosticError) {
          console.error('Error fetching diagnostic:', diagnosticError);
          throw new Error('Error al obtener el diagnóstico');
        }

        if (!diagnostic?.id_entrenamiento) {
          throw new Error('No se encontró entrenamiento asignado');
        }

        // Then get the training details using any type to bypass TypeScript issues
        const { data: training, error: trainingError } = await supabase
          .from('entrenamientos_recomendados')
          .select('nombre_entrenamiento, Descripcion')
          .eq('id', diagnostic.id_entrenamiento)
          .single();

        if (trainingError) {
          console.error('Error fetching training:', trainingError);
          throw new Error('Error al obtener el entrenamiento');
        }

        if (!training) {
          throw new Error('No se encontró el entrenamiento');
        }

        setData({
          nombre_entrenamiento: (training as any).nombre_entrenamiento,
          descripcion: (training as any).Descripcion || ''
        });
      } catch (err) {
        console.error('Error fetching training data:', err);
        setError('Error al cargar los datos del entrenamiento');
      } finally {
        setLoading(false);
      }
    };

    fetchTraining();
  }, [submissionId]);

  return { data, loading, error };
};