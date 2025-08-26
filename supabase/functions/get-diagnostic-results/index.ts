import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const url = new URL(req.url)
    let submissionId = url.searchParams.get('submission_id')
    if (!submissionId && req.method === 'POST') {
      try {
        const body = await req.json();
        submissionId = body?.submission_id ?? null;
      } catch (_) {}
    }

    console.log('Getting results for submissionId:', submissionId);

    // Validate input parameters
    if (!submissionId) {
      return new Response(
        JSON.stringify({ error: 'Submission ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get diagnostic results by submission_id
    const query = supabase
      .from('respuestas_diagnostico')
      .select('*')
      .eq('submission_id', submissionId);

    const { data: diagnosticResult, error: diagnosticError } = await query.maybeSingle()

    console.log('Diagnostic query result:', { data: diagnosticResult, error: diagnosticError });

    if (diagnosticError) {
      console.error('Diagnostic fetch error:', diagnosticError);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Database error',
          details: diagnosticError.message
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!diagnosticResult) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'No diagnostic results found for this submission ID'
        }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get training data if available
    let trainingData = null;
    if (diagnosticResult.id_entrenamiento) {
      const { data: training } = await supabase
        .from('entrenamientos_recomendados')
        .select('nombre_entrenamiento, link_entrenamiento')
        .eq('id', diagnosticResult.id_entrenamiento)
        .maybeSingle();
      
      trainingData = training;
    }

    // Return the data
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          email: diagnosticResult.email,
          claridad_direccion: diagnosticResult.claridad_direccion,
          dominio_emocional: diagnosticResult.dominio_emocional,
          energia_enfoque: diagnosticResult.energia_enfoque,
          autoliderazgo: diagnosticResult.autoliderazgo,
          influencia_comunicacion: diagnosticResult.influencia_comunicacion,
          cambio_adaptabilidad: diagnosticResult.cambio_adaptabilidad,
          area_mas_baja: diagnosticResult.area_mas_baja,
          model_response: diagnosticResult.model_response,
          entrenamientos_recomendados: trainingData ? trainingData : null
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Internal server error',
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})