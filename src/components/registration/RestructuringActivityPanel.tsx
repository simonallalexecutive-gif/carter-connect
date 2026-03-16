import { motion } from 'motion/react';
import { useRegistrationStore } from '@/stores/registrationStore';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useMemo } from 'react';
import { Check } from 'lucide-react';

/* ── colour palette ── */
const COL_RESTR = 'hsl(215, 55%, 28%)';
const COL_CONT = 'hsl(35, 30%, 55%)';
const COL_AUTRES = 'hsl(200, 15%, 65%)';
const COL_AMIABLE = 'hsl(215, 45%, 42%)';
const COL_JUDICIAIRE = 'hsl(215, 60%, 56%)';
const COL_RESTR_FIN = 'hsl(45, 40%, 55%)';

const POSITIONNEMENT_OPTIONS = ['Débiteurs', 'Créanciers', 'Actionnaires', 'Repreneurs / investisseurs'];
const CLIENTELE_OPTIONS = ['Startups', 'PME', 'ETI', 'Grands groupes industriels', 'Sociétés cotées'];

const MAIN_CATEGORIES = [
  { key: 'restr_restructuring', label: 'Restructuring', color: COL_RESTR },
  { key: 'restr_contentieux', label: 'Contentieux', color: COL_CONT },
  { key: 'restr_autres', label: 'Autres activités', color: COL_AUTRES },
];

/* ── Shared pie label renderer ── */
const renderLabel = ({ cx, cy, midAngle, innerRadius: ir, outerRadius: or, value }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = ir + (or - ir) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const pct = Math.round(value);
  if (pct < 8) return null;
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={600} fontFamily="Inter, sans-serif">
      {pct}%
    </text>
  );
};

const tooltipStyle = { fontSize: '11px', fontFamily: 'Inter', background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '4px', color: 'hsl(var(--foreground))' };

const RestructuringActivityPanel = () => {
  const store = useRegistrationStore();

  const handleToggle = (key: string) => {
    const next = { ...store.activites, [key]: !store.activites[key] };
    store.setField('activites', next);
    if (!store.activites[key]) {
      store.setField('pourcentages', { ...store.pourcentages, [key]: 10 });
    }
  };

  const handlePercentChange = (key: string, value: number) => {
    store.setField('pourcentages', { ...store.pourcentages, [key]: value });
  };

  const handleSubChange = (parent: string, child: string, value: number) => {
    const cur = store.sousActivites[parent] || {};
    store.setField('sousActivites', { ...store.sousActivites, [parent]: { ...cur, [child]: value } });
  };

  const toggleList = (field: 'positionnementRestr' | 'clienteleRestr', value: string) => {
    const cur = store[field];
    store.setField(field, cur.includes(value) ? cur.filter(v => v !== value) : [...cur, value]);
  };

  /* ── derived values ── */
  const selected = MAIN_CATEGORIES.filter(c => store.activites[c.key]);
  const hasAny = selected.length > 0;
  const totalRaw = useMemo(() => selected.reduce((s, c) => s + (store.pourcentages[c.key] || 10), 0), [selected, store.pourcentages]);

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

  /* ── CHART 1: main activity ── */
  const mainChartData = useMemo(() =>
    selected.map(c => ({
      name: c.label,
      value: totalRaw > 0 ? Math.round(((store.pourcentages[c.key] || 10) / totalRaw) * 100) : 0,
      color: c.color,
    })),
    [selected, store.pourcentages, totalRaw]
  );

  /* ── CHART 2: restructuring detail ── */
  const restrChartData = useMemo(() => {
    if (!hasRestr || restrSubTotal === 0) return [];
    const segs: { name: string; value: number; color: string }[] = [];

    // Restructuring financier portion
    const finPart = restrFinancier;
    const remaining = 100 - finPart;
    const amiablePct = Math.round((amiableVal / restrSubTotal) * remaining);
    const judiciairePct = remaining - amiablePct;

    segs.push({ name: 'Procédures amiables', value: amiablePct, color: COL_AMIABLE });
    segs.push({ name: 'Procédures judiciaires', value: judiciairePct, color: COL_JUDICIAIRE });
    if (finPart > 0) {
      segs.push({ name: 'Restructuring financier', value: finPart, color: COL_RESTR_FIN });
    }
    return segs;
  }, [hasRestr, restrSubTotal, amiableVal, judiciaireVal, restrFinancier]);

  return (
    <div className="space-y-6">
      {/* Toggle chips */}
      <div className="flex flex-wrap gap-2">
        {MAIN_CATEGORIES.map(c => {
          const active = store.activites[c.key];
          return (
            <button key={c.key} type="button" onClick={() => handleToggle(c.key)}
              className={cn(
                "inline-flex items-center gap-1.5 px-4 py-2 rounded-sm text-sm font-sans font-light transition-all duration-200 border",
                active ? "bg-foreground text-background border-foreground" : "bg-transparent text-foreground border-border hover:border-foreground/40"
              )}>
              {active && <Check className="w-3 h-3" />}
              {c.label}
            </button>
          );
        })}
      </div>

      {hasAny && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="carter-card p-6 space-y-6">
          <p className="carter-label">Répartition de votre activité</p>

          {/* ══════ TWO-COLUMN: charts ══════ */}
          <div className="flex gap-6 items-start flex-col lg:flex-row">

            {/* ── LEFT: Main pie chart + legend + sliders ── */}
            <div className="flex-1 space-y-4 min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Activité globale</p>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0" style={{ width: 180 }}>
                  <ResponsiveContainer width={180} height={180}>
                    <PieChart>
                      <Pie data={mainChartData} cx="50%" cy="50%" innerRadius={36} outerRadius={70} dataKey="value" paddingAngle={2} stroke="hsl(var(--background))" strokeWidth={2} label={renderLabel} labelLine={false}>
                        {mainChartData.map((seg, i) => <Cell key={i} fill={seg.color} />)}
                      </Pie>
                      <Tooltip formatter={(v: number) => [`${v}%`, '']} contentStyle={tooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                {/* Legend + sliders */}
                <div className="flex-1 space-y-3 pt-2">
                  {selected.map(c => {
                    const raw = store.pourcentages[c.key] || 10;
                    const pct = totalRaw > 0 ? Math.round((raw / totalRaw) * 100) : 0;
                    return (
                      <div key={c.key} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: c.color }} />
                            <span className="text-[11px] font-sans text-foreground">{c.label}</span>
                          </div>
                          <span className="text-[11px] font-sans font-bold text-foreground">{pct}%</span>
                        </div>
                        <Slider value={[raw]} onValueChange={([v]) => handlePercentChange(c.key, v)} min={10} max={100} step={10} className="w-full" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── RIGHT: Restructuring detail pie + indicators ── */}
            <div className="flex-1 space-y-4 min-w-0">
              {hasRestr && restrChartData.length > 0 && (
                <>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Détail restructuring</p>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0" style={{ width: 160 }}>
                      <ResponsiveContainer width={160} height={160}>
                        <PieChart>
                          <Pie data={restrChartData} cx="50%" cy="50%" innerRadius={30} outerRadius={62} dataKey="value" paddingAngle={2} stroke="hsl(var(--background))" strokeWidth={2} label={renderLabel} labelLine={false}>
                            {restrChartData.map((seg, i) => <Cell key={i} fill={seg.color} />)}
                          </Pie>
                          <Tooltip formatter={(v: number) => [`${v}%`, '']} contentStyle={tooltipStyle} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    {/* Legend */}
                    <div className="flex-1 space-y-2 pt-2">
                      {restrChartData.map(seg => (
                        <div key={seg.name} className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: seg.color }} />
                          <span className="text-[11px] font-sans text-foreground/80 truncate">{seg.name}</span>
                          <span className="text-[11px] font-sans font-semibold text-foreground ml-auto">{seg.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sub-sliders: Amiable / Judiciaire */}
                  <div className="space-y-2">
                    <p className="text-[10px] text-muted-foreground font-sans">(mandat ad hoc, conciliation vs. sauvegarde, RJ, LJ)</p>
                    {[
                      { key: 'amiable', label: 'Procédures amiables', val: amiableVal, color: COL_AMIABLE },
                      { key: 'judiciaire', label: 'Procédures judiciaires', val: judiciaireVal, color: COL_JUDICIAIRE },
                    ].map(sub => (
                      <div key={sub.key} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: sub.color }} />
                            <span className="text-xs font-sans text-foreground">{sub.label}</span>
                          </div>
                          <span className="text-xs font-sans font-bold text-foreground">{restrSubTotal > 0 ? Math.round((sub.val / restrSubTotal) * 100) : 0}%</span>
                        </div>
                        <Slider value={[sub.val]} onValueChange={([v]) => handleSubChange('restr_restructuring', sub.key, v)} min={0} max={100} step={10} className="w-full" />
                      </div>
                    ))}
                  </div>

                  {/* Restructuring financier */}
                  <div className="pt-2 border-t border-border space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: COL_RESTR_FIN }} />
                        <span className="text-xs font-sans text-foreground">Restructuring financier</span>
                      </div>
                      <span className="text-xs font-sans font-bold text-foreground">{restrFinancier}%</span>
                    </div>
                    <Slider value={[restrFinancier]} onValueChange={([v]) => store.setField('restrFinancier', v)} min={0} max={100} step={5} className="w-full" />
                    <p className="text-[10px] text-muted-foreground font-sans">Part de l'activité restructuring totale</p>
                  </div>
                </>
              )}

              {/* Contentieux sub-breakdown */}
              {hasCont && (
                <div className="pt-3 border-t border-border space-y-3">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Répartition contentieux</p>
                  {[
                    { key: 'cont_pc', label: 'Cont. procédures collectives', val: contPCVal },
                    { key: 'cont_comm', label: 'Cont. commercial général', val: contCommVal },
                  ].map(sub => (
                    <div key={sub.key} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-sans text-foreground">{sub.label}</span>
                        <span className="text-xs font-sans font-bold text-foreground">{contSubTotal > 0 ? Math.round((sub.val / contSubTotal) * 100) : 0}%</span>
                      </div>
                      <Slider value={[sub.val]} onValueChange={([v]) => handleSubChange('restr_contentieux', sub.key, v)} min={0} max={100} step={10} className="w-full" />
                    </div>
                  ))}
                </div>
              )}

              {/* Positionnement */}
              <div className="pt-4 border-t border-border space-y-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Positionnement dans les dossiers</p>
                <div className="flex flex-wrap gap-2">
                  {POSITIONNEMENT_OPTIONS.map(opt => {
                    const active = store.positionnementRestr.includes(opt);
                    return (
                      <button key={opt} type="button" onClick={() => toggleList('positionnementRestr', opt)}
                        className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-sans font-light transition-all duration-200 border",
                          active ? "bg-foreground text-background border-foreground" : "bg-transparent text-foreground border-border hover:border-foreground/40"
                        )}>
                        {active && <Check className="w-3 h-3" />}
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Typologie clientèle */}
              <div className="pt-4 border-t border-border space-y-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Typologie de clientèle</p>
                <div className="flex flex-wrap gap-2">
                  {CLIENTELE_OPTIONS.map(opt => {
                    const active = store.clienteleRestr.includes(opt);
                    return (
                      <button key={opt} type="button" onClick={() => toggleList('clienteleRestr', opt)}
                        className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-sans font-light transition-all duration-200 border",
                          active ? "bg-foreground text-background border-foreground" : "bg-transparent text-foreground border-border hover:border-foreground/40"
                        )}>
                        {active && <Check className="w-3 h-3" />}
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Origine clientèle */}
              <div className="pt-4 border-t border-border space-y-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Origine de la clientèle</p>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-sans text-foreground">Française</span>
                    <span className="text-xs font-sans font-bold text-foreground">{store.clienteleFrancaise}%</span>
                  </div>
                  <Slider value={[store.clienteleFrancaise]} onValueChange={([v]) => store.setField('clienteleFrancaise', v)} min={0} max={100} step={10} className="w-full" />
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
