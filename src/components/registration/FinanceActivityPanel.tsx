import { motion } from 'motion/react';
import { useRegistrationStore } from '@/stores/registrationStore';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { buildQuantizedChartData } from '@/lib/percentages';
import { useMemo } from 'react';
import { Check } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import type { ActivityItem } from '@/lib/constants';

const CHART_PALETTE = [
  'hsl(215, 55%, 28%)',
  'hsl(210, 40%, 48%)',
  'hsl(200, 25%, 62%)',
  'hsl(35, 30%, 55%)',
  'hsl(220, 20%, 38%)',
  'hsl(30, 25%, 68%)',
  'hsl(215, 35%, 52%)',
];

const TYPES_ACTIFS = [
  'Aéronautique', 'Ferroviaire', 'Maritime', 'Automobile',
  'Équipements industriels', 'Télécoms', 'Énergie',
];

const TYPES_PROJETS = [
  'Infrastructures', 'Énergie renouvelable', 'PPP / Concessions',
  'Transport', 'Télécoms', 'Eau / Environnement', 'Social (hôpitaux, écoles)',
];

const TAILLE_OPTIONS = ['Small cap', 'Mid cap', 'Large cap'];

interface FinanceActivityPanelProps {
  items: ActivityItem[];
}

const FinanceActivityPanel = ({ items }: FinanceActivityPanelProps) => {
  const store = useRegistrationStore();

  const handleToggle = (key: string) => {
    const newActivites = { ...store.activites, [key]: !store.activites[key] };
    store.setField('activites', newActivites);
    if (!store.activites[key]) {
      store.setField('pourcentages', { ...store.pourcentages, [key]: 10 });
    }
  };

  const handlePercentChange = (key: string, value: number) => {
    store.setField('pourcentages', { ...store.pourcentages, [key]: value });
  };

  const handleCheckboxToggle = (category: string, value: string) => {
    const current = store.sousActivites[category] || {};
    store.setField('sousActivites', {
      ...store.sousActivites,
      [category]: { ...current, [value]: current[value] ? 0 : 1 },
    });
  };

  const isChecked = (category: string, value: string) => {
    return !!(store.sousActivites[category]?.[value]);
  };

  const handleTailleToggle = (value: string) => {
    const current = store.tailleOperations || [];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    store.setField('tailleOperations', updated);
  };

  const selectedItems = items.filter(item => store.activites[item.key]);
  const hasActivites = selectedItems.length > 0;

  const chartData = useMemo(() => {
    return buildQuantizedChartData(
      selectedItems.map((item, index) => ({
        key: item.key,
        name: item.label,
        raw: store.pourcentages[item.key] || 10,
        color: CHART_PALETTE[index % CHART_PALETTE.length],
      })),
    );
  }, [selectedItems, store.pourcentages]);

  const showActifs = store.activites['fin_actifs'];
  const showProjets = store.activites['fin_projets'];

  return (
    <div className="space-y-6">
      {/* Toggle chips */}
      <div className="flex flex-wrap gap-2">
        {items.map(item => {
          const isActive = store.activites[item.key];
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => handleToggle(item.key)}
              className={cn(
                "inline-flex items-center gap-1.5 px-4 py-2 rounded-sm text-sm font-sans font-light transition-all duration-200 border",
                isActive
                  ? "bg-foreground text-background border-foreground"
                  : "bg-transparent text-foreground border-border hover:border-foreground/40"
              )}
            >
              {isActive && <Check className="w-3 h-3" />}
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Main card */}
      {hasActivites && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="carter-card p-6"
        >
          <p className="carter-label mb-5">Répartition de votre activité</p>

          <div className="flex gap-8 items-start flex-col lg:flex-row">
            {/* LEFT: Pie chart + legend */}
            <div className="flex-shrink-0 mx-auto lg:mx-0 space-y-4" style={{ width: 260 }}>
              <ResponsiveContainer width={260} height={220}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={42}
                    outerRadius={78}
                    dataKey="value"
                    paddingAngle={2}
                    stroke="hsl(var(--background))"
                    strokeWidth={2}
                    label={({ displayPercent, cx, cy, midAngle, innerRadius, outerRadius }) => {
                      const RADIAN = Math.PI / 180;
                      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);
                      if (displayPercent < 8) return null;
                      return (
                        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600} fontFamily="Inter, sans-serif">
                          {displayPercent}%
                        </text>
                      );
                    }}
                    labelLine={false}
                  >
                    {chartData.map((_, index) => (
                      <Cell key={index} fill={CHART_PALETTE[index % CHART_PALETTE.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(_v: number, name: string, props: any) => [`${props.payload?.value}%`, name]}
                    contentStyle={{ fontSize: '11px', fontFamily: 'Inter', background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '4px', color: 'hsl(var(--foreground))' }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Legend under pie */}
              <div className="space-y-1.5">
                {chartData.map((item, i) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: CHART_PALETTE[i % CHART_PALETTE.length] }} />
                    <span className="text-[11px] font-sans text-foreground/80">{item.name}</span>
                    <span className="text-[11px] font-sans font-semibold text-foreground ml-auto">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: Sliders + Positionnement + Clientèle + Taille */}
            <div className="flex-1 space-y-4 w-full">
              {/* Sliders */}
              {selectedItems.map((item, i) => {
                const raw = store.pourcentages[item.key] || 10;
                const displayPercent = totalPercent > 0 ? Math.round((raw / totalPercent) * 100) : 0;
                return (
                  <div key={item.key} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: CHART_PALETTE[i % CHART_PALETTE.length] }} />
                        <span className="text-xs font-sans text-foreground">{item.label}</span>
                      </div>
                      <span className="text-xs font-sans font-bold text-foreground w-10 text-right">{displayPercent}%</span>
                    </div>
                    <Slider
                      value={[raw]}
                      onValueChange={([v]) => handlePercentChange(item.key, v)}
                      min={10}
                      max={100}
                      step={10}
                      className="w-full"
                    />
                  </div>
                );
              })}

              {/* Positionnement */}
              <div className="pt-4 border-t border-border space-y-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Positionnement</p>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-sans text-foreground">Côté prêteur</span>
                    <span className="text-xs font-sans font-bold text-foreground">{store.positionnementPreteur}%</span>
                  </div>
                  <Slider value={[store.positionnementPreteur]} onValueChange={([v]) => store.setField('positionnementPreteur', v)} min={0} max={100} step={10} className="w-full" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-sans text-foreground">Côté sponsor</span>
                    <span className="text-xs font-sans font-bold text-foreground">{100 - store.positionnementPreteur}%</span>
                  </div>
                </div>
              </div>

              {/* Clientèle */}
              <div className="pt-4 border-t border-border space-y-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Clientèle</p>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-sans text-foreground">Clientèle française</span>
                    <span className="text-xs font-sans font-bold text-foreground">{store.clienteleFrancaise}%</span>
                  </div>
                  <Slider value={[store.clienteleFrancaise]} onValueChange={([v]) => store.setField('clienteleFrancaise', v)} min={0} max={100} step={10} className="w-full" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-sans text-foreground">Clientèle étrangère</span>
                    <span className="text-xs font-sans font-bold text-foreground">{100 - store.clienteleFrancaise}%</span>
                  </div>
                </div>
              </div>

              {/* Taille des opérations */}
              <div className="pt-4 border-t border-border space-y-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Taille des opérations</p>
                <div className="flex flex-wrap gap-2">
                  {TAILLE_OPTIONS.map(t => {
                    const active = (store.tailleOperations || []).includes(t);
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => handleTailleToggle(t)}
                        className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-sans transition-all duration-200 border",
                          active
                            ? "bg-foreground text-background border-foreground"
                            : "bg-transparent text-foreground border-border hover:border-foreground/40"
                        )}
                      >
                        {active && <Check className="w-3 h-3" />}
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Supplementary checkboxes */}
          {(showActifs || showProjets) && (
            <div className="mt-6 pt-5 border-t border-border space-y-5">
              {showActifs && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Précisez le type d'actifs</p>
                  <div className="flex flex-wrap gap-x-5 gap-y-2.5">
                    {TYPES_ACTIFS.map(type => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox checked={isChecked('fin_actifs_types', type)} onCheckedChange={() => handleCheckboxToggle('fin_actifs_types', type)} />
                        <span className="text-xs font-sans text-foreground">{type}</span>
                      </label>
                    ))}
                  </div>
                </motion.div>
              )}
              {showProjets && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Précisez le type de projets</p>
                  <div className="flex flex-wrap gap-x-5 gap-y-2.5">
                    {TYPES_PROJETS.map(type => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox checked={isChecked('fin_projets_types', type)} onCheckedChange={() => handleCheckboxToggle('fin_projets_types', type)} />
                        <span className="text-xs font-sans text-foreground">{type}</span>
                      </label>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default FinanceActivityPanel;
