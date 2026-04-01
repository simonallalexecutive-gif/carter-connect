import { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRegistrationStore } from '@/stores/registrationStore';
import { cn } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Check } from 'lucide-react';
import SegmentedBar from '@/components/shared/SegmentedBar';
import { quantizePercentages } from '@/lib/percentages';

/* ── Palette — professional dark tones ── */
const COL_BAUX = 'hsl(215, 50%, 35%)';
const COL_SHARE = 'hsl(200, 50%, 40%)';
const COL_ASSET = 'hsl(210, 25%, 50%)';
const COL_CONSTRUCTION = 'hsl(215, 55%, 22%)';
const COL_FINANCEMENT = 'hsl(200, 12%, 45%)';
const COL_CONTENTIEUX = 'hsl(220, 15%, 62%)';

const ASSET_TYPES = [
  'Bureaux', 'Retail / Commerces', 'Logistique / Entrepôts',
  'Industriel', 'Résidentiel', 'Hôtellerie', 'Restauration',
] as const;

const CLIENT_TYPES = [
  'Investisseurs (buy-side / sell-side)',
  'Promoteurs / développeurs',
  'Utilisateurs (baux commerciaux)',
  'Financiers (debt side)',
] as const;

const CONTENTIEUX_DOMAINES = ['Baux commerciaux', 'Construction'] as const;

const SEGMENTS = [
  { key: 'reBauxAM' as const, label: 'Baux commerciaux / Asset Management', color: COL_BAUX, chartName: 'Baux / AM' },
  { key: 'reShareDeal' as const, label: 'Share Deal', color: COL_SHARE, chartName: 'Share Deal' },
  { key: 'reAssetDealPct' as const, label: 'Asset Deal', color: COL_ASSET, chartName: 'Asset Deal' },
  { key: 'reConstructionPct' as const, label: 'Construction', color: COL_CONSTRUCTION, chartName: 'Construction' },
] as const;

type AdjKey = typeof SEGMENTS[number]['key'];

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
      {value}%
    </text>
  );
};

const RealEstateActivityPanel = () => {
  const store = useRegistrationStore();
  const setField = store.setField;

  /* ── Raw values (used as weights for the quantizer) ── */
  const rawVals: Record<AdjKey, number> = {
    reBauxAM: store.reBauxAM ?? 20,
    reShareDeal: store.reShareDeal ?? 20,
    reAssetDealPct: store.reAssetDealPct ?? 20,
    reConstructionPct: store.reConstructionPct ?? 20,
  };
  const rawFinancement = Math.max(0, 100 - rawVals.reBauxAM - rawVals.reShareDeal - rawVals.reAssetDealPct - rawVals.reConstructionPct);

  /* ── Quantize all 5 segments to step=5 ── */
  const quantized = useMemo(() => quantizePercentages([
    { key: 'baux', raw: rawVals.reBauxAM },
    { key: 'share', raw: rawVals.reShareDeal },
    { key: 'asset', raw: rawVals.reAssetDealPct },
    { key: 'construction', raw: rawVals.reConstructionPct },
    { key: 'financement', raw: rawFinancement },
  ], 5), [rawVals.reBauxAM, rawVals.reShareDeal, rawVals.reAssetDealPct, rawVals.reConstructionPct, rawFinancement]);

  const qBaux = quantized.baux;
  const qShare = quantized.share;
  const qAsset = quantized.asset;
  const qConstruction = quantized.construction;
  const qFinancement = quantized.financement;

  /* ── Slider handler — proportional redistribution, snapped to 5 ── */
  const handleSliderChange = (key: AdjKey, val: number) => {
    const snapped = Math.round(val / 5) * 5;
    const others = SEGMENTS.filter(s => s.key !== key).map(s => s.key);
    const remaining = Math.max(0, 100 - snapped);
    const otherSum = others.reduce((s, k) => s + (rawVals[k] || 0), 0);

    setField(key, snapped);

    if (otherSum === 0) {
      const each = Math.round(remaining / others.length / 5) * 5;
      let leftover = remaining;
      others.forEach((k, i) => {
        const v = i === others.length - 1 ? leftover : Math.min(each, leftover);
        setField(k, v);
        leftover -= v;
      });
    } else {
      let assigned = 0;
      others.forEach((k, i) => {
        if (i === others.length - 1) {
          setField(k, Math.max(0, remaining - assigned));
        } else {
          const v = Math.round((remaining * (rawVals[k] / otherSum)) / 5) * 5;
          setField(k, Math.max(0, v));
          assigned += Math.max(0, v);
        }
      });
    }
  };

  /* ── Contentieux ── */
  const hasContentieux = store.reHasContentieux === true;
  const contentieuxPct = store.reContentieuxPct ?? 20;

  /* ── Anglais percentage ── */
  const anglaisPct = parseInt(store.anglais || '0', 10) || 0;

  /* ── Chart data ── */
  const chartData = useMemo(() => {
    const segments: { name: string; value: number; color: string }[] = [];
    if (qBaux > 0) segments.push({ name: 'Baux / AM', value: qBaux, color: COL_BAUX });
    if (qShare > 0) segments.push({ name: 'Share Deal', value: qShare, color: COL_SHARE });
    if (qAsset > 0) segments.push({ name: 'Asset Deal', value: qAsset, color: COL_ASSET });
    if (qConstruction > 0) segments.push({ name: 'Construction', value: qConstruction, color: COL_CONSTRUCTION });
    if (qFinancement > 0) segments.push({ name: 'Financement immobilier', value: qFinancement, color: COL_FINANCEMENT });
    return segments;
  }, [qBaux, qShare, qAsset, qConstruction, qFinancement]);

  /* ── Toggles ── */
  const toggleChip = (field: 'reAssetTypes' | 'typesClients' | 'reContentieuxDomaines', val: string) => {
    const cur: string[] = (store as any)[field] || [];
    setField(field, cur.includes(val) ? cur.filter((v: string) => v !== val) : [...cur, val]);
  };

  const showSynthesis = chartData.length > 0;

  return (
    <div className="space-y-6">

      {/* ═══════ RÉPARTITION CONSEIL ═══════ */}
      <section className="space-y-4">
        <p className="text-lg font-sans font-semibold text-foreground tracking-tight">Répartition de l'activité conseil</p>

        <div className="space-y-3">
          {SEGMENTS.map(seg => {
            const display = seg.key === 'reBauxAM' ? qBaux : seg.key === 'reShareDeal' ? qShare : seg.key === 'reAssetDealPct' ? qAsset : qConstruction;
            return (
              <div key={seg.key} className="carter-card p-5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-sans font-medium text-foreground">{seg.label}</p>
                  <span className="text-xs font-sans font-bold text-foreground tabular-nums bg-secondary px-2 py-0.5 rounded-sm">{display}%</span>
                </div>
                <SegmentedBar
                  value={rawVals[seg.key]}
                  onChange={v => handleSliderChange(seg.key, v)}
                  step={5}
                  activeColor={seg.color}
                  showValue={false}
                />
              </div>
            );
          })}

          {/* Financement — computed */}
          <div className="carter-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-sans font-medium text-foreground">Financement immobilier</p>
              <span className="text-xs font-sans font-bold text-foreground tabular-nums bg-secondary px-2 py-0.5 rounded-sm">{qFinancement}%</span>
            </div>
            <p className="text-[10px] font-sans text-muted-foreground mt-1">Calculé automatiquement comme complément à 100 %</p>
          </div>
        </div>
      </section>

      {/* ═══════ TYPOLOGIE D'ACTIFS ═══════ */}
      <section className="space-y-3">
        <p className="text-lg font-sans font-semibold text-foreground tracking-tight">Typologie d'actifs</p>
        <div className="flex flex-wrap gap-2">
          {ASSET_TYPES.map(a => {
            const active = (store.reAssetTypes || []).includes(a);
            return (
              <button key={a} type="button" onClick={() => toggleChip('reAssetTypes', a)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-sm text-xs font-sans font-light transition-all duration-200 border",
                  active ? "bg-foreground text-background border-foreground" : "bg-transparent text-foreground border-border hover:border-foreground/40"
                )}>
                {active && <Check className="w-3 h-3" />}
                {a}
              </button>
            );
          })}
        </div>
      </section>

      {/* ═══════ CONTENTIEUX ═══════ */}
      <section className="space-y-3">
        <p className="text-lg font-sans font-semibold text-foreground tracking-tight">Contentieux</p>
        <p className="text-xs font-sans text-muted-foreground">Faites-vous aussi du contentieux immobilier ?</p>
        <div className="flex gap-2">
          {(['Oui', 'Non'] as const).map(label => {
            const val = label === 'Oui';
            const active = store.reHasContentieux === val;
            return (
              <button key={label} type="button" onClick={() => setField('reHasContentieux', active ? null : val)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-sm text-xs font-sans font-light transition-all duration-200 border",
                  active ? "bg-foreground text-background border-foreground" : "bg-transparent text-foreground border-border hover:border-foreground/40"
                )}>
                {active && <Check className="w-3 h-3" />}
                {label}
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {hasContentieux && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden space-y-4">
              <div className="carter-card p-5 space-y-2.5">
                <p className="text-sm font-sans font-medium text-foreground">Part du contentieux dans l'activité totale</p>
                <SegmentedBar value={contentieuxPct} onChange={v => setField('reContentieuxPct', Math.round(v / 5) * 5)} step={5} activeColor={COL_CONTENTIEUX} />
                <div className="flex justify-between text-xs font-sans text-muted-foreground">
                  <span>Conseil <strong className="text-foreground">{100 - contentieuxPct}%</strong></span>
                  <span>Contentieux <strong className="text-foreground">{contentieuxPct}%</strong></span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Dans quel(s) domaine(s) ?</p>
                <div className="flex flex-wrap gap-2">
                  {CONTENTIEUX_DOMAINES.map(d => {
                    const active = (store.reContentieuxDomaines || []).includes(d);
                    return (
                      <button key={d} type="button" onClick={() => toggleChip('reContentieuxDomaines', d)}
                        className={cn(
                          "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-sm text-xs font-sans font-light transition-all duration-200 border",
                          active ? "bg-foreground text-background border-foreground" : "bg-transparent text-foreground border-border hover:border-foreground/40"
                        )}>
                        {active && <Check className="w-3 h-3" />}
                        {d}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ═══════ PART DE L'ACTIVITÉ EN ANGLAIS ═══════ */}
      <section className="space-y-3">
        <p className="text-lg font-sans font-semibold text-foreground tracking-tight">Part de l'activité en anglais</p>
        <div className="carter-card p-5 space-y-2.5">
          <SegmentedBar
            value={anglaisPct}
            onChange={v => setField('anglais', String(Math.round(v / 5) * 5))}
            step={5}
            activeColor="hsl(215, 50%, 35%)"
            label=""
          />
        </div>
      </section>

      {/* ═══════ CLIENTÈLE ═══════ */}
      <section className="space-y-3">
        <p className="text-lg font-sans font-semibold text-foreground tracking-tight">Type de clients</p>
        <div className="flex flex-wrap gap-2">
          {CLIENT_TYPES.map(c => {
            const active = (store.typesClients || []).includes(c);
            return (
              <button key={c} type="button" onClick={() => toggleChip('typesClients', c)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-sm text-xs font-sans font-light transition-all duration-200 border",
                  active ? "bg-foreground text-background border-foreground" : "bg-transparent text-foreground border-border hover:border-foreground/40"
                )}>
                {active && <Check className="w-3 h-3" />}
                {c}
              </button>
            );
          })}
        </div>
      </section>

      {/* ═══════ SYNTHÈSE ═══════ */}
      <AnimatePresence>
        {showSynthesis && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="carter-card p-6 bg-card">
              <p className="text-lg font-sans font-semibold text-foreground tracking-tight mb-5">Synthèse de votre activité</p>

              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Pie chart */}
                <div className="flex-shrink-0 self-center" style={{ width: 200, height: 200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={48}
                        outerRadius={90}
                        dataKey="value"
                        paddingAngle={1.5}
                        stroke="hsl(var(--background))"
                        strokeWidth={2}
                        label={renderLabel}
                        labelLine={false}
                      >
                        {chartData.map((seg, i) => <Cell key={i} fill={seg.color} />)}
                      </Pie>
                      <Tooltip formatter={(v: number) => [`${v}%`, '']} contentStyle={tooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Legend + annotations */}
                <div className="flex-1 space-y-4 min-w-0">
                  {/* Activity legend */}
                  <div className="space-y-1.5">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium mb-2">Activité conseil</p>
                    {chartData.map(seg => (
                      <div key={seg.name} className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: seg.color }} />
                        <span className="text-[11px] font-sans text-foreground/80 flex-1 min-w-0 truncate">{seg.name}</span>
                        <span className="text-[11px] font-sans font-bold text-foreground tabular-nums">{seg.value}%</span>
                      </div>
                    ))}
                  </div>

                  {/* Asset types */}
                  {(store.reAssetTypes || []).length > 0 && (
                    <div className="border-t border-border pt-3 space-y-1.5">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium mb-1">Typologie d'actifs</p>
                      <div className="flex flex-wrap gap-1.5">
                        {(store.reAssetTypes || []).map(a => (
                          <span key={a} className="inline-flex items-center px-2.5 py-0.5 rounded-sm text-[11px] font-sans bg-secondary text-foreground/80 border border-border">
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Contentieux annotation */}
                  {hasContentieux && (
                    <div className="border-t border-border pt-3 space-y-1.5">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium mb-1">Contentieux</p>
                      <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: COL_CONTENTIEUX }} />
                        <span className="text-[11px] font-sans text-foreground/80 flex-1">{contentieuxPct}% de l'activité totale</span>
                      </div>
                      {(store.reContentieuxDomaines || []).length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {(store.reContentieuxDomaines || []).map(d => (
                            <span key={d} className="inline-flex items-center px-2.5 py-0.5 rounded-sm text-[11px] font-sans bg-secondary text-foreground/80 border border-border">
                              {d}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Anglais */}
                  {anglaisPct > 0 && (
                    <div className="border-t border-border pt-3">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium mb-1">Activité en anglais</p>
                      <p className="text-[11px] font-sans font-bold text-foreground">{anglaisPct}%</p>
                    </div>
                  )}

                  {/* Clientèle */}
                  {(store.typesClients || []).length > 0 && (
                    <div className="border-t border-border pt-3 space-y-1.5">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium mb-1">Type de clients</p>
                      <div className="flex flex-wrap gap-1.5">
                        {(store.typesClients || []).map(c => (
                          <span key={c} className="inline-flex items-center px-2.5 py-0.5 rounded-sm text-[11px] font-sans bg-secondary text-foreground/80 border border-border">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RealEstateActivityPanel;
