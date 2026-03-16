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
  'hsl(222, 50%, 28%)',
];

interface FinanceActivityPanelProps {
  items: ActivityItem[];
}

const FinanceActivityPanel = ({ items }: FinanceActivityPanelProps) => {
  const store = useRegistrationStore();

  // Top-level items for the main pie chart
  const topLevelItems = items.filter(i => !i.children || i.children.length === 0 ? true : true);

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

  const selectedItems = items.filter(item => store.activites[item.key]);
  const hasActivites = selectedItems.length > 0;

  const chartData = useMemo(() => {
    return selectedItems.map(item => ({
      name: item.label,
      value: store.pourcentages[item.key] || 10,
    }));
  }, [selectedItems, store.pourcentages]);

  const totalPercent = chartData.reduce((sum, d) => sum + d.value, 0);

  const renderSubBreakdown = (parent: ActivityItem, depth: number = 0) => {
    if (!parent.children || parent.children.length === 0) return null;
    if (!store.activites[parent.key]) return null;

    const subs = store.sousActivites[parent.key] || {};
    // Initialize sub-values if not present
    const childrenWithValues = parent.children.map(child => ({
      ...child,
      value: subs[child.key] ?? Math.round(100 / parent.children!.length),
    }));
    const subTotal = childrenWithValues.reduce((s, c) => s + c.value, 0);

    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        className={cn("space-y-3", depth === 0 ? "ml-4 mt-3 pl-4 border-l-2 border-border" : "ml-4 mt-2 pl-3 border-l border-border/50")}
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
            {/* Recursive: if this child also has children */}
            {child.children && child.value > 0 && renderSubBreakdown(child as ActivityItem, depth + 1)}
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

      {/* Sub-breakdowns for selected items with children */}
      {items.filter(i => i.children && store.activites[i.key]).map(item => (
        <div key={item.key}>
          {renderSubBreakdown(item)}
        </div>
      ))}

      {/* Pie chart + sliders + positioning */}
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

            {/* Sliders */}
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

              {/* Positioning: Prêteur vs Sponsor */}
              <div className="pt-4 border-t border-border space-y-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Positionnement</p>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-sans text-foreground">Côté prêteur</span>
                    <span className="text-xs font-sans font-bold text-foreground">{store.positionnementPreteur}%</span>
                  </div>
                  <Slider
                    value={[store.positionnementPreteur]}
                    onValueChange={([v]) => store.setField('positionnementPreteur', v)}
                    min={0}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-sans text-foreground">Côté sponsor</span>
                    <span className="text-xs font-sans font-bold text-foreground">{100 - store.positionnementPreteur}%</span>
                  </div>
                </div>
              </div>

              {/* Clientèle: Française vs Étrangère */}
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

export default FinanceActivityPanel;
