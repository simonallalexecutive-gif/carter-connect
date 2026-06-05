import { useMemo } from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRegistrationStore } from '@/stores/registrationStore';
import { cn } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Check } from 'lucide-react';
import SquareGauge from '@/components/shared/SquareGauge';

/* ── Palette (cohérente avec RealEstate) ── */
const COL_CORPORATE = 'hsl(0, 0%, 8%)';
const COL_TRANSAC = 'hsl(220, 45%, 22%)';
const COL_PATRI = 'hsl(0, 0%, 32%)';
const COL_PXT = 'hsl(30, 12%, 50%)';
const COL_TVA = 'hsl(210, 35%, 58%)';
const COL_INTL = 'hsl(35, 22%, 72%)';
const COL_CONSEIL = 'hsl(0, 0%, 78%)';
const COL_CONTENTIEUX = 'hsl(40, 28%, 90%)';

const CLIENT_TYPES = [
  'Fonds d\'investissement',
  'Grands groupes',
  'PME / ETI',
  'Dirigeants / personnes physiques',
  'Family offices / holdings patrimoniales',
] as const;

const PATRIMONIAL_TYPES = [
  'Management packages',
  'Mobilité internationale',
  'Exit tax',
  'Transmission / succession',
] as const;

const tooltipStyle = {
  fontSize: '11px',
  fontFamily: 'Inter',
  background: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '4px',
  color: 'hsl(var(--foreground))',
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

const TaxActivityPanel = () => {
  const store = useRegistrationStore();
  // ── Anglais (part d'activité en anglais) ──
  const __anglaisPct = parseInt(store.anglais || '0', 10) || 0;
  const [__anglaisInput, __setAnglaisInput] = useState(String(__anglaisPct));
  const __handleAnglaisBlur = () => {
    let v = parseInt(__anglaisInput, 10);
    if (isNaN(v)) v = 0;
    v = Math.max(0, Math.min(100, v));
    __setAnglaisInput(String(v));
    store.setField('anglais', String(v));
  };

  const setField = store.setField;

  // ── Répartition générale conseil/contentieux ──
  const conseilPct = store.taxConseilPct ?? 70;
  const contentieuxPct = 100 - conseilPct;

  // ── Nature des dossiers (6 segments auto-balanced) ──
  type Field =
    | 'taxCorporatePct'
    | 'taxTransacPct'
    | 'taxPatrimonialPct'
    | 'taxPrixTransfertPct'
    | 'taxTvaPct'
    | 'taxInternationalPct';

  const hasPatrimonial = store.taxHasPatrimonial === true;
  const hasPrixTransfert = store.taxHasPrixTransfert === true;
  const hasTva = store.taxHasTva === true;

  const activeFields: Field[] = [
    'taxCorporatePct',
    'taxTransacPct',
    ...(hasPatrimonial ? ['taxPatrimonialPct' as Field] : []),
    ...(hasPrixTransfert ? ['taxPrixTransfertPct' as Field] : []),
    ...(hasTva ? ['taxTvaPct' as Field] : []),
    'taxInternationalPct',
  ];

  const handleGauge = (field: Field, val: number) => {
    const others = activeFields.filter(f => f !== field);
    const otherSum = others.reduce((s, k) => s + (store[k] ?? 0), 0);
    const remaining = Math.max(0, 100 - val);

    setField(field, val);

    if (otherSum === 0 && others.length > 0) {
      const each = Math.round(remaining / others.length / 5) * 5;
      let leftover = remaining;
      others.forEach((k, i) => {
        const v = i === others.length - 1 ? leftover : Math.min(each, leftover);
        setField(k, v);
        leftover -= v;
      });
    } else if (others.length > 0) {
      let assigned = 0;
      others.forEach((k, i) => {
        if (i === others.length - 1) {
          setField(k, Math.max(0, remaining - assigned));
        } else {
          const v = Math.round((remaining * ((store[k] ?? 0) / otherSum)) / 5) * 5;
          setField(k, Math.max(0, v));
          assigned += Math.max(0, v);
        }
      });
    }
  };

  // Chart data — nature des dossiers
  const corporate = store.taxCorporatePct ?? 20;
  const transac = store.taxTransacPct ?? 20;
  const patri = hasPatrimonial ? (store.taxPatrimonialPct ?? 10) : 0;
  const pxt = hasPrixTransfert ? (store.taxPrixTransfertPct ?? 10) : 0;
  const tva = hasTva ? (store.taxTvaPct ?? 10) : 0;
  const intl = store.taxInternationalPct ?? 20;

  const chartData = useMemo(() => {
    const segs: { name: string; value: number; color: string }[] = [];
    if (corporate > 0) segs.push({ name: 'Corporate Tax', value: corporate, color: COL_CORPORATE });
    if (transac > 0) segs.push({ name: 'Transactionnel (M&A/PE/LBO)', value: transac, color: COL_TRANSAC });
    if (patri > 0) segs.push({ name: 'Patrimonial', value: patri, color: COL_PATRI });
    if (pxt > 0) segs.push({ name: 'Prix de transfert', value: pxt, color: COL_PXT });
    if (tva > 0) segs.push({ name: 'TVA / Fiscalité indirecte', value: tva, color: COL_TVA });
    if (intl > 0) segs.push({ name: 'Fiscalité internationale', value: intl, color: COL_INTL });
    return segs;
  }, [corporate, transac, patri, pxt, tva, intl]);

  const toggleArr = (field: 'taxClients' | 'taxPatrimonialTypes', val: string) => {
    const cur = (store as any)[field] as string[] || [];
    setField(field, cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val]);
  };

  const showSynthesis = chartData.length > 0;

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

              {/* Pie nature des dossiers */}
              <div className="self-center mx-auto" style={{ width: 200, height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%" innerRadius={48} outerRadius={88} dataKey="value" paddingAngle={1.5} stroke="hsl(var(--background))" strokeWidth={2} label={renderLabel} labelLine={false}>
                      {chartData.map((seg, i) => <Cell key={i} fill={seg.color} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => [`${v}%`, '']} contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Légende nature */}
              <div className="space-y-1.5">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium mb-2">Nature des dossiers</p>
                {chartData.map(seg => (
                  <div key={seg.name} className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: seg.color }} />
                    <span className="text-[11px] font-sans text-foreground/80 flex-1 min-w-0 truncate">{seg.name}</span>
                    <span className="text-[11px] font-sans font-bold text-foreground tabular-nums">{seg.value}%</span>
                  </div>
                ))}
              </div>

              {/* Conseil / Contentieux */}
              <div className="border-t border-border pt-3 space-y-2">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Activité</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm" style={{ background: COL_CONSEIL }} />
                    <span className="text-[11px] font-sans text-foreground/80">Conseil</span>
                  </div>
                  <span className="text-[11px] font-sans font-bold text-foreground tabular-nums">{conseilPct}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm" style={{ background: COL_CONTENTIEUX }} />
                    <span className="text-[11px] font-sans text-foreground/80">Contentieux</span>
                  </div>
                  <span className="text-[11px] font-sans font-bold text-foreground tabular-nums">{contentieuxPct}%</span>
                </div>
              </div>

              {(store.taxClients || []).length > 0 && (
                <div className="border-t border-border pt-3 space-y-1.5">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium mb-1">Clientèle</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(store.taxClients || []).map(c => (
                      <span key={c} className="inline-flex items-center px-2.5 py-0.5 rounded-sm text-[11px] font-sans bg-secondary text-foreground/80 border border-border">{c}</span>
                    ))}
                  </div>
                </div>
              )}

              {hasPatrimonial && (store.taxPatrimonialTypes || []).length > 0 && (
                <div className="border-t border-border pt-3 space-y-1.5">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium mb-1">Patrimonial — domaines</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(store.taxPatrimonialTypes || []).map(t => (
                      <span key={t} className="inline-flex items-center px-2.5 py-0.5 rounded-sm text-[11px] font-sans bg-secondary text-foreground/80 border border-border">{t}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════ RIGHT: QUESTIONNAIRE ══════════ */}
      <div className="carter-card p-5 md:p-7 space-y-6 flex-1 min-w-0">

        {/* ═══════ 1. NATURE DES DOSSIERS ═══════ */}
        <div className="space-y-4">
          <p className="text-sm font-sans font-medium text-foreground">Nature des dossiers</p>

          <div className="space-y-2.5 pl-3 border-l-2 border-border">
            <SquareGauge value={corporate} onChange={v => handleGauge('taxCorporatePct', v)} label="Corporate Tax (fiscalité des entreprises et restructurations/réorganisations)" />
            <SquareGauge value={transac} onChange={v => handleGauge('taxTransacPct', v)} label="Transactionnel (fusions-acquisitions, LBO)" />
          </div>

          {/* Patrimoniale Yes/No */}
          <div className="space-y-2.5 pl-3 border-l-2 border-border">
            <p className="text-xs font-sans text-foreground">Avez-vous également une activité en fiscalité patrimoniale ?</p>
            <div className="flex gap-2">
              {(['Oui', 'Non'] as const).map(label => {
                const val = label === 'Oui';
                const active = store.taxHasPatrimonial === val;
                return <ChipButton key={label} active={active} onClick={() => setField('taxHasPatrimonial', active ? null : val)}>{label}</ChipButton>;
              })}
            </div>
            <AnimatePresence>
              {hasPatrimonial && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="space-y-2.5 pt-2">
                    <SquareGauge value={patri} onChange={v => handleGauge('taxPatrimonialPct', v)} label="Part dans l'activité" />
                    <div className="space-y-1.5">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Domaines</p>
                      <div className="flex flex-wrap gap-1.5">
                        {PATRIMONIAL_TYPES.map(t => (
                          <ChipButton key={t} active={(store.taxPatrimonialTypes || []).includes(t)} onClick={() => toggleArr('taxPatrimonialTypes', t)}>
                            {t}
                          </ChipButton>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ═══════ 2. EXPERTISES COMPLÉMENTAIRES ═══════ */}
        <div className="border-t border-border pt-5 space-y-4">
          <p className="text-sm font-sans font-medium text-foreground">Expertises complémentaires</p>

          {/* Prix de transfert */}
          <div className="space-y-2.5 pl-3 border-l-2 border-border">
            <p className="text-xs font-sans text-foreground">Avez-vous développé une expertise en prix de transfert ?</p>
            <div className="flex gap-2">
              {(['Oui', 'Non'] as const).map(label => {
                const val = label === 'Oui';
                const active = store.taxHasPrixTransfert === val;
                return <ChipButton key={label} active={active} onClick={() => setField('taxHasPrixTransfert', active ? null : val)}>{label}</ChipButton>;
              })}
            </div>
            <AnimatePresence>
              {hasPrixTransfert && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="pt-2">
                    <SquareGauge value={pxt} onChange={v => handleGauge('taxPrixTransfertPct', v)} label="Part dans l'activité" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* TVA */}
          <div className="space-y-2.5 pl-3 border-l-2 border-border">
            <p className="text-xs font-sans text-foreground">Avez-vous développé une expertise en TVA ?</p>
            <div className="flex gap-2">
              {(['Oui', 'Non'] as const).map(label => {
                const val = label === 'Oui';
                const active = store.taxHasTva === val;
                return <ChipButton key={label} active={active} onClick={() => setField('taxHasTva', active ? null : val)}>{label}</ChipButton>;
              })}
            </div>
            <AnimatePresence>
              {hasTva && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="pt-2">
                    <SquareGauge value={tva} onChange={v => handleGauge('taxTvaPct', v)} label="Part dans l'activité" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* International */}
          <div className="space-y-2.5 pl-3 border-l-2 border-border">
            <p className="text-xs font-sans text-foreground">Avez-vous une activité en fiscalité internationale ?</p>
            <SquareGauge value={intl} onChange={v => handleGauge('taxInternationalPct', v)} label="Part dans l'activité" />
          </div>
        </div>

        {/* ═══════ 3. RÉPARTITION GÉNÉRALE ═══════ */}
        <div className="border-t border-border pt-5 space-y-4">
          <p className="text-sm font-sans font-medium text-foreground">Répartition générale</p>

          <div className="space-y-2.5 pl-3 border-l-2 border-border">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Conseil vs Contentieux</p>
            <SquareGauge value={conseilPct} onChange={v => setField('taxConseilPct', v)} label="Part du conseil" />
            <div className="flex justify-between text-[10px] text-muted-foreground font-sans">
              <span>Conseil {conseilPct}%</span>
              <span>Contentieux {contentieuxPct}%</span>
            </div>
          </div>

          <div className="space-y-2 pl-3 border-l-2 border-border">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Principaux clients</p>
            <div className="flex flex-wrap gap-1.5">
              {CLIENT_TYPES.map(c => (
                <ChipButton key={c} active={(store.taxClients || []).includes(c)} onClick={() => toggleArr('taxClients', c)}>
                  {c}
                </ChipButton>
              ))}
            </div>
          </div>
        </div>

      </div>
          {/* ── Part d'activité en anglais ── */}
          <div className="border-t border-border pt-5 space-y-2.5">
            <p className="font-sans text-[11px] font-medium text-muted-foreground uppercase tracking-[0.15em]">Part d'activité en anglais</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                inputMode="numeric"
                value={__anglaisInput}
                onChange={e => __setAnglaisInput(e.target.value.replace(/\D/g, ''))}
                onBlur={__handleAnglaisBlur}
                className="w-16 text-center text-sm font-sans font-bold border border-border rounded-sm px-2 py-1 bg-transparent text-foreground"
              />
              <span className="text-xs font-sans text-muted-foreground">%</span>
            </div>
          </div>

    </div>
  );
};

export default TaxActivityPanel;