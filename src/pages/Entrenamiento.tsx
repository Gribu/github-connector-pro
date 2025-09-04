import { useSearchParams } from "react-router-dom";
import { useTrainingData } from "@/hooks/useTrainingData";

const Entrenamiento = () => {
  const [searchParams] = useSearchParams();
  const submissionId = searchParams.get('submission_id');
  
  const { data, loading, error } = useTrainingData(submissionId);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando tu entrenamiento...</p>
        </div>
      </div>
    );
  }

  // Mock data for preview when no submission_id or error
  const mockData = {
    nombre_entrenamiento: "Por qué terminan las rachas ganadoras",
    descripcion: "Las rachas ganadoras terminan cuando perdemos la perspectiva de lo que realmente las creó. En este entrenamiento profundo, explorarás los mecanismos psicológicos que sostienen el éxito consistente y cómo mantener la mentalidad ganadora incluso en momentos de adversidad. Aprenderás a identificar las señales tempranas de declive en el rendimiento y desarrollarás estrategias concretas para renovar tu energía mental y emocional. Este no es solo un entrenamiento sobre ganar, sino sobre crear sistemas mentales que te permitan mantener la excelencia a largo plazo.",
    link_entrenamiento: `<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; background: #000;">
      <iframe 
        src="https://player.vimeo.com/video/sample" 
        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" 
        frameborder="0" 
        allow="autoplay; fullscreen; picture-in-picture" 
        allowfullscreen>
      </iframe>
    </div>`
  };

  const displayData = data || mockData;
  const isPreview = !data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Preview Banner */}
      {isPreview && (
        <div className="bg-warning/20 border-b border-warning/30 px-4 py-3">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm font-medium text-warning">
              ⚠️ Modo Preview: Este es contenido de ejemplo para visualización
            </p>
          </div>
        </div>
      )}
      {/* Header with Logo */}
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
            Tu Entrenamiento Recomendado
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-16">
        {/* Training Content */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8 text-center">
            {displayData.nombre_entrenamiento}
          </h2>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-primary/10 mb-8">
            <div 
              className="text-lg text-foreground leading-relaxed prose max-w-none"
              dangerouslySetInnerHTML={{ __html: displayData.descripcion }}
            />
          </div>

          {/* Training Video */}
          {displayData.link_entrenamiento && (
            <div className="mb-12">
              <div 
                dangerouslySetInnerHTML={{ __html: displayData.link_entrenamiento }}
                className="w-full"
              />
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-warning/10 via-warning/5 to-primary/10 rounded-xl p-8 border-2 border-warning/20 shadow-xl text-center">
          <p className="text-xl text-foreground mb-6 leading-relaxed font-medium">
            Sabes en qué necesitas trabajar. Lo que sigue es decidir cuándo empezar.
          </p>
          
          <h3 className="text-2xl font-bold text-foreground mb-8 leading-relaxed">
            Agenda tu Sesión con uno de nuestros Coaches Expertos
          </h3>

          {/* Booking Iframe */}
          <div className="max-w-full">
            <iframe 
              src="https://api.leadconnectorhq.com/widget/booking/PT33W3Ep8DQvuWlx6IRF" 
              style={{ width: '100%', border: 'none', overflow: 'hidden', minHeight: '600px' }}
              id="PT33W3Ep8DQvuWlx6IRF_1756238018120"
              className="rounded-lg"
            />
            <script src="https://link.msgsndr.com/js/form_embed.js" type="text/javascript"></script>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Entrenamiento;