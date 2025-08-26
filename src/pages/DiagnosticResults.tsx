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
      case "Dominio emocional en momentos críticos": return Target;
      case "Enfoque y energía personal": return TrendingUp;
      case "Liderazgo": return Award;
      case "Influencia y comunicación": return Users;
      case "Adaptabilidad y Cambio": return Brain;
      default: return Brain;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
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
        {data.model_response && (
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
                    <div className="whitespace-pre-wrap text-foreground leading-relaxed font-medium text-lg">
                      {data.model_response}
                    </div>
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
                      className="w-full bg-warning hover:bg-warning/90 text-primary font-bold text-lg py-4 h-auto transition-all duration-300 transform hover:scale-105 shadow-lg"
                      onClick={() => window.open(recommendedTraining.url, '_blank')}
                    >
                      🚀 Comenzar Mi Transformación
                      <ExternalLink className="ml-2 h-5 w-5" />
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