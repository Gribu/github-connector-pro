import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from 'lucide-react';

const educationalPhrases = [
  "Escoger significa renunciar.",
  "La velocidad viene de la alineación, no del esfuerzo.",
  "Todo lo que existe, viene de un pensamiento.",
  "No se cambia lo que no se observa.",
  "Si quieres que algo suceda, debes liderarlo."
];

export default function ProcesandoDiagnostico() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const submissionId = searchParams.get('submission_id');
  
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [isTimeout, setIsTimeout] = useState(false);

  const checkForDiagnosticResult = async () => {
    if (!submissionId || attempts >= 12) {
      if (attempts >= 12) {
        setIsTimeout(true);
      }
      return;
    }

    try {
      console.log(`Checking for diagnostic result, attempt ${attempts + 1}/12`);
      
      const { data, error } = await supabase
        .from('respuestas_diagnostico')
        .select('id')
        .eq('submission_id', submissionId)
        .single();

      if (data && !error) {
        console.log('Diagnostic result found, redirecting...');
        navigate(`/resultados?submission_id=${submissionId}`);
        return;
      }

      // Update phrase and attempts count
      setCurrentPhraseIndex((prev) => (prev + 1) % educationalPhrases.length);
      setAttempts((prev) => prev + 1);
      
    } catch (error) {
      console.log('Expected error while waiting for diagnostic result:', error);
      setCurrentPhraseIndex((prev) => (prev + 1) % educationalPhrases.length);
      setAttempts((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (!submissionId) {
      navigate('/');
      return;
    }

    // Start checking immediately
    checkForDiagnosticResult();

    // Set up interval for subsequent checks
    const interval = setInterval(checkForDiagnosticResult, 5000);

    return () => clearInterval(interval);
  }, [submissionId]);

  if (!submissionId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Gradient Background */}
      <div 
        className="relative min-h-screen flex items-center justify-center"
        style={{
          background: 'var(--gradient-hero)'
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          {/* Logo */}
          <div className="flex justify-center mb-12">
            <img 
              src="/lovable-uploads/b4013c2e-b832-4574-be32-050289f8d891.png" 
              alt="OPTIMUS - El Software para tu Mente" 
              className="h-16 w-auto"
            />
          </div>

          {/* Main Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight font-montserrat">
            Estamos procesando tu diagnóstico personalizado
          </h1>

          {/* Loading Spinner */}
          <div className="flex justify-center mb-8">
            <Loader2 className="h-12 w-12 text-secondary animate-spin" />
          </div>

          {/* Educational Phrase or Timeout Message */}
          <div className="max-w-2xl mx-auto">
            <p className="text-xl md:text-2xl text-white/90 font-medium font-poppins leading-relaxed min-h-[3rem] flex items-center justify-center">
              {isTimeout ? (
                <>
                  Tu diagnóstico está tardando más de lo habitual.<br />
                  Pero no te preocupes, un miembro del equipo te contactará pronto con los resultados.
                </>
              ) : (
                educationalPhrases[currentPhraseIndex]
              )}
            </p>
          </div>

          {/* Progress Indicator */}
          {!isTimeout && (
            <div className="mt-12">
              <div className="flex justify-center items-center space-x-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      i === currentPhraseIndex % 5 ? 'bg-secondary' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
              <p className="text-white/70 text-sm">
                Verificando resultados... {attempts}/12
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}