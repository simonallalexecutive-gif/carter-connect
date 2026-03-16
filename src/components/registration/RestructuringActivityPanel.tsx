import { motion } from 'motion/react';
import { useRegistrationStore } from '@/stores/registrationStore';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useMemo } from 'react';
import { Check } from 'lucide-react';
import type { ActivityItem } from '@/lib/constants';

const CHART_PALETTE = [
  'hsl(215, 55%, 28%)',
  'hsl(35, 30%, 55%)',
];

const POSITIONNEMENT_OPTIONS = [
  'Côté débiteur',
  'Côté créancier',
  'Côté actionnaire',
  'Côté repreneur',
];

const CLIENTELE_OPTIONS = [
  'Startups',
  'ETI',
  'PME',
  'Grands groupes industriels',
  'Sociétés cotées',
];

interface RestructuringActivityPanelProps {
  items: ActivityItem[];
}

const RestructuringActivityPanel = ({ items }: RestructuringActivityPanelProps) => {
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

  const handleSubPercentChange = (parentKey: string, childKey: string, value: number) => {
    const current = store.sousActivites[parentKey] || {};
    store.setField('sousActivites', {
      ...store.sousActivites,
      [parentKey]: { ...current, [childKey]: value },
    });
  };

  const toggleCheckbox = (field: 'positionnementRestr' | 'clienteleRestr', value: string) => {
    const current = store[field];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    store.setField(field, updated);
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

  const totalPercent = useMemo(() => {
    return selectedItems.reduce((sum, item) => sum + (store.pourcentages[item.key] || 10), 0);
  }, [selectedItems, store.pourcentages]);

  const chartData = useMemo(() => {
    return selectedItems.map(item => {
      const raw = store.pourcentages[item.key] || 10;
      const displayPercent = totalPercent > 0 ? Math.round((raw / totalPercent) * 100) : 0;
      return { name: item.label, value: raw, displayPercent };
    });
  }, [selectedItems, store.pourcentages, totalPercent]);

  // Sub-breakdowns for Restructuring
  const restrSubs = store.sousActivites['restr_restructuring'] || {};
  const amiableVal = restrSubs['amiable'] ?? 50;
  const judiciaireVal = restrSubs['judiciaire'] ?? 50;
  const restrSubTotal = amiableVal + judiciaireVal;

  // Sub-breakdowns for Contentieux
  const contSubs = store.sousActivites['restr_contentieux'] || {};
  const contPCVal = contSubs['cont_pc'] ?? 50;
  const contCommVal = contSubs['cont_comm'] ?? 50;
  const contSubTotal = contPCVal + contCommVal;

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
                    formatter={(_v: number, name: string, props: any) => [`${props.payload?.displayPercent}%`, name]}
                    contentStyle={{ fontSize: '11px', fontFamily: 'Inter', background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '4px', color: 'hsl(var(--foreground))' }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Legend */}
              <div className="space-y-1.5">
                {chartData.map((item, i) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: CHART_PALETTE[i % CHART_PALETTE.length] }} />
                    <span className="text-[11px] font-sans text-foreground/80">{item.name}</span>
                    <span className="text-[11px] font-sans font-semibold text-foreground ml-auto">{item.displayPercent}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: Sliders + sub-breakdowns + positionnement + clientèle + taille */}
            <div className="flex-1 space-y-4 w-full">
              {/* Main sliders */}
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

              {/* Sub-breakdown: Restructuring → Amiable / Judiciaire */}
              {store.activites['restr_restructuring'] && (
                <div className="pt-3 border-t border-border space-y-3">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Répartition restructuring</p>
                  {[
                    { key: 'amiable', label: 'Amiable', value: amiableVal },
                    { key: 'judiciaire', label: 'Judiciaire', value: judiciaireVal },
                  ].map(sub => (
                    <div key={sub.key} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-sans text-foreground">{sub.label}</span>
                        <span className="text-xs font-sans font-bold text-foreground w-10 text-right">
                          {restrSubTotal > 0 ? Math.round((sub.value / restrSubTotal) * 100) : 0}%
                        </span>
                      </div>
                      <Slider
                        value={[sub.value]}
                        onValueChange={([v]) => handleSubPercentChange('restr_restructuring', sub.key, v)}
                        min={0}
                        max={100}
                        step={10}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Sub-breakdown: Contentieux → PC / Commercial */}
              {store.activites['restr_contentieux'] && (
                <div className="pt-3 border-t border-border space-y-3">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Répartition contentieux</p>
                  {[
                    { key: 'cont_pc', label: 'Contentieux procédures collectives', value: contPCVal },
                    { key: 'cont_comm', label: 'Contentieux commercial général', value: contCommVal },
                  ].map(sub => (
                    <div key={sub.key} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-sans text-foreground">{sub.label}</span>
                        <span className="text-xs font-sans font-bold text-foreground w-10 text-right">
                          {contSubTotal > 0 ? Math.round((sub.value / contSubTotal) * 100) : 0}%
                        </span>
                      </div>
                      <Slider
                        value={[sub.value]}
                        onValueChange={([v]) => handleSubPercentChange('restr_contentieux', sub.key, v)}
                        min={0}
                        max={100}
                        step={10}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Positionnement */}
              <div className="pt-4 border-t border-border space-y-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Positionnement</p>
                <div className="flex flex-wrap gap-2">
                  {POSITIONNEMENT_OPTIONS.map(opt => {
                    const isActive = store.positionnementRestr.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => toggleCheckbox('positionnementRestr', opt)}
                        className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-sans font-light transition-all duration-200 border",
                          isActive
                            ? "bg-foreground text-background border-foreground"
                            : "bg-transparent text-foreground border-border hover:border-foreground/40"
                        )}
                      >
                        {isActive && <Check className="w-3 h-3" />}
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Type de clientèle */}
              <div className="pt-4 border-t border-border space-y-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Type de clientèle</p>
                <div className="flex flex-wrap gap-2">
                  {CLIENTELE_OPTIONS.map(opt => {
                    const isActive = store.clienteleRestr.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => toggleCheckbox('clienteleRestr', opt)}
                        className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-sans font-light transition-all duration-200 border",
                          isActive
                            ? "bg-foreground text-background border-foreground"
                            : "bg-transparent text-foreground border-border hover:border-foreground/40"
                        )}
                      >
                        {isActive && <Check className="w-3 h-3" />}
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Clientèle FR vs étrangère */}
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
                  {['Small cap', 'Mid cap', 'Large cap'].map(t => {
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
        </motion.div>
      )}
    </div>
  );
};

export default RestructuringActivityPanel;
