import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRegistrationStore } from '@/stores/registrationStore';
import { cn } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Check, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import SegmentedBar from '@/components/shared/SegmentedBar';
import { buildQuantizedChartData } from '@/lib/percentages';

/* ── Palette ── */
const COL_AMIABLE = 'hsl(215, 50%, 35%)';
const COL_JUDICIAIRE = 'hsl(215, 55%, 22%)';
const COL_FINANCIER = 'hsl(35, 25%, 65%)';
const COL_DISTRESSED = 'hsl(200, 12%, 55%)';
const COL_CONTENTIEUX = 'hsl(210, 8%, 72%)';

const COL_POS = ['hsl(215, 50%, 35%)', 'hsl(200, 12%, 55%)', 'hsl(35, 25%, 65%)'];
const COL_CLI = ['hsl(215, 55%, 22%)', 'hsl(210, 8%, 72%)', 'hsl(200, 12%, 55%)', 'hsl(35, 25%, 65%)', 'hsl(215, 50%, 35%)', 'hsl(220, 20%, 45%)'];

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
  if (value < 8) return null;
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={600} fontFamily="Inter, sans-serif">
      {Math.round(value)}%
    </text>
  );
};

const MiniPieChart = ({ data, size = 140 }: { data: { name: string; value: number; color: string }[]; size?: number }) => (
  <div style={{ width: size, height: size }}>
    <ResponsiveContainer width={size} height={size}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={size * 0.22} outerRadius={size * 0.42} dataKey="value" paddingAngle={1.5} stroke="hsl(var(--background))" strokeWidth={2} label={renderLabel} labelLine={false}>
          {data.map((seg, i) => <Cell key={i} fill={seg.color} />)}
        </Pie>
        <Tooltip formatter={(v: number) => [`${v}%`, '']} contentStyle={tooltipStyle} />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

const RestructuringActivityPanel = () => {
  const store = useRegistrationStore();
  const [showPreview, setShowPreview] = useState(false);

  // ── Store fields ──
  const restrSubs = store.sousActivites['restr_restructuring'] || {};
  const amiableVal = restrSubs['amiable'] ?? 50;
  const judiciaireVal = 100 - amiableVal;
  const restrFinancier = store.restrFinancier ?? 0;

  const distressedVal = store.pourcentages['restr_distressed'] ?? 10;
  const contentieuxVal = store.pourcentages['restr_contentieux_affaires'] ?? 10;

  const restructuringMainPct = Math.max(0, 100 - distressedVal - contentieuxVal);

  const financierPart = Math.round(restructuringMainPct * (restrFinancier / 100));
  const amiableRatio = amiableVal / 100;
  const remaining = restructuringMainPct - financierPart;
  const amiablePct = Math.round(remaining * amiableRatio);
  const judiciairePct = remaining - amiablePct;

  const chartData = useMemo(() => {
    const segments: { name: string; value: number; color: string }[] = [];
    if (amiablePct > 0) segments.push({ name: 'Amiable', value: amiablePct, color: COL_AMIABLE });
    if (judiciairePct > 0) segments.push({ name: 'Judiciaire', value: judiciairePct, color: COL_JUDICIAIRE });
    if (financierPart > 0) segments.push({ name: 'Restructuring financier', value: financierPart, color: COL_FINANCIER });
    if (distressedVal > 0) segments.push({ name: 'Distressed M&A', value: distressedVal, color: COL_DISTRESSED });
    if (contentieuxVal > 0) segments.push({ name: 'Contentieux', value: contentieuxVal, color: COL_CONTENTIEUX });
    return segments;
  }, [amiablePct, judiciairePct, financierPart, distressedVal, contentieuxVal]);

  // Positionnement with percentages
  const posChartData = useMemo(() => {
    if (store.positionnementRestr.length === 0) return [];
    return buildQuantizedChartData(
      store.positionnementRestr.map((opt, i) => ({
        key: opt,
        name: opt,
        raw: store.positionnementRestrPct[opt] || 10,
        color: COL_POS[i % COL_POS.length],
      }))
    );
  }, [store.positionnementRestr, store.positionnementRestrPct]);

  // Clientèle with percentages
  const cliChartData = useMemo(() => {
    if (store.clienteleRestr.length === 0) return [];
    return buildQuantizedChartData(
      store.clienteleRestr.map((opt, i) => ({
        key: opt,
        name: opt,
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
    const next = Math.max(10, Math.min(100, current + delta));
    store.setField('positionnementRestrPct', { ...store.positionnementRestrPct, [key]: next });
  };

  const handleCliPctChange = (key: string, delta: number) => {
    const current = store.clienteleRestrPct[key] || 10;
    const next = Math.max(10, Math.min(100, current + delta));
    store.setField('clienteleRestrPct', { ...store.clienteleRestrPct, [key]: next });
  };

  const allFilled = chartData.length > 0 && store.positionnementRestr.length > 0 && store.clienteleRestr.length > 0;

  return (
    <div className="space-y-8">

      {/* ═══════ RÉPARTITION DES DOSSIERS ═══════ */}
      <section className="space-y-6">
        <p className="text-sm font-serif text-foreground tracking-tight">Répartition des dossiers</p>

        {/* Restructuring */}
        <div className="carter-card p-6 space-y-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-sans font-medium text-foreground">Restructuring</p>
            <span className="text-xs font-sans font-bold text-foreground tabular-nums bg-secondary px-2 py-0.5 rounded-sm">{restructuringMainPct}%</span>
          </div>

          <div className="space-y-3 pl-3 border-l-2 border-border">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Amiable vs Judiciaire</p>
            <SegmentedBar value={amiableVal} onChange={handleAmiableChange} activeColor={COL_AMIABLE} label="Amiable (mandat ad hoc, conciliation)" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-sans text-foreground">Judiciaire <span className="text-muted-foreground">(sauvegarde, RJ, LJ)</span></span>
              <span className="text-xs font-sans font-bold text-foreground tabular-nums">{judiciaireVal}%</span>
            </div>
          </div>

          <div className="space-y-3 pl-3 border-l-2 border-border">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Part de restructuring financier</p>
            <SegmentedBar value={restrFinancier} onChange={(v) => store.setField('restrFinancier', v)} activeColor={COL_FINANCIER} label="Restructuring financier" />
          </div>
        </div>

        {/* Distressed M&A */}
        <div className="carter-card p-6 space-y-3">
          <p className="text-sm font-sans font-medium text-foreground">Distressed M&A / Reprises</p>
          <SegmentedBar value={distressedVal} onChange={handleDistressedChange} max={80} activeColor={COL_DISTRESSED} label="Part dans l'activité globale" />
        </div>

        {/* Contentieux */}
        <div className="carter-card p-6 space-y-3">
          <p className="text-sm font-sans font-medium text-foreground">Contentieux des affaires</p>
          <SegmentedBar value={contentieuxVal} onChange={handleContentieuxChange} max={80} activeColor={COL_CONTENTIEUX} label="Part dans l'activité globale" />
        </div>
      </section>

      {/* ═══════ POSITIONNEMENT ═══════ */}
      <section className="space-y-4">
        <p className="text-sm font-serif text-foreground tracking-tight">Positionnement</p>
        <p className="text-[11px] text-muted-foreground font-sans">Sélectionnez puis ajustez la répartition.</p>
        <div className="flex flex-wrap gap-2">
          {POSITIONNEMENT_OPTIONS.map(opt => {
            const active = store.positionnementRestr.includes(opt);
            return (
              <button key={opt} type="button" onClick={() => toggleList('positionnementRestr', 'positionnementRestrPct', opt)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-4 py-2 rounded-sm text-xs font-sans font-light transition-all duration-200 border",
                  active ? "bg-foreground text-background border-foreground" : "bg-transparent text-foreground border-border hover:border-foreground/40"
                )}>
                {active && <Check className="w-3 h-3" />}
                {opt}
              </button>
            );
          })}
        </div>

        {/* Percentage controls for positionnement */}
        <AnimatePresence>
          {store.positionnementRestr.length > 1 && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="carter-card p-5 space-y-3">
                {store.positionnementRestr.map((opt, i) => {
                  const displayPct = posChartData.find(d => d.name === opt)?.value ?? 0;
                  return (
                    <div key={opt} className="flex items-center gap-3 py-1.5 border-b border-border last:border-b-0">
                      <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: COL_POS[i % COL_POS.length] }} />
                      <span className="text-xs font-sans text-foreground flex-1 min-w-0 truncate">{opt}</span>
                      <div className="flex items-center gap-1">
                        <button type="button" onClick={() => handlePosPctChange(opt, -10)} className="w-6 h-6 rounded-sm border border-border flex items-center justify-center hover:bg-secondary transition-colors text-xs">−</button>
                        <span className="text-xs font-sans font-bold text-foreground w-10 text-center tabular-nums">{displayPct}%</span>
                        <button type="button" onClick={() => handlePosPctChange(opt, 10)} className="w-6 h-6 rounded-sm border border-border flex items-center justify-center hover:bg-secondary transition-colors text-xs">+</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ═══════ CLIENTÈLE ═══════ */}
      <section className="space-y-4">
        <p className="text-sm font-serif text-foreground tracking-tight">Clientèle</p>
        <p className="text-[11px] text-muted-foreground font-sans">Sélectionnez puis ajustez la répartition.</p>
        <div className="flex flex-wrap gap-2">
          {CLIENTELE_OPTIONS.map(opt => {
            const active = store.clienteleRestr.includes(opt);
            return (
              <button key={opt} type="button" onClick={() => toggleList('clienteleRestr', 'clienteleRestrPct', opt)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-4 py-2 rounded-sm text-xs font-sans font-light transition-all duration-200 border",
                  active ? "bg-foreground text-background border-foreground" : "bg-transparent text-foreground border-border hover:border-foreground/40"
                )}>
                {active && <Check className="w-3 h-3" />}
                {opt}
              </button>
            );
          })}
        </div>

        {/* Percentage controls for clientèle */}
        <AnimatePresence>
          {store.clienteleRestr.length > 1 && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="carter-card p-5 space-y-3">
                {store.clienteleRestr.map((opt, i) => {
                  const displayPct = cliChartData.find(d => d.name === opt)?.value ?? 0;
                  return (
                    <div key={opt} className="flex items-center gap-3 py-1.5 border-b border-border last:border-b-0">
                      <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: COL_CLI[i % COL_CLI.length] }} />
                      <span className="text-xs font-sans text-foreground flex-1 min-w-0 truncate">{opt}</span>
                      <div className="flex items-center gap-1">
                        <button type="button" onClick={() => handleCliPctChange(opt, -10)} className="w-6 h-6 rounded-sm border border-border flex items-center justify-center hover:bg-secondary transition-colors text-xs">−</button>
                        <span className="text-xs font-sans font-bold text-foreground w-10 text-center tabular-nums">{displayPct}%</span>
                        <button type="button" onClick={() => handleCliPctChange(opt, 10)} className="w-6 h-6 rounded-sm border border-border flex items-center justify-center hover:bg-secondary transition-colors text-xs">+</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ═══════ APERÇU BUTTON ═══════ */}
      <AnimatePresence>
        {allFilled && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end">
            <Button type="button" variant="outline" onClick={() => setShowPreview(true)} className="gap-2 font-sans font-light rounded-sm">
              <Eye className="w-4 h-4" />
              Aperçu de mon activité
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════ PREVIEW DIALOG ═══════ */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl font-normal tracking-tight">Aperçu de votre activité</DialogTitle>
          </DialogHeader>

          <div className="space-y-8 py-4">
            {/* Répartition des dossiers */}
            <div className="space-y-4">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Répartition des dossiers</p>
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <MiniPieChart data={chartData} size={180} />
                <div className="space-y-1.5 flex-1">
                  {chartData.map(seg => (
                    <div key={seg.name} className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: seg.color }} />
                      <span className="text-[11px] font-sans text-foreground/80 flex-1">{seg.name}</span>
                      <span className="text-[11px] font-sans font-bold text-foreground tabular-nums">{seg.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Positionnement */}
            {posChartData.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-border">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Positionnement</p>
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <MiniPieChart data={posChartData} size={140} />
                  <div className="space-y-1.5 flex-1">
                    {posChartData.map(seg => (
                      <div key={seg.name} className="flex items-center gap-2.5">
                        <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: seg.color }} />
                        <span className="text-[11px] font-sans text-foreground/80 flex-1">{seg.name}</span>
                        <span className="text-[11px] font-sans font-bold text-foreground tabular-nums">{seg.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Clientèle */}
            {cliChartData.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-border">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Clientèle</p>
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <MiniPieChart data={cliChartData} size={140} />
                  <div className="space-y-1.5 flex-1">
                    {cliChartData.map(seg => (
                      <div key={seg.name} className="flex items-center gap-2.5">
                        <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: seg.color }} />
                        <span className="text-[11px] font-sans text-foreground/80 flex-1">{seg.name}</span>
                        <span className="text-[11px] font-sans font-bold text-foreground tabular-nums">{seg.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <DialogClose asChild>
              <Button variant="outline" className="font-sans font-light rounded-sm">Fermer</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RestructuringActivityPanel;
