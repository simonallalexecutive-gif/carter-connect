import { motion } from 'motion/react';
import { useRegistrationStore } from '@/stores/registrationStore';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useMemo } from 'react';
import { Check, Building2, Globe, Briefcase, Users, Tag } from 'lucide-react';

/* ── Palette ── */
const COL_CONSEIL = 'hsl(215, 55%, 28%)';
const COL_CONTENTIEUX = 'hsl(35, 30%, 50%)';
const COL_INDIV = 'hsl(200, 50%, 45%)';
const COL_COLL = 'hsl(215, 45%, 38%)';
const COL_EMPLOYEUR = 'hsl(160, 35%, 40%)';
const COL_SALARIE = 'hsl(45, 50%, 50%)';

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

const renderLabel = ({ cx, cy, midAngle, innerRadius: ir, outerRadius: or, value }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = ir + (or - ir) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  if (value < 8) return null;
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={600} fontFamily="Inter, sans-serif">
      {Math.round(value)}%
    </text>
  );
};

const tooltipStyle = {
  fontSize: '11px', fontFamily: 'Inter',
  background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))',
  borderRadius: '4px', color: 'hsl(var(--foreground))',
};

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

  /* ── Toggle helpers ── */
  const toggleList = (field: 'socialClientele' | 'socialExpertises', value: string) => {
    const cur = (store[field] as string[]) || [];
    store.setField(field, cur.includes(value) ? cur.filter(v => v !== value) : [...cur, value]);
  };

  /* ── Pie chart data (6-segment synthesis) ── */
  const chartData = useMemo(() => {
    const segments: { name: string; value: number; color: string }[] = [];

    // Split by Conseil/Contentieux, then by Relations, then by Employeur/Salarié
    // We create a layered pie: outer ring = Conseil vs Contentieux proportions
    // Each half subdivided by relation type weight

    const conseilWeight = conseilPct / 100;
    const contentieuxWeight = contentieuxPct / 100;

    // Relation weighting
    let indivWeight = 0.5, collWeight = 0.5;
    if (relationType === 'individuelles') { indivWeight = 1; collWeight = 0; }
    else if (relationType === 'collectives') { indivWeight = 0; collWeight = 1; }
    else if (relationType === 'les_deux') { indivWeight = indivPct / 100; collWeight = collPct / 100; }

    // Conseil segments
    if (conseilPct > 0) {
      const cIndiv = Math.round(conseilPct * indivWeight);
      const cColl = conseilPct - cIndiv;
      if (cIndiv > 0) segments.push({ name: 'Conseil – Individuel', value: cIndiv, color: COL_CONSEIL });
      if (cColl > 0) segments.push({ name: 'Conseil – Collectif', value: cColl, color: 'hsl(215, 40%, 42%)' });
    }

    // Contentieux segments
    if (contentieuxPct > 0) {
      const xIndiv = Math.round(contentieuxPct * indivWeight);
      const xColl = contentieuxPct - xIndiv;
      if (xIndiv > 0) segments.push({ name: 'Contentieux – Individuel', value: xIndiv, color: COL_CONTENTIEUX });
      if (xColl > 0) segments.push({ name: 'Contentieux – Collectif', value: xColl, color: 'hsl(40, 25%, 60%)' });
    }

    return segments;
  }, [conseilPct, contentieuxPct, relationType, indivPct, collPct]);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="carter-card p-6 space-y-6">

        {/* ══════ TWO-COLUMN LAYOUT ══════ */}
        <div className="flex gap-8 items-start flex-col lg:flex-row">

          {/* ── LEFT: Pie chart + Q1/Q2/Q3 ── */}
          <div className="lg:w-[45%] space-y-5">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Structure de l'activité</p>

            {/* Pie chart */}
            <div className="mx-auto" style={{ width: 240 }}>
              <ResponsiveContainer width={240} height={240}>
                <PieChart>
                  <Pie data={chartData} cx="50%" cy="50%" innerRadius={44} outerRadius={90} dataKey="value" paddingAngle={1.5} stroke="hsl(var(--background))" strokeWidth={2} label={renderLabel} labelLine={false}>
                    {chartData.map((seg, i) => <Cell key={i} fill={seg.color} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => [`${v}%`, '']} contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="space-y-1.5 px-2">
              {chartData.map(seg => (
                <div key={seg.name} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: seg.color }} />
                  <span className="text-[11px] font-sans text-foreground/80 truncate">{seg.name}</span>
                  <span className="text-[11px] font-sans font-semibold text-foreground ml-auto">{seg.value}%</span>
                </div>
              ))}
            </div>

            {/* Q1: Conseil / Contentieux */}
            <div className="space-y-3 pt-3 border-t border-border">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Q1 – Conseil vs Contentieux</p>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: COL_CONSEIL }} />
                    <span className="text-xs font-sans text-foreground">Conseil</span>
                  </div>
                  <span className="text-xs font-sans font-bold text-foreground">{conseilPct}%</span>
                </div>
                <Slider value={[conseilPct]} onValueChange={([v]) => store.setField('socialConseil', v)} min={0} max={100} step={10} className="w-full" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: COL_CONTENTIEUX }} />
                    <span className="text-xs font-sans text-foreground">Contentieux</span>
                  </div>
                  <span className="text-xs font-sans font-bold text-foreground">{contentieuxPct}%</span>
                </div>
              </div>
              {/* Gauge */}
              <div className="h-2.5 rounded-full overflow-hidden flex border border-border">
                <div className="h-full transition-all duration-300" style={{ width: `${conseilPct}%`, backgroundColor: COL_CONSEIL }} />
                <div className="h-full transition-all duration-300" style={{ width: `${contentieuxPct}%`, backgroundColor: COL_CONTENTIEUX }} />
              </div>
            </div>

            {/* Q2: Relations */}
            <div className="space-y-3 pt-3 border-t border-border">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Q2 – Nature des relations</p>
              <div className="flex flex-wrap gap-2">
                {([
                  { key: 'individuelles', label: 'Relations individuelles' },
                  { key: 'collectives', label: 'Relations collectives' },
                  { key: 'les_deux', label: 'Les deux' },
                ] as const).map(opt => {
                  const active = relationType === opt.key;
                  return (
                    <button key={opt.key} type="button" onClick={() => store.setField('socialRelationType', active ? '' : opt.key)}
                      className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-sans font-light transition-all duration-200 border",
                        active ? "bg-foreground text-background border-foreground" : "bg-transparent text-foreground border-border hover:border-foreground/40"
                      )}>
                      {active && <Check className="w-3 h-3" />}
                      {opt.label}
                    </button>
                  );
                })}
              </div>
              {relationType === 'les_deux' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: COL_INDIV }} />
                      <span className="text-xs font-sans text-foreground">Individuelles</span>
                    </div>
                    <span className="text-xs font-sans font-bold text-foreground">{indivPct}%</span>
                  </div>
                  <Slider value={[indivPct]} onValueChange={([v]) => store.setField('socialIndividuel', v)} min={0} max={100} step={10} className="w-full" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: COL_COLL }} />
                      <span className="text-xs font-sans text-foreground">Collectives</span>
                    </div>
                    <span className="text-xs font-sans font-bold text-foreground">{collPct}%</span>
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden flex border border-border">
                    <div className="h-full transition-all duration-300" style={{ width: `${indivPct}%`, backgroundColor: COL_INDIV }} />
                    <div className="h-full transition-all duration-300" style={{ width: `${collPct}%`, backgroundColor: COL_COLL }} />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Q3: Employeur / Salarié */}
            <div className="space-y-3 pt-3 border-t border-border">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Q3 – Positionnement</p>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: COL_EMPLOYEUR }} />
                    <span className="text-xs font-sans text-foreground">Côté employeur</span>
                  </div>
                  <span className="text-xs font-sans font-bold text-foreground">{employeurPct}%</span>
                </div>
                <Slider value={[employeurPct]} onValueChange={([v]) => store.setField('socialEmployeur', v)} min={0} max={100} step={10} className="w-full" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: COL_SALARIE }} />
                    <span className="text-xs font-sans text-foreground">Côté salarié / dirigeant</span>
                  </div>
                  <span className="text-xs font-sans font-bold text-foreground">{salariePct}%</span>
                </div>
              </div>
              <div className="h-2.5 rounded-full overflow-hidden flex border border-border">
                <div className="h-full transition-all duration-300" style={{ width: `${employeurPct}%`, backgroundColor: COL_EMPLOYEUR }} />
                <div className="h-full transition-all duration-300" style={{ width: `${salariePct}%`, backgroundColor: COL_SALARIE }} />
              </div>
            </div>
          </div>

          {/* ── RIGHT: Complementary indicators ── */}
          <div className="lg:w-[55%] space-y-5">

            {/* Q4: Positionnement cabinet */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Positionnement au sein du cabinet</p>
              </div>
              <div className="space-y-2">
                {POSITIONNEMENT_CABINET.map(item => {
                  const raw = posCabinet[item.key as keyof typeof posCabinet] ?? 10;
                  const pct = posCabinetTotal > 0 ? Math.round((raw / posCabinetTotal) * 100) : 0;
                  return (
                    <div key={item.key} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-sans text-foreground">{item.label}</span>
                        <span className="text-xs font-sans font-bold text-foreground">{pct}%</span>
                      </div>
                      <Slider value={[raw]} onValueChange={([v]) => handlePosCabinet(item.key, v)} min={0} max={100} step={10} className="w-full" />
                    </div>
                  );
                })}
              </div>
              {/* Bar gauge */}
              <div className="h-3 rounded-full overflow-hidden flex border border-border">
                {POSITIONNEMENT_CABINET.map((item, i) => {
                  const raw = posCabinet[item.key as keyof typeof posCabinet] ?? 10;
                  const pct = posCabinetTotal > 0 ? (raw / posCabinetTotal) * 100 : 33;
                  const colors = ['hsl(215, 55%, 28%)', 'hsl(200, 40%, 45%)', 'hsl(35, 30%, 50%)'];
                  return <div key={item.key} className="h-full transition-all duration-300" style={{ width: `${pct}%`, backgroundColor: colors[i] }} />;
                })}
              </div>
            </div>

            {/* Q5: Typologie clientèle */}
            <div className="space-y-3 pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Typologie de clientèle</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {CLIENTELE_OPTIONS.map(opt => {
                  const active = (store.socialClientele || []).includes(opt);
                  return (
                    <button key={opt} type="button" onClick={() => toggleList('socialClientele', opt)}
                      className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-sans font-light transition-all duration-200 border",
                        active ? "bg-foreground text-background border-foreground" : "bg-transparent text-foreground border-border hover:border-foreground/40"
                      )}>
                      {active && <Check className="w-3 h-3" />}
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Origine clientèle */}
            <div className="space-y-3 pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Origine de la clientèle</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-sans text-foreground">Française</span>
                  <span className="text-xs font-sans font-bold text-foreground">{store.clienteleFrancaise}%</span>
                </div>
                <Slider value={[store.clienteleFrancaise]} onValueChange={([v]) => store.setField('clienteleFrancaise', v)} min={0} max={100} step={10} className="w-full" />
                <div className="h-3 rounded-full overflow-hidden flex border border-border">
                  <div className="bg-foreground/70 h-full transition-all duration-300" style={{ width: `${store.clienteleFrancaise}%` }} />
                  <div className="bg-foreground/15 h-full transition-all duration-300" style={{ width: `${100 - store.clienteleFrancaise}%` }} />
                </div>
                <div className="flex justify-between">
                  <span className="text-[10px] font-sans text-muted-foreground">🇫🇷 Française {store.clienteleFrancaise}%</span>
                  <span className="text-[10px] font-sans text-muted-foreground">🌍 Étrangère {100 - store.clienteleFrancaise}%</span>
                </div>
              </div>
            </div>

            {/* Q6: Expertises */}
            <div className="space-y-3 pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-muted-foreground" />
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Domaines d'expertise</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {EXPERTISE_OPTIONS.map(opt => {
                  const active = (store.socialExpertises || []).includes(opt);
                  return (
                    <button key={opt} type="button" onClick={() => toggleList('socialExpertises', opt)}
                      className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-sans font-light transition-all duration-200 border",
                        active ? "bg-foreground text-background border-foreground" : "bg-transparent text-foreground border-border hover:border-foreground/40"
                      )}>
                      {active && <Check className="w-3 h-3" />}
                      {opt}
                    </button>
                  );
                })}
              </div>
              {(store.socialExpertises || []).length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap gap-1.5">
                  {(store.socialExpertises || []).map(opt => (
                    <span key={opt} className="px-2.5 py-1 rounded-sm bg-muted text-[10px] font-sans font-medium text-foreground">
                      {opt}
                    </span>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Taille des opérations */}
            <div className="space-y-3 pt-4 border-t border-border">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Taille des opérations</p>
              <div className="flex flex-wrap gap-2">
                {['Small cap', 'Mid cap', 'Large cap'].map(t => {
                  const active = (store.tailleOperations || []).includes(t);
                  return (
                    <button key={t} type="button"
                      onClick={() => {
                        const current = store.tailleOperations || [];
                        store.setField('tailleOperations', active ? current.filter(v => v !== t) : [...current, t]);
                      }}
                      className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-sans font-light transition-all duration-200 border",
                        active ? "bg-foreground text-background border-foreground" : "bg-transparent text-foreground border-border hover:border-foreground/40"
                      )}>
                      {active && <Check className="w-3 h-3" />}
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SocialActivityPanel;
