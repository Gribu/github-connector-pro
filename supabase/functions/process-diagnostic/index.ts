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

    const { 
      nombre, email, telefono, claridad_direccion, dominio_emocional,
      energia_enfoque, autoliderazgo, influencia_comunicacion, conexion_proposito
    } = await req.json()

    console.log('Received diagnostic data:', { nombre, email, telefono });

    // Enhanced input validation
    if (!nombre || !email || 
        claridad_direccion === undefined || dominio_emocional === undefined ||
        energia_enfoque === undefined || autoliderazgo === undefined ||
        influencia_comunicacion === undefined || conexion_proposito === undefined) {
      throw new Error('Missing required fields')
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format')
    }

    // Validate phone format if provided
    if (telefono && !/^[\d\s\-\+\(\)]+$/.test(telefono)) {
      throw new Error('Invalid phone format')
    }

    // Validate score ranges (assuming 0-10 scale)
    const scoreValues = [claridad_direccion, dominio_emocional, energia_enfoque, 
                        autoliderazgo, influencia_comunicacion, conexion_proposito]
    if (scoreValues.some(score => isNaN(Number(score)) || Number(score) < 0 || Number(score) > 10)) {
      throw new Error('Invalid score values. Scores must be between 0 and 10')
    }

    const scores = {
      claridad_direccion: Number(claridad_direccion),
      dominio_emocional: Number(dominio_emocional),
      energia_enfoque: Number(energia_enfoque),
      autoliderazgo: Number(autoliderazgo),
      influencia_comunicacion: Number(influencia_comunicacion),
      conexion_proposito: Number(conexion_proposito)
    }

    console.log('Calculated scores:', scores);

    const lowestScore = Math.min(...Object.values(scores))
    const areaWithLowestScore = Object.keys(scores).find(key => 
      scores[key as keyof typeof scores] === lowestScore
    ) as string

    console.log('Area with lowest score:', areaWithLowestScore);

    const { data: training, error: trainingError } = await supabase
      .from('entrenamientos_recomendados')
      .select('*')
      .eq('area', areaWithLowestScore)
      .single()

    if (trainingError || !training) {
      console.error('Training error:', trainingError);
      throw new Error(`No training found for area: ${areaWithLowestScore}`)
    }

    console.log('Found training:', training);

    // Generate secure submission ID
    const submissionId = crypto.randomUUID()

    const { data: insertedRecord, error: insertError } = await supabase
      .from('respuestas_diagnostico')
      .insert({
        nombre: nombre.trim(), 
        email: email.toLowerCase().trim(), 
        telefono: telefono?.trim() || null,
        submission_id: submissionId,
        claridad_direccion: scores.claridad_direccion,
        dominio_emocional: scores.dominio_emocional,
        energia_enfoque: scores.energia_enfoque,
        autoliderazgo: scores.autoliderazgo,
        influencia_comunicacion: scores.influencia_comunicacion,
        conexion_proposito: scores.conexion_proposito,
        area_mas_baja: areaWithLowestScore,
        id_entrenamiento: training.id
      })
      .select()
      .single()

    if (insertError) {
      console.error('Insert error:', insertError);
      throw insertError
    }

    console.log('Inserted record:', insertedRecord);

    return new Response(
      JSON.stringify({ 
        success: true, 
        recordId: insertedRecord.id,
        resultsUrl: `${Deno.env.get('SITE_URL') || 'https://your-site.lovable.app'}/resultados?email=${encodeURIComponent(insertedRecord.email)}&submissionId=${encodeURIComponent(submissionId)}`,
        areaToImprove: areaWithLowestScore,
        recommendedTraining: training.nombre_entrenamiento
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})