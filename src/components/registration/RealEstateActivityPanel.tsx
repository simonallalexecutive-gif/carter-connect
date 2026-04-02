import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRegistrationStore } from '@/stores/registrationStore';
import { cn } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Check } from 'lucide-react';
import SegmentedBar from '@/components/shared/SegmentedBar';

/* ── Palette ── */
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

const CONTENTIEUX_DOMAINES = ['Baux commerciaux', 'Construction', 'Autre'] as const;

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

const RealEstateActivityPanel = () => {
  const store = useRegistrationStore();
  const setField = store.setField;

  // ── Advisory sub-distribution (Baux / Share / Asset / Construction) ──
  const bauxVal = store.reBauxAM ?? 25;
  const shareVal = store.reShareDeal ?? 25;
  const assetVal = store.reAssetDealPct ?? 25;
  const constructionVal = Math.max(0, 100 - bauxVal - shareVal - assetVal);

  const handleSubSlider = (field: 'reBauxAM' | 'reShareDeal' | 'reAssetDealPct', val: number) => {
    const fields: ('reBauxAM' | 'reShareDeal' | 'reAssetDealPct')[] = ['reBauxAM', 'reShareDeal', 'reAssetDealPct'];
    const others = fields.filter(f => f !== field);
    const otherSum = others.reduce((s, k) => s + (store[k] ?? 25), 0);
    const remaining = Math.max(0, 100 - val);

    setField(field, val);

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
          const v = Math.round((remaining * ((store[k] ?? 25) / otherSum)) / 5) * 5;
          setField(k, Math.max(0, v));
          assigned += Math.max(0, v);
        }
      });
    }
  };

  // ── Financement ──
  const hasFinancement = store.reHasFinancement === true;
  const financementPct = store.reFinancementPct ?? 20;

  // ── Contentieux ──
  const hasContentieux = store.reHasContentieux === true;
  const contentieuxPct = store.reContentieuxPct ?? 20;

  // ── Anglais (free input) ──
  const anglaisPct = parseInt(store.anglais || '0', 10) || 0;
  const [anglaisInput, setAnglaisInput] = useState(String(anglaisPct));

  const handleAnglaisBlur = () => {
    let v = parseInt(anglaisInput, 10);
    if (isNaN(v)) v = 0;
    v = Math.max(0, Math.min(100, v));
    setAnglaisInput(String(v));
    setField('anglais', String(v));
  };

  // ── Chart data ──
  // Compute effective percentages for pie
  const advisoryPct = Math.max(0, 100 - (hasFinancement ? financementPct : 0) - (hasContentieux ? contentieuxPct : 0));
  const effBaux = Math.round(advisoryPct * bauxVal / 100);
  const effShare = Math.round(advisoryPct * shareVal / 100);
  const effAsset = Math.round(advisoryPct * assetVal / 100);
  const effConstruction = Math.max(0, advisoryPct - effBaux - effShare - effAsset);

  const chartData = useMemo(() => {
    const segments: { name: string; value: number; color: string }[] = [];
    if (effBaux > 0) segments.push({ name: 'Baux / AM', value: effBaux, color: COL_BAUX });
    if (effShare > 0) segments.push({ name: 'Share Deal', value: effShare, color: COL_SHARE });
    if (effAsset > 0) segments.push({ name: 'Asset Deal', value: effAsset, color: COL_ASSET });
    if (effConstruction > 0) segments.push({ name: 'Construction', value: effConstruction, color: COL_CONSTRUCTION });
    if (hasFinancement && financementPct > 0) segments.push({ name: 'Financement', value: financementPct, color: COL_FINANCEMENT });
    if (hasContentieux && contentieuxPct > 0) segments.push({ name: 'Contentieux', value: contentieuxPct, color: COL_CONTENTIEUX });
    return segments;
  }, [effBaux, effShare, effAsset, effConstruction, hasFinancement, financementPct, hasContentieux, contentieuxPct]);

  const toggleChip = (field: 'reAssetTypes' | 'typesClients' | 'reContentieuxDomaines', val: string) => {
    const cur: string[] = (store as any)[field] || [];
    setField(field, cur.includes(val) ? cur.filter((v: string) => v !== val) : [...cur, val]);
  };

  const showSynthesis = chartData.length > 0;

  return (
    <div className="space-y-6">

      {/* ═══════ RÉPARTITION DE L'ACTIVITÉ CONSEIL ═══════ */}
      <section className="space-y-4">
        <p className="text-lg font-serif text-foreground tracking-tight">Répartition de l'activité conseil</p>

        <div className="carter-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-sans font-medium text-foreground">Conseil immobilier</p>
            <span className="text-xs font-sans font-bold text-foreground tabular-nums bg-secondary px-2 py-0.5 rounded-sm">{advisoryPct}%</span>
          </div>

          <div className="space-y-2.5 pl-3 border-l-2 border-border">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Répartition interne</p>

            {/* Baux / AM */}
            <SegmentedBar value={bauxVal} onChange={v => handleSubSlider('reBauxAM', v)} activeColor={COL_BAUX} label="Baux commerciaux / Asset Management" />

            {/* Share Deal */}
            <SegmentedBar value={shareVal} onChange={v => handleSubSlider('reShareDeal', v)} activeColor={COL_SHARE} label="Share Deal" />

            {/* Asset Deal */}
            <SegmentedBar value={assetVal} onChange={v => handleSubSlider('reAssetDealPct', v)} activeColor={COL_ASSET} label="Asset Deal" />

            {/* Construction — computed */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-sans text-foreground/70">Construction <span className="text-muted-foreground">(complément)</span></span>
              <span className="text-xs font-sans font-bold text-foreground tabular-nums">{constructionVal}%</span>
            </div>
          </div>
        </div>

        {/* Financement immobilier — separate toggle like contentieux */}
        <div className="carter-card p-5 space-y-2.5">
          <p className="text-sm font-sans font-medium text-foreground">Financement immobilier</p>
          <p className="text-[12px] font-sans text-muted-foreground mb-1">Faites-vous aussi du financement immobilier ?</p>
          <div className="flex gap-2 mb-2">
            {(['Oui', 'Non'] as const).map(label => {
              const val = label === 'Oui';
              const active = store.reHasFinancement === val;
              return <ChipButton key={label} active={active} onClick={() => setField('reHasFinancement', active ? null : val)}>{label}</ChipButton>;
            })}
          </div>

          <AnimatePresence>
            {hasFinancement && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="pl-3 border-l-2 border-border mt-2 space-y-2">
                  <SegmentedBar value={financementPct} onChange={v => setField('reFinancementPct', v)} activeColor={COL_FINANCEMENT} label="Part dans l'activité globale" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Contentieux immobilier — separate toggle */}
        <div className="carter-card p-5 space-y-2.5">
          <p className="text-sm font-sans font-medium text-foreground">Contentieux immobilier</p>
          <p className="text-[12px] font-sans text-muted-foreground mb-1">Faites-vous aussi du contentieux immobilier ?</p>
          <div className="flex gap-2 mb-2">
            {(['Oui', 'Non'] as const).map(label => {
              const val = label === 'Oui';
              const active = store.reHasContentieux === val;
              return <ChipButton key={label} active={active} onClick={() => setField('reHasContentieux', active ? null : val)}>{label}</ChipButton>;
            })}
          </div>

          <AnimatePresence>
            {hasContentieux && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="pl-3 border-l-2 border-border mt-2 space-y-4">
                  <SegmentedBar value={contentieuxPct} onChange={v => setField('reContentieuxPct', v)} activeColor={COL_CONTENTIEUX} label="Part dans l'activité globale" />

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
      </section>

      {/* ═══════ TYPOLOGIE D'ACTIFS ═══════ */}
      <section className="space-y-3">
        <p className="text-lg font-serif text-foreground tracking-tight">Typologie d'actifs</p>
        <div className="flex flex-wrap gap-2">
          {ASSET_TYPES.map(a => {
            const active = (store.reAssetTypes || []).includes(a);
            return <ChipButton key={a} active={active} onClick={() => toggleChip('reAssetTypes', a)}>{a}</ChipButton>;
          })}
        </div>
      </section>

      {/* ═══════ TYPE DE CLIENTS ═══════ */}
      <section className="space-y-3">
        <p className="text-lg font-serif text-foreground tracking-tight">Type de clients</p>
        <div className="flex flex-wrap gap-2">
          {CLIENT_TYPES.map(c => {
            const active = (store.typesClients || []).includes(c);
            return <ChipButton key={c} active={active} onClick={() => toggleChip('typesClients', c)}>{c}</ChipButton>;
          })}
        </div>
      </section>

      {/* ═══════ PART DE L'ACTIVITÉ EN ANGLAIS ═══════ */}
      <section className="space-y-3">
        <p className="text-lg font-serif text-foreground tracking-tight">Part de l'activité en anglais</p>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min={0}
            max={100}
            value={anglaisInput}
            onChange={e => setAnglaisInput(e.target.value)}
            onBlur={handleAnglaisBlur}
            onKeyDown={e => { if (e.key === 'Enter') handleAnglaisBlur(); }}
            className="w-20 h-9 rounded-sm border border-border bg-background px-3 text-sm font-sans font-bold text-foreground tabular-nums text-center focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
          />
          <span className="text-sm font-sans text-muted-foreground">%</span>
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
              <p className="text-lg font-serif text-foreground tracking-tight mb-5">Synthèse de votre activité</p>

              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Pie chart */}
                <div className="flex-shrink-0 self-center" style={{ width: 200, height: 200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={chartData} cx="50%" cy="50%" innerRadius={48} outerRadius={90} dataKey="value" paddingAngle={1.5} stroke="hsl(var(--background))" strokeWidth={2} label={renderLabel} labelLine={false}>
                        {chartData.map((seg, i) => <Cell key={i} fill={seg.color} />)}
                      </Pie>
                      <Tooltip formatter={(v: number) => [`${v}%`, '']} contentStyle={tooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="flex-1 space-y-4 min-w-0">
                  <div className="space-y-1.5">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium mb-2">Activité</p>
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

                  {anglaisPct > 0 && (
                    <div className="border-t border-border pt-3">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium mb-1">Anglais</p>
                      <span className="text-[11px] font-sans text-foreground/80">{anglaisPct}% de l'activité</span>
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
