import { motion, AnimatePresence } from 'motion/react';
import { useRegistrationStore } from '@/stores/registrationStore';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import ActivityPieChart from '@/components/shared/ActivityPieChart';
import SegmentedBar from '@/components/shared/SegmentedBar';

/* ── Palette ── */
const PIE_COLORS = [
  'hsl(215, 55%, 28%)',   // Baux / AM
  'hsl(200, 50%, 40%)',   // Share Deal
  'hsl(190, 40%, 50%)',   // Asset Deal
  'hsl(45, 40%, 42%)',    // Construction
  'hsl(160, 35%, 38%)',   // Financement
];

const ASSET_TYPES = [
  'Bureaux',
  'Retail / Commerces',
  'Logistique / Entrepôts',
  'Industriel',
  'Résidentiel',
  'Hôtellerie',
  'Restauration',
] as const;

const CONTENTIEUX_DOMAINES = ['Baux commerciaux', 'Construction'] as const;

/* ── Shared UI ── */
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium mb-3">{children}</p>
);

const ChipButton = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-sans font-light transition-all duration-200 border",
      active
        ? "bg-foreground text-background border-foreground"
        : "bg-transparent text-foreground border-border hover:border-foreground/40"
    )}
  >
    {active && <Check className="w-3 h-3" />}
    {label}
  </button>
);

const SliderRow = ({ label, value, color, onChange, disabled }: {
  label: string; value: number; color: string; onChange: (v: number) => void; disabled?: boolean;
}) => (
  <div className="space-y-1">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: color }} />
        <span className="text-xs font-sans text-foreground">{label}</span>
      </div>
      <span className="text-xs font-sans font-bold text-foreground tabular-nums">{value}%</span>
    </div>
    {!disabled && (
      <SegmentedBar value={value} onChange={onChange} />
    )}
  </div>
);

/* ── Clamping logic for 4 adjustable + 1 computed ── */
type AdjKey = 'reBauxAM' | 'reShareDeal' | 'reAssetDealPct' | 'reConstructionPct';
const ADJ_KEYS: AdjKey[] = ['reBauxAM', 'reShareDeal', 'reAssetDealPct', 'reConstructionPct'];

const useClampFourWay = () => {
  const setField = useRegistrationStore(s => s.setField);
  const reBauxAM = useRegistrationStore(s => s.reBauxAM);
  const reShareDeal = useRegistrationStore(s => s.reShareDeal);
  const reAssetDealPct = useRegistrationStore(s => s.reAssetDealPct);
  const reConstructionPct = useRegistrationStore(s => s.reConstructionPct);

  return (key: AdjKey, val: number) => {
    const vals: Record<AdjKey, number> = { reBauxAM, reShareDeal, reAssetDealPct, reConstructionPct };
    const others = ADJ_KEYS.filter(k => k !== key);
    const remaining = 100 - val;
    if (remaining < 0) return;

    const otherSum = others.reduce((s, k) => s + vals[k], 0);
    setField(key, val);

    if (otherSum === 0) {
      const each = Math.floor(remaining / others.length);
      others.forEach((k, i) => {
        setField(k, i === others.length - 1 ? remaining - each * (others.length - 1) : each);
      });
    } else {
      const newVals = others.map(k => Math.round(remaining * (vals[k] / otherSum)));
      const newSum = newVals.reduce((a, b) => a + b, 0);
      if (newSum !== remaining) newVals[0] += remaining - newSum;
      others.forEach((k, i) => setField(k, Math.max(0, newVals[i])));
    }
  };
};

/* ══════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════ */
const RealEstateActivityPanel = () => {
  const store = useRegistrationStore();
  const clamp = useClampFourWay();

  const bauxAM = store.reBauxAM ?? 20;
  const shareDeal = store.reShareDeal ?? 20;
  const assetDeal = store.reAssetDealPct ?? 20;
  const construction = store.reConstructionPct ?? 20;
  const financement = Math.max(0, 100 - bauxAM - shareDeal - assetDeal - construction);

  const toggleAsset = (val: string) => {
    const cur = store.reAssetTypes || [];
    store.setField('reAssetTypes', cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val]);
  };

  const toggleContentieuxDomaine = (val: string) => {
    const cur = store.reContentieuxDomaines || [];
    store.setField('reContentieuxDomaines', cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val]);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="carter-card p-6 space-y-8">

        {/* ─────── I. ACTIVITÉ CONSEIL (PIE CHART) ─────── */}
        <div className="space-y-5">
          <SectionTitle>Répartition de l'activité conseil</SectionTitle>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Pie + Asset types */}
            <div className="flex-shrink-0 space-y-5">
              <ActivityPieChart
                data={{
                  'Baux / AM': bauxAM,
                  'Share Deal': shareDeal,
                  'Asset Deal': assetDeal,
                  'Construction': construction,
                  'Financement': financement,
                }}
                size={180}
                innerRadius={45}
                outerRadius={80}
                showLegend={false}
                customColors={PIE_COLORS}
              />

              {/* Asset types next to pie */}
              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Typologie d'actifs</p>
                <div className="flex flex-wrap gap-1.5">
                  {ASSET_TYPES.map(a => (
                    <ChipButton
                      key={a}
                      label={a}
                      active={(store.reAssetTypes || []).includes(a)}
                      onClick={() => toggleAsset(a)}
                    />
                  ))}
                </div>
              </div>

              {/* Contentieux annotation */}
              <AnimatePresence>
                {store.reHasContentieux && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2 pt-3 border-t border-border"
                  >
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Contentieux — {store.reContentieuxPct}% de l'activité totale</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(store.reContentieuxDomaines || []).map(d => (
                        <span key={d} className="inline-flex items-center px-2.5 py-1 rounded-sm text-xs font-sans bg-muted text-muted-foreground border border-border">
                          {d}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sliders */}
            <div className="flex-1 space-y-3 w-full">
              <SliderRow
                label="Baux commerciaux / Asset Management"
                value={bauxAM}
                color={PIE_COLORS[0]}
                onChange={v => clamp('reBauxAM', v)}
              />
              <SliderRow
                label="Share Deal"
                value={shareDeal}
                color={PIE_COLORS[1]}
                onChange={v => clamp('reShareDeal', v)}
              />
              <SliderRow
                label="Asset Deal"
                value={assetDeal}
                color={PIE_COLORS[2]}
                onChange={v => clamp('reAssetDealPct', v)}
              />
              <SliderRow
                label="Construction"
                value={construction}
                color={PIE_COLORS[3]}
                onChange={v => clamp('reConstructionPct', v)}
              />
              <SliderRow
                label="Financement immobilier"
                value={financement}
                color={PIE_COLORS[4]}
                disabled
                onChange={() => {}}
              />
            </div>
          </div>
        </div>

        {/* ─────── II. CONTENTIEUX ─────── */}
        <div className="space-y-4 pt-6 border-t border-border">
          <SectionTitle>Faites-vous aussi du contentieux ?</SectionTitle>

          <div className="flex gap-2">
            <ChipButton
              label="Oui"
              active={store.reHasContentieux === true}
              onClick={() => store.setField('reHasContentieux', store.reHasContentieux === true ? null : true)}
            />
            <ChipButton
              label="Non"
              active={store.reHasContentieux === false}
              onClick={() => store.setField('reHasContentieux', store.reHasContentieux === false ? null : false)}
            />
          </div>

          <AnimatePresence>
            {store.reHasContentieux && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 pl-1"
              >
                <div className="space-y-2">
                  <p className="text-xs font-sans text-foreground">
                    Part du contentieux dans votre activité totale
                  </p>
                  <SegmentedBar
                    value={store.reContentieuxPct ?? 20}
                    onChange={v => store.setField('reContentieuxPct', v)}
                  />
                  <div className="flex justify-between text-xs font-sans text-muted-foreground">
                    <span>Conseil <strong>{100 - (store.reContentieuxPct ?? 20)}%</strong></span>
                    <span>Contentieux <strong>{store.reContentieuxPct ?? 20}%</strong></span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-sans text-foreground">Dans quel(s) domaine(s) ?</p>
                  <div className="flex flex-wrap gap-2">
                    {CONTENTIEUX_DOMAINES.map(d => (
                      <ChipButton
                        key={d}
                        label={d}
                        active={(store.reContentieuxDomaines || []).includes(d)}
                        onClick={() => toggleContentieuxDomaine(d)}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </motion.div>
    </div>
  );
};

export default RealEstateActivityPanel;
