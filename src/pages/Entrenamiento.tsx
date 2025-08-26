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

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Entrenamiento no encontrado</h1>
          <p className="text-muted-foreground">{error || "No se pudo cargar tu entrenamiento recomendado."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
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
            {data.nombre_entrenamiento}
          </h2>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-primary/10 mb-8">
            <p className="text-lg text-foreground leading-relaxed">
              {data.descripcion}
            </p>
          </div>

          {/* Training Video */}
          {data.link_entrenamiento && (
            <div className="mb-12">
              <div 
                dangerouslySetInnerHTML={{ __html: data.link_entrenamiento }}
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
          
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Agenda tu sesión con uno de nuestros coaches expertos y activa el entrenamiento que más impacto puede tener en tu mentalidad, tu dirección y tu negocio.
          </p>

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