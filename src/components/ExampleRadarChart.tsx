import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

const ExampleRadarChart = () => {
  const data = [
    { area: 'Visión & Claridad', value: 7, fullValue: 10 },
    { area: 'Dominio Emocional', value: 9, fullValue: 10 },
    { area: 'Energía & Enfoque', value: 6, fullValue: 10 },
    { area: 'Liderazgo', value: 8, fullValue: 10 },
    { area: 'Influencia', value: 4, fullValue: 10 },
    { area: 'Adaptabilidad', value: 7, fullValue: 10 }
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart data={data}>
        <PolarGrid 
          stroke="rgba(255,255,255,0.2)"
          gridType="polygon"
        />
        <PolarAngleAxis 
          dataKey="area" 
          className="text-white text-xs font-medium"
          tick={{ 
            fontSize: 11, 
            fill: 'white',
            fontWeight: 500
          }}
        />
        <PolarRadiusAxis 
          angle={90} 
          domain={[0, 10]} 
          className="text-white/60 text-xs"
          tick={{ 
            fontSize: 9, 
            fill: 'rgba(255,255,255,0.7)'
          }}
          tickFormatter={(value) => `${value}`}
        />
        <Radar
          name="Puntaje"
          dataKey="value"
          stroke="hsl(var(--accent))"
          fill="hsl(var(--accent))"
          fillOpacity={0.2}
          strokeWidth={2}
          dot={{ 
            fill: 'hsl(var(--warning))', 
            strokeWidth: 2, 
            stroke: 'white',
            r: 4 
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default ExampleRadarChart;