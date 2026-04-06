import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { cn } from '@/lib/utils';

type ChartDatum = {
  name: string;
  value: number;
  color: string;
};

interface CabinetRestructuringSynthesisProps {
  chartData: ChartDatum[];
  posChartData: ChartDatum[];
  cliChartData: ChartDatum[];
  theme?: 'light' | 'dark';
  className?: string;
}

const CabinetRestructuringSynthesis = ({
  chartData,
  posChartData,
  cliChartData,
  theme = 'light',
  className,
}: CabinetRestructuringSynthesisProps) => {
  if (chartData.length === 0) return null;

  const isDark = theme === 'dark';

  return (
    <div className={cn(
      'space-y-4',
      isDark ? 'rounded-lg border border-white/[0.08] bg-white/[0.03] p-5' : 'carter-card p-5',
      className,
    )}>
      <p className={cn(
        'text-sm font-sans font-medium',
        isDark ? 'text-white' : 'text-foreground',
      )}>
        Synthèse
      </p>

      <div className="self-center mx-auto" style={{ width: 200, height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={48}
              outerRadius={88}
              dataKey="value"
              paddingAngle={1.5}
              stroke={isDark ? 'hsl(0, 0%, 10%)' : 'hsl(var(--background))'}
              strokeWidth={2}
              label={({ cx, cy, midAngle, innerRadius: ir, outerRadius: or, value }: any) => {
                const RADIAN = Math.PI / 180;
                const radius = ir + (or - ir) * 0.5;
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);
                if (value < 10) return null;
                return (
                  <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700} fontFamily="Inter, sans-serif">
                    {Math.round(value)}%
                  </text>
                );
              }}
              labelLine={false}
            >
              {chartData.map((seg, i) => <Cell key={i} fill={seg.color} />)}
            </Pie>
            <Tooltip
              formatter={(value: number) => [`${value}%`, '']}
              contentStyle={isDark
                ? { fontSize: '10px', borderRadius: '4px', background: 'hsl(0,0%,15%)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }
                : { fontSize: '11px', fontFamily: 'Inter', background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '4px', color: 'hsl(var(--foreground))' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-1.5">
        <p className={cn(
          'text-[10px] uppercase tracking-wider font-sans font-medium mb-2',
          isDark ? 'text-white/35' : 'text-muted-foreground',
        )}>
          Activité
        </p>
        {chartData.map((seg) => (
          <div key={seg.name} className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: seg.color }} />
            <span className={cn(
              'text-[11px] font-sans flex-1 min-w-0 truncate',
              isDark ? 'text-white/70' : 'text-foreground/80',
            )}>
              {seg.name}
            </span>
            <span className={cn(
              'text-[11px] font-sans font-bold tabular-nums',
              isDark ? 'text-white' : 'text-foreground',
            )}>
              {seg.value}%
            </span>
          </div>
        ))}
      </div>

      {posChartData.length > 0 && (
        <div className={cn(
          'pt-3 space-y-1.5',
          isDark ? 'border-t border-white/[0.08]' : 'border-t border-border',
        )}>
          <p className={cn(
            'text-[10px] uppercase tracking-wider font-sans font-medium mb-1',
            isDark ? 'text-white/35' : 'text-muted-foreground',
          )}>
            Positionnement
          </p>
          {posChartData.map((seg) => (
            <div key={seg.name} className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: seg.color }} />
              <span className={cn(
                'text-[11px] font-sans flex-1',
                isDark ? 'text-white/70' : 'text-foreground/70',
              )}>
                {seg.name}
              </span>
              <span className={cn(
                'text-[11px] font-sans font-semibold tabular-nums',
                isDark ? 'text-white' : 'text-foreground',
              )}>
                {seg.value}%
              </span>
            </div>
          ))}
        </div>
      )}

      {cliChartData.length > 0 && (
        <div className={cn(
          'pt-3 space-y-1.5',
          isDark ? 'border-t border-white/[0.08]' : 'border-t border-border',
        )}>
          <p className={cn(
            'text-[10px] uppercase tracking-wider font-sans font-medium mb-1',
            isDark ? 'text-white/35' : 'text-muted-foreground',
          )}>
            Clientèle
          </p>
          {cliChartData.map((seg) => (
            <div key={seg.name} className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: seg.color }} />
              <span className={cn(
                'text-[11px] font-sans flex-1',
                isDark ? 'text-white/70' : 'text-foreground/70',
              )}>
                {seg.name}
              </span>
              <span className={cn(
                'text-[11px] font-sans font-semibold tabular-nums',
                isDark ? 'text-white' : 'text-foreground',
              )}>
                {seg.value}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CabinetRestructuringSynthesis;
