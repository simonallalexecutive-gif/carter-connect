import { motion } from 'motion/react';
import { useRegistrationStore } from '@/stores/registrationStore';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useMemo } from 'react';
import { Check, Building2, Users, Briefcase, TrendingUp, Globe } from 'lucide-react';

/* ── Palette ── */
const COL_RESTR = 'hsl(215, 55%, 28%)';
const COL_CONT = 'hsl(35, 30%, 50%)';
const COL_AUTRES = 'hsl(200, 15%, 60%)';
const COL_AMIABLE = 'hsl(200, 50%, 45%)';
const COL_JUDICIAIRE = 'hsl(215, 45%, 38%)';
const COL_RESTR_FIN = 'hsl(45, 50%, 50%)';
const COL_CONT_PC = 'hsl(30, 35%, 45%)';
const COL_CONT_COMM = 'hsl(40, 25%, 60%)';

const POSITIONNEMENT_OPTIONS = ['Débiteurs', 'Créanciers', 'Actionnaires', 'Repreneurs / investisseurs'];
const CLIENTELE_OPTIONS = ['Startups', 'PME', 'ETI', 'Grands groupes industriels', 'Sociétés cotées'];

const MAIN_CATEGORIES = [
  { key: 'restr_restructuring', label: 'Restructuring', color: COL_RESTR },
  { key: 'restr_contentieux', label: 'Contentieux', color: COL_CONT },
  { key: 'restr_autres', label: 'Autres activités', color: COL_AUTRES },
];

const renderLabel = ({ cx, cy, midAngle, innerRadius: ir, outerRadius: or, value }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = ir + (or - ir) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  if (value < 8) return null;
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={600} fontFamily="Inter, sans-serif">
      {Math.round(value)}%
    </text>
  );
};

const tooltipStyle = {
  fontSize: '11px', fontFamily: 'Inter',
  background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))',
  borderRadius: '4px', color: 'hsl(var(--foreground))',
};

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

  /* ── Derived ── */
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

  /* ── CHART DATA: main pie with sub-segments ── */
  const mainChartData = useMemo(() => {
    if (!hasAny) return [];
    const segments: { name: string; value: number; color: string }[] = [];

    selected.forEach(c => {
      const pct = totalRaw > 0 ? Math.round(((store.pourcentages[c.key] || 10) / totalRaw) * 100) : 0;

      if (c.key === 'restr_restructuring' && pct > 0) {
        // Split into sub-segments
        const finPart = Math.round(pct * (restrFinancier / 100));
        const remaining = pct - finPart;
        const amiablePct = restrSubTotal > 0 ? Math.round(remaining * (amiableVal / restrSubTotal)) : Math.round(remaining / 2);
        const judiciairePct = remaining - amiablePct;

        if (amiablePct > 0) segments.push({ name: 'Amiable (restr.)', value: amiablePct, color: COL_AMIABLE });
        if (judiciairePct > 0) segments.push({ name: 'Judiciaire (restr.)', value: judiciairePct, color: COL_JUDICIAIRE });
        if (finPart > 0) segments.push({ name: 'Restr. financier', value: finPart, color: COL_RESTR_FIN });
      } else if (c.key === 'restr_contentieux' && pct > 0) {
        const pcPct = contSubTotal > 0 ? Math.round(pct * (contPCVal / contSubTotal)) : Math.round(pct / 2);
        const commPct = pct - pcPct;
        if (pcPct > 0) segments.push({ name: 'Cont. proc. collectives', value: pcPct, color: COL_CONT_PC });
        if (commPct > 0) segments.push({ name: 'Cont. commercial', value: commPct, color: COL_CONT_COMM });
      } else {
        segments.push({ name: c.label, value: pct, color: c.color });
      }
    });

    return segments;
  }, [selected, store.pourcentages, totalRaw, restrSubTotal, amiableVal, judiciaireVal, contSubTotal, contPCVal, contCommVal, restrFinancier, hasAny]);

  return (
    <div className="space-y-6">
      {/* ── Toggle chips ── */}
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

          {/* ══════ TWO-COLUMN LAYOUT ══════ */}
          <div className="flex gap-8 items-start flex-col lg:flex-row">

            {/* ── LEFT COLUMN: Camembert principal ── */}
            <div className="lg:w-[45%] space-y-5">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Répartition de l'activité</p>

              <div className="flex-shrink-0 mx-auto" style={{ width: 240 }}>
                <ResponsiveContainer width={240} height={240}>
                  <PieChart>
                    <Pie data={mainChartData} cx="50%" cy="50%" innerRadius={44} outerRadius={90} dataKey="value" paddingAngle={1.5} stroke="hsl(var(--background))" strokeWidth={2} label={renderLabel} labelLine={false}>
                      {mainChartData.map((seg, i) => <Cell key={i} fill={seg.color} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => [`${v}%`, '']} contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="space-y-1.5 px-2">
                {mainChartData.map(seg => (
                  <div key={seg.name} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: seg.color }} />
                    <span className="text-[11px] font-sans text-foreground/80 truncate">{seg.name}</span>
                    <span className="text-[11px] font-sans font-semibold text-foreground ml-auto">{seg.value}%</span>
                  </div>
                ))}
              </div>

              {/* Main sliders */}
              <div className="space-y-3 pt-2 border-t border-border">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Poids des catégories</p>
                {selected.map(c => {
                  const raw = store.pourcentages[c.key] || 10;
                  const pct = totalRaw > 0 ? Math.round((raw / totalRaw) * 100) : 0;
                  return (
                    <div key={c.key} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-sans text-foreground">{c.label}</span>
                        <span className="text-xs font-sans font-bold text-foreground">{pct}%</span>
                      </div>
                      <Slider value={[raw]} onValueChange={([v]) => handlePercentChange(c.key, v)} min={10} max={100} step={10} className="w-full" />
                    </div>
                  );
                })}
              </div>

              {/* Q1: Restructuring sub-breakdown */}
              {hasRestr && (
                <div className="space-y-3 pt-3 border-t border-border">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Détail restructuring</p>
                  <p className="text-[10px] text-muted-foreground font-sans italic">Procédures amiables vs. judiciaires</p>
                  {[
                    { key: 'amiable', label: 'Procédures amiables', sub: '(mandat ad hoc, conciliation)', val: amiableVal, color: COL_AMIABLE },
                    { key: 'judiciaire', label: 'Procédures judiciaires', sub: '(sauvegarde, RJ, LJ)', val: judiciaireVal, color: COL_JUDICIAIRE },
                  ].map(sub => (
                    <div key={sub.key} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: sub.color }} />
                          <span className="text-xs font-sans text-foreground">{sub.label}</span>
                        </div>
                        <span className="text-xs font-sans font-bold text-foreground">{restrSubTotal > 0 ? Math.round((sub.val / restrSubTotal) * 100) : 0}%</span>
                      </div>
                      <p className="text-[9px] text-muted-foreground font-sans ml-4">{sub.sub}</p>
                      <Slider value={[sub.val]} onValueChange={([v]) => handleSubChange('restr_restructuring', sub.key, v)} min={0} max={100} step={10} className="w-full" />
                    </div>
                  ))}
                </div>
              )}

              {/* Q2: Contentieux sub-breakdown */}
              {hasCont && (
                <div className="space-y-3 pt-3 border-t border-border">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Détail contentieux</p>
                  {[
                    { key: 'cont_pc', label: 'Cont. procédures collectives', val: contPCVal, color: COL_CONT_PC },
                    { key: 'cont_comm', label: 'Cont. commercial général', val: contCommVal, color: COL_CONT_COMM },
                  ].map(sub => (
                    <div key={sub.key} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: sub.color }} />
                          <span className="text-xs font-sans text-foreground">{sub.label}</span>
                        </div>
                        <span className="text-xs font-sans font-bold text-foreground">{contSubTotal > 0 ? Math.round((sub.val / contSubTotal) * 100) : 0}%</span>
                      </div>
                      <Slider value={[sub.val]} onValueChange={([v]) => handleSubChange('restr_contentieux', sub.key, v)} min={0} max={100} step={10} className="w-full" />
                    </div>
                  ))}
                </div>
              )}

              {/* Q3: Restructuring financier */}
              {hasRestr && (
                <div className="space-y-2 pt-3 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: COL_RESTR_FIN }} />
                      <span className="text-xs font-sans text-foreground">Restructuring financier</span>
                    </div>
                    <span className="text-xs font-sans font-bold text-foreground">{restrFinancier}%</span>
                  </div>
                  <Slider value={[restrFinancier]} onValueChange={([v]) => store.setField('restrFinancier', v)} min={0} max={100} step={10} className="w-full" />
                  <p className="text-[9px] text-muted-foreground font-sans">Part de votre activité totale en restructuring financier</p>
                </div>
              )}
            </div>

            {/* ── RIGHT COLUMN: Indicateurs complémentaires ── */}
            <div className="lg:w-[55%] space-y-5">

              {/* Q4: Positionnement */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Positionnement dans les dossiers</p>
                </div>
                <p className="text-[10px] text-muted-foreground font-sans">Vous intervenez principalement pour :</p>
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
                {/* Visual bar */}
                {store.positionnementRestr.length > 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-1 h-6 rounded-sm overflow-hidden">
                    {store.positionnementRestr.map((opt, i) => (
                      <div key={opt} className="flex-1 flex items-center justify-center text-[9px] font-sans font-medium text-background"
                        style={{ backgroundColor: `hsl(215, ${50 - i * 8}%, ${30 + i * 8}%)` }}>
                        {opt.split(' ')[0]}
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Q5: Typologie clientèle */}
              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Typologie de clientèle</p>
                </div>
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
                {/* Visual pills */}
                {store.clienteleRestr.length > 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap gap-1.5">
                    {store.clienteleRestr.map(opt => (
                      <span key={opt} className="px-2.5 py-1 rounded-sm bg-muted text-[10px] font-sans font-medium text-foreground">
                        {opt}
                      </span>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Q6: Origine clientèle */}
              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Origine de la clientèle</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-sans text-foreground">Française</span>
                    <span className="text-xs font-sans font-bold text-foreground">{store.clienteleFrancaise}%</span>
                  </div>
                  <Slider value={[store.clienteleFrancaise]} onValueChange={([v]) => store.setField('clienteleFrancaise', v)} min={0} max={100} step={10} className="w-full" />
                  {/* Gauge */}
                  <div className="h-3 rounded-full overflow-hidden flex border border-border">
                    <div className="bg-foreground/70 h-full transition-all duration-300" style={{ width: `${store.clienteleFrancaise}%` }} />
                    <div className="bg-foreground/15 h-full transition-all duration-300" style={{ width: `${100 - store.clienteleFrancaise}%` }} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[10px] font-sans text-muted-foreground">🇫🇷 Française {store.clienteleFrancaise}%</span>
                    <span className="text-[10px] font-sans text-muted-foreground">🌍 Étrangère {100 - store.clienteleFrancaise}%</span>
                  </div>
                </div>
              </div>

              {/* Taille des opérations */}
              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Taille des opérations</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Small cap', 'Mid cap', 'Large cap'].map(t => {
                    const active = (store.tailleOperations || []).includes(t);
                    return (
                      <button key={t} type="button"
                        onClick={() => {
                          const current = store.tailleOperations || [];
                          store.setField('tailleOperations', active ? current.filter(v => v !== t) : [...current, t]);
                        }}
                        className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-sans font-light transition-all duration-200 border",
                          active ? "bg-foreground text-background border-foreground" : "bg-transparent text-foreground border-border hover:border-foreground/40"
                        )}>
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
