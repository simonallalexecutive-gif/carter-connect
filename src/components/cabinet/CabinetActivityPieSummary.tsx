import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { cn } from '@/lib/utils';

type ChartDatum = {
  name: string;
  value: number;
  color: string;
};

interface CabinetActivityPieSummaryProps {
  chartData: ChartDatum[];
  title?: string;
  theme?: 'light' | 'dark';
  className?: string;
}

const CabinetActivityPieSummary = ({
  chartData,
  title = 'Répartition des dossiers',
  theme = 'light',
  className,
}: CabinetActivityPieSummaryProps) => {
  if (chartData.length === 0) return null;

  const isDark = theme === 'dark';

  return (
    <div className={cn(className)}>
      <p className={cn(
        'font-sans text-[11px] font-medium uppercase tracking-[0.15em] mb-5',
        isDark ? 'text-white/35' : 'text-muted-foreground',
      )}>
        {title}
      </p>
      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
        <div className="flex-shrink-0" style={{ width: 160, height: 160 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={38}
                outerRadius={72}
                dataKey="value"
                paddingAngle={2}
                stroke={isDark ? 'hsl(0, 0%, 10%)' : 'hsl(var(--background))'}
                strokeWidth={2}
                label={({ cx, cy, midAngle, innerRadius: ir, outerRadius: or, index }: any) => {
                  const RADIAN = Math.PI / 180;
                  const radius = ir + (or - ir) * 0.5;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);
                  const pct = chartData[index]?.value ?? 0;
                  if (pct < 15) return null;
                  return (
                    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700} fontFamily="Inter, sans-serif">
                      {pct}%
                    </text>
                  );
                }}
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [`${value}%`, name]}
                contentStyle={isDark
                  ? { fontSize: '10px', borderRadius: '4px', background: 'hsl(0,0%,15%)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }
                  : { fontSize: '11px', borderRadius: '4px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 w-full space-y-2">
          {chartData.map((item) => (
            <div key={item.name} className={cn(
              'flex items-center gap-3 py-2 border-b last:border-b-0',
              isDark ? 'border-white/[0.08]' : 'border-border',
            )}>
              <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: item.color }} />
              <span className={cn(
                'text-[12px] font-sans flex-1 min-w-0 truncate',
                isDark ? 'text-white/70' : 'text-foreground',
              )}>
                {item.name}
              </span>
              <span className={cn(
                'text-[12px] font-sans font-bold w-10 text-center tabular-nums',
                isDark ? 'text-white' : 'text-foreground',
              )}>
                {item.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CabinetActivityPieSummary;
