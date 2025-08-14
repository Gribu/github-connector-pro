import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const ExamplePieChart = () => {
  const data = [
    { name: 'Claridad mental', value: 35, color: '#3B82F6' },
    { name: 'Dominio emocional', value: 25, color: '#8B5CF6' },
    { name: 'Energía personal', value: 20, color: '#F59E0B' },
    { name: 'Autoliderazgo', value: 20, color: '#10B981' }
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={80}
          dataKey="value"
          stroke="none"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ExamplePieChart;