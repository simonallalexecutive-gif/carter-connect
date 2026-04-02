import { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRegistrationStore } from '@/stores/registrationStore';
import { cn } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Check } from 'lucide-react';
import SquareGauge from '@/components/shared/SquareGauge';
import { buildQuantizedChartData } from '@/lib/percentages';

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

  const selected = MAIN_CATEGORIES.filter(c => store.activites[c.key]);
  const hasAny = selected.length > 0;
  const totalRaw = useMemo(() => selected.reduce((s, c) => s + (store.pourcentages[c.key] || 10), 0), [selected, store.pourcentages]);

  const hasPE = store.activites['ma_pe'];
  const hasMA = store.activites['ma_ma'];
  const hasVC = store.activites['ma_vc'];

  const mainChartData = useMemo(() =>
    buildQuantizedChartData(
      selected.map(c => ({ key: c.key, name: c.label, raw: store.pourcentages[c.key] || 10, color: c.color })),
    ),
    [selected, store.pourcentages]
  );

  const buildSubChart = (parentKey: string, subs: { key: string; label: string; color: string }[]) => {
    const vals = store.sousActivites[parentKey] || {};
    return buildQuantizedChartData(
      subs.map(s => ({ key: s.key, name: s.label, raw: vals[s.key] ?? Math.round(100 / subs.length), color: s.color })),
    );
  };

  const peChart = useMemo(() => hasPE ? buildSubChart('ma_pe', PE_SUBS) : [], [hasPE, store.sousActivites]);
  const maChart = useMemo(() => hasMA ? buildSubChart('ma_ma', MA_SUBS) : [], [hasMA, store.sousActivites]);
  const vcChart = useMemo(() => hasVC ? buildSubChart('ma_vc', VC_SUBS) : [], [hasVC, store.sousActivites]);

  const peFonds = store.maPeFonds ?? 50;
  const maSanteVendeur = store.maSanteVendeur ?? 50;
  const vcFonds = store.maVcFonds ?? 50;

  const showSynthesis = hasAny;

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
            <div className="carter-card p-5 space-y-4">
              <p className="text-sm font-sans font-medium text-foreground">Synthèse</p>

              {/* Main Pie */}
              <div className="self-center mx-auto" style={{ width: 200, height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={mainChartData} cx="50%" cy="50%" innerRadius={48} outerRadius={88} dataKey="value" paddingAngle={1.5} stroke="hsl(var(--background))" strokeWidth={2} label={renderLabel} labelLine={false}>
                      {mainChartData.map((seg, i) => <Cell key={i} fill={seg.color} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => [`${v}%`, '']} contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Main legend */}
              <div className="space-y-1.5">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium mb-2">Répartition</p>
                {mainChartData.map(seg => (
                  <div key={seg.name} className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: seg.color }} />
                    <span className="text-[11px] font-sans text-foreground/80 flex-1 min-w-0 truncate">{seg.name}</span>
                    <span className="text-[11px] font-sans font-bold text-foreground tabular-nums">{seg.value}%</span>
                  </div>
                ))}
              </div>

              {/* PE sub-legend */}
              {hasPE && peChart.length > 0 && (
                <div className="border-t border-border pt-3 space-y-1.5">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium mb-1">Détail PE</p>
                  {peChart.map(seg => (
                    <div key={seg.name} className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: seg.color }} />
                      <span className="text-[11px] font-sans text-foreground/70 flex-1">{seg.name}</span>
                      <span className="text-[11px] font-sans font-semibold text-foreground tabular-nums">{seg.value}%</span>
                    </div>
                  ))}
                </div>
              )}

              {/* M&A sub-legend */}
              {hasMA && maChart.length > 0 && (
                <div className="border-t border-border pt-3 space-y-1.5">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium mb-1">Détail M&A</p>
                  {maChart.map(seg => (
                    <div key={seg.name} className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: seg.color }} />
                      <span className="text-[11px] font-sans text-foreground/70 flex-1">{seg.name}</span>
                      <span className="text-[11px] font-sans font-semibold text-foreground tabular-nums">{seg.value}%</span>
                    </div>
                  ))}
                </div>
              )}

              {/* VC sub-legend */}
              {hasVC && vcChart.length > 0 && (
                <div className="border-t border-border pt-3 space-y-1.5">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium mb-1">Détail VC</p>
                  {vcChart.map(seg => (
                    <div key={seg.name} className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: seg.color }} />
                      <span className="text-[11px] font-sans text-foreground/70 flex-1">{seg.name}</span>
                      <span className="text-[11px] font-sans font-semibold text-foreground tabular-nums">{seg.value}%</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Clientèle origine */}
              <div className="border-t border-border pt-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium mb-1">Clientèle</p>
                <span className="text-[11px] font-sans text-foreground/80">🇫🇷 {store.clienteleFrancaise}% — 🌍 {100 - store.clienteleFrancaise}%</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════ RIGHT: QUESTIONNAIRE ══════════ */}
      <div className="carter-card p-5 md:p-7 space-y-6 flex-1 min-w-0">

        {/* ═══════ CATEGORY TOGGLES ═══════ */}
        <div className="space-y-4">
          <p className="text-sm font-sans font-medium text-foreground">Nature des opérations</p>
          <div className="flex flex-wrap gap-2">
            {MAIN_CATEGORIES.map(c => (
              <ChipButton key={c.key} active={!!store.activites[c.key]} onClick={() => handleToggle(c.key)}>
                {c.label}
              </ChipButton>
            ))}
          </div>
        </div>

        {/* ═══════ RÉPARTITION ═══════ */}
        {hasAny && (
          <div className="border-t border-border pt-5 space-y-2.5">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Répartition</p>
            <div className="pl-3 border-l-2 border-border space-y-2.5">
              {selected.map(c => {
                const pct = totalRaw > 0 ? Math.round(((store.pourcentages[c.key] || 10) / totalRaw) * 100) : 0;
                return (
                  <SquareGauge
                    key={c.key}
                    value={store.pourcentages[c.key] || 10}
                    onChange={v => handlePct(c.key, v)}
                    activeColor={c.color}
                    label={`${c.label} (${pct}%)`}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* ═══════ PRIVATE EQUITY DETAIL ═══════ */}
        {hasPE && (
          <div className="border-t border-border pt-5 space-y-4">
            <p className="text-sm font-sans font-medium text-foreground">Détail Private Equity</p>
            <div className="pl-3 border-l-2 border-border space-y-2.5">
              {PE_SUBS.map(sub => {
                const vals = store.sousActivites['ma_pe'] || {};
                const raw = vals[sub.key] ?? 25;
                const total = PE_SUBS.reduce((s, ss) => s + (vals[ss.key] ?? 25), 0);
                const pct = total > 0 ? Math.round((raw / total) * 100) : 0;
                return (
                  <SquareGauge key={sub.key} value={raw} onChange={v => handleSub('ma_pe', sub.key, v)} activeColor={sub.color} label={`${sub.label} (${pct}%)`} />
                );
              })}
            </div>

            {/* PE Positionnement */}
            <div className="pl-3 border-l-2 border-border space-y-2">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Positionnement PE</p>
              <SquareGauge value={peFonds} onChange={v => store.setField('maPeFonds', v)} activeColor={COL_PE} label="Côté fonds" />
              <div className="flex items-center justify-between">
                <span className="text-xs font-sans text-foreground">Côté management</span>
                <span className="text-xs font-sans font-bold text-foreground tabular-nums">{100 - peFonds}%</span>
              </div>
            </div>
          </div>
        )}

        {/* ═══════ M&A DETAIL ═══════ */}
        {hasMA && (
          <div className="border-t border-border pt-5 space-y-4">
            <p className="text-sm font-sans font-medium text-foreground">Détail M&A</p>
            <div className="pl-3 border-l-2 border-border space-y-2.5">
              {MA_SUBS.map(sub => {
                const vals = store.sousActivites['ma_ma'] || {};
                const raw = vals[sub.key] ?? 33;
                const total = MA_SUBS.reduce((s, ss) => s + (vals[ss.key] ?? 33), 0);
                const pct = total > 0 ? Math.round((raw / total) * 100) : 0;
                return (
                  <SquareGauge key={sub.key} value={raw} onChange={v => handleSub('ma_ma', sub.key, v)} activeColor={sub.color} label={`${sub.label} (${pct}%)`} />
                );
              })}
            </div>

            {/* M&A Industriel */}
            {((store.sousActivites['ma_ma'] || {})['industriel'] ?? 33) > 0 && (
              <div className="space-y-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">M&A Industriel – Secteurs</p>
                <div className="flex flex-wrap gap-1.5">
                  {MA_INDUS_SECTEURS.map(s => (
                    <ChipButton key={s} active={(store.maIndusSecteurs || []).includes(s)} onClick={() => toggleArr('maIndusSecteurs', s)}>{s}</ChipButton>
                  ))}
                </div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium pt-2">M&A Industriel – Clientèle</p>
                <div className="flex flex-wrap gap-1.5">
                  {MA_INDUS_CLIENTELE.map(s => (
                    <ChipButton key={s} active={(store.maIndusClientele || []).includes(s)} onClick={() => toggleArr('maIndusClientele', s)}>{s}</ChipButton>
                  ))}
                </div>
              </div>
            )}

            {/* M&A Santé */}
            {((store.sousActivites['ma_ma'] || {})['sante'] ?? 33) > 0 && (
              <div className="space-y-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">M&A Santé – Clientèle</p>
                <div className="flex flex-wrap gap-1.5">
                  {MA_SANTE_CLIENTELE.map(s => (
                    <ChipButton key={s} active={(store.maSanteClientele || []).includes(s)} onClick={() => toggleArr('maSanteClientele', s)}>{s}</ChipButton>
                  ))}
                </div>
                <div className="pl-3 border-l-2 border-border space-y-2">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Positionnement M&A Santé</p>
                  <SquareGauge value={maSanteVendeur} onChange={v => store.setField('maSanteVendeur', v)} activeColor={COL_MA} label="Côté vendeur" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-sans text-foreground">Côté acquéreur</span>
                    <span className="text-xs font-sans font-bold text-foreground tabular-nums">{100 - maSanteVendeur}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════ VENTURE CAPITAL DETAIL ═══════ */}
        {hasVC && (
          <div className="border-t border-border pt-5 space-y-4">
            <p className="text-sm font-sans font-medium text-foreground">Détail Venture Capital</p>
            <div className="pl-3 border-l-2 border-border space-y-2.5">
              {VC_SUBS.map(sub => {
                const vals = store.sousActivites['ma_vc'] || {};
                const raw = vals[sub.key] ?? 50;
                const total = VC_SUBS.reduce((s, ss) => s + (vals[ss.key] ?? 50), 0);
                const pct = total > 0 ? Math.round((raw / total) * 100) : 0;
                return (
                  <SquareGauge key={sub.key} value={raw} onChange={v => handleSub('ma_vc', sub.key, v)} activeColor={sub.color} label={`${sub.label} (${pct}%)`} />
                );
              })}
            </div>

            {/* VC Positionnement */}
            <div className="pl-3 border-l-2 border-border space-y-2">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Positionnement VC</p>
              <SquareGauge value={vcFonds} onChange={v => store.setField('maVcFonds', v)} activeColor={COL_VC} label="Côté investisseurs / fonds" />
              <div className="flex items-center justify-between">
                <span className="text-xs font-sans text-foreground">Côté fondateurs</span>
                <span className="text-xs font-sans font-bold text-foreground tabular-nums">{100 - vcFonds}%</span>
              </div>
            </div>

            {/* VC Stade */}
            <div className="space-y-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Stade des opérations</p>
              <div className="flex flex-wrap gap-1.5">
                {VC_STADES.map(s => (
                  <ChipButton key={s} active={(store.maVcStades || []).includes(s)} onClick={() => toggleArr('maVcStades', s)}>{s}</ChipButton>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══════ ORIGINE CLIENTÈLE ═══════ */}
        <div className="border-t border-border pt-5 space-y-2.5">
          <p className="text-sm font-sans font-medium text-foreground">Origine de la clientèle</p>
          <div className="pl-3 border-l-2 border-border space-y-2">
            <SquareGauge value={store.clienteleFrancaise} onChange={v => store.setField('clienteleFrancaise', v)} activeColor={COL_PE} label="Française" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-sans text-foreground">Étrangère</span>
              <span className="text-xs font-sans font-bold text-foreground tabular-nums">{100 - store.clienteleFrancaise}%</span>
            </div>
          </div>
        </div>

        {/* ═══════ TAILLE ═══════ */}
        <div className="border-t border-border pt-5 space-y-3">
          <p className="text-sm font-sans font-medium text-foreground">Taille des opérations</p>
          <div className="flex flex-wrap gap-2">
            {['Small cap', 'Mid cap', 'Large cap'].map(t => {
              const active = (store.tailleOperations || []).includes(t);
              return (
                <ChipButton key={t} active={active} onClick={() => {
                  const cur = store.tailleOperations || [];
                  store.setField('tailleOperations', active ? cur.filter(v => v !== t) : [...cur, t]);
                }}>
                  {t}
                </ChipButton>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaActivityPanel;
