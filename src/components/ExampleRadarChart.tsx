import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

const ExampleRadarChart = () => {
  const data = [
    { area: 'Claridad Mental', value: 7, fullValue: 10 },
    { area: 'Dominio Emocional', value: 5, fullValue: 10 },
    { area: 'Energía Personal', value: 6, fullValue: 10 },
    { area: 'Autoliderazgo', value: 8, fullValue: 10 },
    { area: 'Influencia', value: 4, fullValue: 10 },
    { area: 'Propósito', value: 7, fullValue: 10 }
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