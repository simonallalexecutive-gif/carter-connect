import { motion } from 'motion/react';
import { useRegistrationStore } from '@/stores/registrationStore';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useMemo } from 'react';
import { Check } from 'lucide-react';

/* ── colour palette ── */
const COL_RESTR = 'hsl(215, 55%, 28%)';
const COL_RESTR_AMIABLE = 'hsl(215, 45%, 42%)';
const COL_RESTR_JUDICIAIRE = 'hsl(215, 60%, 56%)';
const COL_RESTR_FINANCIER = 'hsl(45, 40%, 55%)';
const COL_CONT = 'hsl(35, 30%, 55%)';
const COL_CONT_PC = 'hsl(35, 25%, 42%)';
const COL_CONT_COMM = 'hsl(35, 35%, 65%)';
const COL_AUTRES = 'hsl(200, 15%, 65%)';

const POSITIONNEMENT_OPTIONS = [
  'Débiteurs',
  'Créanciers',
  'Actionnaires',
  'Repreneurs / investisseurs',
];

const CLIENTELE_OPTIONS = [
  'Startups',
  'PME',
  'ETI',
  'Grands groupes industriels',
  'Sociétés cotées',
];

/* ── main categories ── */
const MAIN_CATEGORIES = [
  { key: 'restr_restructuring', label: 'Restructuring' },
  { key: 'restr_contentieux', label: 'Contentieux' },
  { key: 'restr_autres', label: 'Autres activités' },
];

const RestructuringActivityPanel = () => {
  const store = useRegistrationStore();

  /* ── toggle main categories ── */
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

  /* ── selected items ── */
  const selectedItems = MAIN_CATEGORIES.filter(item => store.activites[item.key]);
  const hasActivites = selectedItems.length > 0;

  const totalRaw = useMemo(() =>
    selectedItems.reduce((sum, item) => sum + (store.pourcentages[item.key] || 10), 0),
    [selectedItems, store.pourcentages]
  );

  /* ── sub-values ── */
  const hasRestr = store.activites['restr_restructuring'];
  const hasCont = store.activites['restr_contentieux'];

  const restrSubs = store.sousActivites['restr_restructuring'] || {};
  const amiableVal = restrSubs['amiable'] ?? 50;
  const judiciaireVal = restrSubs['judiciaire'] ?? 50;
  const restrSubTotal = amiableVal + judiciaireVal;

  const contSubs = store.sousActivites['restr_contentieux'] || {};
  const contPCVal = contSubs['cont_pc'] ?? 50;
  const contCommVal = contSubs['cont_comm'] ?? 50;
  const contSubTotal = contPCVal + contCommVal;

  const restrFinancier = store.restrFinancier ?? 0;

  /* ── pie chart data with sub-segments ── */
  const chartData = useMemo(() => {
    const segments: { name: string; value: number; color: string; parent?: string }[] = [];

    selectedItems.forEach(item => {
      const rawPercent = totalRaw > 0
        ? ((store.pourcentages[item.key] || 10) / totalRaw) * 100
        : 0;

      if (item.key === 'restr_restructuring' && restrSubTotal > 0) {
        // Restructuring financier as sub-segment
        const restrFinPart = (restrFinancier / 100) * rawPercent;
        const remainingRestr = rawPercent - restrFinPart;

        if (restrFinPart > 0) {
          segments.push({ name: 'Restructuring financier', value: restrFinPart, color: COL_RESTR_FINANCIER, parent: 'Restructuring' });
        }

        const amiablePct = (amiableVal / restrSubTotal) * remainingRestr;
        const judiciairePct = (judiciaireVal / restrSubTotal) * remainingRestr;

        segments.push({ name: 'Procédures amiables', value: amiablePct, color: COL_RESTR_AMIABLE, parent: 'Restructuring' });
        segments.push({ name: 'Procédures judiciaires', value: judiciairePct, color: COL_RESTR_JUDICIAIRE, parent: 'Restructuring' });
      } else if (item.key === 'restr_contentieux' && contSubTotal > 0) {
        const pcPct = (contPCVal / contSubTotal) * rawPercent;
        const commPct = (contCommVal / contSubTotal) * rawPercent;
        segments.push({ name: 'Cont. procédures collectives', value: pcPct, color: COL_CONT_PC, parent: 'Contentieux' });
        segments.push({ name: 'Cont. commercial général', value: commPct, color: COL_CONT_COMM, parent: 'Contentieux' });
      } else {
        segments.push({
          name: item.label,
          value: rawPercent,
          color: item.key === 'restr_restructuring' ? COL_RESTR
               : item.key === 'restr_contentieux' ? COL_CONT
               : COL_AUTRES,
        });
      }
    });
    return segments;
  }, [selectedItems, store.pourcentages, totalRaw, restrSubTotal, amiableVal, judiciaireVal, contSubTotal, contPCVal, contCommVal, restrFinancier]);

  /* ── legend items grouped by parent ── */
  const legendGroups = useMemo(() => {
    const groups: { parent: string; items: typeof chartData }[] = [];
    const seen = new Set<string>();
    chartData.forEach(seg => {
      const parent = seg.parent || seg.name;
      if (!seen.has(parent)) {
        seen.add(parent);
        groups.push({ parent, items: chartData.filter(s => (s.parent || s.name) === parent) });
      }
    });
    return groups;
  }, [chartData]);

  return (
    <div className="space-y-6">
      {/* Toggle chips */}
      <div className="flex flex-wrap gap-2">
        {MAIN_CATEGORIES.map(item => {
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
            {/* ══ LEFT: Pie chart + legend ══ */}
            <div className="flex-shrink-0 mx-auto lg:mx-0 space-y-4" style={{ width: 280 }}>
              <ResponsiveContainer width={280} height={240}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={44}
                    outerRadius={85}
                    dataKey="value"
                    paddingAngle={1.5}
                    stroke="hsl(var(--background))"
                    strokeWidth={2}
                    label={({ cx, cy, midAngle, innerRadius: ir, outerRadius: or, value }) => {
                      const RADIAN = Math.PI / 180;
                      const radius = ir + (or - ir) * 0.5;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);
                      const pct = Math.round(value);
                      if (pct < 6) return null;
                      return (
                        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={600} fontFamily="Inter, sans-serif">
                          {pct}%
                        </text>
                      );
                    }}
                    labelLine={false}
                  >
                    {chartData.map((seg, index) => (
                      <Cell key={index} fill={seg.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`${Math.round(value)}%`, '']}
                    contentStyle={{ fontSize: '11px', fontFamily: 'Inter', background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '4px', color: 'hsl(var(--foreground))' }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Grouped legend */}
              <div className="space-y-3">
                {legendGroups.map(group => (
                  <div key={group.parent} className="space-y-1">
                    {group.items.length > 1 && (
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">{group.parent}</p>
                    )}
                    {group.items.map(seg => (
                      <div key={seg.name} className="flex items-center gap-2 pl-0">
                        <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: seg.color }} />
                        <span className="text-[11px] font-sans text-foreground/80 truncate">{seg.name}</span>
                        <span className="text-[11px] font-sans font-semibold text-foreground ml-auto">{Math.round(seg.value)}%</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* ══ RIGHT: Sliders + sub-breakdowns + positionnement + clientèle ══ */}
            <div className="flex-1 space-y-4 w-full">
              {/* Main category sliders */}
              {selectedItems.map(item => {
                const raw = store.pourcentages[item.key] || 10;
                const displayPercent = totalRaw > 0 ? Math.round((raw / totalRaw) * 100) : 0;
                const color = item.key === 'restr_restructuring' ? COL_RESTR
                            : item.key === 'restr_contentieux' ? COL_CONT
                            : COL_AUTRES;
                return (
                  <div key={item.key} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: color }} />
                        <span className="text-xs font-sans font-medium text-foreground">{item.label}</span>
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
              {hasRestr && (
                <div className="pt-3 border-t border-border space-y-3">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">
                    Répartition restructuring
                  </p>
                  <p className="text-[10px] text-muted-foreground font-sans -mt-1">
                    (mandat ad hoc, conciliation vs. sauvegarde, RJ, LJ)
                  </p>
                  {[
                    { key: 'amiable', label: 'Procédures amiables', value: amiableVal, color: COL_RESTR_AMIABLE },
                    { key: 'judiciaire', label: 'Procédures judiciaires', value: judiciaireVal, color: COL_RESTR_JUDICIAIRE },
                  ].map(sub => (
                    <div key={sub.key} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ backgroundColor: sub.color }} />
                          <span className="text-xs font-sans text-foreground">{sub.label}</span>
                        </div>
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
              {hasCont && (
                <div className="pt-3 border-t border-border space-y-3">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Répartition contentieux</p>
                  {[
                    { key: 'cont_pc', label: 'Contentieux procédures collectives', value: contPCVal, color: COL_CONT_PC },
                    { key: 'cont_comm', label: 'Contentieux commercial général', value: contCommVal, color: COL_CONT_COMM },
                  ].map(sub => (
                    <div key={sub.key} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ backgroundColor: sub.color }} />
                          <span className="text-xs font-sans text-foreground">{sub.label}</span>
                        </div>
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

              {/* Restructuring financier */}
              {hasRestr && (
                <div className="pt-3 border-t border-border space-y-3">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Restructuring financier</p>
                  <p className="text-[10px] text-muted-foreground font-sans -mt-1">Part de votre activité totale</p>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ backgroundColor: COL_RESTR_FINANCIER }} />
                        <span className="text-xs font-sans text-foreground">Restructuring financier</span>
                      </div>
                      <span className="text-xs font-sans font-bold text-foreground w-10 text-right">{restrFinancier}%</span>
                    </div>
                    <Slider
                      value={[restrFinancier]}
                      onValueChange={([v]) => store.setField('restrFinancier', v)}
                      min={0}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>
                </div>
              )}

              {/* Positionnement */}
              <div className="pt-4 border-t border-border space-y-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Positionnement dans les dossiers</p>
                <div className="space-y-2">
                  {POSITIONNEMENT_OPTIONS.map(opt => {
                    const isActive = store.positionnementRestr.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => toggleCheckbox('positionnementRestr', opt)}
                        className="flex items-center gap-3 w-full text-left group"
                      >
                        <div className={cn(
                          "w-4 h-4 rounded-sm border flex items-center justify-center transition-all",
                          isActive
                            ? "bg-foreground border-foreground"
                            : "border-border group-hover:border-foreground/40"
                        )}>
                          {isActive && <Check className="w-3 h-3 text-background" />}
                        </div>
                        <span className="text-xs font-sans text-foreground">{opt}</span>
                        {isActive && (
                          <div className="flex-1 h-1.5 rounded-full bg-foreground/15 ml-2">
                            <div className="h-full rounded-full bg-foreground/60" style={{ width: '100%' }} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Typologie de clientèle */}
              <div className="pt-4 border-t border-border space-y-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Typologie de clientèle</p>
                <div className="space-y-2">
                  {CLIENTELE_OPTIONS.map(opt => {
                    const isActive = store.clienteleRestr.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => toggleCheckbox('clienteleRestr', opt)}
                        className="flex items-center gap-3 w-full text-left group"
                      >
                        <div className={cn(
                          "w-4 h-4 rounded-sm border flex items-center justify-center transition-all",
                          isActive
                            ? "bg-foreground border-foreground"
                            : "border-border group-hover:border-foreground/40"
                        )}>
                          {isActive && <Check className="w-3 h-3 text-background" />}
                        </div>
                        <span className="text-xs font-sans text-foreground">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Clientèle FR vs étrangère */}
              <div className="pt-4 border-t border-border space-y-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Origine de la clientèle</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-sans text-foreground">Clientèle française</span>
                    <span className="text-xs font-sans font-bold text-foreground">{store.clienteleFrancaise}%</span>
                  </div>
                  <Slider value={[store.clienteleFrancaise]} onValueChange={([v]) => store.setField('clienteleFrancaise', v)} min={0} max={100} step={10} className="w-full" />
                  {/* Visual gauge */}
                  <div className="h-2.5 rounded-full overflow-hidden flex">
                    <div className="bg-foreground/70 h-full transition-all" style={{ width: `${store.clienteleFrancaise}%` }} />
                    <div className="bg-foreground/20 h-full transition-all" style={{ width: `${100 - store.clienteleFrancaise}%` }} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[10px] font-sans text-muted-foreground">Française {store.clienteleFrancaise}%</span>
                    <span className="text-[10px] font-sans text-muted-foreground">Étrangère {100 - store.clienteleFrancaise}%</span>
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
