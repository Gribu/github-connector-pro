import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";
import { ExternalLink } from "lucide-react";
import { useDiagnosticResults } from "@/hooks/useDiagnosticResults";

const DiagnosticResults = () => {
  const [searchParams] = useSearchParams();
  const submissionId = searchParams.get('submission_id');
  
  const { data, loading, error } = useDiagnosticResults(submissionId);

  const trainingLinks = {
    "Visión y Claridad": {
      title: "Cómo mantener el enfoque correcto",
      url: "https://entrenamiento.com/enfoque"
    },
    "Dominio emocional en momentos críticos": {
      title: "Aprende a controlar lo que te frena", 
      url: "https://entrenamiento.com/emociones"
    },
    "Enfoque y energía personal": {
      title: "Sálvate de la procrastinación",
      url: "https://entrenamiento.com/procrastinacion"
    },
    "Liderazgo": {
      title: "Por qué terminan las rachas ganadoras",
      url: "https://entrenamiento.com/rachas"
    },
    "Influencia y comunicación": {
      title: "La crítica en equipos / Arte de convencer",
      url: "https://entrenamiento.com/comunicacion"
    },
    "Adaptabilidad y Cambio": {
      title: "No puedes cambiar lo que no eres consciente",
      url: "https://entrenamiento.com/proposito"
    },
    "Apertura al cambio profundo": {
      title: "La estrategia del camaleón",
      url: "https://entrenamiento.com/cambio"
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando tus resultados...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Resultados no encontrados</h1>
          <p className="text-muted-foreground">{error || "No se pudieron cargar tus resultados del diagnóstico."}</p>
        </div>
      </div>
    );
  }

  const radarData = [
    {
      area: "Visión y Claridad",
      value: data.claridad_direccion,
      fullValue: 10
    },
    {
      area: "Manejo de la Presión y del Estrés", 
      value: data.dominio_emocional,
      fullValue: 10
    },
    {
      area: "Energía y Enfoque",
      value: data.energia_enfoque,
      fullValue: 10
    },
    {
      area: "Liderazgo",
      value: data.autoliderazgo,
      fullValue: 10
    },
    {
      area: "Influencia",
      value: data.influencia_comunicacion,
      fullValue: 10
    },
    {
      area: "Adaptabilidad y Cambio",
      value: data.cambio_adaptabilidad,
      fullValue: 10
    }
  ];

  const pillars = [
    { name: "Visión y Claridad", score: data.claridad_direccion, key: "claridad_direccion" },
    { name: "Dominio emocional en momentos críticos", score: data.dominio_emocional, key: "dominio_emocional" },
    { name: "Enfoque y energía personal", score: data.energia_enfoque, key: "energia_enfoque" },
    { name: "Liderazgo", score: data.autoliderazgo, key: "autoliderazgo" },
    { name: "Influencia y comunicación", score: data.influencia_comunicacion, key: "influencia_comunicacion" },
    { name: "Adaptabilidad y Cambio", score: data.cambio_adaptabilidad, key: "cambio_adaptabilidad" }
  ];

  const averageScore = pillars.reduce((sum, pillar) => sum + pillar.score, 0) / pillars.length;
  const weakestPillar = pillars.find(pillar => pillar.key === data.area_mas_baja) || pillars.reduce((min, pillar) => pillar.score < min.score ? pillar : min);
  
  // Use the training from database if available, otherwise fallback to hardcoded
  const recommendedTraining = data.entrenamientos_recomendados ? {
    title: data.entrenamientos_recomendados.nombre_entrenamiento,
    url: data.entrenamientos_recomendados.link_entrenamiento
  } : trainingLinks[weakestPillar.name as keyof typeof trainingLinks];

  const getZoneInfo = (score: number) => {
    if (score >= 7) return { zone: "Zona Óptima", color: "text-green-600", bgColor: "bg-green-50" };
    if (score >= 4) return { zone: "Zona de Mejora", color: "text-orange-600", bgColor: "bg-orange-50" };
    return { zone: "Zona Crítica", color: "text-red-600", bgColor: "bg-red-50" };
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            ¡Felicidades por completar el Diagnóstico de Liderazgo Mental!
          </h1>
          <p className="text-muted-foreground mb-6">
             Hemos evaluado tus respuestas en los 6 pilares fundamentales y calculado 
             tu puntaje total de "Liderazgo Mental" así como tu puntuación individual por área.
           </p>
          
          {/* Overall Score Card */}
          <Card className="max-w-md mx-auto mb-8">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">PUNTAJE GENERAL DE LIDERAZGO MENTAL</p>
                <div className="text-6xl font-bold text-primary mb-2">
                  {Math.round(averageScore * 10)}%
                </div>
                <div className={`inline-block px-4 py-2 rounded-full ${getZoneInfo(averageScore).bgColor}`}>
                  <span className={`font-semibold ${getZoneInfo(averageScore).color}`}>
                    {getZoneInfo(averageScore).zone}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Radar Chart Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Resultados de tu Liderazgo Mental
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis 
                    dataKey="area" 
                    className="text-sm"
                    tick={{ fontSize: 12 }}
                  />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 10]} 
                    className="text-xs"
                    tick={{ fontSize: 10 }}
                  />
                  <Radar
                    name="Puntaje"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Individual Scores Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {pillars.map((pillar) => {
            const zoneInfo = getZoneInfo(pillar.score);
            const isWeakest = pillar.name === weakestPillar.name;
            
            return (
              <Card key={pillar.key} className={`${isWeakest ? 'ring-2 ring-red-500' : ''}`}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg leading-tight">
                    {pillar.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold">
                      {Math.round(pillar.score * 10)}%
                    </span>
                    <div className={`px-3 py-1 rounded-full ${zoneInfo.bgColor}`}>
                      <span className={`text-sm font-medium ${zoneInfo.color}`}>
                        {zoneInfo.zone}
                      </span>
                    </div>
                  </div>
                  {isWeakest && (
                    <div className="mt-3 p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                      <p className="text-sm text-red-700 font-medium">
                        Área con mayor oportunidad de mejora
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* AI Analysis Section */}
        {data.model_response && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-center text-2xl">
                Análisis Personalizado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-lg max-w-none">
                <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                  {data.model_response}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recommendation Section */}
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Tu Entrenamiento Recomendado</h2>
              <p className="text-lg mb-6">
                Tu área con mayor oportunidad de mejora es <strong>{weakestPillar.name}</strong>.
                Este pilar es fundamental para lograr la transformación que deseas como líder.
                Te recomendamos iniciar con este entrenamiento específico:
              </p>
              
              <div className="max-w-md mx-auto">
                <Card className="mb-6">
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-semibold mb-4">
                      {recommendedTraining.title}
                    </h3>
                    <Button 
                      size="lg" 
                      className="w-full"
                      onClick={() => window.open(recommendedTraining.url, '_blank')}
                    >
                      Ver Entrenamiento
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DiagnosticResults;