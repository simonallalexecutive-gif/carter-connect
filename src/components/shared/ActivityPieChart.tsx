import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const BLUE_PALETTE = [
  'hsl(0, 0%, 8%)',       // Noir mat
  'hsl(220, 45%, 18%)',    // Bleu pétrole
  'hsl(0, 0%, 28%)',       // Gris anthracite
  'hsl(20, 75%, 32%)',    // Vert green
  'hsl(220, 45%, 18%)',    // Bleu foncé
  'hsl(0, 0%, 72%)',       // Gris clair
  'hsl(220, 45%, 18%)',    // Bleu pétrole foncé
  'hsl(0, 0%, 48%)',       // Gris moyen
];

interface ActivityPieChartProps {
  data: Record<string, number>;
  size?: number;
  innerRadius?: number;
  outerRadius?: number;
  showLegend?: boolean;
  darkMode?: boolean;
  className?: string;
  customColors?: string[];
}

const ActivityPieChart = ({
  data,
  size = 140,
  innerRadius = 35,
  outerRadius = 65,
  showLegend = true,
  darkMode = false,
  className = '',
  customColors,
}: ActivityPieChartProps) => {
  const palette = customColors || BLUE_PALETTE;
  const chartData = useMemo(() => {
    return Object.entries(data)
      .filter(([, v]) => v > 0)
      .map(([name, value]) => ({ name, value }));
  }, [data]);

  if (chartData.length === 0) return null;

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <ResponsiveContainer width={size} height={size}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            dataKey="value"
            stroke={darkMode ? 'rgba(255,255,255,0.08)' : 'hsl(var(--background))'}
            strokeWidth={2}
          >
            {chartData.map((_, i) => (
              <Cell key={i} fill={palette[i % palette.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string) => [`${value}%`, name]}
            contentStyle={{
              fontSize: '11px',
              borderRadius: '4px',
              background: darkMode ? 'hsl(220,15%,15%)' : 'white',
              color: darkMode ? 'white' : 'inherit',
              border: darkMode ? '1px solid rgba(255,255,255,0.1)' : undefined,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      {showLegend && (
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 justify-center">
          {chartData.map((item, i) => (
            <div key={item.name} className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                style={{ background: palette[i % palette.length] }}
              />
              <span className={`text-[10px] ${darkMode ? 'text-white/60' : 'text-muted-foreground'}`}>
                {item.name} ({item.value}%)
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export { BLUE_PALETTE };
export default ActivityPieChart;
