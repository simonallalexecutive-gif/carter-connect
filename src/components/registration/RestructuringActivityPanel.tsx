import { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRegistrationStore } from '@/stores/registrationStore';
import { cn } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Check, Minus, Plus } from 'lucide-react';
import SquareGauge from '@/components/shared/SquareGauge';
import { buildQuantizedChartData } from '@/lib/percentages';

/* ── Palette ── */
const COL_AMIABLE = 'hsl(215, 50%, 35%)';
const COL_JUDICIAIRE = 'hsl(215, 55%, 22%)';
const COL_FINANCIER = 'hsl(210, 25%, 50%)';
const COL_DISTRESSED = 'hsl(200, 12%, 45%)';
const COL_CONTENTIEUX = 'hsl(220, 15%, 62%)';

const COL_POS = ['hsl(215, 50%, 35%)', 'hsl(200, 15%, 50%)', 'hsl(220, 20%, 30%)'];
const COL_CLI = ['hsl(215, 55%, 22%)', 'hsl(210, 20%, 42%)', 'hsl(200, 12%, 55%)', 'hsl(220, 15%, 35%)', 'hsl(215, 50%, 35%)', 'hsl(210, 10%, 62%)'];

const POSITIONNEMENT_OPTIONS = ['Côté débiteur', 'Côté créancier', 'Côté repreneur / investisseur'];
const CLIENTELE_OPTIONS = ['ETI', 'PME', 'Grands groupes', 'Banques', 'Fonds', 'AJ/MJ'];

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

const RestructuringActivityPanel = () => {
  const store = useRegistrationStore();

  // ── Store fields ──
  const restrSubs = store.sousActivites['restr_restructuring'] || {};
  const amiableVal = restrSubs['amiable'] ?? 50;
  const judiciaireVal = 100 - amiableVal;
  const restrFinancier = store.restrFinancier ?? 0;

  const distressedVal = store.pourcentages['restr_distressed'] ?? 10;
  const contentieuxVal = store.pourcentages['restr_contentieux_affaires'] ?? 10;

  const restructuringMainPct = Math.max(0, 100 - distressedVal - contentieuxVal);

  const amiableRatio = amiableVal / 100;
  const totalAmiablePct = Math.round(restructuringMainPct * amiableRatio);
  const judiciairePct = restructuringMainPct - totalAmiablePct;

  const financierPct = Math.round(totalAmiablePct * (restrFinancier / 100));
  const amiableHorsFinancierPct = totalAmiablePct - financierPct;

  const chartData = useMemo(() => {
    const segments: { name: string; value: number; color: string }[] = [];
    if (amiableHorsFinancierPct > 0) segments.push({ name: 'Amiable (hors financier)', value: amiableHorsFinancierPct, color: COL_AMIABLE });
    if (financierPct > 0) segments.push({ name: 'Restructuring financier', value: financierPct, color: COL_FINANCIER });
    if (judiciairePct > 0) segments.push({ name: 'Judiciaire', value: judiciairePct, color: COL_JUDICIAIRE });
    if (distressedVal > 0) segments.push({ name: 'Distressed M&A', value: distressedVal, color: COL_DISTRESSED });
    if (contentieuxVal > 0) segments.push({ name: 'Contentieux', value: contentieuxVal, color: COL_CONTENTIEUX });
    return segments;
  }, [amiableHorsFinancierPct, financierPct, judiciairePct, distressedVal, contentieuxVal]);

  // Positionnement
  const posChartData = useMemo(() => {
    if (store.positionnementRestr.length === 0) return [];
    return buildQuantizedChartData(
      store.positionnementRestr.map((opt, i) => ({
        key: opt, name: opt,
        raw: store.positionnementRestrPct[opt] || 10,
        color: COL_POS[i % COL_POS.length],
      }))
    );
  }, [store.positionnementRestr, store.positionnementRestrPct]);

  // Clientèle
  const cliChartData = useMemo(() => {
    if (store.clienteleRestr.length === 0) return [];
    return buildQuantizedChartData(
      store.clienteleRestr.map((opt, i) => ({
        key: opt, name: opt,
        raw: store.clienteleRestrPct[opt] || 10,
        color: COL_CLI[i % COL_CLI.length],
      }))
    );
  }, [store.clienteleRestr, store.clienteleRestrPct]);

  const handleAmiableChange = (v: number) => {
    const cur = store.sousActivites['restr_restructuring'] || {};
    store.setField('sousActivites', {
      ...store.sousActivites,
      restr_restructuring: { ...cur, amiable: v, judiciaire: 100 - v },
    });
  };

  const handleDistressedChange = (v: number) => {
    const maxAllowed = Math.max(0, 100 - contentieuxVal);
    store.setField('pourcentages', { ...store.pourcentages, restr_distressed: Math.min(v, maxAllowed) });
  };

  const handleContentieuxChange = (v: number) => {
    const maxAllowed = Math.max(0, 100 - distressedVal);
    store.setField('pourcentages', { ...store.pourcentages, restr_contentieux_affaires: Math.min(v, maxAllowed) });
  };

  const toggleList = (field: 'positionnementRestr' | 'clienteleRestr', pctField: 'positionnementRestrPct' | 'clienteleRestrPct', value: string) => {
    const cur = store[field];
    if (cur.includes(value)) {
      store.setField(field, cur.filter(v => v !== value));
      const pcts = { ...store[pctField] };
      delete pcts[value];
      store.setField(pctField, pcts);
    } else {
      store.setField(field, [...cur, value]);
      store.setField(pctField, { ...store[pctField], [value]: 10 });
    }
  };

  const handlePosPctChange = (key: string, delta: number) => {
    const current = store.positionnementRestrPct[key] || 10;
    store.setField('positionnementRestrPct', { ...store.positionnementRestrPct, [key]: Math.max(10, Math.min(100, current + delta)) });
  };

  const handleCliPctChange = (key: string, delta: number) => {
    const current = store.clienteleRestrPct[key] || 10;
    store.setField('clienteleRestrPct', { ...store.clienteleRestrPct, [key]: Math.max(10, Math.min(100, current + delta)) });
  };

  const showSynthesis = chartData.length > 0;

  /* ═══════════════════════════════════════════════════════
     RENDER — Two-column: Synthesis LEFT, Questionnaire RIGHT
     ═══════════════════════════════════════════════════════ */
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
            <div className="carter-card p-5 space-y-4">
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

              {/* Legend — Activité */}
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

              {/* Legend — Positionnement */}
              {posChartData.length > 0 && (
                <div className="border-t border-border pt-3 space-y-1.5">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium mb-1">Positionnement</p>
                  {posChartData.map((seg, i) => (
                    <div key={seg.name} className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: COL_POS[i % COL_POS.length] }} />
                      <span className="text-[11px] font-sans text-foreground/70 flex-1">{seg.name}</span>
                      <span className="text-[11px] font-sans font-semibold text-foreground tabular-nums">{seg.value}%</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Legend — Clientèle */}
              {cliChartData.length > 0 && (
                <div className="border-t border-border pt-3 space-y-1.5">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium mb-1">Clientèle</p>
                  {cliChartData.map((seg, i) => (
                    <div key={seg.name} className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: COL_CLI[i % COL_CLI.length] }} />
                      <span className="text-[11px] font-sans text-foreground/70 flex-1">{seg.name}</span>
                      <span className="text-[11px] font-sans font-semibold text-foreground tabular-nums">{seg.value}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════ RIGHT: QUESTIONNAIRE ══════════ */}
      <div className="carter-card p-5 md:p-7 space-y-6 flex-1 min-w-0">

        {/* ═══════ RESTRUCTURING MAIN ═══════ */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-sans font-medium text-foreground">Restructuring</p>
            <span className="text-xs font-sans font-bold text-foreground tabular-nums bg-secondary px-2 py-0.5 rounded-sm">{restructuringMainPct}%</span>
          </div>

          <div className="space-y-2.5 pl-3 border-l-2 border-border">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Amiable vs Judiciaire</p>
            <SquareGauge value={amiableVal} onChange={handleAmiableChange} activeColor={COL_AMIABLE} label="Amiable (mandat ad hoc, conciliation)" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-sans text-foreground">Judiciaire <span className="text-muted-foreground">(sauvegarde, RJ, LJ)</span></span>
              <span className="text-xs font-sans font-bold text-foreground tabular-nums">{judiciaireVal}%</span>
            </div>
          </div>

          <div className="space-y-2.5 pl-3 border-l-2 border-border">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Dont restructuring financier <span className="normal-case">(au sein de l'amiable)</span></p>
            <SquareGauge value={restrFinancier} onChange={(v) => store.setField('restrFinancier', v)} activeColor={COL_FINANCIER} label={`Restructuring financier : ${financierPct}% de l'activité totale`} />
          </div>
        </div>

        {/* ═══════ DISTRESSED M&A ═══════ */}
        <div className="border-t border-border pt-5 space-y-2.5">
          <p className="text-sm font-sans font-medium text-foreground">Distressed M&A / Reprises</p>
          <SquareGauge value={distressedVal} onChange={handleDistressedChange} max={80} activeColor={COL_DISTRESSED} label="Part dans l'activité globale" />
        </div>

        {/* ═══════ CONTENTIEUX ═══════ */}
        <div className="border-t border-border pt-5 space-y-2.5">
          <p className="text-sm font-sans font-medium text-foreground">Contentieux des affaires</p>
          <SquareGauge value={contentieuxVal} onChange={handleContentieuxChange} max={80} activeColor={COL_CONTENTIEUX} label="Part dans l'activité globale" />
        </div>

        {/* ═══════ POSITIONNEMENT ═══════ */}
        <div className="border-t border-border pt-5 space-y-3">
          <p className="text-sm font-sans font-medium text-foreground">Positionnement</p>
          <div className="flex flex-wrap gap-2">
            {POSITIONNEMENT_OPTIONS.map(opt => (
              <ChipButton key={opt} active={store.positionnementRestr.includes(opt)} onClick={() => toggleList('positionnementRestr', 'positionnementRestrPct', opt)}>
                {opt}
              </ChipButton>
            ))}
          </div>

          <AnimatePresence>
            {store.positionnementRestr.length > 1 && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="pl-3 border-l-2 border-border mt-2 space-y-2">
                  {store.positionnementRestr.map((opt, i) => {
                    const displayPct = posChartData.find(d => d.name === opt)?.value ?? 0;
                    return (
                      <div key={opt} className="flex items-center gap-2.5 py-1 border-b border-border last:border-b-0">
                        <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: COL_POS[i % COL_POS.length] }} />
                        <span className="text-xs font-sans text-foreground flex-1 min-w-0 truncate">{opt}</span>
                        <div className="flex items-center gap-1">
                          <button type="button" onClick={() => handlePosPctChange(opt, -10)} className="w-6 h-6 rounded-sm border border-border flex items-center justify-center hover:bg-secondary transition-colors"><Minus className="w-3 h-3" /></button>
                          <span className="text-xs font-sans font-bold text-foreground w-10 text-center tabular-nums">{displayPct}%</span>
                          <button type="button" onClick={() => handlePosPctChange(opt, 10)} className="w-6 h-6 rounded-sm border border-border flex items-center justify-center hover:bg-secondary transition-colors"><Plus className="w-3 h-3" /></button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ═══════ CLIENTÈLE ═══════ */}
        <div className="border-t border-border pt-5 space-y-3">
          <p className="text-sm font-sans font-medium text-foreground">Clientèle</p>
          <div className="flex flex-wrap gap-2">
            {CLIENTELE_OPTIONS.map(opt => (
              <ChipButton key={opt} active={store.clienteleRestr.includes(opt)} onClick={() => toggleList('clienteleRestr', 'clienteleRestrPct', opt)}>
                {opt}
              </ChipButton>
            ))}
          </div>

          <AnimatePresence>
            {store.clienteleRestr.length > 1 && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="pl-3 border-l-2 border-border mt-2 space-y-2">
                  {store.clienteleRestr.map((opt, i) => {
                    const displayPct = cliChartData.find(d => d.name === opt)?.value ?? 0;
                    return (
                      <div key={opt} className="flex items-center gap-2.5 py-1 border-b border-border last:border-b-0">
                        <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: COL_CLI[i % COL_CLI.length] }} />
                        <span className="text-xs font-sans text-foreground flex-1 min-w-0 truncate">{opt}</span>
                        <div className="flex items-center gap-1">
                          <button type="button" onClick={() => handleCliPctChange(opt, -10)} className="w-6 h-6 rounded-sm border border-border flex items-center justify-center hover:bg-secondary transition-colors"><Minus className="w-3 h-3" /></button>
                          <span className="text-xs font-sans font-bold text-foreground w-10 text-center tabular-nums">{displayPct}%</span>
                          <button type="button" onClick={() => handleCliPctChange(opt, 10)} className="w-6 h-6 rounded-sm border border-border flex items-center justify-center hover:bg-secondary transition-colors"><Plus className="w-3 h-3" /></button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default RestructuringActivityPanel;
