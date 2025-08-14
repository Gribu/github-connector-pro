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
    const email = url.searchParams.get('email')
    const submissionId = url.searchParams.get('submission_id')

    console.log('Getting results for:', { email, submissionId });

    // Validate input parameters
    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get diagnostic results - simple query first
    let query = supabase
      .from('respuestas_diagnostico')
      .select('*')
      .eq('email', email);

    if (submissionId) {
      query = query.eq('submission_id', submissionId);
    } else {
      query = query.order('fecha_respuesta', { ascending: false }).limit(1);
    }

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
          error: 'No diagnostic results found for this email'
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
          conexion_proposito: diagnosticResult.conexion_proposito,
          area_mas_baja: diagnosticResult.area_mas_baja,
          entrenamientos_recomendados: trainingData ? [trainingData] : []
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