import { motion } from 'motion/react';
import { useRegistrationStore } from '@/stores/registrationStore';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useMemo } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import type { ActivityItem } from '@/lib/constants';

const CHART_COLORS = [
  'hsl(215, 60%, 30%)',
  'hsl(215, 50%, 42%)',
  'hsl(220, 55%, 22%)',
  'hsl(210, 45%, 52%)',
  'hsl(218, 40%, 36%)',
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

  const selectedItems = items.filter(item => store.activites[item.key]);
  const hasActivites = selectedItems.length > 0;

  const chartData = useMemo(() => {
    return selectedItems.map(item => ({
      name: item.label,
      value: store.pourcentages[item.key] || 10,
    }));
  }, [selectedItems, store.pourcentages]);

  const totalPercent = chartData.reduce((sum, d) => sum + d.value, 0);

  const renderSubBreakdown = (parent: ActivityItem) => {
    if (!parent.children || parent.children.length === 0) return null;
    if (!store.activites[parent.key]) return null;

    const subs = store.sousActivites[parent.key] || {};
    const childrenWithValues = parent.children.map(child => ({
      ...child,
      value: subs[child.key] ?? Math.round(100 / parent.children!.length),
    }));
    const subTotal = childrenWithValues.reduce((s, c) => s + c.value, 0);

    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        className="ml-4 mt-3 pl-4 border-l-2 border-border space-y-3"
      >
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">
          Répartition {parent.label.toLowerCase()}
        </p>
        {childrenWithValues.map(child => (
          <div key={child.key} className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-sans text-foreground">{child.label}</span>
              <span className="text-xs font-sans font-bold text-foreground w-10 text-right">
                {subTotal > 0 ? Math.round((child.value / subTotal) * 100) : 0}%
              </span>
            </div>
            <Slider
              value={[child.value]}
              onValueChange={([v]) => handleSubPercentChange(parent.key, child.key, v)}
              min={0}
              max={100}
              step={5}
              className="w-full"
            />
          </div>
        ))}
      </motion.div>
    );
  };

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
              {item.children && item.children.length > 0 && (
                <ChevronDown className={cn("w-3 h-3 transition-transform", isActive && "rotate-180")} />
              )}
            </button>
          );
        })}
      </div>

      {/* Sub-breakdowns */}
      {items.filter(i => i.children && store.activites[i.key]).map(item => (
        <div key={item.key}>{renderSubBreakdown(item)}</div>
      ))}

      {/* Pie chart + positioning + clientele */}
      {hasActivites && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="carter-card p-6"
        >
          <p className="carter-label mb-5">Répartition de votre activité</p>
          <div className="flex gap-8 items-start flex-col md:flex-row">
            {/* Pie chart */}
            <div className="w-40 h-40 flex-shrink-0 mx-auto md:mx-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={38}
                    outerRadius={68}
                    dataKey="value"
                    paddingAngle={2}
                  >
                    {chartData.map((_, index) => (
                      <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`${Math.round((value / totalPercent) * 100)}%`, '']}
                    contentStyle={{ fontSize: '11px', fontFamily: 'Inter', background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '4px', color: 'hsl(var(--foreground))' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Sliders + side info */}
            <div className="flex-1 space-y-4 w-full">
              {selectedItems.map((item, i) => (
                <div key={item.key} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                      <span className="text-xs font-sans text-foreground">{item.label}</span>
                    </div>
                    <span className="text-xs font-sans font-bold text-foreground w-10 text-right">
                      {Math.round(((store.pourcentages[item.key] || 10) / totalPercent) * 100)}%
                    </span>
                  </div>
                  <Slider
                    value={[store.pourcentages[item.key] || 10]}
                    onValueChange={([v]) => handlePercentChange(item.key, v)}
                    min={10}
                    max={100}
                    step={10}
                    className="w-full"
                  />
                </div>
              ))}

              {/* Positionnement (checkboxes) */}
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

              {/* Type de clientèle (checkboxes) */}
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

              {/* Clientèle française vs étrangère */}
              <div className="pt-4 border-t border-border space-y-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Clientèle</p>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-sans text-foreground">Clientèle française</span>
                    <span className="text-xs font-sans font-bold text-foreground">{store.clienteleFrancaise}%</span>
                  </div>
                  <Slider
                    value={[store.clienteleFrancaise]}
                    onValueChange={([v]) => store.setField('clienteleFrancaise', v)}
                    min={0}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-sans text-foreground">Clientèle étrangère</span>
                    <span className="text-xs font-sans font-bold text-foreground">{100 - store.clienteleFrancaise}%</span>
                  </div>
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
