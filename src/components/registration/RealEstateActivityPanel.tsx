import { motion, AnimatePresence } from 'motion/react';
import { useRegistrationStore } from '@/stores/registrationStore';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

/* ── Colors ── */
const COL_CONSEIL = 'hsl(215, 55%, 28%)';
const COL_CONTENTIEUX = 'hsl(35, 30%, 50%)';
const COL_TRANSAC = 'hsl(200, 50%, 40%)';
const COL_FINIMMO = 'hsl(160, 35%, 40%)';
const COL_DEV = 'hsl(45, 45%, 45%)';

const ASSET_TYPES = ['Bureaux', 'Logistique', 'Résidentiel', 'Retail', 'Hôtellerie'];

const BAIL_SIDE = ['Côté bailleur', 'Côté preneur', 'Les deux'] as const;

const CLIENTELE_OPTIONS = [
  { key: 'fonds_immo', label: 'Fonds immobiliers', color: 'hsl(215, 50%, 30%)' },
  { key: 'invest_instit', label: 'Investisseurs institutionnels', color: 'hsl(200, 40%, 40%)' },
  { key: 'promoteurs', label: 'Promoteurs', color: 'hsl(160, 35%, 38%)' },
  { key: 'autres_re', label: 'Autres', color: 'hsl(35, 30%, 45%)' },
];

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium mb-3">{children}</p>
);

const ChipButton = ({ label, active, onClick, disabled }: { label: string; active: boolean; onClick: () => void; disabled?: boolean }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={cn(
      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-sans font-light transition-all duration-200 border",
      active
        ? "bg-foreground text-background border-foreground"
        : disabled
          ? "border-border/40 text-muted-foreground/40 cursor-not-allowed"
          : "bg-transparent text-foreground border-border hover:border-foreground/40"
    )}
  >
    {active && <Check className="w-3 h-3" />}
    {label}
  </button>
);

const SliderRow = ({ label, value, color, onChange }: { label: string; value: number; color: string; onChange: (v: number) => void }) => (
  <div className="space-y-1">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: color }} />
        <span className="text-xs font-sans text-foreground">{label}</span>
      </div>
      <span className="text-xs font-sans font-bold text-foreground tabular-nums">{value}%</span>
    </div>
    <Slider value={[value]} onValueChange={([v]) => onChange(v)} min={0} max={100} step={5} className="w-full" />
  </div>
);

const Gauge = ({ segments }: { segments: { pct: number; color: string }[] }) => (
  <div className="h-2.5 rounded-full overflow-hidden flex border border-border">
    {segments.map((s, i) => (
      <div key={i} className="h-full transition-all duration-300" style={{ width: `${s.pct}%`, backgroundColor: s.color }} />
    ))}
  </div>
);

const RealEstateActivityPanel = () => {
  const store = useRegistrationStore();

  // Q1
  const conseilPct = store.reConseil ?? 50;
  const contentieuxPct = 100 - conseilPct;

  // Q2
  const transacPct = store.reTransac ?? 34;
  const finImmoPct = store.reFinImmo ?? 33;
  const devPct = Math.max(0, 100 - transacPct - finImmoPct);

  const setConseilSplit = (key: 'reTransac' | 'reFinImmo', val: number) => {
    const other = key === 'reTransac' ? store.reFinImmo : store.reTransac;
    const remaining = 100 - val;
    if (remaining < 0) return;
    store.setField(key, val);
    if (key === 'reTransac') {
      store.setField('reFinImmo', Math.min(other, remaining));
    } else {
      store.setField('reTransac', Math.min(other, remaining));
    }
  };

  // Q3 transactional
  const acqPct = store.reTransacAcq ?? 50;
  const devProjPct = 100 - acqPct;
  const assetPct = store.reTransacAsset ?? 50;
  const sharePct = 100 - assetPct;

  // Q4 baux
  const bauxPct = store.reBauxPct ?? 0;

  // Q5 financement
  const creditPct = store.reFinCredit ?? 34;
  const leveragedPct = store.reFinLeveraged ?? 33;
  const refiPct = Math.max(0, 100 - creditPct - leveragedPct);

  const setFinSplit = (key: 'reFinCredit' | 'reFinLeveraged', val: number) => {
    const other = key === 'reFinCredit' ? store.reFinLeveraged : store.reFinCredit;
    const remaining = 100 - val;
    if (remaining < 0) return;
    store.setField(key, val);
    if (key === 'reFinCredit') {
      store.setField('reFinLeveraged', Math.min(other, remaining));
    } else {
      store.setField('reFinCredit', Math.min(other, remaining));
    }
  };

  // Q6 — clientele percentage breakdown
  const clientelePct = store.reClientelePct || {};
  const setClientelePct = (key: string, val: number) => {
    const otherKeys = CLIENTELE_OPTIONS.filter(o => o.key !== key).map(o => o.key);
    const remaining = 100 - val;
    if (remaining < 0) return;

    const otherTotal = otherKeys.reduce((sum, k) => sum + (clientelePct[k] || 0), 0);
    const newPct = { ...clientelePct, [key]: val };

    if (otherTotal > remaining) {
      // Scale down others proportionally
      const scale = otherTotal > 0 ? remaining / otherTotal : 0;
      otherKeys.forEach(k => {
        newPct[k] = Math.round((clientelePct[k] || 0) * scale / 5) * 5;
      });
      // Adjust rounding
      const totalAfter = val + otherKeys.reduce((sum, k) => sum + (newPct[k] || 0), 0);
      if (totalAfter !== 100 && otherKeys.length > 0) {
        const diff = 100 - totalAfter;
        const firstOther = otherKeys.find(k => (newPct[k] || 0) + diff >= 0);
        if (firstOther) newPct[firstOther] = (newPct[firstOther] || 0) + diff;
      }
    }

    store.setField('reClientelePct', newPct);
  };

  // Q3 asset types toggle
  const toggleAssetType = (value: string) => {
    const cur = store.reAssetTypes || [];
    store.setField('reAssetTypes', cur.includes(value) ? cur.filter(v => v !== value) : [...cur, value]);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="carter-card p-6 space-y-6">

        {/* Header */}
        <div className="space-y-1">
          <p className="text-sm font-sans text-foreground font-medium">Cartographions votre pratique en droit immobilier</p>
          <p className="text-xs font-sans text-muted-foreground font-light">Répondez en quelques étapes pour représenter précisément votre activité.</p>
          <p className="text-[10px] font-sans text-muted-foreground">⏱️ 1 minute</p>
        </div>

        <div className="flex gap-8 items-start flex-col lg:flex-row">

          {/* ── LEFT ── */}
          <div className="lg:w-1/2 space-y-5">

            {/* Q1 */}
            <div className="space-y-3">
              <SectionTitle>1. Comment se répartit votre activité ?</SectionTitle>
              <SliderRow label="Conseil" value={conseilPct} color={COL_CONSEIL} onChange={v => store.setField('reConseil', v)} />
              <SliderRow label="Contentieux" value={contentieuxPct} color={COL_CONTENTIEUX} onChange={v => store.setField('reConseil', 100 - v)} />
              <Gauge segments={[{ pct: conseilPct, color: COL_CONSEIL }, { pct: contentieuxPct, color: COL_CONTENTIEUX }]} />
            </div>

            {/* Q2 — only if conseil > 0 */}
            <AnimatePresence>
              {conseilPct > 0 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden space-y-3 pt-3 border-t border-border">
                  <SectionTitle>2. Comment se répartit votre activité en conseil ?</SectionTitle>
                  <SliderRow label="Transactionnel (Real Estate M&A)" value={transacPct} color={COL_TRANSAC} onChange={v => setConseilSplit('reTransac', v)} />
                  <SliderRow label="Financement immobilier" value={finImmoPct} color={COL_FINIMMO} onChange={v => setConseilSplit('reFinImmo', v)} />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: COL_DEV }} />
                      <span className="text-xs font-sans text-foreground">Développement / Asset management</span>
                    </div>
                    <span className="text-xs font-sans font-bold text-foreground tabular-nums">{devPct}%</span>
                  </div>
                  <Gauge segments={[
                    { pct: transacPct, color: COL_TRANSAC },
                    { pct: finImmoPct, color: COL_FINIMMO },
                    { pct: devPct, color: COL_DEV },
                  ]} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Q4 — Baux commerciaux */}
            <div className="space-y-3 pt-3 border-t border-border">
              <SectionTitle>4. Quelle part de votre activité concerne les baux commerciaux ?</SectionTitle>
              <SliderRow label="Part de votre activité totale" value={bauxPct} color="hsl(270, 30%, 45%)" onChange={v => store.setField('reBauxPct', v)} />
              <AnimatePresence>
                {bauxPct > 0 && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <div className="flex flex-wrap gap-2 mt-2">
                      {BAIL_SIDE.map(opt => (
                        <ChipButton key={opt} label={opt} active={store.reBauxSide === opt} onClick={() => store.setField('reBauxSide', store.reBauxSide === opt ? '' : opt)} />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div className="lg:w-1/2 space-y-5">

            {/* Q3 — Transactional detail (if transac > 0 & conseil > 0) */}
            <AnimatePresence>
              {conseilPct > 0 && transacPct > 0 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden space-y-3">
                  <SectionTitle>3. Sur votre activité transactionnelle (Real Estate M&A)</SectionTitle>
                  <SliderRow label="Acquisitions / cessions d'actifs" value={acqPct} color={COL_TRANSAC} onChange={v => store.setField('reTransacAcq', v)} />
                  <SliderRow label="Développement de projets" value={devProjPct} color={COL_DEV} onChange={v => store.setField('reTransacAcq', 100 - v)} />

                  <p className="text-[10px] text-muted-foreground font-sans mt-2">Structuration</p>
                  <SliderRow label="Asset deals" value={assetPct} color="hsl(200, 40%, 50%)" onChange={v => store.setField('reTransacAsset', v)} />
                  <SliderRow label="Share deals" value={sharePct} color="hsl(220, 40%, 35%)" onChange={v => store.setField('reTransacAsset', 100 - v)} />

                  <p className="text-[10px] text-muted-foreground font-sans mt-2">Types d'actifs</p>
                  <div className="flex flex-wrap gap-2">
                    {ASSET_TYPES.map(a => (
                      <ChipButton key={a} label={a} active={(store.reAssetTypes || []).includes(a)} onClick={() => toggleAssetType(a)} />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Q5 — Financement immobilier detail (if finImmo > 0 & conseil > 0) */}
            <AnimatePresence>
              {conseilPct > 0 && finImmoPct > 0 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden space-y-3 pt-3 border-t border-border">
                  <SectionTitle>5. Sur le financement immobilier</SectionTitle>
                  <SliderRow label="Crédits immobiliers" value={creditPct} color={COL_FINIMMO} onChange={v => setFinSplit('reFinCredit', v)} />
                  <SliderRow label="Leveraged / structured finance" value={leveragedPct} color="hsl(180, 30%, 42%)" onChange={v => setFinSplit('reFinLeveraged', v)} />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: 'hsl(140, 25%, 45%)' }} />
                      <span className="text-xs font-sans text-foreground">Refinancing</span>
                    </div>
                    <span className="text-xs font-sans font-bold text-foreground tabular-nums">{refiPct}%</span>
                  </div>
                  <Gauge segments={[
                    { pct: creditPct, color: COL_FINIMMO },
                    { pct: leveragedPct, color: 'hsl(180, 30%, 42%)' },
                    { pct: refiPct, color: 'hsl(140, 25%, 45%)' },
                  ]} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Q6 — Typologie (percentage breakdown) */}
            <div className="space-y-3 pt-3 border-t border-border">
              <SectionTitle>6. Quelle est la typologie de vos dossiers ? (répartition en %)</SectionTitle>
              {CLIENTELE_OPTIONS.map(opt => (
                <SliderRow
                  key={opt.key}
                  label={opt.label}
                  value={clientelePct[opt.key] || 0}
                  color={opt.color}
                  onChange={v => setClientelePct(opt.key, v)}
                />
              ))}
              <Gauge segments={CLIENTELE_OPTIONS.map(opt => ({
                pct: clientelePct[opt.key] || 0,
                color: opt.color,
              }))} />
              {(() => {
                const total = CLIENTELE_OPTIONS.reduce((sum, opt) => sum + (clientelePct[opt.key] || 0), 0);
                return total !== 100 && total > 0 ? (
                  <p className="text-[10px] text-destructive font-sans">Total actuel : {total}% — ajustez pour atteindre 100%</p>
                ) : null;
              })()}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RealEstateActivityPanel;
