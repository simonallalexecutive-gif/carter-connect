import { motion, AnimatePresence } from 'motion/react';
import { useRegistrationStore } from '@/stores/registrationStore';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import ActivityPieChart from '@/components/shared/ActivityPieChart';
import SegmentedBar from '@/components/shared/SegmentedBar';

/* ── Palette ── */
const CONSEIL_COLORS = [
  'hsl(215, 55%, 28%)',   // Baux
  'hsl(200, 50%, 40%)',   // Transactionnel
  'hsl(45, 40%, 42%)',    // Construction
  'hsl(160, 35%, 38%)',   // Financement
];

const CONTENTIEUX_COLORS = [
  'hsl(0, 0%, 30%)',      // Baux
  'hsl(0, 0%, 50%)',      // Construction
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

const SIDE_OPTIONS = ['Côté bailleur', 'Côté preneur / utilisateur', 'Les deux'] as const;
const TRANSAC_OPTIONS = ['Share deal', 'Asset deal', 'Les deux'] as const;
const FIN_SIDE_OPTIONS = ['Côté prêteur', 'Côté emprunteur', 'Les deux'] as const;

/* ── Shared UI ── */
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium mb-3">{children}</p>
);

const SubLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-sans font-medium mt-4 mb-2">{children}</p>
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

/* ── Helpers ── */
const clampThreeWay = (
  store: ReturnType<typeof useRegistrationStore>,
  key: 'reConseilBaux' | 'reConseilTransac' | 'reConseilConstruction',
  val: number,
) => {
  const keys: ('reConseilBaux' | 'reConseilTransac' | 'reConseilConstruction')[] = ['reConseilBaux', 'reConseilTransac', 'reConseilConstruction'];
  const others = keys.filter(k => k !== key);
  const remaining = 100 - val;
  if (remaining < 0) return;

  const otherSum = others.reduce((s, k) => s + (store[k] as number), 0);
  store.setField(key, val);

  if (otherSum === 0) {
    // distribute equally
    store.setField(others[0], Math.round(remaining / 2));
    store.setField(others[1], remaining - Math.round(remaining / 2));
  } else {
    // proportional
    for (const k of others) {
      const ratio = (store[k] as number) / otherSum;
      store.setField(k, Math.round(remaining * ratio));
    }
    // Fix rounding
    const newSum = others.reduce((s, k) => s + (store[k] as number), 0);
    if (newSum !== remaining) {
      store.setField(others[0], (store[others[0]] as number) + (remaining - newSum));
    }
  }
};

/* ══════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════ */
const RealEstateActivityPanel = () => {
  const store = useRegistrationStore();

  /* Global split */
  const conseilPct = store.reConseil ?? 50;
  const contentieuxPct = 100 - conseilPct;

  /* Conseil breakdown */
  const cBaux = store.reConseilBaux ?? 25;
  const cTransac = store.reConseilTransac ?? 25;
  const cConstruction = store.reConseilConstruction ?? 25;
  const cFinancement = Math.max(0, 100 - cBaux - cTransac - cConstruction);

  /* Contentieux breakdown */
  const lBaux = store.reContentieuxBaux ?? 50;
  const lConstruction = 100 - lBaux;

  /* Asset types */
  const toggleAsset = (val: string) => {
    const cur = store.reAssetTypes || [];
    store.setField('reAssetTypes', cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val]);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="carter-card p-6 space-y-8">

        {/* ─────── I. RÉPARTITION GLOBALE ─────── */}
        <div className="space-y-3">
          <SectionTitle>Répartition globale conseil / contentieux</SectionTitle>
          <SegmentedBar value={conseilPct} onChange={v => store.setField('reConseil', v)} />
          <div className="flex justify-between text-xs font-sans">
            <span className="text-foreground">Conseil <strong>{conseilPct}%</strong></span>
            <span className="text-foreground">Contentieux <strong>{contentieuxPct}%</strong></span>
          </div>
        </div>

        {/* ─────── TWO-COLUMN PIE CHARTS ─────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* ── CONSEIL ── */}
          <AnimatePresence>
            {conseilPct > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-5 p-5 rounded-lg border border-border bg-muted/30"
              >
                <h3 className="text-sm font-sans font-semibold text-foreground tracking-wide">
                  Conseil — Répartition
                </h3>

                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  {/* Pie */}
                  <div className="flex-shrink-0">
                    <ActivityPieChart
                      data={{
                        'Baux / AM': cBaux,
                        'Transactionnel': cTransac,
                        'Construction': cConstruction,
                        'Financement': cFinancement,
                      }}
                      size={160}
                      innerRadius={40}
                      outerRadius={72}
                      showLegend={false}
                      customColors={CONSEIL_COLORS}
                    />
                  </div>

                  {/* Sliders */}
                  <div className="flex-1 space-y-3 w-full">
                    <SliderRow
                      label="Baux commerciaux / Asset Management"
                      value={cBaux}
                      color={CONSEIL_COLORS[0]}
                      onChange={v => clampThreeWay(store, 'reConseilBaux', v)}
                    />
                    <SliderRow
                      label="Immobilier transactionnel"
                      value={cTransac}
                      color={CONSEIL_COLORS[1]}
                      onChange={v => clampThreeWay(store, 'reConseilTransac', v)}
                    />
                    <SliderRow
                      label="Construction (contrats & développement)"
                      value={cConstruction}
                      color={CONSEIL_COLORS[2]}
                      onChange={v => clampThreeWay(store, 'reConseilConstruction', v)}
                    />
                    <SliderRow
                      label="Financement immobilier"
                      value={cFinancement}
                      color={CONSEIL_COLORS[3]}
                      disabled
                      onChange={() => {}}
                    />
                  </div>
                </div>

                {/* Sub-positioning Conseil */}
                <div className="space-y-4 pt-4 border-t border-border">
                  {/* Baux side */}
                  {cBaux > 0 && (
                    <div>
                      <SubLabel>Baux — Positionnement</SubLabel>
                      <div className="flex flex-wrap gap-2">
                        {SIDE_OPTIONS.map(opt => (
                          <ChipButton
                            key={opt}
                            label={opt}
                            active={store.reBauxSideConseil === opt}
                            onClick={() => store.setField('reBauxSideConseil', store.reBauxSideConseil === opt ? '' : opt)}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Transactionnel structure */}
                  {cTransac > 0 && (
                    <div>
                      <SubLabel>Transactionnel — Structure des opérations</SubLabel>
                      <div className="flex flex-wrap gap-2">
                        {TRANSAC_OPTIONS.map(opt => (
                          <ChipButton
                            key={opt}
                            label={opt}
                            active={store.reTransacStructure === opt}
                            onClick={() => store.setField('reTransacStructure', store.reTransacStructure === opt ? '' : opt)}
                          />
                        ))}
                      </div>
                      <SubLabel>Support corporate associé ?</SubLabel>
                      <div className="flex gap-2">
                        <ChipButton
                          label="Oui"
                          active={store.reTransacCorporate === true}
                          onClick={() => store.setField('reTransacCorporate', store.reTransacCorporate === true ? null : true)}
                        />
                        <ChipButton
                          label="Non"
                          active={store.reTransacCorporate === false}
                          onClick={() => store.setField('reTransacCorporate', store.reTransacCorporate === false ? null : false)}
                        />
                      </div>
                    </div>
                  )}

                  {/* Financement side */}
                  {cFinancement > 0 && (
                    <div>
                      <SubLabel>Financement — Positionnement</SubLabel>
                      <div className="flex flex-wrap gap-2">
                        {FIN_SIDE_OPTIONS.map(opt => (
                          <ChipButton
                            key={opt}
                            label={opt}
                            active={store.reFinSide === opt}
                            onClick={() => store.setField('reFinSide', store.reFinSide === opt ? '' : opt)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── CONTENTIEUX ── */}
          <AnimatePresence>
            {contentieuxPct > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-5 p-5 rounded-lg border border-border bg-muted/30"
              >
                <h3 className="text-sm font-sans font-semibold text-foreground tracking-wide">
                  Contentieux — Répartition
                </h3>

                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  {/* Pie */}
                  <div className="flex-shrink-0">
                    <ActivityPieChart
                      data={{
                        'Baux / AM': lBaux,
                        'Construction': lConstruction,
                      }}
                      size={160}
                      innerRadius={40}
                      outerRadius={72}
                      showLegend={false}
                      customColors={CONTENTIEUX_COLORS}
                    />
                  </div>

                  {/* Sliders */}
                  <div className="flex-1 space-y-3 w-full">
                    <SliderRow
                      label="Baux commerciaux / Asset Management"
                      value={lBaux}
                      color={CONTENTIEUX_COLORS[0]}
                      onChange={v => store.setField('reContentieuxBaux', v)}
                    />
                    <SliderRow
                      label="Construction (contrats & développement)"
                      value={lConstruction}
                      color={CONTENTIEUX_COLORS[1]}
                      disabled
                      onChange={() => {}}
                    />
                  </div>
                </div>

                {/* Sub-positioning Contentieux */}
                {lBaux > 0 && (
                  <div className="pt-4 border-t border-border">
                    <SubLabel>Baux — Positionnement</SubLabel>
                    <div className="flex flex-wrap gap-2">
                      {SIDE_OPTIONS.map(opt => (
                        <ChipButton
                          key={opt}
                          label={opt}
                          active={store.reBauxSideContentieux === opt}
                          onClick={() => store.setField('reBauxSideContentieux', store.reBauxSideContentieux === opt ? '' : opt)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ─────── II. TYPOLOGIE D'ACTIFS ─────── */}
        <div className="space-y-3 pt-4 border-t border-border">
          <SectionTitle>Typologie d'actifs</SectionTitle>
          <div className="flex flex-wrap gap-2">
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

      </motion.div>
    </div>
  );
};

export default RealEstateActivityPanel;
