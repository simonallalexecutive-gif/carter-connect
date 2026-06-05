import { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRegistrationStore } from '@/stores/registrationStore';
import { cn } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Check } from 'lucide-react';
import SquareGauge from '@/components/shared/SquareGauge';

/* ── Palette ── */
const COL_CONSEIL = 'hsl(0, 0%, 8%)';
const COL_CONTENTIEUX = 'hsl(220, 45%, 22%)';
const COL_INDIV = 'hsl(0, 0%, 32%)';
const COL_COLL = 'hsl(30, 12%, 50%)';
const COL_EMPLOYEUR = 'hsl(210, 35%, 58%)';
const COL_SALARIE = 'hsl(35, 22%, 72%)';

const POSITIONNEMENT_CABINET = [
  { key: 'standalone', label: 'Stand alone' },
  { key: 'corporate', label: 'En support corporate / M&A' },
  { key: 'restructuring', label: 'En support restructuring' },
];

const CLIENTELE_OPTIONS = ['CAC 40', 'Grands groupes', 'Scale-ups', 'PME / ETI'];

const EXPERTISE_OPTIONS = [
  'PSE et restructurations sociales',
  'Contentieux stratégiques (harcèlement, discrimination, dirigeants)',
  'Enquêtes internes',
  'Compliance sociale',
  'ESG social',
  'Relations collectives (CSE, négociations collectives)',
  'Rémunération des dirigeants',
  'Autres',
];

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

const SocialActivityPanel = () => {
  const store = useRegistrationStore();

  /* ── Q1: Conseil / Contentieux ── */
  const conseilPct = store.socialConseil ?? 50;
  const contentieuxPct = 100 - conseilPct;

  /* ── Q2: Relations ── */
  const relationType = store.socialRelationType ?? '';
  const indivPct = store.socialIndividuel ?? 50;
  const collPct = 100 - indivPct;

  /* ── Q3: Employeur / Salarié ── */
  const employeurPct = store.socialEmployeur ?? 50;
  const salariePct = 100 - employeurPct;

  /* ── Q4: Positionnement cabinet ── */
  const posCabinet = store.socialPosCabinet || { standalone: 10, corporate: 10, restructuring: 10 };
  const posCabinetTotal = Object.values(posCabinet).reduce((s, v) => s + v, 0);

  const handlePosCabinet = (key: string, value: number) => {
    store.setField('socialPosCabinet', { ...posCabinet, [key]: value });
  };

  const toggleList = (field: 'socialClientele' | 'socialExpertises', value: string) => {
    const cur = (store[field] as string[]) || [];
    store.setField(field, cur.includes(value) ? cur.filter(v => v !== value) : [...cur, value]);
  };

  /* ── Pie chart data ── */
  const chartData = useMemo(() => {
    const segments: { name: string; value: number; color: string }[] = [];
    let indivWeight = 0.5, collWeight = 0.5;
    if (relationType === 'individuelles') { indivWeight = 1; collWeight = 0; }
    else if (relationType === 'collectives') { indivWeight = 0; collWeight = 1; }
    else if (relationType === 'les_deux') { indivWeight = indivPct / 100; collWeight = collPct / 100; }

    if (conseilPct > 0) {
      const cIndiv = Math.round(conseilPct * indivWeight);
      const cColl = conseilPct - cIndiv;
      if (cIndiv > 0) segments.push({ name: 'Conseil – Individuel', value: cIndiv, color: COL_CONSEIL });
      if (cColl > 0) segments.push({ name: 'Conseil – Collectif', value: cColl, color: 'hsl(0, 0%, 78%)' });
    }
    if (contentieuxPct > 0) {
      const xIndiv = Math.round(contentieuxPct * indivWeight);
      const xColl = contentieuxPct - xIndiv;
      if (xIndiv > 0) segments.push({ name: 'Contentieux – Individuel', value: xIndiv, color: COL_CONTENTIEUX });
      if (xColl > 0) segments.push({ name: 'Contentieux – Collectif', value: xColl, color: 'hsl(40, 28%, 90%)' });
    }
    return segments;
  }, [conseilPct, contentieuxPct, relationType, indivPct, collPct]);

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

              {/* Pie chart */}
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

              {/* Legend */}
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

              {/* Employeur / Salarié summary */}
              <div className="border-t border-border pt-3 space-y-1.5">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium mb-1">Positionnement</p>
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: COL_EMPLOYEUR }} />
                  <span className="text-[11px] font-sans text-foreground/80 flex-1">Employeur</span>
                  <span className="text-[11px] font-sans font-bold text-foreground tabular-nums">{employeurPct}%</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: COL_SALARIE }} />
                  <span className="text-[11px] font-sans text-foreground/80 flex-1">Salarié / dirigeant</span>
                  <span className="text-[11px] font-sans font-bold text-foreground tabular-nums">{salariePct}%</span>
                </div>
              </div>

              {/* Cabinet positioning summary */}
              {posCabinetTotal > 0 && (
                <div className="border-t border-border pt-3 space-y-1.5">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium mb-1">Positionnement cabinet</p>
                  {POSITIONNEMENT_CABINET.map(item => {
                    const raw = posCabinet[item.key as keyof typeof posCabinet] ?? 10;
                    const pct = posCabinetTotal > 0 ? Math.round((raw / posCabinetTotal) * 100) : 0;
                    return (
                      <div key={item.key} className="flex items-center gap-2.5">
                        <span className="text-[11px] font-sans text-foreground/80 flex-1">{item.label}</span>
                        <span className="text-[11px] font-sans font-bold text-foreground tabular-nums">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Clientèle tags */}
              {(store.socialClientele || []).length > 0 && (
                <div className="border-t border-border pt-3 space-y-1.5">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium mb-1">Clientèle</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(store.socialClientele || []).map(c => (
                      <span key={c} className="inline-flex items-center px-2.5 py-0.5 rounded-sm text-[11px] font-sans bg-secondary text-foreground/80 border border-border">{c}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Expertises tags */}
              {(store.socialExpertises || []).length > 0 && (
                <div className="border-t border-border pt-3 space-y-1.5">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium mb-1">Expertises</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(store.socialExpertises || []).map(e => (
                      <span key={e} className="inline-flex items-center px-2.5 py-0.5 rounded-sm text-[11px] font-sans bg-secondary text-foreground/80 border border-border">{e}</span>
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

        {/* ═══════ CONSEIL / CONTENTIEUX ═══════ */}
        <div className="space-y-4">
          <p className="text-sm font-sans font-medium text-foreground">Conseil vs Contentieux</p>
          <div className="space-y-2.5 pl-3 border-l-2 border-border">
            <SquareGauge value={conseilPct} onChange={v => store.setField('socialConseil', v)} label="Conseil" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-sans text-foreground">Contentieux</span>
              <span className="text-xs font-sans font-bold text-foreground tabular-nums">{contentieuxPct}%</span>
            </div>
          </div>
        </div>

        {/* ═══════ NATURE DES RELATIONS ═══════ */}
        <div className="border-t border-border pt-5 space-y-2.5">
          <p className="text-sm font-sans font-medium text-foreground">Nature des relations</p>
          <div className="flex flex-wrap gap-2">
            {([
              { key: 'individuelles', label: 'Relations individuelles' },
              { key: 'collectives', label: 'Relations collectives' },
              { key: 'les_deux', label: 'Les deux' },
            ] as const).map(opt => (
              <ChipButton key={opt.key} active={relationType === opt.key} onClick={() => store.setField('socialRelationType', relationType === opt.key ? '' : opt.key)}>
                {opt.label}
              </ChipButton>
            ))}
          </div>

          <AnimatePresence>
            {relationType === 'les_deux' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="pl-3 border-l-2 border-border mt-2 space-y-2">
                  <SquareGauge value={indivPct} onChange={v => store.setField('socialIndividuel', v)} label="Individuelles" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-sans text-foreground">Collectives</span>
                    <span className="text-xs font-sans font-bold text-foreground tabular-nums">{collPct}%</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ═══════ EMPLOYEUR / SALARIÉ ═══════ */}
        <div className="border-t border-border pt-5 space-y-2.5">
          <p className="text-sm font-sans font-medium text-foreground">Positionnement</p>
          <div className="pl-3 border-l-2 border-border space-y-2">
            <SquareGauge value={employeurPct} onChange={v => store.setField('socialEmployeur', v)} label="Côté employeur" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-sans text-foreground">Côté salarié / dirigeant</span>
              <span className="text-xs font-sans font-bold text-foreground tabular-nums">{salariePct}%</span>
            </div>
          </div>
        </div>

        {/* ═══════ POSITIONNEMENT CABINET ═══════ */}
        <div className="border-t border-border pt-5 space-y-2.5">
          <p className="text-sm font-sans font-medium text-foreground">Positionnement au sein du cabinet</p>
          <div className="pl-3 border-l-2 border-border space-y-2.5">
            {POSITIONNEMENT_CABINET.map(item => {
              const raw = posCabinet[item.key as keyof typeof posCabinet] ?? 10;
              const pct = posCabinetTotal > 0 ? Math.round((raw / posCabinetTotal) * 100) : 0;
              return (
                <SquareGauge
                  key={item.key}
                  value={raw}
                  onChange={v => handlePosCabinet(item.key, v)}
                  label={`${item.label} (${pct}%)`}
                />
              );
            })}
          </div>
        </div>

        {/* ═══════ CLIENTÈLE ═══════ */}
        <div className="border-t border-border pt-5 space-y-3">
          <p className="text-sm font-sans font-medium text-foreground">Typologie de clientèle</p>
          <div className="flex flex-wrap gap-2">
            {CLIENTELE_OPTIONS.map(opt => (
              <ChipButton key={opt} active={(store.socialClientele || []).includes(opt)} onClick={() => toggleList('socialClientele', opt)}>
                {opt}
              </ChipButton>
            ))}
          </div>
        </div>

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

        {/* ═══════ EXPERTISES ═══════ */}
        <div className="border-t border-border pt-5 space-y-3">
          <p className="text-sm font-sans font-medium text-foreground">Domaines d'expertise</p>
          <div className="flex flex-wrap gap-2">
            {EXPERTISE_OPTIONS.map(opt => (
              <ChipButton key={opt} active={(store.socialExpertises || []).includes(opt)} onClick={() => toggleList('socialExpertises', opt)}>
                {opt}
              </ChipButton>
            ))}
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
                  const current = store.tailleOperations || [];
                  store.setField('tailleOperations', active ? current.filter(v => v !== t) : [...current, t]);
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

export default SocialActivityPanel;
