import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";
import { ExternalLink, Brain, Target, Users, TrendingUp, Award } from "lucide-react";
import { useDiagnosticResults } from "@/hooks/useDiagnosticResults";
import optimusLogoBluePng from "@/assets/optimus-logo-blue.png";

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

  // Mock data for preview when no submission_id or error
  const mockData = {
    email: "preview@optimus.com",
    claridad_direccion: 7.5,
    dominio_emocional: 6.2,
    energia_enfoque: 8.1,
    autoliderazgo: 5.8,
    influencia_comunicacion: 7.9,
    cambio_adaptabilidad: 6.7,
    area_mas_baja: "autoliderazgo",
    model_response: "Basado en tu diagnóstico, muestras una fortaleza notable en Energía y Enfoque, lo que indica una excelente capacidad para mantener la concentración y dirigir tu energía hacia objetivos específicos. Sin embargo, tu área de mayor oportunidad está en el Autoliderazgo, donde desarrollar una mayor conciencia de tus patrones de pensamiento y comportamiento te permitirá liderar con mayor autenticidad y efectividad. Te recomendamos enfocarte en prácticas de autoconocimiento y desarrollo de la inteligencia emocional para fortalecer esta dimensión fundamental del liderazgo mental.",
    entrenamientos_recomendados: {
      nombre_entrenamiento: "Por qué terminan las rachas ganadoras",
      link_entrenamiento: "https://entrenamiento.com/rachas"
    }
  };

  const displayData = data || mockData;
  const isPreview = !data;

  const radarData = [
    {
      area: "Visión y Claridad",
      value: displayData.claridad_direccion,
      fullValue: 10
    },
    {
      area: "Manejo de la Presión y del Estrés", 
      value: displayData.dominio_emocional,
      fullValue: 10
    },
    {
      area: "Energía y Enfoque",
      value: displayData.energia_enfoque,
      fullValue: 10
    },
    {
      area: "Liderazgo",
      value: displayData.autoliderazgo,
      fullValue: 10
    },
    {
      area: "Influencia y Comunicación",
      value: displayData.influencia_comunicacion,
      fullValue: 10
    },
    {
      area: "Adaptabilidad y Cambio",
      value: displayData.cambio_adaptabilidad,
      fullValue: 10
    }
  ];

  const pillars = [
    { name: "Visión y Claridad", score: displayData.claridad_direccion, key: "claridad_direccion" },
    { name: "Manejo de la Presión y del Estrés", score: displayData.dominio_emocional, key: "dominio_emocional" },
    { name: "Enfoque y Energía", score: displayData.energia_enfoque, key: "energia_enfoque" },
    { name: "Liderazgo", score: displayData.autoliderazgo, key: "autoliderazgo" },
    { name: "Influencia y comunicación", score: displayData.influencia_comunicacion, key: "influencia_comunicacion" },
    { name: "Adaptabilidad y Cambio", score: displayData.cambio_adaptabilidad, key: "cambio_adaptabilidad" }
  ];

  const averageScore = pillars.reduce((sum, pillar) => sum + pillar.score, 0) / pillars.length;
  const weakestPillar = pillars.find(pillar => pillar.key === displayData.area_mas_baja) || pillars.reduce((min, pillar) => pillar.score < min.score ? pillar : min);
  
  // Use the training from database if available, otherwise fallback to hardcoded
  const recommendedTraining = displayData.entrenamientos_recomendados ? {
    title: displayData.entrenamientos_recomendados.nombre_entrenamiento,
    url: displayData.entrenamientos_recomendados.link_entrenamiento
  } : trainingLinks[weakestPillar.name as keyof typeof trainingLinks];

  const getZoneInfo = (score: number) => {
    if (score >= 7) return { 
      zone: "Zona Óptima", 
      color: "text-secondary", 
      bgColor: "bg-secondary/10",
      icon: Award
    };
    if (score >= 4) return { 
      zone: "Zona de Mejora", 
      color: "text-warning", 
      bgColor: "bg-warning/10",
      icon: TrendingUp
    };
    return { 
      zone: "Zona Crítica", 
      color: "text-destructive", 
      bgColor: "bg-destructive/10",
      icon: Target
    };
  };

  const getPillarIcon = (pillarName: string) => {
    switch (pillarName) {
      case "Visión y Claridad": return Brain;
      case "Manejo de la Presión y del Estrés": return Target;
      case "Enfoque y energía personal": return TrendingUp;
      case "Liderazgo": return Award;
      case "Influencia y comunicación": return Users;
      case "Adaptabilidad y Cambio": return Brain;
      default: return Brain;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Preview Banner */}
      {isPreview && (
        <div className="bg-warning/20 border-b border-warning/30 px-4 py-3">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-sm font-medium text-warning">
              ⚠️ Modo Preview: Estos son datos de ejemplo para visualización
            </p>
          </div>
        </div>
      )}
      {/* Hero Header with Logo */}
      <div className="bg-primary text-white py-16 px-4 mb-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <img 
              src="/lovable-uploads/b4013c2e-b832-4574-be32-050289f8d891.png" 
              alt="OPTIMUS - El Software para tu Mente" 
              className="h-16 w-auto"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            ¡Felicidades por completar tu<br />
            <span className="text-secondary">Diagnóstico de Liderazgo Mental!</span>
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Hemos evaluado tus respuestas en los 6 pilares fundamentales del liderazgo mental.
            Tu transformación comienza ahora.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-16">
        {/* Overall Score Card */}
        <Card className="max-w-2xl mx-auto mb-16 bg-gradient-to-br from-white to-secondary/5 border-2 border-secondary/20 shadow-xl">
          <CardContent className="pt-8 pb-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Award className="h-12 w-12 text-warning" />
              </div>
              <p className="text-sm font-semibold text-primary mb-4 uppercase tracking-wider">
                Tu Puntaje de Liderazgo Mental
              </p>
              <div className="text-7xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
                {Math.round(averageScore * 10)}%
              </div>
              <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full ${getZoneInfo(averageScore).bgColor} border-2 border-current/20`}>
                {(() => {
                  const ZoneIcon = getZoneInfo(averageScore).icon;
                  return <ZoneIcon className="h-5 w-5" />;
                })()}
                <span className={`text-lg font-semibold ${getZoneInfo(averageScore).color}`}>
                  {getZoneInfo(averageScore).zone}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Radar Chart Section */}
        <Card className="mb-16 bg-gradient-to-br from-white via-white to-accent/5 border-2 border-accent/20 shadow-lg">
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center mb-4">
              <Brain className="h-10 w-10 text-accent" />
            </div>
            <CardTitle className="text-3xl font-bold text-primary mb-2">
              Tu Perfil de Liderazgo Mental
            </CardTitle>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Visualiza tu fortaleza en cada uno de los 6 pilares fundamentales del liderazgo mental
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[500px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} margin={{ top: 40, right: 80, bottom: 40, left: 80 }}>
                  <PolarGrid 
                    stroke="hsl(var(--border))"
                    strokeWidth={1}
                  />
                  <PolarAngleAxis 
                    dataKey="area" 
                    className="text-sm font-medium"
                    tick={{ 
                      fontSize: 13, 
                      fill: 'hsl(var(--primary))',
                      fontWeight: 500
                    }}
                  />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 10]} 
                    className="text-xs"
                    tick={{ 
                      fontSize: 11, 
                      fill: 'hsl(var(--muted-foreground))'
                    }}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Radar
                    name="Tu Puntaje"
                    dataKey="value"
                    stroke="hsl(var(--secondary))"
                    fill="hsl(var(--secondary))"
                    fillOpacity={0.15}
                    strokeWidth={3}
                    dot={{ 
                      fill: 'hsl(var(--warning))', 
                      strokeWidth: 3, 
                      stroke: 'hsl(var(--primary))',
                      r: 6 
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Individual Scores Grid */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Análisis Detallado por Pilares</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Explora tu puntuación individual en cada uno de los pilares del liderazgo mental
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pillars.map((pillar) => {
              const zoneInfo = getZoneInfo(pillar.score);
              const isWeakest = pillar.name === weakestPillar.name;
              const PillarIcon = getPillarIcon(pillar.name);
              
              return (
                <Card key={pillar.key} className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                  isWeakest 
                    ? 'ring-2 ring-warning bg-gradient-to-br from-warning/5 to-warning/10 border-warning/30' 
                    : 'bg-gradient-to-br from-white to-primary/5 border-primary/20'
                }`}>
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-3 rounded-lg ${isWeakest ? 'bg-warning/20' : 'bg-primary/10'}`}>
                        <PillarIcon className={`h-6 w-6 ${isWeakest ? 'text-warning' : 'text-primary'}`} />
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${zoneInfo.bgColor} ${zoneInfo.color} border border-current/20`}>
                        {zoneInfo.zone}
                      </div>
                    </div>
                    <CardTitle className="text-lg leading-tight text-primary">
                      {pillar.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-4xl font-bold ${isWeakest ? 'text-warning' : 'text-primary'}`}>
                        {Math.round(pillar.score * 10)}%
                      </span>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-6 rounded-full ${
                              i < (pillar.score * 5) / 10 
                                ? (isWeakest ? 'bg-warning' : 'bg-primary') 
                                : 'bg-muted'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    {isWeakest && (
                      <div className="mt-4 p-4 bg-gradient-to-r from-warning/10 to-warning/5 rounded-lg border-l-4 border-warning">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="h-4 w-4 text-warning" />
                          <p className="text-sm text-warning font-semibold">
                            Área Prioritaria
                          </p>
                        </div>
                        <p className="text-xs text-warning/80">
                          Este es tu mayor punto de mejora. Te recomendamos enfocar tu desarrollo en esta área.
                        </p>
                      </div>
                    )}
                  </CardContent>
                  
                  {isWeakest && (
                    <div className="absolute top-4 right-4">
                      <div className="w-3 h-3 bg-warning rounded-full animate-pulse" />
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>

        {/* AI Analysis Section */}
        {displayData.model_response && (
          <Card className="mb-16 bg-gradient-to-br from-accent/5 via-white to-accent/10 border-2 border-accent/20 shadow-lg">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <Brain className="h-10 w-10 text-accent" />
              </div>
              <CardTitle className="text-3xl font-bold text-primary mb-2">
                Tu Análisis Personalizado
              </CardTitle>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Insights generados específicamente para tu perfil de liderazgo mental
              </p>
            </CardHeader>
            <CardContent>
              <div className="max-w-4xl mx-auto">
                <div className="bg-white/50 backdrop-blur-sm p-8 rounded-xl border border-accent/20">
                  <div className="prose prose-lg max-w-none">
                    <div 
                      className="text-foreground leading-relaxed font-medium text-lg space-y-4"
                      dangerouslySetInnerHTML={{ __html: displayData.model_response }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recommendation Section */}
        <Card className="bg-gradient-to-br from-warning/10 via-warning/5 to-primary/10 border-2 border-warning/30 shadow-xl">
          <CardContent className="pt-8 pb-8">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <Target className="h-16 w-16 text-warning" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-warning rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">!</span>
                  </div>
                </div>
              </div>
              
              <h2 className="text-4xl font-bold text-primary mb-6">
                Tu Próximo Paso hacia la <span className="text-warning">Excelencia</span>
              </h2>
              
              <div className="max-w-3xl mx-auto mb-8">
                <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-warning/20 mb-6">
                  <p className="text-lg text-foreground mb-4 leading-relaxed">
                    Tu área con mayor oportunidad de mejora es{" "}
                    <span className="font-bold text-warning">{weakestPillar.name}</span>.
                  </p>
                  <p className="text-base text-muted-foreground">
                    Este pilar es fundamental para lograr la transformación que deseas como líder.
                    Hemos seleccionado el entrenamiento perfecto para acelerar tu desarrollo.
                  </p>
                </div>
              </div>
              
              <div className="max-w-lg mx-auto">
                <Card className="bg-gradient-to-br from-primary to-accent border-2 border-primary/30 shadow-2xl overflow-hidden">
                  <CardContent className="pt-8 pb-8 text-white">
                    <div className="flex justify-center mb-4">
                      <Award className="h-12 w-12 text-warning" />
                    </div>
                    <h3 className="text-2xl font-bold mb-6 text-white">
                      {recommendedTraining.title}
                    </h3>
                    <Button 
                      size="lg" 
                      className="w-full bg-warning hover:bg-warning/90 text-primary font-bold text-base sm:text-lg py-4 px-4 h-auto transition-all duration-300 transform hover:scale-105 shadow-lg whitespace-nowrap overflow-hidden text-ellipsis"
                      onClick={() => window.location.href = `/entrenamiento?submission_id=${submissionId}`}
                    >
                      IR A MI ENTRENAMIENTO 🚀
                    </Button>
                    <p className="text-white/80 text-sm mt-4">
                      ✨ Diseñado específicamente para tu perfil
                    </p>
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