import { motion } from 'motion/react';
import { useRegistrationStore } from '@/stores/registrationStore';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useMemo } from 'react';
import { Check, Globe, Building2, TrendingUp, Briefcase, Target } from 'lucide-react';

/* ── Palette ── */
const COL_PE = 'hsl(215, 55%, 28%)';
const COL_MA = 'hsl(35, 35%, 48%)';
const COL_VC = 'hsl(160, 35%, 38%)';
const COL_AUTRES = 'hsl(200, 15%, 60%)';

const COL_PE_LBO = 'hsl(215, 50%, 35%)';
const COL_PE_MBO = 'hsl(215, 40%, 48%)';
const COL_PE_PTP = 'hsl(210, 45%, 55%)';
const COL_PE_PIPE = 'hsl(220, 35%, 62%)';

const COL_MA_INDUS = 'hsl(30, 40%, 42%)';
const COL_MA_SANTE = 'hsl(45, 35%, 50%)';
const COL_MA_PUB = 'hsl(40, 25%, 58%)';

const COL_VC_LEVEES = 'hsl(155, 35%, 35%)';
const COL_VC_CORP = 'hsl(170, 30%, 48%)';

const MAIN_CATEGORIES = [
  { key: 'ma_pe', label: 'Private Equity', color: COL_PE },
  { key: 'ma_ma', label: 'M&A', color: COL_MA },
  { key: 'ma_vc', label: 'Venture Capital', color: COL_VC },
  { key: 'ma_autres', label: 'Autres', color: COL_AUTRES },
];

const PE_SUBS = [
  { key: 'lbo', label: 'LBO', color: COL_PE_LBO },
  { key: 'mbo', label: 'MBO / Management', color: COL_PE_MBO },
  { key: 'ptp', label: 'Public-to-Private', color: COL_PE_PTP },
  { key: 'pipe', label: 'PIPE', color: COL_PE_PIPE },
];

const MA_SUBS = [
  { key: 'industriel', label: 'M&A industriel', color: COL_MA_INDUS },
  { key: 'sante', label: 'M&A santé', color: COL_MA_SANTE },
  { key: 'public', label: 'Public M&A', color: COL_MA_PUB },
];

const VC_SUBS = [
  { key: 'levees', label: 'Levées de fonds', color: COL_VC_LEVEES },
  { key: 'corporate', label: 'Corporate / structuration', color: COL_VC_CORP },
];

const MA_INDUS_SECTEURS = ['Production / industrie', 'Ingénierie', 'Fabrication', 'Luxe', 'Hôtellerie', 'Énergie', 'Infrastructure / construction', 'Logistique'];
const MA_INDUS_CLIENTELE = ['PME', 'Family offices', 'Entreprises détenues par des investisseurs privés'];
const MA_SANTE_CLIENTELE = ['Cliniques', 'Laboratoires', 'Medtech', 'Biotech', 'Pharmaceutique'];
const VC_STADES = ['Seed', 'Série A', 'Série B', 'Série C ou plus'];

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

/* ── Chip button helper ── */
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

/* ── Small pie helper ── */
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

const MaActivityPanel = () => {
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

  const toggleArr = (field: 'maIndusSecteurs' | 'maIndusClientele' | 'maSanteClientele' | 'maVcStades', value: string) => {
    const cur = (store[field] as string[]) || [];
    store.setField(field, cur.includes(value) ? cur.filter(v => v !== value) : [...cur, value]);
  };

  /* ── Derived ── */
  const selected = MAIN_CATEGORIES.filter(c => store.activites[c.key]);
  const hasAny = selected.length > 0;
  const totalRaw = useMemo(() => selected.reduce((s, c) => s + (store.pourcentages[c.key] || 10), 0), [selected, store.pourcentages]);

  const hasPE = store.activites['ma_pe'];
  const hasMA = store.activites['ma_ma'];
  const hasVC = store.activites['ma_vc'];

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
  const buildSubChart = (parentKey: string, subs: typeof PE_SUBS) => {
    const vals = store.sousActivites[parentKey] || {};
    const items = subs.map(s => ({ ...s, raw: vals[s.key] ?? Math.round(100 / subs.length) }));
    const total = items.reduce((s, i) => s + i.raw, 0);
    return items.map(i => ({ name: i.label, value: total > 0 ? Math.round((i.raw / total) * 100) : 0, color: i.color }));
  };

  const peChart = useMemo(() => hasPE ? buildSubChart('ma_pe', PE_SUBS) : [], [hasPE, store.sousActivites]);
  const maChart = useMemo(() => hasMA ? buildSubChart('ma_ma', MA_SUBS) : [], [hasMA, store.sousActivites]);
  const vcChart = useMemo(() => hasVC ? buildSubChart('ma_vc', VC_SUBS) : [], [hasVC, store.sousActivites]);

  const peFonds = store.maPeFonds ?? 50;
  const maSanteVendeur = store.maSanteVendeur ?? 50;
  const vcFonds = store.maVcFonds ?? 50;

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
            <div className="lg:w-[45%] space-y-5">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Répartition transactionnelle</p>
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

              {/* Origine clientèle */}
              <div className="space-y-3 pt-3 border-t border-border">
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
                  <div className="h-3 rounded-full overflow-hidden flex border border-border">
                    <div className="bg-foreground/70 h-full transition-all duration-300" style={{ width: `${store.clienteleFrancaise}%` }} />
                    <div className="bg-foreground/15 h-full transition-all duration-300" style={{ width: `${100 - store.clienteleFrancaise}%` }} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[10px] font-sans text-muted-foreground">🇫🇷 {store.clienteleFrancaise}%</span>
                    <span className="text-[10px] font-sans text-muted-foreground">🌍 {100 - store.clienteleFrancaise}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT: Sub-charts + indicators ── */}
            <div className="lg:w-[55%] space-y-6">

              {/* ═══ PRIVATE EQUITY ═══ */}
              {hasPE && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Détail Private Equity</p>
                  </div>
                  <div className="flex gap-4 items-start">
                    <MiniPie data={peChart} size={140} />
                    <div className="flex-1 space-y-2 pt-1">
                      <MiniLegend data={peChart} />
                    </div>
                  </div>
                  {/* PE sub-sliders */}
                  <div className="space-y-2">
                    {PE_SUBS.map(sub => {
                      const vals = store.sousActivites['ma_pe'] || {};
                      const raw = vals[sub.key] ?? 25;
                      const total = PE_SUBS.reduce((s, ss) => s + (vals[ss.key] ?? 25), 0);
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
                          <Slider value={[raw]} onValueChange={([v]) => handleSub('ma_pe', sub.key, v)} min={0} max={100} step={10} className="w-full" />
                        </div>
                      );
                    })}
                  </div>
                  {/* PE Positionnement: Fonds vs Management */}
                  <div className="space-y-2 pt-2 border-t border-border">
                    <p className="text-[10px] text-muted-foreground font-sans font-medium uppercase tracking-wider">Positionnement PE</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-sans text-foreground">Côté fonds</span>
                      <span className="text-xs font-sans font-bold text-foreground">{peFonds}%</span>
                    </div>
                    <Slider value={[peFonds]} onValueChange={([v]) => store.setField('maPeFonds', v)} min={0} max={100} step={10} className="w-full" />
                    <div className="h-2.5 rounded-full overflow-hidden flex border border-border">
                      <div className="h-full transition-all duration-300" style={{ width: `${peFonds}%`, backgroundColor: COL_PE }} />
                      <div className="h-full transition-all duration-300" style={{ width: `${100 - peFonds}%`, backgroundColor: 'hsl(200, 15%, 60%)' }} />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[10px] font-sans text-muted-foreground">Fonds {peFonds}%</span>
                      <span className="text-[10px] font-sans text-muted-foreground">Management {100 - peFonds}%</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ═══ M&A ═══ */}
              {hasMA && (
                <div className={cn("space-y-4", hasPE && "pt-4 border-t border-border")}>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Détail M&A</p>
                  </div>
                  <div className="flex gap-4 items-start">
                    <MiniPie data={maChart} size={140} />
                    <div className="flex-1 space-y-2 pt-1">
                      <MiniLegend data={maChart} />
                    </div>
                  </div>
                  {/* MA sub-sliders */}
                  <div className="space-y-2">
                    {MA_SUBS.map(sub => {
                      const vals = store.sousActivites['ma_ma'] || {};
                      const raw = vals[sub.key] ?? 33;
                      const total = MA_SUBS.reduce((s, ss) => s + (vals[ss.key] ?? 33), 0);
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
                          <Slider value={[raw]} onValueChange={([v]) => handleSub('ma_ma', sub.key, v)} min={0} max={100} step={10} className="w-full" />
                        </div>
                      );
                    })}
                  </div>

                  {/* M&A Industriel: Secteurs + Clientèle */}
                  <div className="space-y-3 pt-2 border-t border-border">
                    <p className="text-[10px] text-muted-foreground font-sans font-medium uppercase tracking-wider">M&A Industriel – Secteurs</p>
                    <div className="flex flex-wrap gap-1.5">
                      {MA_INDUS_SECTEURS.map(s => (
                        <Chip key={s} active={(store.maIndusSecteurs || []).includes(s)} label={s} onClick={() => toggleArr('maIndusSecteurs', s)} />
                      ))}
                    </div>
                    <p className="text-[10px] text-muted-foreground font-sans font-medium uppercase tracking-wider pt-2">M&A Industriel – Clientèle</p>
                    <div className="flex flex-wrap gap-1.5">
                      {MA_INDUS_CLIENTELE.map(s => (
                        <Chip key={s} active={(store.maIndusClientele || []).includes(s)} label={s} onClick={() => toggleArr('maIndusClientele', s)} />
                      ))}
                    </div>
                  </div>

                  {/* M&A Santé: Clientèle + Positionnement */}
                  <div className="space-y-3 pt-2 border-t border-border">
                    <p className="text-[10px] text-muted-foreground font-sans font-medium uppercase tracking-wider">M&A Santé – Clientèle</p>
                    <div className="flex flex-wrap gap-1.5">
                      {MA_SANTE_CLIENTELE.map(s => (
                        <Chip key={s} active={(store.maSanteClientele || []).includes(s)} label={s} onClick={() => toggleArr('maSanteClientele', s)} />
                      ))}
                    </div>
                    <div className="space-y-2 pt-2">
                      <p className="text-[10px] text-muted-foreground font-sans font-medium uppercase tracking-wider">Positionnement M&A Santé</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-sans text-foreground">Côté vendeur</span>
                        <span className="text-xs font-sans font-bold text-foreground">{maSanteVendeur}%</span>
                      </div>
                      <Slider value={[maSanteVendeur]} onValueChange={([v]) => store.setField('maSanteVendeur', v)} min={0} max={100} step={10} className="w-full" />
                      <div className="h-2.5 rounded-full overflow-hidden flex border border-border">
                        <div className="h-full transition-all duration-300" style={{ width: `${maSanteVendeur}%`, backgroundColor: COL_MA }} />
                        <div className="h-full transition-all duration-300" style={{ width: `${100 - maSanteVendeur}%`, backgroundColor: 'hsl(200, 15%, 60%)' }} />
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[10px] font-sans text-muted-foreground">Vendeur {maSanteVendeur}%</span>
                        <span className="text-[10px] font-sans text-muted-foreground">Acquéreur {100 - maSanteVendeur}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ═══ VENTURE CAPITAL ═══ */}
              {hasVC && (
                <div className={cn("space-y-4", (hasPE || hasMA) && "pt-4 border-t border-border")}>
                  <div className="flex items-center gap-2">
                    <Target className="w-3.5 h-3.5 text-muted-foreground" />
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Détail Venture Capital</p>
                  </div>
                  <div className="flex gap-4 items-start">
                    <MiniPie data={vcChart} size={140} />
                    <div className="flex-1 space-y-2 pt-1">
                      <MiniLegend data={vcChart} />
                    </div>
                  </div>
                  {/* VC sub-sliders */}
                  <div className="space-y-2">
                    {VC_SUBS.map(sub => {
                      const vals = store.sousActivites['ma_vc'] || {};
                      const raw = vals[sub.key] ?? 50;
                      const total = VC_SUBS.reduce((s, ss) => s + (vals[ss.key] ?? 50), 0);
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
                          <Slider value={[raw]} onValueChange={([v]) => handleSub('ma_vc', sub.key, v)} min={0} max={100} step={10} className="w-full" />
                        </div>
                      );
                    })}
                  </div>
                  {/* VC Positionnement */}
                  <div className="space-y-2 pt-2 border-t border-border">
                    <p className="text-[10px] text-muted-foreground font-sans font-medium uppercase tracking-wider">Positionnement VC</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-sans text-foreground">Côté investisseurs / fonds</span>
                      <span className="text-xs font-sans font-bold text-foreground">{vcFonds}%</span>
                    </div>
                    <Slider value={[vcFonds]} onValueChange={([v]) => store.setField('maVcFonds', v)} min={0} max={100} step={10} className="w-full" />
                    <div className="h-2.5 rounded-full overflow-hidden flex border border-border">
                      <div className="h-full transition-all duration-300" style={{ width: `${vcFonds}%`, backgroundColor: COL_VC }} />
                      <div className="h-full transition-all duration-300" style={{ width: `${100 - vcFonds}%`, backgroundColor: 'hsl(200, 15%, 60%)' }} />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[10px] font-sans text-muted-foreground">Fonds {vcFonds}%</span>
                      <span className="text-[10px] font-sans text-muted-foreground">Fondateurs {100 - vcFonds}%</span>
                    </div>
                  </div>
                  {/* VC Stade */}
                  <div className="space-y-2 pt-2 border-t border-border">
                    <p className="text-[10px] text-muted-foreground font-sans font-medium uppercase tracking-wider">Stade des opérations</p>
                    <div className="flex flex-wrap gap-1.5">
                      {VC_STADES.map(s => (
                        <Chip key={s} active={(store.maVcStades || []).includes(s)} label={s} onClick={() => toggleArr('maVcStades', s)} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Taille des opérations */}
              <div className={cn("space-y-3", (hasPE || hasMA || hasVC) && "pt-4 border-t border-border")}>
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Taille des opérations</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Small cap', 'Mid cap', 'Large cap'].map(t => {
                    const active = (store.tailleOperations || []).includes(t);
                    return (
                      <Chip key={t} active={active} label={t} onClick={() => {
                        const cur = store.tailleOperations || [];
                        store.setField('tailleOperations', active ? cur.filter(v => v !== t) : [...cur, t]);
                      }} />
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

export default MaActivityPanel;
