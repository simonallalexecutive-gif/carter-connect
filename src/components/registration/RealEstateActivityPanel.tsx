import { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRegistrationStore } from '@/stores/registrationStore';
import { cn } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Check, Minus, Plus } from 'lucide-react';
import SegmentedBar from '@/components/shared/SegmentedBar';
import { buildQuantizedChartData } from '@/lib/percentages';

/* ── Palette — professional dark tones, NO yellow ── */
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

const CONTENTIEUX_DOMAINES = ['Baux commerciaux', 'Construction'] as const;

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

/* ── Clamping: 4 adjustable sliders, 1 computed remainder ── */
type AdjKey = 'reBauxAM' | 'reShareDeal' | 'reAssetDealPct' | 'reConstructionPct';
const ADJ_KEYS: AdjKey[] = ['reBauxAM', 'reShareDeal', 'reAssetDealPct', 'reConstructionPct'];

const RealEstateActivityPanel = () => {
  const store = useRegistrationStore();

  // ── Values ──
  const bauxAM = store.reBauxAM ?? 20;
  const shareDeal = store.reShareDeal ?? 20;
  const assetDeal = store.reAssetDealPct ?? 20;
  const construction = store.reConstructionPct ?? 20;
  const financement = Math.max(0, 100 - bauxAM - shareDeal - assetDeal - construction);

  // Contentieux
  const hasContentieux = store.reHasContentieux === true;
  const contentieuxPct = store.reContentieuxPct ?? 20;

  // ── Clamp handler ──
  const handleSliderChange = (key: AdjKey, val: number) => {
    const vals: Record<AdjKey, number> = { reBauxAM: bauxAM, reShareDeal: shareDeal, reAssetDealPct: assetDeal, reConstructionPct: construction };
    const others = ADJ_KEYS.filter(k => k !== key);
    const remaining = 100 - val;
    if (remaining < 0) return;

    const otherSum = others.reduce((s, k) => s + vals[k], 0);
    store.setField(key, val);

    if (otherSum === 0) {
      const each = Math.floor(remaining / others.length);
      others.forEach((k, i) => {
        store.setField(k, i === others.length - 1 ? remaining - each * (others.length - 1) : each);
      });
    } else {
      const newVals = others.map(k => Math.round(remaining * (vals[k] / otherSum)));
      const newSum = newVals.reduce((a, b) => a + b, 0);
      if (newSum !== remaining) newVals[0] += remaining - newSum;
      others.forEach((k, i) => store.setField(k, Math.max(0, newVals[i])));
    }
  };

  // ── Chart data ──
  const chartData = useMemo(() => {
    const segments: { name: string; value: number; color: string }[] = [];
    if (bauxAM > 0) segments.push({ name: 'Baux / Asset Management', value: bauxAM, color: COL_BAUX });
    if (shareDeal > 0) segments.push({ name: 'Share Deal', value: shareDeal, color: COL_SHARE });
    if (assetDeal > 0) segments.push({ name: 'Asset Deal', value: assetDeal, color: COL_ASSET });
    if (construction > 0) segments.push({ name: 'Construction', value: construction, color: COL_CONSTRUCTION });
    if (financement > 0) segments.push({ name: 'Financement immobilier', value: financement, color: COL_FINANCEMENT });
    return segments;
  }, [bauxAM, shareDeal, assetDeal, construction, financement]);

  // ── Toggles ──
  const toggleAsset = (val: string) => {
    const cur = store.reAssetTypes || [];
    store.setField('reAssetTypes', cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val]);
  };

  const toggleContentieuxDomaine = (val: string) => {
    const cur = store.reContentieuxDomaines || [];
    store.setField('reContentieuxDomaines', cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val]);
  };

  const allFilled = chartData.length > 0 && (store.reAssetTypes || []).length > 0;

  return (
    <div className="space-y-6">

      {/* ═══════ RÉPARTITION CONSEIL ═══════ */}
      <section className="space-y-4">
        <p className="text-lg font-serif text-foreground tracking-tight">Répartition de l'activité conseil</p>

        <div className="space-y-4">
          {/* Baux / AM */}
          <div className="carter-card p-5 space-y-2.5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-sans font-medium text-foreground">Baux commerciaux / Asset Management</p>
              <span className="text-xs font-sans font-bold text-foreground tabular-nums bg-secondary px-2 py-0.5 rounded-sm">{bauxAM}%</span>
            </div>
            <SegmentedBar value={bauxAM} onChange={v => handleSliderChange('reBauxAM', v)} activeColor={COL_BAUX} />
          </div>

          {/* Share Deal */}
          <div className="carter-card p-5 space-y-2.5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-sans font-medium text-foreground">Share Deal</p>
              <span className="text-xs font-sans font-bold text-foreground tabular-nums bg-secondary px-2 py-0.5 rounded-sm">{shareDeal}%</span>
            </div>
            <SegmentedBar value={shareDeal} onChange={v => handleSliderChange('reShareDeal', v)} activeColor={COL_SHARE} />
          </div>

          {/* Asset Deal */}
          <div className="carter-card p-5 space-y-2.5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-sans font-medium text-foreground">Asset Deal</p>
              <span className="text-xs font-sans font-bold text-foreground tabular-nums bg-secondary px-2 py-0.5 rounded-sm">{assetDeal}%</span>
            </div>
            <SegmentedBar value={assetDeal} onChange={v => handleSliderChange('reAssetDealPct', v)} activeColor={COL_ASSET} />
          </div>

          {/* Construction */}
          <div className="carter-card p-5 space-y-2.5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-sans font-medium text-foreground">Construction</p>
              <span className="text-xs font-sans font-bold text-foreground tabular-nums bg-secondary px-2 py-0.5 rounded-sm">{construction}%</span>
            </div>
            <SegmentedBar value={construction} onChange={v => handleSliderChange('reConstructionPct', v)} activeColor={COL_CONSTRUCTION} />
          </div>

          {/* Financement — computed */}
          <div className="carter-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-sans font-medium text-foreground">Financement immobilier</p>
              <span className="text-xs font-sans font-bold text-foreground tabular-nums bg-secondary px-2 py-0.5 rounded-sm">{financement}%</span>
            </div>
            <p className="text-[10px] font-sans text-muted-foreground mt-1">Calculé automatiquement comme complément à 100%</p>
          </div>
        </div>
      </section>

      {/* ═══════ TYPOLOGIE D'ACTIFS ═══════ */}
      <section className="space-y-3">
        <p className="text-lg font-serif text-foreground tracking-tight">Typologie d'actifs</p>
        <div className="flex flex-wrap gap-2">
          {ASSET_TYPES.map(a => {
            const active = (store.reAssetTypes || []).includes(a);
            return (
              <button key={a} type="button" onClick={() => toggleAsset(a)}
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
        <p className="text-lg font-serif text-foreground tracking-tight">Contentieux</p>
        <p className="text-xs font-sans text-muted-foreground">Faites-vous aussi du contentieux immobilier ?</p>
        <div className="flex gap-2">
          {(['Oui', 'Non'] as const).map(label => {
            const val = label === 'Oui';
            const active = store.reHasContentieux === val;
            return (
              <button key={label} type="button" onClick={() => store.setField('reHasContentieux', active ? null : val)}
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
                <SegmentedBar value={contentieuxPct} onChange={v => store.setField('reContentieuxPct', v)} activeColor={COL_CONTENTIEUX} />
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
                      <button key={d} type="button" onClick={() => toggleContentieuxDomaine(d)}
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

      {/* ═══════ SYNTHÈSE INLINE ═══════ */}
      <AnimatePresence>
        {allFilled && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="carter-card p-6 bg-card">
              <p className="text-lg font-serif text-foreground tracking-tight mb-5">Synthèse de votre activité</p>

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

                {/* Legend + side info */}
                <div className="flex-1 space-y-5 min-w-0">
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
