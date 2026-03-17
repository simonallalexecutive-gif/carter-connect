import { motion } from 'motion/react';
import { useRegistrationStore } from '@/stores/registrationStore';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useMemo } from 'react';
import { Check, Globe, TrendingUp, Gavel, FileCheck, Building2, Tag, BarChart3 } from 'lucide-react';

/* ── Palette ── */
const COL_TRANSAC = 'hsl(215, 55%, 28%)';
const COL_CONTENTIEUX = 'hsl(35, 35%, 48%)';
const COL_CONSEIL = 'hsl(160, 35%, 38%)';

const COL_TR_PE = 'hsl(215, 50%, 35%)';
const COL_TR_MA = 'hsl(215, 40%, 48%)';
const COL_TR_RESTR = 'hsl(210, 45%, 55%)';
const COL_TR_INTL = 'hsl(220, 35%, 62%)';

const COL_CTX_CTRL = 'hsl(30, 40%, 42%)';
const COL_CTX_POST = 'hsl(45, 35%, 50%)';
const COL_CTX_NEGO = 'hsl(40, 25%, 58%)';

const COL_CON_STRUCT = 'hsl(155, 35%, 35%)';
const COL_CON_OPS = 'hsl(170, 30%, 48%)';
const COL_CON_INTL = 'hsl(165, 25%, 56%)';
const COL_CON_PATRI = 'hsl(180, 20%, 42%)';

const MAIN_CATEGORIES = [
  { key: 'fisc_transac', label: 'Fiscalité transactionnelle', color: COL_TRANSAC },
  { key: 'fisc_contentieux', label: 'Fiscalité contentieuse', color: COL_CONTENTIEUX },
  { key: 'fisc_conseil', label: 'Fiscalité conseil / structuration', color: COL_CONSEIL },
];

const TRANSAC_SUBS = [
  { key: 'pe', label: 'Private Equity', color: COL_TR_PE },
  { key: 'ma_indus', label: 'M&A industriel', color: COL_TR_MA },
  { key: 'restr_intra', label: 'Restructurations intra-groupe', color: COL_TR_RESTR },
  { key: 'intl', label: 'Opérations internationales', color: COL_TR_INTL },
];

const CTX_SUBS = [
  { key: 'controles', label: 'Contrôles fiscaux', color: COL_CTX_CTRL },
  { key: 'post_redress', label: 'Contentieux post-redressement', color: COL_CTX_POST },
  { key: 'negotiations', label: 'Négociations avec l\'administration', color: COL_CTX_NEGO },
];

const CONS_SUBS = [
  { key: 'structuration', label: 'Structuration fiscale', color: COL_CON_STRUCT },
  { key: 'operationnelle', label: 'Fiscalité opérationnelle', color: COL_CON_OPS },
  { key: 'internationale', label: 'Fiscalité internationale', color: COL_CON_INTL },
  { key: 'patrimoniale', label: 'Fiscalité patrimoniale', color: COL_CON_PATRI },
];

const TRANSAC_OPS = ['LBO', 'Build-up', 'Carve-out', 'Reorganisation de groupe'];
const CTX_DOSSIERS = ['Fiscalité des sociétés', 'Fiscalité internationale', 'Prix de transfert', 'TVA', 'Fiscalité personnelle (dirigeants, actionnaires)'];
const CONS_MISSIONS = ['Structuration d\'investissements', 'Optimisation fiscale', 'Mise en conformité', 'Assistance récurrente'];
const CLIENTELE = ['Fonds d\'investissement', 'Grands groupes', 'PME / ETI', 'Dirigeants / personnes physiques'];
const COMPLEXITE = ['Dossiers standard', 'Dossiers complexes', 'Dossiers très complexes / structurants'];
const SPECIALISATIONS = ['Fiscalité des sociétés', 'Fiscalité internationale', 'Prix de transfert', 'TVA', 'Fiscalité patrimoniale', 'Management packages'];

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

const FiscalActivityPanel = () => {
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

  const toggleArr = (field: 'fiscTransacOps' | 'fiscCtxDossiers' | 'fiscConsMissions' | 'fiscClientele' | 'fiscComplexite' | 'fiscSpecialisations', value: string) => {
    const cur = (store[field] as string[]) || [];
    store.setField(field, cur.includes(value) ? cur.filter(v => v !== value) : [...cur, value]);
  };

  const selected = MAIN_CATEGORIES.filter(c => store.activites[c.key]);
  const hasAny = selected.length > 0;
  const totalRaw = useMemo(() => selected.reduce((s, c) => s + (store.pourcentages[c.key] || 10), 0), [selected, store.pourcentages]);

  const hasTransac = store.activites['fisc_transac'];
  const hasCtx = store.activites['fisc_contentieux'];
  const hasCons = store.activites['fisc_conseil'];

  const mainChartData = useMemo(() =>
    selected.map(c => ({
      name: c.label,
      value: totalRaw > 0 ? Math.round(((store.pourcentages[c.key] || 10) / totalRaw) * 100) : 0,
      color: c.color,
    })),
    [selected, store.pourcentages, totalRaw]
  );

  const buildSubChart = (parentKey: string, subs: { key: string; label: string; color: string }[]) => {
    const vals = store.sousActivites[parentKey] || {};
    const items = subs.map(s => ({ ...s, raw: vals[s.key] ?? Math.round(100 / subs.length) }));
    const total = items.reduce((s, i) => s + i.raw, 0);
    return items.map(i => ({ name: i.label, value: total > 0 ? Math.round((i.raw / total) * 100) : 0, color: i.color }));
  };

  const transacChart = useMemo(() => hasTransac ? buildSubChart('fisc_transac', TRANSAC_SUBS) : [], [hasTransac, store.sousActivites]);
  const ctxChart = useMemo(() => hasCtx ? buildSubChart('fisc_contentieux', CTX_SUBS) : [], [hasCtx, store.sousActivites]);
  const consChart = useMemo(() => hasCons ? buildSubChart('fisc_conseil', CONS_SUBS) : [], [hasCons, store.sousActivites]);

  const fiscInvestisseur = store.fiscInvestisseur ?? 50;
  const fiscCtxDefense = store.fiscCtxDefense ?? 50;
  const fiscDomestique = store.fiscDomestique ?? 50;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {MAIN_CATEGORIES.map(c => (
          <Chip key={c.key} active={!!store.activites[c.key]} label={c.label} onClick={() => handleToggle(c.key)} />
        ))}
      </div>

      {hasAny && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="carter-card p-6 space-y-6">
          <div className="flex gap-8 items-start flex-col lg:flex-row">

            {/* ── LEFT ── */}
            <div className="lg:w-[45%] space-y-5">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Structure de l'activité fiscale</p>
              <MiniPie data={mainChartData} size={240} />
              <MiniLegend data={mainChartData} />

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
                  <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Dimension internationale</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-sans text-foreground">Dossiers domestiques</span>
                    <span className="text-xs font-sans font-bold text-foreground">{fiscDomestique}%</span>
                  </div>
                  <Slider value={[fiscDomestique]} onValueChange={([v]) => store.setField('fiscDomestique', v)} min={0} max={100} step={5} className="w-full" />
                  <div className="h-3 rounded-full overflow-hidden flex border border-border">
                    <div className="bg-foreground/70 h-full transition-all duration-300" style={{ width: `${fiscDomestique}%` }} />
                    <div className="bg-foreground/15 h-full transition-all duration-300" style={{ width: `${100 - fiscDomestique}%` }} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[10px] font-sans text-muted-foreground">🇫🇷 Domestique {fiscDomestique}%</span>
                    <span className="text-[10px] font-sans text-muted-foreground">🌍 International {100 - fiscDomestique}%</span>
                  </div>
                </div>
              </div>

              {/* Clientèle */}
              <div className="space-y-3 pt-3 border-t border-border">
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Typologie de clientèle</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {CLIENTELE.map(s => (
                    <Chip key={s} active={(store.fiscClientele || []).includes(s)} label={s} onClick={() => toggleArr('fiscClientele', s)} />
                  ))}
                </div>
              </div>

              {/* Complexité */}
              <div className="space-y-3 pt-3 border-t border-border">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-3.5 h-3.5 text-muted-foreground" />
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Complexité des dossiers</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {COMPLEXITE.map(s => (
                    <Chip key={s} active={(store.fiscComplexite || []).includes(s)} label={s} onClick={() => toggleArr('fiscComplexite', s)} />
                  ))}
                </div>
              </div>

              {/* Spécialisations */}
              <div className="space-y-3 pt-3 border-t border-border">
                <div className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-muted-foreground" />
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Spécialisations clés</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {SPECIALISATIONS.map(s => (
                    <Chip key={s} active={(store.fiscSpecialisations || []).includes(s)} label={s} onClick={() => toggleArr('fiscSpecialisations', s)} />
                  ))}
                </div>
              </div>
            </div>

            {/* ── RIGHT ── */}
            <div className="lg:w-[55%] space-y-6">

              {/* ═══ TRANSACTIONNEL ═══ */}
              {hasTransac && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Détail Transactionnel</p>
                  </div>
                  <div className="flex gap-4 items-start">
                    <MiniPie data={transacChart} size={140} />
                    <div className="flex-1 space-y-2 pt-1"><MiniLegend data={transacChart} /></div>
                  </div>
                  <div className="space-y-2">
                    {TRANSAC_SUBS.map(sub => {
                      const vals = store.sousActivites['fisc_transac'] || {};
                      const raw = vals[sub.key] ?? 25;
                      const total = TRANSAC_SUBS.reduce((s, ss) => s + (vals[ss.key] ?? 25), 0);
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
                          <Slider value={[raw]} onValueChange={([v]) => handleSub('fisc_transac', sub.key, v)} min={0} max={100} step={10} className="w-full" />
                        </div>
                      );
                    })}
                  </div>
                  {/* Positionnement investisseur / entreprise */}
                  <div className="space-y-2 pt-2 border-t border-border">
                    <p className="text-[10px] text-muted-foreground font-sans font-medium uppercase tracking-wider">Positionnement transactionnel</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-sans text-foreground">Côté investisseur / fonds</span>
                      <span className="text-xs font-sans font-bold text-foreground">{fiscInvestisseur}%</span>
                    </div>
                    <Slider value={[fiscInvestisseur]} onValueChange={([v]) => store.setField('fiscInvestisseur', v)} min={0} max={100} step={5} className="w-full" />
                    <div className="h-2.5 rounded-full overflow-hidden flex border border-border">
                      <div className="h-full transition-all duration-300" style={{ width: `${fiscInvestisseur}%`, backgroundColor: COL_TRANSAC }} />
                      <div className="h-full transition-all duration-300" style={{ width: `${100 - fiscInvestisseur}%`, backgroundColor: 'hsl(200, 15%, 60%)' }} />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[10px] font-sans text-muted-foreground">Investisseur {fiscInvestisseur}%</span>
                      <span className="text-[10px] font-sans text-muted-foreground">Entreprise {100 - fiscInvestisseur}%</span>
                    </div>
                  </div>
                  {/* Types d'opérations */}
                  <div className="space-y-2 pt-2 border-t border-border">
                    <p className="text-[10px] text-muted-foreground font-sans font-medium uppercase tracking-wider">Types d'opérations</p>
                    <div className="flex flex-wrap gap-1.5">
                      {TRANSAC_OPS.map(s => (
                        <Chip key={s} active={(store.fiscTransacOps || []).includes(s)} label={s} onClick={() => toggleArr('fiscTransacOps', s)} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ═══ CONTENTIEUX ═══ */}
              {hasCtx && (
                <div className={cn("space-y-4", hasTransac && "pt-4 border-t border-border")}>
                  <div className="flex items-center gap-2">
                    <Gavel className="w-3.5 h-3.5 text-muted-foreground" />
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Détail Contentieux fiscal</p>
                  </div>
                  <div className="flex gap-4 items-start">
                    <MiniPie data={ctxChart} size={140} />
                    <div className="flex-1 space-y-2 pt-1"><MiniLegend data={ctxChart} /></div>
                  </div>
                  <div className="space-y-2">
                    {CTX_SUBS.map(sub => {
                      const vals = store.sousActivites['fisc_contentieux'] || {};
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
                          <Slider value={[raw]} onValueChange={([v]) => handleSub('fisc_contentieux', sub.key, v)} min={0} max={100} step={10} className="w-full" />
                        </div>
                      );
                    })}
                  </div>
                  {/* Type de dossiers */}
                  <div className="space-y-2 pt-2 border-t border-border">
                    <p className="text-[10px] text-muted-foreground font-sans font-medium uppercase tracking-wider">Types de dossiers</p>
                    <div className="flex flex-wrap gap-1.5">
                      {CTX_DOSSIERS.map(s => (
                        <Chip key={s} active={(store.fiscCtxDossiers || []).includes(s)} label={s} onClick={() => toggleArr('fiscCtxDossiers', s)} />
                      ))}
                    </div>
                  </div>
                  {/* Positionnement défense / négociation */}
                  <div className="space-y-2 pt-2 border-t border-border">
                    <p className="text-[10px] text-muted-foreground font-sans font-medium uppercase tracking-wider">Positionnement contentieux</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-sans text-foreground">Défense contribuable</span>
                      <span className="text-xs font-sans font-bold text-foreground">{fiscCtxDefense}%</span>
                    </div>
                    <Slider value={[fiscCtxDefense]} onValueChange={([v]) => store.setField('fiscCtxDefense', v)} min={0} max={100} step={5} className="w-full" />
                    <div className="h-2.5 rounded-full overflow-hidden flex border border-border">
                      <div className="h-full transition-all duration-300" style={{ width: `${fiscCtxDefense}%`, backgroundColor: COL_CONTENTIEUX }} />
                      <div className="h-full transition-all duration-300" style={{ width: `${100 - fiscCtxDefense}%`, backgroundColor: 'hsl(200, 15%, 60%)' }} />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[10px] font-sans text-muted-foreground">Défense {fiscCtxDefense}%</span>
                      <span className="text-[10px] font-sans text-muted-foreground">Négociation {100 - fiscCtxDefense}%</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ═══ CONSEIL / STRUCTURATION ═══ */}
              {hasCons && (
                <div className={cn("space-y-4", (hasTransac || hasCtx) && "pt-4 border-t border-border")}>
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-3.5 h-3.5 text-muted-foreground" />
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Détail Conseil / structuration</p>
                  </div>
                  <div className="flex gap-4 items-start">
                    <MiniPie data={consChart} size={140} />
                    <div className="flex-1 space-y-2 pt-1"><MiniLegend data={consChart} /></div>
                  </div>
                  <div className="space-y-2">
                    {CONS_SUBS.map(sub => {
                      const vals = store.sousActivites['fisc_conseil'] || {};
                      const raw = vals[sub.key] ?? 25;
                      const total = CONS_SUBS.reduce((s, ss) => s + (vals[ss.key] ?? 25), 0);
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
                          <Slider value={[raw]} onValueChange={([v]) => handleSub('fisc_conseil', sub.key, v)} min={0} max={100} step={10} className="w-full" />
                        </div>
                      );
                    })}
                  </div>
                  {/* Types de missions */}
                  <div className="space-y-2 pt-2 border-t border-border">
                    <p className="text-[10px] text-muted-foreground font-sans font-medium uppercase tracking-wider">Types de missions</p>
                    <div className="flex flex-wrap gap-1.5">
                      {CONS_MISSIONS.map(s => (
                        <Chip key={s} active={(store.fiscConsMissions || []).includes(s)} label={s} onClick={() => toggleArr('fiscConsMissions', s)} />
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

export default FiscalActivityPanel;
