import { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRegistrationStore } from '@/stores/registrationStore';
import { cn } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { buildQuantizedChartData } from '@/lib/percentages';
import { Check } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import SquareGauge from '@/components/shared/SquareGauge';
import type { ActivityItem } from '@/lib/constants';

const CHART_PALETTE = [
  'hsl(0, 0%, 8%)',
  'hsl(220, 45%, 22%)',
  'hsl(0, 0%, 32%)',
  'hsl(30, 12%, 50%)',
  'hsl(220, 45%, 22%)',
  'hsl(210, 35%, 58%)',
  'hsl(35, 22%, 72%)',
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

const tooltipStyle = {
  fontSize: '11px', fontFamily: 'Inter',
  background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))',
  borderRadius: '4px', color: 'hsl(var(--foreground))',
};

const renderLabel = ({ cx, cy, midAngle, innerRadius: ir, outerRadius: or, value }: any) => {
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
};

const ChipButton = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button type="button" onClick={onClick}
    className={cn(
      "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-sm text-xs font-sans font-light transition-all duration-200 border",
      active ? "bg-foreground text-background border-foreground" : "bg-transparent text-foreground border-border hover:border-foreground/40"
    )}>
    {active && <Check className="w-3 h-3" />}
    {children}
  </button>
);

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
  const showSynthesis = hasActivites;

  return (
    <div className="flex flex-col-reverse md:flex-row gap-8 items-start">

      {/* ══════════ LEFT: SYNTHÈSE ══════════ */}
      <AnimatePresence>
        {showSynthesis && (
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="md:sticky md:top-8 md:w-[320px] flex-shrink-0 w-full"
          >
            <div className="bg-white border border-gray-200 rounded-sm p-5 space-y-4">
              <p className="text-sm font-sans font-medium text-foreground">Synthèse</p>

              {/* Pie chart */}
              <div className="self-center mx-auto" style={{ width: 200, height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%" innerRadius={48} outerRadius={88} dataKey="value" paddingAngle={1.5} stroke="hsl(var(--background))" strokeWidth={2} label={renderLabel} labelLine={false}>
                      {chartData.map((_, i) => <Cell key={i} fill={CHART_PALETTE[i % CHART_PALETTE.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => [`${v}%`, '']} contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="space-y-1.5">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium mb-2">Répartition</p>
                {chartData.map((item, i) => (
                  <div key={item.name} className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: CHART_PALETTE[i % CHART_PALETTE.length] }} />
                    <span className="text-[11px] font-sans text-foreground/80 flex-1 min-w-0 truncate">{item.name}</span>
                    <span className="text-[11px] font-sans font-bold text-foreground tabular-nums">{item.value}%</span>
                  </div>
                ))}
              </div>

              {/* Positionnement summary */}
              <div className="border-t border-border pt-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium mb-1">Positionnement</p>
                <div className="flex items-center gap-2.5">
                  <span className="text-[11px] font-sans text-foreground/80 flex-1">Prêteur</span>
                  <span className="text-[11px] font-sans font-bold text-foreground tabular-nums">{store.positionnementPreteur}%</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-[11px] font-sans text-foreground/80 flex-1">Sponsor</span>
                  <span className="text-[11px] font-sans font-bold text-foreground tabular-nums">{100 - store.positionnementPreteur}%</span>
                </div>
              </div>

              {/* Clientèle summary */}
              <div className="border-t border-border pt-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium mb-1">Clientèle</p>
                <span className="text-[11px] font-sans text-foreground/80">FR {store.clienteleFrancaise}% — International {100 - store.clienteleFrancaise}%</span>
              </div>

              {/* Taille summary */}
              {(store.tailleOperations || []).length > 0 && (
                <div className="border-t border-border pt-3 space-y-1.5">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium mb-1">Taille</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(store.tailleOperations || []).map(t => (
                      <span key={t} className="inline-flex items-center px-2.5 py-0.5 rounded-sm text-[11px] font-sans bg-secondary text-foreground/80 border border-border">{t}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════ RIGHT: QUESTIONNAIRE ══════════ */}
      <div className="carter-card p-5 md:p-7 space-y-6 flex-1 min-w-0">

        {/* ═══════ TOGGLE CHIPS ═══════ */}
        <div className="space-y-4">
          <p className="text-sm font-sans font-medium text-foreground">Type de financement</p>
          <div className="flex flex-wrap gap-2">
            {items.map(item => (
              <ChipButton key={item.key} active={!!store.activites[item.key]} onClick={() => handleToggle(item.key)}>
                {item.label}
              </ChipButton>
            ))}
          </div>
        </div>

        {/* ═══════ RÉPARTITION ═══════ */}
        {hasActivites && (
          <div className="border-t border-border pt-5 space-y-2.5">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Répartition</p>
            <div className="pl-3 border-l-2 border-border space-y-2.5">
              {selectedItems.map((item, i) => {
                const chartItem = chartData.find(d => d.name === item.label);
                const displayPercent = chartItem?.value ?? 0;
                return (
                  <SquareGauge
                    key={item.key}
                    value={store.pourcentages[item.key] || 10}
                    onChange={v => handlePercentChange(item.key, v)}
                    label={`${item.label} (${displayPercent}%)`}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* ═══════ POSITIONNEMENT ═══════ */}
        <div className="border-t border-border pt-5 space-y-2.5">
          <p className="text-sm font-sans font-medium text-foreground">Positionnement</p>
          <div className="pl-3 border-l-2 border-border space-y-2">
            <SquareGauge value={store.positionnementPreteur} onChange={v => store.setField('positionnementPreteur', v)} label="Côté prêteur" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-sans text-foreground">Côté sponsor</span>
              <span className="text-xs font-sans font-bold text-foreground tabular-nums">{100 - store.positionnementPreteur}%</span>
            </div>
          </div>
        </div>

        {/* ═══════ CLIENTÈLE ═══════ */}
        <div className="border-t border-border pt-5 space-y-2.5">
          <p className="text-sm font-sans font-medium text-foreground">Clientèle</p>
          <div className="pl-3 border-l-2 border-border space-y-2">
            <SquareGauge value={store.clienteleFrancaise} onChange={v => store.setField('clienteleFrancaise', v)} label="Clientèle française" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-sans text-foreground">Clientèle étrangère</span>
              <span className="text-xs font-sans font-bold text-foreground tabular-nums">{100 - store.clienteleFrancaise}%</span>
            </div>
          </div>
        </div>

        {/* ═══════ TAILLE ═══════ */}
        <div className="border-t border-border pt-5 space-y-3">
          <p className="text-sm font-sans font-medium text-foreground">Taille des opérations</p>
          <div className="flex flex-wrap gap-2">
            {TAILLE_OPTIONS.map(t => (
              <ChipButton key={t} active={(store.tailleOperations || []).includes(t)} onClick={() => handleTailleToggle(t)}>
                {t}
              </ChipButton>
            ))}
          </div>
        </div>

        {/* ═══════ TYPES D'ACTIFS / PROJETS ═══════ */}
        {showActifs && (
          <div className="border-t border-border pt-5 space-y-3">
            <p className="text-sm font-sans font-medium text-foreground">Type d'actifs</p>
            <div className="flex flex-wrap gap-x-5 gap-y-2.5">
              {TYPES_ACTIFS.map(type => (
                <label key={type} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={isChecked('fin_actifs_types', type)} onCheckedChange={() => handleCheckboxToggle('fin_actifs_types', type)} />
                  <span className="text-xs font-sans text-foreground">{type}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {showProjets && (
          <div className="border-t border-border pt-5 space-y-3">
            <p className="text-sm font-sans font-medium text-foreground">Type de projets</p>
            <div className="flex flex-wrap gap-x-5 gap-y-2.5">
              {TYPES_PROJETS.map(type => (
                <label key={type} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={isChecked('fin_projets_types', type)} onCheckedChange={() => handleCheckboxToggle('fin_projets_types', type)} />
                  <span className="text-xs font-sans text-foreground">{type}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinanceActivityPanel;
