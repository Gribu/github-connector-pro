import { useEffect } from 'react';

const Diagnostico = () => {
  useEffect(() => {
    // Load Tally embed script
    const script = document.createElement('script');
    script.src = 'https://tally.so/widgets/embed.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Cleanup script if component unmounts
      const existingScript = document.querySelector('script[src="https://tally.so/widgets/embed.js"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden">
      <iframe
        data-tally-src="https://tally.so/r/mV6oJa?transparentBackground=1"
        width="100%"
        height="100%"
        frameBorder="0"
        marginHeight={0}
        marginWidth={0}
        title="Radar Optimus: los Pilares de la mente"
        className="absolute top-0 right-0 bottom-0 left-0 border-0"
      />
    </div>
  );
};

export default Diagnostico;