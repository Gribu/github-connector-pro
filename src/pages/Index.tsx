import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { 
  Eye, 
  Heart, 
  Zap, 
  Settings, 
  Megaphone, 
  Star,
  ArrowDown,
  ChevronDown
} from "lucide-react";
import ExampleRadarChart from "@/components/ExampleRadarChart";
import { supabase } from "@/integrations/supabase/client";

// Function to get user's country using IP geolocation
const getUserCountry = async (): Promise<string> => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return data.country_name || 'Unknown';
  } catch (error) {
    console.error('Error getting user country:', error);
    return 'Unknown';
  }
};

// Function to get ref_id from URL parameters
const getRefIdFromUrl = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  const refId = urlParams.get('ref_id');
  console.log('Current URL:', window.location.href);
  console.log('URL params:', window.location.search);
  console.log('Extracted ref_id:', refId);
  return refId;
};

// Function to send webhook via Supabase Edge Function (avoids CORS)
const sendWebhook = async (country: string, refId: string | null) => {
  const webhookData = {
    country,
    ref_id: refId,
    timestamp: new Date().toISOString(),
    url: window.location.href,
  };

  const maxAttempts = 3;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`Sending webhook (attempt ${attempt}):`, webhookData);
      const { data, error } = await supabase.functions.invoke('forward-webhook', {
        body: webhookData,
      });

      if (error) throw error;
      if (data?.success !== true) {
        throw new Error(`Edge function responded with failure: ${JSON.stringify(data)}`);
      }

      console.log('Webhook sent successfully via edge function:', data);
      return;
    } catch (err) {
      console.error(`Webhook attempt ${attempt} failed:`, err);
      if (attempt < maxAttempts) {
        await new Promise((res) => setTimeout(res, attempt * 1000));
        continue;
      }
      break;
    }
  }
};

const Index = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  useEffect(() => {
    // Send webhook on page load
    const sendVisitWebhook = async () => {
      const country = await getUserCountry();
      const refId = getRefIdFromUrl();
      await sendWebhook(country, refId);
    };

    sendVisitWebhook();

    // Cargar script de Tally
    const script = document.createElement('script');
    script.innerHTML = `
      var d=document,w="https://tally.so/widgets/embed.js",v=function(){"undefined"!=typeof Tally?Tally.loadEmbeds():d.querySelectorAll("iframe[data-tally-src]:not([src])").forEach((function(e){e.src=e.dataset.tallySrc}))};if("undefined"!=typeof Tally)v();else if(d.querySelector('script[src="'+w+'"]')==null){var s=d.createElement("script");s.src=w,s.onload=v,s.onerror=v,d.body.appendChild(s);}
    `;
    document.body.appendChild(script);
  }, []);

  const openDiagnosticForm = () => {
    setIsDialogOpen(true);
  };

  const pillars = [
    {
      title: "Claridad mental y dirección",
      description: "Foco, visión clara y orientación hacia objetivos específicos",
      icon: Eye
    },
    {
      title: "Dominio emocional",
      description: "Autogestión emocional y resiliencia en momentos críticos",
      icon: Heart
    },
    {
      title: "Energía y enfoque personal",
      description: "Vitalidad constante y productividad sostenida",
      icon: Zap
    },
    {
      title: "Autoliderazgo y hábitos mentales",
      description: "Disciplina personal y patrones de pensamiento efectivos",
      icon: Settings
    },
    {
      title: "Influencia y comunicación",
      description: "Capacidad de impacto y liderazgo comunicacional",
      icon: Megaphone
    },
    {
      title: "Conexión con propósito",
      description: "Sentido trascendente y alineación con valores profundos",
      icon: Star
    }
  ];

  return (
    <div className="min-h-screen bg-background font-poppins">
      {/* Header con Logo */}
      <header className="absolute top-0 left-0 w-full py-6 px-8 z-10">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/b4013c2e-b832-4574-be32-050289f8d891.png" 
            alt="OPTIMUS - El Software para tu Mente" 
            className="h-16 w-auto"
          />
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 md:pt-28 lg:pt-0" style={{background: 'var(--gradient-hero)'}}>
        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-20 h-20 bg-warning/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-32 left-16 w-32 h-32 bg-secondary/30 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-accent/20 rounded-full"></div>
        <div className="absolute bottom-20 right-32 w-8 h-8 bg-warning rotate-45"></div>
        
        <div className="container mx-auto px-8 max-w-7xl">
          {/* Mobile Layout */}
          <div className="block lg:hidden text-center">
            <h1 className="text-4xl md:text-5xl font-montserrat font-bold text-white mb-6 leading-tight">
              ¿Qué está frenando tu 
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-warning to-secondary">
                crecimiento
              </span>
              como emprendedor?
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 font-poppins font-light leading-relaxed">
              Descubre tu pilar más débil y accede a un entrenamiento gratuito para fortalecerlo.
            </p>
            <Button 
              data-tally-open="mV6oJa" 
              data-tally-emoji-text="👋" 
              data-tally-emoji-animation="wave"
              size="lg"
              className="bg-warning hover:bg-warning/90 text-warning-foreground font-montserrat font-bold px-10 py-6 text-lg rounded-full shadow-2xl hover:shadow-warning/25 transition-all duration-300 transform hover:scale-105 mb-8"
            >
              Hacer mi diagnóstico
              <ArrowDown className="ml-3 h-6 w-6" />
            </Button>
            
            {/* Chart for mobile */}
            <div className="relative flex justify-center mb-8">
              <div className="w-80 h-80 bg-white/10 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center border border-white/20 p-6">
                <div className="w-full h-64 mb-4">
                  <ExampleRadarChart />
                </div>
                <p className="text-white/90 font-roboto text-sm text-center">
                  Ejemplo de tu diagnóstico personalizado
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="text-left lg:pr-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-montserrat font-bold text-white mb-6 leading-tight">
                ¿Qué está frenando tu 
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-warning to-secondary">
                  crecimiento
                </span>
                como emprendedor?
              </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-8 font-poppins font-light leading-relaxed">
              Descubre tu pilar más débil y accede a un entrenamiento gratuito para fortalecerlo.
            </p>
            <Button 
              data-tally-open="mV6oJa" 
              data-tally-emoji-text="👋" 
              data-tally-emoji-animation="wave"
              size="lg"
              className="bg-warning hover:bg-warning/90 text-warning-foreground font-montserrat font-bold px-10 py-6 text-lg rounded-full shadow-2xl hover:shadow-warning/25 transition-all duration-300 transform hover:scale-105"
            >
              Hacer mi diagnóstico
              <ArrowDown className="ml-3 h-6 w-6" />
            </Button>
            </div>

            {/* Right Column - Visual Element */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative">
                {/* Radar Chart Example */}
                <div className="w-80 h-80 lg:w-96 lg:h-96 bg-white/10 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center border border-white/20 p-6">
                  <div className="w-full h-64 mb-4">
                    <ExampleRadarChart />
                  </div>
                  <p className="text-white/90 font-roboto text-sm text-center">
                    Ejemplo de tu diagnóstico personalizado
                  </p>
                </div>
                
                {/* Floating Pill Elements */}
                <div className="absolute -top-4 -left-4 bg-secondary text-secondary-foreground px-4 py-2 rounded-full text-sm font-semibold font-poppins">
                  Claridad Mental
                </div>
                <div className="absolute top-4 -right-12 bg-accent text-accent-foreground px-3 py-1.5 rounded-full text-xs font-semibold font-poppins">
                  Energía Personal
                </div>
                <div className="absolute -bottom-4 left-8 bg-warning text-warning-foreground px-4 py-2 rounded-full text-sm font-semibold font-poppins">
                  Dominio Emocional
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce">
          <ChevronDown className="h-8 w-8" />
        </div>
      </section>

      {/* Sección de Pilares */}
      <section className="py-12 px-4" style={{background: 'var(--gradient-card)'}}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-montserrat font-bold text-foreground mb-6">
              Evalúa estos 6 pilares internos
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto font-poppins leading-relaxed">
              Cada pilar es fundamental para tu éxito como emprendedor. Identifica cuál necesitas fortalecer primero.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pillars.map((pillar, index) => {
              const IconComponent = pillar.icon;
              const colors = [
                'from-primary to-accent',
                'from-secondary to-accent', 
                'from-accent to-warning',
                'from-warning to-secondary',
                'from-secondary to-primary',
                'from-accent to-primary'
              ];
              return (
                <Card key={index} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-8 text-center">
                    <div className="mb-6 flex justify-center">
                      <div className={`w-20 h-20 bg-gradient-to-br ${colors[index]} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <IconComponent className="h-10 w-10 text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl font-montserrat font-bold text-foreground mb-4 leading-tight">
                      {pillar.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed font-poppins">
                      {pillar.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Promesa Pre-Formulario */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="max-w-5xl mx-auto text-center">
          <div className="bg-white/70 backdrop-blur-lg border border-white/30 rounded-3xl p-10 shadow-2xl">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-warning to-secondary rounded-full flex items-center justify-center">
                <Star className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl md:text-3xl font-montserrat font-bold text-foreground mb-6">
              En menos de 5 minutos conocerás tu transformación
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed font-poppins max-w-3xl mx-auto">
              Tu puntaje por pilar, tu área más débil y acceso a un entrenamiento personalizado para empezar a transformarte.
            </p>
            <div className="mt-8 flex justify-center">
              <Button 
                data-tally-open="mV6oJa" 
                data-tally-emoji-text="👋" 
                data-tally-emoji-animation="wave"
                size="lg"
                className="bg-warning hover:bg-warning/90 text-warning-foreground font-montserrat font-bold px-10 py-6 text-lg rounded-full shadow-2xl hover:shadow-warning/25 transition-all duration-300 transform hover:scale-105"
              >
                Hacer mi diagnóstico
                <ArrowDown className="ml-3 h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Formulario Popup */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-montserrat font-bold text-center mb-4">
              Completa tu Diagnóstico de Liderazgo Mental
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <iframe 
              data-tally-src="https://tally.so/embed/mV6oJa?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1" 
              loading="lazy"
              width="100%" 
              height="600" 
              frameBorder={0} 
              marginHeight={0} 
              marginWidth={0} 
              title="Pilares del Emprendedor"
              className="w-full"
            ></iframe>
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="py-16 px-4 bg-primary">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <div className="flex justify-center mb-6">
              <img 
                src="/lovable-uploads/b4013c2e-b832-4574-be32-050289f8d891.png" 
                alt="OPTIMUS - El Software para tu Mente" 
                className="h-20 w-auto"
              />
            </div>
            <p className="text-white/70 text-base font-poppins max-w-2xl mx-auto leading-relaxed">
              Una herramienta de Optimus – El software para tu mente. 
              Transformamos emprendedores a través del entrenamiento mental científico.
            </p>
          </div>
          <div className="pt-8 border-t border-white/20">
            <p className="text-white/50 text-sm font-poppins">
              © 2024 Optimus. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
