import { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRegistrationStore } from '@/stores/registrationStore';
import { cn } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Check, Minus, Plus } from 'lucide-react';
import SquareGauge from '@/components/shared/SquareGauge';
import { buildQuantizedChartData } from '@/lib/percentages';

/* ── Palette ── */
const COL_PE = 'hsl(0, 0%, 8%)';
const COL_MA = 'hsl(220, 45%, 22%)';
const COL_VC = 'hsl(0, 0%, 32%)';

const COL_PE_LBO = 'hsl(30, 12%, 50%)';
const COL_PE_MBO = 'hsl(210, 35%, 58%)';
const COL_PE_PTP = 'hsl(35, 22%, 72%)';
const COL_PE_PIPE = 'hsl(0, 0%, 78%)';

const COL_MA_PRIVATE = 'hsl(40, 28%, 90%)';
const COL_MA_PUBLIC = 'hsl(0, 0%, 8%)';

const COL_MA_INDUS = 'hsl(220, 45%, 22%)';
const COL_MA_TECH = 'hsl(0, 0%, 32%)';
const COL_MA_SANTE = 'hsl(30, 12%, 50%)';
const COL_MA_ENERGY = 'hsl(210, 35%, 58%)';
const COL_MA_SERVICES = 'hsl(35, 22%, 72%)';
const COL_MA_INFRA = 'hsl(0, 0%, 78%)';

const COL_MA_OPA = 'hsl(40, 28%, 90%)';
const COL_MA_OPE = 'hsl(0, 0%, 8%)';
const COL_MA_SQUEEZE = 'hsl(220, 45%, 22%)';
const COL_MA_DUAL = 'hsl(0, 0%, 32%)';

const COL_VC_LEVEES = 'hsl(30, 12%, 50%)';
const COL_VC_CORP = 'hsl(0, 0%, 8%)';
const COL_VC_SECONDARY = 'hsl(220, 45%, 22%)';

/* ── PE sub-activities ── */
const PE_SUBS = [
  { key: 'lbo', label: 'LBO', color: COL_PE_LBO },
  { key: 'mbo', label: 'MBO / Management', color: COL_PE_MBO },
  { key: 'ptp', label: 'Public-to-Private', color: COL_PE_PTP },
  { key: 'pipe', label: 'PIPE', color: COL_PE_PIPE },
];

/* ── M&A sub-activities ── */
const MA_TYPES = [
  { key: 'private', label: 'Private M&A', color: COL_MA_PRIVATE },
  { key: 'public', label: 'Public M&A', color: COL_MA_PUBLIC },
];

const MA_PRIVATE_SECTEURS = [
  { key: 'industriel', label: 'Industrie / Manufacturing' },
  { key: 'tech', label: 'Tech / TMT' },
  { key: 'sante', label: 'Santé / Life Sciences' },
  { key: 'energie', label: 'Énergie / ENR' },
  { key: 'services', label: 'Services / Distribution' },
  { key: 'infra', label: 'Infrastructures' },
];

const MA_PUBLIC_OPS = [
  'OPA (offre publique d\'achat)',
  'OPE (offre publique d\'échange)',
  'Squeeze-out / Retrait obligatoire',
  'Dual-track (IPO vs M&A)',
  'Offre publique de rachat (OPRA)',
  'Offre publique obligatoire (franchissement seuil)',
];

const MA_CLIENTELE = [
  'Corporates / Industriels',
  'Fonds d\'investissement',
  'Family offices',
  'Dirigeants / Management',
  'Banques d\'affaires',
  'Institutionnels (assureurs, fonds souverains)',
];

/* ── VC sub-activities ── */
const VC_SUBS = [
  { key: 'levees', label: 'Levées de fonds', color: COL_VC_LEVEES },
  { key: 'corporate', label: 'Corporate venture / Structuration', color: COL_VC_CORP },
  { key: 'secondary', label: 'Secondary / Cessions', color: COL_VC_SECONDARY },
];

const VC_STADES = ['Seed / Pré-seed', 'Série A', 'Série B', 'Série C+', 'Late stage / Growth'];

const VC_SECTEURS = [
  'Tech / SaaS', 'Fintech', 'Biotech / Healthtech', 'Cleantech / Greentech',
  'Deep tech', 'Consumer / D2C', 'Marketplace / Plateforme', 'Impact / ESG',
];

const COL_CLI = ['hsl(0, 0%, 8%)', 'hsl(220, 45%, 22%)', 'hsl(0, 0%, 32%)', 'hsl(30, 12%, 50%)', 'hsl(210, 35%, 58%)', 'hsl(35, 22%, 72%)'];

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

const MAIN_CATEGORIES = [
  { key: 'ma_pe', label: 'Private Equity', color: COL_PE },
  { key: 'ma_ma', label: 'M&A', color: COL_MA },
  { key: 'ma_vc', label: 'Venture Capital', color: COL_VC },
];

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

  const toggleArr = (field: 'maIndusSecteurs' | 'maIndusClientele' | 'maSanteClientele' | 'maVcStades' | 'maPublicOps' | 'maClientele' | 'vcSecteurs', value: string) => {
    const cur = (store[field] as string[]) || [];
    store.setField(field, cur.includes(value) ? cur.filter(v => v !== value) : [...cur, value]);
  };

  const selected = MAIN_CATEGORIES.filter(c => store.activites[c.key]);
  const hasAny = selected.length > 0;

  const hasPE = !!store.activites['ma_pe'];
  const hasMA = !!store.activites['ma_ma'];
  const hasVC = !!store.activites['ma_vc'];

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
  const maChart = useMemo(() => hasMA ? buildSubChart('ma_ma', MA_TYPES) : [], [hasMA, store.sousActivites]);
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
            <div className="bg-white border border-gray-200 rounded-sm p-5 space-y-4">
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
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[10px] font-sans text-muted-foreground">Fonds {peFonds}%</span>
                    <span className="text-[10px] text-muted-foreground">·</span>
                    <span className="text-[10px] font-sans text-muted-foreground">Management {100 - peFonds}%</span>
                  </div>
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
                  {(store.maClientele || []).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(store.maClientele || []).map(c => (
                        <span key={c} className="inline-flex items-center px-2.5 py-0.5 rounded-sm text-[11px] font-sans bg-secondary text-foreground/80 border border-border">{c}</span>
                      ))}
                    </div>
                  )}
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
                  {(store.vcSecteurs || []).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(store.vcSecteurs || []).map(s => (
                        <span key={s} className="inline-flex items-center px-2.5 py-0.5 rounded-sm text-[11px] font-sans bg-secondary text-foreground/80 border border-border">{s}</span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Clientèle origine */}
              <div className="border-t border-border pt-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium mb-1">Clientèle</p>
                <span className="text-[11px] font-sans text-foreground/80">FR {store.clienteleFrancaise}% — International {100 - store.clienteleFrancaise}%</span>
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
                const totalRaw = selected.reduce((s, cc) => s + (store.pourcentages[cc.key] || 10), 0);
                const pct = totalRaw > 0 ? Math.round(((store.pourcentages[c.key] || 10) / totalRaw) * 100) : 0;
                return (
                  <SquareGauge
                    key={c.key}
                    value={store.pourcentages[c.key] || 10}
                    onChange={v => handlePct(c.key, v)}
                    label={`${c.label} (${pct}%)`}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════
            BLOC 1 — PRIVATE EQUITY
           ═══════════════════════════════════════ */}
        {hasPE && (
          <div className="border-t-2 border-foreground/20 pt-6 space-y-5">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm" style={{ background: COL_PE }} />
              <p className="text-base font-sans font-semibold text-foreground">Private Equity</p>
            </div>

            {/* PE Positionnement (LBO, MBO, PtP, PIPE) */}
            <div className="space-y-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Positionnement</p>
              <div className="pl-3 border-l-2 border-border space-y-2.5">
                {PE_SUBS.map(sub => {
                  const vals = store.sousActivites['ma_pe'] || {};
                  const raw = vals[sub.key] ?? 25;
                  const total = PE_SUBS.reduce((s, ss) => s + (vals[ss.key] ?? 25), 0);
                  const pct = total > 0 ? Math.round((raw / total) * 100) : 0;
                  return (
                    <SquareGauge key={sub.key} value={raw} onChange={v => handleSub('ma_pe', sub.key, v)} label={`${sub.label} (${pct}%)`} />
                  );
                })}
              </div>
            </div>

            {/* PE Clientèle: Fonds vs Management */}
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Clientèle</p>
              <div className="pl-3 border-l-2 border-border space-y-2">
                <SquareGauge value={peFonds} onChange={v => store.setField('maPeFonds', v)} label="Côté fonds" />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-sans text-foreground">Côté management</span>
                  <span className="text-xs font-sans font-bold text-foreground tabular-nums">{100 - peFonds}%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════
            BLOC 2 — M&A
           ═══════════════════════════════════════ */}
        {hasMA && (
          <div className="border-t-2 border-foreground/20 pt-6 space-y-5">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm" style={{ background: COL_MA }} />
              <p className="text-base font-sans font-semibold text-foreground">M&A</p>
            </div>

            {/* Private vs Public M&A */}
            <div className="space-y-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Répartition Private / Public M&A</p>
              <div className="pl-3 border-l-2 border-border space-y-2.5">
                {MA_TYPES.map(sub => {
                  const vals = store.sousActivites['ma_ma'] || {};
                  const raw = vals[sub.key] ?? 50;
                  const total = MA_TYPES.reduce((s, ss) => s + (vals[ss.key] ?? 50), 0);
                  const pct = total > 0 ? Math.round((raw / total) * 100) : 0;
                  return (
                    <SquareGauge key={sub.key} value={raw} onChange={v => handleSub('ma_ma', sub.key, v)} label={`${sub.label} (${pct}%)`} />
                  );
                })}
              </div>
            </div>

            {/* Private M&A — Secteurs */}
            {((store.sousActivites['ma_ma'] || {})['private'] ?? 50) > 0 && (
              <div className="space-y-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Private M&A — Secteurs</p>
                <div className="flex flex-wrap gap-1.5">
                  {MA_PRIVATE_SECTEURS.map(s => (
                    <ChipButton key={s.key} active={(store.maIndusSecteurs || []).includes(s.key)} onClick={() => toggleArr('maIndusSecteurs', s.key)}>
                      {s.label}
                    </ChipButton>
                  ))}
                </div>
              </div>
            )}

            {/* Public M&A — Types d'opérations */}
            {((store.sousActivites['ma_ma'] || {})['public'] ?? 50) > 0 && (
              <div className="space-y-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Public M&A — Types d'opérations</p>
                <div className="flex flex-wrap gap-1.5">
                  {MA_PUBLIC_OPS.map(op => (
                    <ChipButton key={op} active={(store.maPublicOps || []).includes(op)} onClick={() => toggleArr('maPublicOps', op)}>
                      {op}
                    </ChipButton>
                  ))}
                </div>
              </div>
            )}

            {/* M&A Positionnement: Vendeur vs Acquéreur */}
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Positionnement M&A</p>
              <div className="pl-3 border-l-2 border-border space-y-2">
                <SquareGauge value={maSanteVendeur} onChange={v => store.setField('maSanteVendeur', v)} label="Côté vendeur / cédant" />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-sans text-foreground">Côté acquéreur</span>
                  <span className="text-xs font-sans font-bold text-foreground tabular-nums">{100 - maSanteVendeur}%</span>
                </div>
              </div>
            </div>

            {/* M&A Clientèle */}
            <div className="space-y-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Clientèle M&A</p>
              <div className="flex flex-wrap gap-1.5">
                {MA_CLIENTELE.map(c => (
                  <ChipButton key={c} active={(store.maClientele || []).includes(c)} onClick={() => toggleArr('maClientele', c)}>
                    {c}
                  </ChipButton>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════
            BLOC 3 — VENTURE CAPITAL
           ═══════════════════════════════════════ */}
        {hasVC && (
          <div className="border-t-2 border-foreground/20 pt-6 space-y-5">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm" style={{ background: COL_VC }} />
              <p className="text-base font-sans font-semibold text-foreground">Venture Capital</p>
            </div>

            {/* VC Sous-activités */}
            <div className="space-y-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Nature de l'activité</p>
              <div className="pl-3 border-l-2 border-border space-y-2.5">
                {VC_SUBS.map(sub => {
                  const vals = store.sousActivites['ma_vc'] || {};
                  const raw = vals[sub.key] ?? Math.round(100 / VC_SUBS.length);
                  const total = VC_SUBS.reduce((s, ss) => s + (vals[ss.key] ?? Math.round(100 / VC_SUBS.length)), 0);
                  const pct = total > 0 ? Math.round((raw / total) * 100) : 0;
                  return (
                    <SquareGauge key={sub.key} value={raw} onChange={v => handleSub('ma_vc', sub.key, v)} label={`${sub.label} (${pct}%)`} />
                  );
                })}
              </div>
            </div>

            {/* VC Positionnement */}
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Positionnement</p>
              <div className="pl-3 border-l-2 border-border space-y-2">
                <SquareGauge value={vcFonds} onChange={v => store.setField('maVcFonds', v)} label="Côté investisseurs / fonds" />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-sans text-foreground">Côté fondateurs / management</span>
                  <span className="text-xs font-sans font-bold text-foreground tabular-nums">{100 - vcFonds}%</span>
                </div>
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

            {/* VC Secteurs */}
            <div className="space-y-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Secteurs</p>
              <div className="flex flex-wrap gap-1.5">
                {VC_SECTEURS.map(s => (
                  <ChipButton key={s} active={(store.vcSecteurs || []).includes(s)} onClick={() => toggleArr('vcSecteurs', s)}>{s}</ChipButton>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══════ ORIGINE CLIENTÈLE ═══════ */}
        <div className="border-t border-border pt-5 space-y-2.5">
          <p className="text-sm font-sans font-medium text-foreground">Origine de la clientèle</p>
          <div className="pl-3 border-l-2 border-border space-y-2">
            <SquareGauge value={store.clienteleFrancaise} onChange={v => store.setField('clienteleFrancaise', v)} label="Française" />
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
