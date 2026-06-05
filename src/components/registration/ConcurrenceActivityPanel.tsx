import { motion } from 'motion/react';
import { useRegistrationStore } from '@/stores/registrationStore';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useMemo } from 'react';
import { Check, Shield, Gavel, FileCheck, Building2, Scale } from 'lucide-react';

/* ── Palette ── */
const COL_CONCENTRATIONS = 'hsl(0, 0%, 8%)';
const COL_CONTENTIEUX = 'hsl(220, 45%, 22%)';
const COL_CONSEIL = 'hsl(0, 0%, 32%)';

const COL_CONC_NAT = 'hsl(30, 12%, 50%)';
const COL_CONC_EU = 'hsl(210, 35%, 58%)';
const COL_CONC_MULTI = 'hsl(35, 22%, 72%)';

const COL_CTX_CARTELS = 'hsl(0, 0%, 78%)';
const COL_CTX_ABUS = 'hsl(40, 28%, 90%)';
const COL_CTX_PRATIQUES = 'hsl(0, 0%, 8%)';

const COL_CONS_COMPLIANCE = 'hsl(220, 45%, 22%)';
const COL_CONS_CONTRATS = 'hsl(0, 0%, 32%)';
const COL_CONS_AUDIT = 'hsl(30, 12%, 50%)';

const MAIN_CATEGORIES = [
  { key: 'conc_concentrations', label: 'Contrôle des concentrations', color: COL_CONCENTRATIONS },
  { key: 'conc_contentieux', label: 'Contentieux / enquêtes', color: COL_CONTENTIEUX },
  { key: 'conc_conseil', label: 'Conseil / compliance', color: COL_CONSEIL },
];

const CONC_SUBS = [
  { key: 'nationales', label: 'Notifications nationales', color: COL_CONC_NAT },
  { key: 'europeennes', label: 'Notifications européennes', color: COL_CONC_EU },
  { key: 'multi', label: 'Coordination multi-juridictionnelle', color: COL_CONC_MULTI },
];

const CTX_SUBS = [
  { key: 'cartels', label: 'Cartels', color: COL_CTX_CARTELS },
  { key: 'abus', label: 'Abus de position dominante', color: COL_CTX_ABUS },
  { key: 'pratiques', label: 'Pratiques restrictives / déloyale', color: COL_CTX_PRATIQUES },
];

const CONS_SUBS = [
  { key: 'compliance', label: 'Compliance concurrence', color: COL_CONS_COMPLIANCE },
  { key: 'contrats', label: 'Contrats (distribution, accords)', color: COL_CONS_CONTRATS },
  { key: 'audit', label: 'Audit / risk assessment', color: COL_CONS_AUDIT },
];

const CONC_OPS_TYPES = ['Private Equity', 'M&A industriel', 'Joint-ventures', 'Opérations transfrontalières'];
const CTX_INTERVENTIONS = ['Enquêtes (dawn raids, inspections)', 'Procédures devant autorités', 'Contentieux indemnitaires (follow-on damages)'];
const CONS_MISSIONS = ['Programmes de compliance', 'Formations internes', 'Audits de risques', 'Structuration de réseaux de distribution'];
const SECTEURS = ['Tech / numérique', 'Industrie', 'Énergie', 'Santé / pharma', 'Distribution', 'Transport', 'Autres'];
const AUTORITES = ['Autorité de la concurrence (France)', 'Commission européenne', 'Autorités étrangères'];

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

const Chip = ({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) => (
  <button type="button" onClick={onClick}
    className={cn(
      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-sans font-light transition-all duration-200 border",
      active ? "bg-foreground text-background border-foreground" : "bg-transparent text-foreground border-border hover:border-foreground/40"
    )}>
    {active && <Check className="w-3 h-3" />}
    {label}
  </button>
);

const MiniPie = ({ data, size = 160 }: { data: { name: string; value: number; color: string }[]; size?: number }) => (
  <div className="mx-auto" style={{ width: size }}>
    <ResponsiveContainer width={size} height={size}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={size * 0.2} outerRadius={size * 0.42} dataKey="value" paddingAngle={1.5} stroke="hsl(var(--background))" strokeWidth={2} label={renderLabel} labelLine={false}>
          {data.map((seg, i) => <Cell key={i} fill={seg.color} />)}
        </Pie>
        <Tooltip formatter={(v: number) => [`${v}%`, '']} contentStyle={tooltipStyle} />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

const MiniLegend = ({ data }: { data: { name: string; value: number; color: string }[] }) => (
  <div className="space-y-1 px-2">
    {data.map(seg => (
      <div key={seg.name} className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: seg.color }} />
        <span className="text-[11px] font-sans text-foreground/80 truncate">{seg.name}</span>
        <span className="text-[11px] font-sans font-semibold text-foreground ml-auto">{seg.value}%</span>
      </div>
    ))}
  </div>
);

const ConcurrenceActivityPanel = () => {
  const store = useRegistrationStore();

  const handleToggle = (key: string) => {
    const next = { ...store.activites, [key]: !store.activites[key] };
    store.setField('activites', next);
    if (!store.activites[key]) {
      store.setField('pourcentages', { ...store.pourcentages, [key]: 10 });
    }
  };

  const handlePct = (key: string, value: number) => {
    store.setField('pourcentages', { ...store.pourcentages, [key]: value });
  };

  const handleSub = (parent: string, child: string, value: number) => {
    const cur = store.sousActivites[parent] || {};
    store.setField('sousActivites', { ...store.sousActivites, [parent]: { ...cur, [child]: value } });
  };

  const toggleArr = (field: 'concOpsTypes' | 'concCtxInterventions' | 'concConsMissions' | 'concSecteurs' | 'concAutorites', value: string) => {
    const cur = (store[field] as string[]) || [];
    store.setField(field, cur.includes(value) ? cur.filter(v => v !== value) : [...cur, value]);
  };

  /* ── Derived ── */
  const selected = MAIN_CATEGORIES.filter(c => store.activites[c.key]);
  const hasAny = selected.length > 0;
  const totalRaw = useMemo(() => selected.reduce((s, c) => s + (store.pourcentages[c.key] || 10), 0), [selected, store.pourcentages]);

  const hasConc = store.activites['conc_concentrations'];
  const hasCtx = store.activites['conc_contentieux'];
  const hasCons = store.activites['conc_conseil'];

  /* ── Main chart ── */
  const mainChartData = useMemo(() =>
    selected.map(c => ({
      name: c.label,
      value: totalRaw > 0 ? Math.round(((store.pourcentages[c.key] || 10) / totalRaw) * 100) : 0,
      color: c.color,
    })),
    [selected, store.pourcentages, totalRaw]
  );

  /* ── Sub charts ── */
  const buildSubChart = (parentKey: string, subs: typeof CONC_SUBS) => {
    const vals = store.sousActivites[parentKey] || {};
    const items = subs.map(s => ({ ...s, raw: vals[s.key] ?? Math.round(100 / subs.length) }));
    const total = items.reduce((s, i) => s + i.raw, 0);
    return items.map(i => ({ name: i.label, value: total > 0 ? Math.round((i.raw / total) * 100) : 0, color: i.color }));
  };

  const concChart = useMemo(() => hasConc ? buildSubChart('conc_concentrations', CONC_SUBS) : [], [hasConc, store.sousActivites]);
  const ctxChart = useMemo(() => hasCtx ? buildSubChart('conc_contentieux', CTX_SUBS) : [], [hasCtx, store.sousActivites]);
  const consChart = useMemo(() => hasCons ? buildSubChart('conc_conseil', CONS_SUBS) : [], [hasCons, store.sousActivites]);

  const concAcquereur = store.concAcquereur ?? 50;
  const ctxDefense = store.concCtxDefense ?? 50;
  const concDomestique = store.concDomestique ?? 50;

  return (
    <div className="space-y-6">
      {/* Toggle chips */}
      <div className="flex flex-wrap gap-2">
        {MAIN_CATEGORIES.map(c => (
          <Chip key={c.key} active={!!store.activites[c.key]} label={c.label} onClick={() => handleToggle(c.key)} />
        ))}
      </div>

      {hasAny && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="carter-card p-6 space-y-6">
          <div className="flex gap-8 items-start flex-col lg:flex-row">

            {/* ── LEFT: Main pie + sliders ── */}
            <div className="lg:w-[45%] space-y-5 bg-white border border-gray-200 rounded-sm p-5">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Structure de l'activité concurrence</p>
              <MiniPie data={mainChartData} size={240} />
              <MiniLegend data={mainChartData} />

              {/* Sliders */}
              <div className="space-y-3 pt-3 border-t border-border">
                {selected.map(c => {
                  const raw = store.pourcentages[c.key] || 10;
                  const pct = totalRaw > 0 ? Math.round((raw / totalRaw) * 100) : 0;
                  return (
                    <div key={c.key} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-sans text-foreground">{c.label}</span>
                        <span className="text-xs font-sans font-bold text-foreground">{pct}%</span>
                      </div>
                      <Slider value={[raw]} onValueChange={([v]) => handlePct(c.key, v)} min={10} max={100} step={10} className="w-full" />
                    </div>
                  );
                })}
              </div>

              {/* Dimension internationale */}
              <div className="space-y-3 pt-3 border-t border-border">
                <div className="flex items-center gap-2">
                  
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Dimension internationale</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-sans text-foreground">Dossiers domestiques</span>
                    <span className="text-xs font-sans font-bold text-foreground">{concDomestique}%</span>
                  </div>
                  <Slider value={[concDomestique]} onValueChange={([v]) => store.setField('concDomestique', v)} min={0} max={100} step={10} className="w-full" />
                  <div className="h-3 rounded-full overflow-hidden flex border border-border">
                    <div className="bg-foreground/70 h-full transition-all duration-300" style={{ width: `${concDomestique}%` }} />
                    <div className="bg-foreground/15 h-full transition-all duration-300" style={{ width: `${100 - concDomestique}%` }} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[10px] font-sans text-muted-foreground">FR Domestique {concDomestique}%</span>
                    <span className="text-[10px] font-sans text-muted-foreground">International International {100 - concDomestique}%</span>
                  </div>
                </div>
              </div>

              {/* Secteurs d'intervention */}
              <div className="space-y-3 pt-3 border-t border-border">
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Secteurs d'intervention</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {SECTEURS.map(s => (
                    <Chip key={s} active={(store.concSecteurs || []).includes(s)} label={s} onClick={() => toggleArr('concSecteurs', s)} />
                  ))}
                </div>
              </div>

              {/* Autorités de référence */}
              <div className="space-y-3 pt-3 border-t border-border">
                <div className="flex items-center gap-2">
                  <Scale className="w-3.5 h-3.5 text-muted-foreground" />
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Autorités de référence</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {AUTORITES.map(a => (
                    <Chip key={a} active={(store.concAutorites || []).includes(a)} label={a} onClick={() => toggleArr('concAutorites', a)} />
                  ))}
                </div>
              </div>
            </div>

            {/* ── RIGHT: Sub-charts + indicators ── */}
            <div className="lg:w-[55%] space-y-6">

              {/* ═══ CONTRÔLE DES CONCENTRATIONS ═══ */}
              {hasConc && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-muted-foreground" />
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Détail Concentrations</p>
                  </div>
                  <div className="flex gap-4 items-start">
                    <MiniPie data={concChart} size={140} />
                    <div className="flex-1 space-y-2 pt-1">
                      <MiniLegend data={concChart} />
                    </div>
                  </div>
                  {/* Sub-sliders */}
                  <div className="space-y-2">
                    {CONC_SUBS.map(sub => {
                      const vals = store.sousActivites['conc_concentrations'] || {};
                      const raw = vals[sub.key] ?? 33;
                      const total = CONC_SUBS.reduce((s, ss) => s + (vals[ss.key] ?? 33), 0);
                      const pct = total > 0 ? Math.round((raw / total) * 100) : 0;
                      return (
                        <div key={sub.key} className="space-y-0.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: sub.color }} />
                              <span className="text-[11px] font-sans text-foreground">{sub.label}</span>
                            </div>
                            <span className="text-[11px] font-sans font-bold text-foreground">{pct}%</span>
                          </div>
                          <Slider value={[raw]} onValueChange={([v]) => handleSub('conc_concentrations', sub.key, v)} min={0} max={100} step={10} className="w-full" />
                        </div>
                      );
                    })}
                  </div>
                  {/* Positionnement acquéreur / vendeur */}
                  <div className="space-y-2 pt-2 border-t border-border">
                    <p className="text-[10px] text-muted-foreground font-sans font-medium uppercase tracking-wider">Positionnement opérations</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-sans text-foreground">Côté acquéreur</span>
                      <span className="text-xs font-sans font-bold text-foreground">{concAcquereur}%</span>
                    </div>
                    <Slider value={[concAcquereur]} onValueChange={([v]) => store.setField('concAcquereur', v)} min={0} max={100} step={10} className="w-full" />
                    <div className="h-2.5 rounded-full overflow-hidden flex border border-border">
                      <div className="h-full transition-all duration-300" style={{ width: `${concAcquereur}%`, backgroundColor: COL_CONCENTRATIONS }} />
                      <div className="h-full transition-all duration-300" style={{ width: `${100 - concAcquereur}%`, backgroundColor: 'hsl(220, 45%, 22%)' }} />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[10px] font-sans text-muted-foreground">Acquéreur {concAcquereur}%</span>
                      <span className="text-[10px] font-sans text-muted-foreground">Vendeur {100 - concAcquereur}%</span>
                    </div>
                  </div>
                  {/* Types d'opérations */}
                  <div className="space-y-2 pt-2 border-t border-border">
                    <p className="text-[10px] text-muted-foreground font-sans font-medium uppercase tracking-wider">Types d'opérations</p>
                    <div className="flex flex-wrap gap-1.5">
                      {CONC_OPS_TYPES.map(s => (
                        <Chip key={s} active={(store.concOpsTypes || []).includes(s)} label={s} onClick={() => toggleArr('concOpsTypes', s)} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ═══ CONTENTIEUX / ENQUÊTES ═══ */}
              {hasCtx && (
                <div className={cn("space-y-4", hasConc && "pt-4 border-t border-border")}>
                  <div className="flex items-center gap-2">
                    <Gavel className="w-3.5 h-3.5 text-muted-foreground" />
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Détail Contentieux / enquêtes</p>
                  </div>
                  <div className="flex gap-4 items-start">
                    <MiniPie data={ctxChart} size={140} />
                    <div className="flex-1 space-y-2 pt-1">
                      <MiniLegend data={ctxChart} />
                    </div>
                  </div>
                  {/* Sub-sliders */}
                  <div className="space-y-2">
                    {CTX_SUBS.map(sub => {
                      const vals = store.sousActivites['conc_contentieux'] || {};
                      const raw = vals[sub.key] ?? 33;
                      const total = CTX_SUBS.reduce((s, ss) => s + (vals[ss.key] ?? 33), 0);
                      const pct = total > 0 ? Math.round((raw / total) * 100) : 0;
                      return (
                        <div key={sub.key} className="space-y-0.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: sub.color }} />
                              <span className="text-[11px] font-sans text-foreground">{sub.label}</span>
                            </div>
                            <span className="text-[11px] font-sans font-bold text-foreground">{pct}%</span>
                          </div>
                          <Slider value={[raw]} onValueChange={([v]) => handleSub('conc_contentieux', sub.key, v)} min={0} max={100} step={10} className="w-full" />
                        </div>
                      );
                    })}
                  </div>
                  {/* Types d'intervention */}
                  <div className="space-y-2 pt-2 border-t border-border">
                    <p className="text-[10px] text-muted-foreground font-sans font-medium uppercase tracking-wider">Types d'intervention</p>
                    <div className="flex flex-wrap gap-1.5">
                      {CTX_INTERVENTIONS.map(s => (
                        <Chip key={s} active={(store.concCtxInterventions || []).includes(s)} label={s} onClick={() => toggleArr('concCtxInterventions', s)} />
                      ))}
                    </div>
                  </div>
                  {/* Positionnement défense / plaignant */}
                  <div className="space-y-2 pt-2 border-t border-border">
                    <p className="text-[10px] text-muted-foreground font-sans font-medium uppercase tracking-wider">Positionnement contentieux</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-sans text-foreground">Défense</span>
                      <span className="text-xs font-sans font-bold text-foreground">{ctxDefense}%</span>
                    </div>
                    <Slider value={[ctxDefense]} onValueChange={([v]) => store.setField('concCtxDefense', v)} min={0} max={100} step={10} className="w-full" />
                    <div className="h-2.5 rounded-full overflow-hidden flex border border-border">
                      <div className="h-full transition-all duration-300" style={{ width: `${ctxDefense}%`, backgroundColor: COL_CONTENTIEUX }} />
                      <div className="h-full transition-all duration-300" style={{ width: `${100 - ctxDefense}%`, backgroundColor: 'hsl(220, 45%, 22%)' }} />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[10px] font-sans text-muted-foreground">Défense {ctxDefense}%</span>
                      <span className="text-[10px] font-sans text-muted-foreground">Plaignant {100 - ctxDefense}%</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ═══ CONSEIL / COMPLIANCE ═══ */}
              {hasCons && (
                <div className={cn("space-y-4", (hasConc || hasCtx) && "pt-4 border-t border-border")}>
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-3.5 h-3.5 text-muted-foreground" />
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Détail Conseil / compliance</p>
                  </div>
                  <div className="flex gap-4 items-start">
                    <MiniPie data={consChart} size={140} />
                    <div className="flex-1 space-y-2 pt-1">
                      <MiniLegend data={consChart} />
                    </div>
                  </div>
                  {/* Sub-sliders */}
                  <div className="space-y-2">
                    {CONS_SUBS.map(sub => {
                      const vals = store.sousActivites['conc_conseil'] || {};
                      const raw = vals[sub.key] ?? 33;
                      const total = CONS_SUBS.reduce((s, ss) => s + (vals[ss.key] ?? 33), 0);
                      const pct = total > 0 ? Math.round((raw / total) * 100) : 0;
                      return (
                        <div key={sub.key} className="space-y-0.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: sub.color }} />
                              <span className="text-[11px] font-sans text-foreground">{sub.label}</span>
                            </div>
                            <span className="text-[11px] font-sans font-bold text-foreground">{pct}%</span>
                          </div>
                          <Slider value={[raw]} onValueChange={([v]) => handleSub('conc_conseil', sub.key, v)} min={0} max={100} step={10} className="w-full" />
                        </div>
                      );
                    })}
                  </div>
                  {/* Types de missions */}
                  <div className="space-y-2 pt-2 border-t border-border">
                    <p className="text-[10px] text-muted-foreground font-sans font-medium uppercase tracking-wider">Types de missions</p>
                    <div className="flex flex-wrap gap-1.5">
                      {CONS_MISSIONS.map(s => (
                        <Chip key={s} active={(store.concConsMissions || []).includes(s)} label={s} onClick={() => toggleArr('concConsMissions', s)} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ConcurrenceActivityPanel;
