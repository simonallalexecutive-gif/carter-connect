import { motion } from 'motion/react';
import { useRegistrationStore } from '@/stores/registrationStore';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useMemo } from 'react';
import { Check, Building2, Briefcase, ShieldQuestion, ArrowRightLeft, Globe, TrendingUp } from 'lucide-react';

/* ── Palette sobres (bleu marine, taupe, ardoise) ── */
const COL_RESTR     = 'hsl(215, 55%, 28%)';
const COL_CONT_AFF  = 'hsl(35, 28%, 48%)';
const COL_REPRISES  = 'hsl(200, 30%, 42%)';
const COL_AUTRES    = 'hsl(0, 0%, 62%)';
const COL_AMIABLE   = 'hsl(200, 45%, 45%)';
const COL_JUDICIAIRE = 'hsl(215, 50%, 32%)';
const COL_PC_PURES  = 'hsl(220, 45%, 38%)';
const COL_CONT_LIES = 'hsl(210, 35%, 52%)';

const MAIN_CATEGORIES = [
  { key: 'restr_restructuring', label: 'Restructuring', color: COL_RESTR },
  { key: 'restr_contentieux', label: 'Contentieux des affaires (hors PC)', color: COL_CONT_AFF },
  { key: 'restr_reprises', label: 'Reprises / M&A distressed', color: COL_REPRISES },
  { key: 'restr_autres', label: 'Autres', color: COL_AUTRES },
];

const CLIENTELE_OPTIONS = [
  'PME', 'ETI', 'Grands groupes',
  'Banques / fonds / créanciers financiers',
  'Administrateurs judiciaires (AJ)',
  'Mandataires judiciaires (MJ)',
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

const RestructuringActivityPanel = () => {
  const store = useRegistrationStore();

  /* ── Handlers ── */
  const handleToggle = (key: string) => {
    const next = { ...store.activites, [key]: !store.activites[key] };
    store.setField('activites', next);
    if (!store.activites[key]) {
      store.setField('pourcentages', { ...store.pourcentages, [key]: 10 });
    }
  };

  const handlePercentChange = (key: string, value: number) => {
    store.setField('pourcentages', { ...store.pourcentages, [key]: value });
  };

  const handleSubChange = (parent: string, child: string, value: number) => {
    const cur = store.sousActivites[parent] || {};
    store.setField('sousActivites', { ...store.sousActivites, [parent]: { ...cur, [child]: value } });
  };

  const toggleList = (field: 'positionnementRestr' | 'clienteleRestr', value: string) => {
    const cur = store[field];
    store.setField(field, cur.includes(value) ? cur.filter(v => v !== value) : [...cur, value]);
  };

  const handleClientelePct = (key: string, value: number) => {
    store.setField('restrClientelePcts', { ...store.restrClientelePcts, [key]: value });
  };

  /* ── Derived values ── */
  const selected = MAIN_CATEGORIES.filter(c => store.activites[c.key]);
  const hasAny = selected.length > 0;
  const totalRaw = useMemo(() => selected.reduce((s, c) => s + (store.pourcentages[c.key] || 10), 0), [selected, store.pourcentages]);

  const hasRestr = store.activites['restr_restructuring'];
  const hasReprises = store.activites['restr_reprises'];

  // Q2 sub-values
  const restrSubs = store.sousActivites['restr_restructuring'] || {};
  const amiableVal = restrSubs['amiable'] ?? 50;
  const judiciaireVal = restrSubs['judiciaire'] ?? 50;
  const restrSubTotal = amiableVal + judiciaireVal;

  // Q3 sub-values
  const judSubs = store.sousActivites['restr_judiciaire'] || {};
  const pcPuresVal = judSubs['pc_pures'] ?? 50;
  const contLiesVal = judSubs['cont_lies'] ?? 50;
  const judSubTotal = pcPuresVal + contLiesVal;
  const hasJudiciaire = hasRestr && judiciaireVal > 0;

  // Q4 debiteur/creancier
  const debiteurCreancier = store.restrDebiteurCreancier;
  const debiteurPct = store.restrDebiteurPct;

  // Q5 clientele
  const clienteleSelected = store.clienteleRestr;
  const clientelePcts = store.restrClientelePcts;
  const clientelePctTotal = useMemo(() =>
    clienteleSelected.reduce((s, k) => s + (clientelePcts[k] || 0), 0),
    [clienteleSelected, clientelePcts]
  );
  const showClientelePcts = clienteleSelected.length > 1;

  /* ── PIE CHART DATA ── */
  const mainChartData = useMemo(() => {
    if (!hasAny) return [];
    const segments: { name: string; value: number; color: string }[] = [];

    selected.forEach(c => {
      const pct = totalRaw > 0 ? Math.round(((store.pourcentages[c.key] || 10) / totalRaw) * 100) : 0;
      if (pct <= 0) return;

      if (c.key === 'restr_restructuring') {
        // Split into amiable / judiciaire, then judiciaire into PC pures / contentieux liés
        const amiablePct = restrSubTotal > 0 ? Math.round(pct * (amiableVal / restrSubTotal)) : Math.round(pct / 2);
        const judiciairePctTotal = pct - amiablePct;

        if (amiablePct > 0) segments.push({ name: 'Amiable', value: amiablePct, color: COL_AMIABLE });

        if (judiciairePctTotal > 0 && hasJudiciaire) {
          const pcPct = judSubTotal > 0 ? Math.round(judiciairePctTotal * (pcPuresVal / judSubTotal)) : Math.round(judiciairePctTotal / 2);
          const clPct = judiciairePctTotal - pcPct;
          if (pcPct > 0) segments.push({ name: 'Judiciaire – PC pures', value: pcPct, color: COL_PC_PURES });
          if (clPct > 0) segments.push({ name: 'Judiciaire – Cont. liés', value: clPct, color: COL_CONT_LIES });
        } else if (judiciairePctTotal > 0) {
          segments.push({ name: 'Judiciaire', value: judiciairePctTotal, color: COL_JUDICIAIRE });
        }
      } else {
        segments.push({ name: c.label, value: pct, color: c.color });
      }
    });

    return segments;
  }, [selected, store.pourcentages, totalRaw, restrSubTotal, amiableVal, judiciaireVal, judSubTotal, pcPuresVal, contLiesVal, hasJudiciaire, hasAny]);

  return (
    <div className="space-y-6">
      {/* ── Q1: Toggle chips ── */}
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium mb-3">
          Q1 – Comment se répartit votre activité globale ?
        </p>
        <div className="flex flex-wrap gap-2">
          {MAIN_CATEGORIES.map(c => {
            const active = store.activites[c.key];
            return (
              <button key={c.key} type="button" onClick={() => handleToggle(c.key)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-4 py-2 rounded-sm text-sm font-sans font-light transition-all duration-200 border",
                  active ? "bg-foreground text-background border-foreground" : "bg-transparent text-foreground border-border hover:border-foreground/40"
                )}>
                {active && <Check className="w-3 h-3" />}
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {hasAny && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="carter-card p-6 space-y-6">
          <div className="flex gap-8 items-start flex-col lg:flex-row">

            {/* ── LEFT: Pie + sliders + Q2/Q3 ── */}
            <div className="lg:w-[45%] space-y-5">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Répartition de l'activité</p>

              {/* Pie Chart */}
              <div className="flex-shrink-0 mx-auto" style={{ width: 240 }}>
                <ResponsiveContainer width={240} height={240}>
                  <PieChart>
                    <Pie data={mainChartData} cx="50%" cy="50%" innerRadius={44} outerRadius={90} dataKey="value" paddingAngle={1.5} stroke="hsl(var(--background))" strokeWidth={2} label={renderLabel} labelLine={false}>
                      {mainChartData.map((seg, i) => <Cell key={i} fill={seg.color} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => [`${v}%`, '']} contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="space-y-1.5 px-2">
                {mainChartData.map(seg => (
                  <div key={seg.name} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: seg.color }} />
                    <span className="text-[11px] font-sans text-foreground/80 truncate">{seg.name}</span>
                    <span className="text-[11px] font-sans font-semibold text-foreground ml-auto">{seg.value}%</span>
                  </div>
                ))}
              </div>

              {/* Main sliders */}
              <div className="space-y-3 pt-2 border-t border-border">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Poids des catégories</p>
                {selected.map(c => {
                  const raw = store.pourcentages[c.key] || 10;
                  const pct = totalRaw > 0 ? Math.round((raw / totalRaw) * 100) : 0;
                  return (
                    <div key={c.key} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-sans text-foreground">{c.label}</span>
                        <span className="text-xs font-sans font-bold text-foreground">{pct}%</span>
                      </div>
                      <Slider value={[raw]} onValueChange={([v]) => handlePercentChange(c.key, v)} min={10} max={100} step={10} className="w-full" />
                    </div>
                  );
                })}
              </div>

              {/* ── Q2: Zoom restructuring ── */}
              {hasRestr && (
                <div className="space-y-3 pt-3 border-t border-border">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Q2 – Zoom restructuring</p>
                  <p className="text-[9px] text-muted-foreground font-sans italic">Répartition amiable vs judiciaire</p>
                  {[
                    { key: 'amiable', label: 'Amiable', sub: '(mandat ad hoc, conciliation)', val: amiableVal, color: COL_AMIABLE },
                    { key: 'judiciaire', label: 'Judiciaire', sub: '(sauvegarde, RJ, LJ + contentieux liés)', val: judiciaireVal, color: COL_JUDICIAIRE },
                  ].map(sub => (
                    <div key={sub.key} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: sub.color }} />
                          <span className="text-xs font-sans text-foreground">{sub.label}</span>
                        </div>
                        <span className="text-xs font-sans font-bold text-foreground">{restrSubTotal > 0 ? Math.round((sub.val / restrSubTotal) * 100) : 0}%</span>
                      </div>
                      <p className="text-[9px] text-muted-foreground font-sans ml-4">{sub.sub}</p>
                      <Slider value={[sub.val]} onValueChange={([v]) => handleSubChange('restr_restructuring', sub.key, v)} min={0} max={100} step={10} className="w-full" />
                    </div>
                  ))}
                </div>
              )}

              {/* ── Q3: Détail judiciaire ── */}
              {hasJudiciaire && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-3 pt-3 border-t border-border">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Q3 – Détail judiciaire</p>
                  <p className="text-[9px] text-muted-foreground font-sans italic">Nature de l'activité judiciaire</p>
                  {[
                    { key: 'pc_pures', label: 'Procédures collectives "pures"', sub: '(accompagnement des procédures)', val: pcPuresVal, color: COL_PC_PURES },
                    { key: 'cont_lies', label: 'Contentieux liés aux PC', sub: '(contentieux liés aux procédures collectives)', val: contLiesVal, color: COL_CONT_LIES },
                  ].map(sub => (
                    <div key={sub.key} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: sub.color }} />
                          <span className="text-xs font-sans text-foreground">{sub.label}</span>
                        </div>
                        <span className="text-xs font-sans font-bold text-foreground">{judSubTotal > 0 ? Math.round((sub.val / judSubTotal) * 100) : 0}%</span>
                      </div>
                      <p className="text-[9px] text-muted-foreground font-sans ml-4">{sub.sub}</p>
                      <Slider value={[sub.val]} onValueChange={([v]) => handleSubChange('restr_judiciaire', sub.key, v)} min={0} max={100} step={10} className="w-full" />
                    </div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* ── RIGHT: Q4, Q5, Q6 ── */}
            <div className="lg:w-[55%] space-y-5">

              {/* ── Q4: Positionnement client ── */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Q4 – Positionnement client</p>
                </div>
                <p className="text-[10px] text-muted-foreground font-sans">Vous intervenez principalement pour :</p>
                <div className="flex flex-wrap gap-2">
                  {(['debiteurs', 'creanciers', 'mixte'] as const).map(opt => {
                    const labels: Record<string, string> = { debiteurs: 'Débiteurs', creanciers: 'Créanciers', mixte: 'Mixte' };
                    const active = debiteurCreancier === opt;
                    return (
                      <button key={opt} type="button" onClick={() => store.setField('restrDebiteurCreancier', active ? '' : opt)}
                        className={cn(
                          "inline-flex items-center gap-1.5 px-4 py-2 rounded-sm text-sm font-sans font-light transition-all duration-200 border",
                          active ? "bg-foreground text-background border-foreground" : "bg-transparent text-foreground border-border hover:border-foreground/40"
                        )}>
                        {active && <Check className="w-3 h-3" />}
                        {labels[opt]}
                      </button>
                    );
                  })}
                </div>

                {/* Q4bis: slider if mixte */}
                {debiteurCreancier === 'mixte' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-sans text-foreground">Débiteurs</span>
                      <span className="text-xs font-sans font-bold text-foreground">{debiteurPct}%</span>
                    </div>
                    <Slider value={[debiteurPct]} onValueChange={([v]) => store.setField('restrDebiteurPct', v)} min={0} max={100} step={10} className="w-full" />
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-sans text-foreground">Créanciers</span>
                      <span className="text-xs font-sans font-bold text-foreground">{100 - debiteurPct}%</span>
                    </div>
                    <div className="h-2.5 rounded-full overflow-hidden flex border border-border">
                      <div className="h-full transition-all duration-300" style={{ width: `${debiteurPct}%`, backgroundColor: COL_RESTR }} />
                      <div className="h-full transition-all duration-300" style={{ width: `${100 - debiteurPct}%`, backgroundColor: COL_CONT_AFF }} />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* ── Q5: Typologie de clientèle ── */}
              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Q5 – Typologie de clientèle</p>
                </div>
                <p className="text-[10px] text-muted-foreground font-sans">Sélectionnez les typologies pertinentes :</p>
                <div className="flex flex-wrap gap-2">
                  {CLIENTELE_OPTIONS.map(opt => {
                    const active = clienteleSelected.includes(opt);
                    return (
                      <button key={opt} type="button" onClick={() => toggleList('clienteleRestr', opt)}
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

                {/* Q5bis: optional pondération */}
                {showClientelePcts && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-3 pt-2">
                    <p className="text-[9px] text-muted-foreground font-sans italic">Répartition approximative (facultatif, total = 100%)</p>
                    {clienteleSelected.map(opt => {
                      const val = clientelePcts[opt] || 0;
                      return (
                        <div key={opt} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-sans text-foreground truncate">{opt}</span>
                            <span className="text-xs font-sans font-bold text-foreground">{val}%</span>
                          </div>
                          <Slider value={[val]} onValueChange={([v]) => handleClientelePct(opt, v)} min={0} max={100} step={10} className="w-full" />
                        </div>
                      );
                    })}
                    {clientelePctTotal > 0 && clientelePctTotal !== 100 && (
                      <p className={cn("text-[9px] font-sans", clientelePctTotal > 100 ? "text-destructive" : "text-muted-foreground")}>
                        Total : {clientelePctTotal}% {clientelePctTotal !== 100 && '(ajustez pour atteindre 100%)'}
                      </p>
                    )}
                  </motion.div>
                )}
              </div>

              {/* ── Q6: Focus reprises / situations spéciales ── */}
              {hasReprises && (
                <div className="space-y-3 pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <ArrowRightLeft className="w-3.5 h-3.5 text-muted-foreground" />
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Q6 – Focus reprises / distressed M&A</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-sans">Dans les opérations de reprise, vous intervenez principalement :</p>
                  <div className="flex flex-wrap gap-2">
                    {(['repreneurs', 'cedants', 'les_deux'] as const).map(opt => {
                      const labels: Record<string, string> = { repreneurs: 'Côté repreneurs / investisseurs', cedants: 'Côté cédants / débiteurs', les_deux: 'Les deux' };
                      const active = store.restrRepriseSide === opt;
                      return (
                        <button key={opt} type="button" onClick={() => store.setField('restrRepriseSide', active ? '' : opt)}
                          className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-sans font-light transition-all duration-200 border",
                            active ? "bg-foreground text-background border-foreground" : "bg-transparent text-foreground border-border hover:border-foreground/40"
                          )}>
                          {active && <Check className="w-3 h-3" />}
                          {labels[opt]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

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

              {/* Taille des opérations */}
              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Taille des opérations</p>
                </div>
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
      )}
    </div>
  );
};

export default RestructuringActivityPanel;
