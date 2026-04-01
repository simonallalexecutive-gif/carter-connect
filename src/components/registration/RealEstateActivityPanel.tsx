import { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRegistrationStore } from '@/stores/registrationStore';
import { cn } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Check } from 'lucide-react';
import SegmentedBar from '@/components/shared/SegmentedBar';
import { quantizePercentages } from '@/lib/percentages';

/* ── Palette ── */
const COL_BAUX = 'hsl(215, 50%, 35%)';
const COL_SHARE = 'hsl(200, 50%, 40%)';
const COL_ASSET = 'hsl(210, 25%, 50%)';
const COL_CONSTRUCTION = 'hsl(215, 55%, 22%)';
const COL_FINANCEMENT = 'hsl(200, 12%, 45%)';
const COL_CONTENTIEUX = 'hsl(220, 15%, 62%)';
const COL_ANGLAIS = 'hsl(215, 40%, 30%)';

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

const RealEstateActivityPanel = () => {
  const store = useRegistrationStore();
  const setField = store.setField;

  const rawVals: Record<AdjKey, number> = {
    reBauxAM: store.reBauxAM ?? 20,
    reShareDeal: store.reShareDeal ?? 20,
    reAssetDealPct: store.reAssetDealPct ?? 20,
    reConstructionPct: store.reConstructionPct ?? 20,
  };
  const rawFinancement = Math.max(0, 100 - rawVals.reBauxAM - rawVals.reShareDeal - rawVals.reAssetDealPct - rawVals.reConstructionPct);

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

  const hasContentieux = store.reHasContentieux === true;
  const contentieuxPct = store.reContentieuxPct ?? 20;
  const anglaisPct = parseInt(store.anglais || '0', 10) || 0;

  const chartData = useMemo(() => {
    const segments: { name: string; value: number; color: string }[] = [];
    if (qBaux > 0) segments.push({ name: 'Baux / AM', value: qBaux, color: COL_BAUX });
    if (qShare > 0) segments.push({ name: 'Share Deal', value: qShare, color: COL_SHARE });
    if (qAsset > 0) segments.push({ name: 'Asset Deal', value: qAsset, color: COL_ASSET });
    if (qConstruction > 0) segments.push({ name: 'Construction', value: qConstruction, color: COL_CONSTRUCTION });
    if (qFinancement > 0) segments.push({ name: 'Financement', value: qFinancement, color: COL_FINANCEMENT });
    return segments;
  }, [qBaux, qShare, qAsset, qConstruction, qFinancement]);

  const toggleChip = (field: 'reAssetTypes' | 'typesClients' | 'reContentieuxDomaines', val: string) => {
    const cur: string[] = (store as any)[field] || [];
    setField(field, cur.includes(val) ? cur.filter((v: string) => v !== val) : [...cur, val]);
  };

  const showSynthesis = chartData.length > 0;

  return (
    <div className="space-y-6">

      {/* ═══════ SINGLE UNIFIED BLOCK ═══════ */}
      <div className="border border-border rounded-sm p-6 md:p-8 space-y-0">

        {/* ── Répartition conseil ── */}
        <p className="font-sans text-[11px] font-medium text-muted-foreground uppercase tracking-[0.15em] mb-5">Répartition de l'activité conseil</p>

        <div className="space-y-5">
          {SEGMENTS.map(seg => {
            const display = seg.key === 'reBauxAM' ? qBaux : seg.key === 'reShareDeal' ? qShare : seg.key === 'reAssetDealPct' ? qAsset : qConstruction;
            return (
              <div key={seg.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-sans text-foreground">{seg.label}</span>
                  <span className="text-[13px] font-sans font-bold text-foreground tabular-nums">{display}%</span>
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
          <div className="flex items-center justify-between py-2 border-t border-border">
            <span className="text-[13px] font-sans text-foreground">Financement immobilier <span className="text-muted-foreground text-[11px]">(complément)</span></span>
            <span className="text-[13px] font-sans font-bold text-foreground tabular-nums">{qFinancement}%</span>
          </div>
        </div>

        {/* ── Contentieux ── */}
        <div className="pt-8">
          <p className="font-sans text-[11px] font-medium text-muted-foreground uppercase tracking-[0.15em] mb-4">Contentieux</p>
          <p className="text-[12px] font-sans text-muted-foreground mb-3">Faites-vous aussi du contentieux immobilier ?</p>
          <div className="flex gap-2 mb-3">
            {(['Oui', 'Non'] as const).map(label => {
              const val = label === 'Oui';
              const active = store.reHasContentieux === val;
              return <ChipButton key={label} active={active} onClick={() => setField('reHasContentieux', active ? null : val)}>{label}</ChipButton>;
            })}
          </div>

          <AnimatePresence>
            {hasContentieux && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="space-y-4 pl-3 border-l-2 border-border mt-2">
                  <div className="space-y-2">
                    <span className="text-[13px] font-sans text-foreground">Part du contentieux dans l'activité totale</span>
                    <SegmentedBar value={contentieuxPct} onChange={v => setField('reContentieuxPct', Math.round(v / 5) * 5)} step={5} activeColor={COL_CONTENTIEUX} />
                    <div className="flex justify-between text-[11px] font-sans text-muted-foreground">
                      <span>Conseil <strong className="text-foreground">{100 - contentieuxPct}%</strong></span>
                      <span>Contentieux <strong className="text-foreground">{contentieuxPct}%</strong></span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Dans quel(s) domaine(s) ?</p>
                    <div className="flex flex-wrap gap-2">
                      {CONTENTIEUX_DOMAINES.map(d => {
                        const active = (store.reContentieuxDomaines || []).includes(d);
                        return <ChipButton key={d} active={active} onClick={() => toggleChip('reContentieuxDomaines', d)}>{d}</ChipButton>;
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Typologie d'actifs ── */}
        <div className="pt-8">
          <p className="font-sans text-[11px] font-medium text-muted-foreground uppercase tracking-[0.15em] mb-4">Typologie d'actifs</p>
          <div className="flex flex-wrap gap-2">
            {ASSET_TYPES.map(a => {
              const active = (store.reAssetTypes || []).includes(a);
              return <ChipButton key={a} active={active} onClick={() => toggleChip('reAssetTypes', a)}>{a}</ChipButton>;
            })}
          </div>
        </div>

        {/* ── Part de l'activité en anglais ── */}
        <div className="pt-8">
          <p className="font-sans text-[11px] font-medium text-muted-foreground uppercase tracking-[0.15em] mb-4">Part de l'activité en anglais</p>
          <div className="flex gap-1.5 flex-wrap">
            {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(v => (
              <button key={v} type="button" onClick={() => setField('anglais', String(v))}
                className={cn(
                  "px-2.5 py-1.5 rounded-sm text-[11px] font-sans border transition-all min-w-[40px]",
                  anglaisPct === v
                    ? "bg-foreground text-background border-foreground"
                    : "bg-transparent text-muted-foreground border-border hover:border-foreground"
                )}>
                {v}%
              </button>
            ))}
          </div>
        </div>

        {/* ── Type de clients ── */}
        <div className="pt-8">
          <p className="font-sans text-[11px] font-medium text-muted-foreground uppercase tracking-[0.15em] mb-4">Type de clients</p>
          <div className="flex flex-wrap gap-2">
            {CLIENT_TYPES.map(c => {
              const active = (store.typesClients || []).includes(c);
              return <ChipButton key={c} active={active} onClick={() => toggleChip('typesClients', c)}>{c}</ChipButton>;
            })}
          </div>
        </div>
      </div>

      {/* ═══════ SYNTHÈSE ═══════ */}
      <AnimatePresence>
        {showSynthesis && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="border border-border rounded-sm p-6 md:p-8">
              <p className="font-sans text-[11px] font-medium text-muted-foreground uppercase tracking-[0.15em] mb-5">Synthèse de votre activité</p>

              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Pie chart */}
                <div className="flex-shrink-0 self-center" style={{ width: 180, height: 180 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={chartData} cx="50%" cy="50%" innerRadius={44} outerRadius={82} dataKey="value" paddingAngle={1.5} stroke="hsl(var(--background))" strokeWidth={2} label={renderLabel} labelLine={false}>
                        {chartData.map((seg, i) => <Cell key={i} fill={seg.color} />)}
                      </Pie>
                      <Tooltip formatter={(v: number) => [`${v}%`, '']} contentStyle={tooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="flex-1 space-y-4 min-w-0">
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

                  {(store.reAssetTypes || []).length > 0 && (
                    <div className="border-t border-border pt-3 space-y-1.5">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium mb-1">Actifs</p>
                      <div className="flex flex-wrap gap-1.5">
                        {(store.reAssetTypes || []).map(a => (
                          <span key={a} className="inline-flex items-center px-2.5 py-0.5 rounded-sm text-[11px] font-sans bg-secondary text-foreground/80 border border-border">{a}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {hasContentieux && (
                    <div className="border-t border-border pt-3 space-y-1.5">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium mb-1">Contentieux</p>
                      <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: COL_CONTENTIEUX }} />
                        <span className="text-[11px] font-sans text-foreground/80 flex-1">{contentieuxPct}% de l'activité totale</span>
                      </div>
                    </div>
                  )}

                  {anglaisPct > 0 && (
                    <div className="border-t border-border pt-3">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium mb-1">Anglais</p>
                      <span className="text-[11px] font-sans text-foreground/80">{anglaisPct}% de l'activité</span>
                    </div>
                  )}

                  {(store.typesClients || []).length > 0 && (
                    <div className="border-t border-border pt-3 space-y-1.5">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium mb-1">Clients</p>
                      <div className="flex flex-wrap gap-1.5">
                        {(store.typesClients || []).map(c => (
                          <span key={c} className="inline-flex items-center px-2.5 py-0.5 rounded-sm text-[11px] font-sans bg-secondary text-foreground/80 border border-border">{c}</span>
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
