import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRegistrationStore } from '@/stores/registrationStore';
import { cn } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Check, Briefcase, Building2, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import SegmentedBar from '@/components/shared/SegmentedBar';

/* ── Palette ── */
const COL_AMIABLE = 'hsl(215, 50%, 35%)';
const COL_JUDICIAIRE = 'hsl(215, 55%, 22%)';
const COL_FINANCIER = 'hsl(35, 25%, 65%)';
const COL_DISTRESSED = 'hsl(200, 12%, 55%)';
const COL_CONTENTIEUX = 'hsl(210, 8%, 72%)';

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
    if (amiablePct > 0) segments.push({ name: 'Amiable (mandat ad hoc, conciliation)', value: amiablePct, color: COL_AMIABLE });
    if (judiciairePct > 0) segments.push({ name: 'Judiciaire (sauvegarde, RJ, LJ)', value: judiciairePct, color: COL_JUDICIAIRE });
    if (financierPart > 0) segments.push({ name: 'Restructuring financier', value: financierPart, color: COL_FINANCIER });
    if (distressedVal > 0) segments.push({ name: 'Distressed M&A / Reprises', value: distressedVal, color: COL_DISTRESSED });
    if (contentieuxVal > 0) segments.push({ name: 'Contentieux des affaires', value: contentieuxVal, color: COL_CONTENTIEUX });
    return segments;
  }, [amiablePct, judiciairePct, financierPart, distressedVal, contentieuxVal]);

  const handleAmiableChange = (v: number) => {
    const cur = store.sousActivites['restr_restructuring'] || {};
    store.setField('sousActivites', {
      ...store.sousActivites,
      restr_restructuring: { ...cur, amiable: v, judiciaire: 100 - v },
    });
  };

  const handleDistressedChange = (v: number) => {
    const maxAllowed = Math.max(0, 100 - contentieuxVal);
    const clamped = Math.min(v, maxAllowed);
    store.setField('pourcentages', { ...store.pourcentages, restr_distressed: clamped });
  };

  const handleContentieuxChange = (v: number) => {
    const maxAllowed = Math.max(0, 100 - distressedVal);
    const clamped = Math.min(v, maxAllowed);
    store.setField('pourcentages', { ...store.pourcentages, restr_contentieux_affaires: clamped });
  };

  const toggleList = (field: 'positionnementRestr' | 'clienteleRestr', value: string) => {
    const cur = store[field];
    store.setField(field, cur.includes(value) ? cur.filter(v => v !== value) : [...cur, value]);
  };

  const allFilled = chartData.length > 0 && store.positionnementRestr.length > 0 && store.clienteleRestr.length > 0;

  return (
    <div className="space-y-8">

      {/* ═══════ I. RÉPARTITION DES DOSSIERS ═══════ */}
      <section className="space-y-6">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium mb-1">I. Répartition des dossiers</p>
        </div>

        {/* 1. Restructuring */}
        <div className="carter-card p-6 space-y-5">
          <p className="text-sm font-sans font-medium text-foreground">1. Restructuring</p>
          <p className="text-[11px] text-muted-foreground font-sans">
            Ce bloc représente <span className="font-semibold text-foreground">{restructuringMainPct}%</span> de votre activité globale (ajusté automatiquement).
          </p>

          {/* Amiable / Judiciaire split */}
          <div className="space-y-3 pl-3 border-l-2 border-border">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Amiable vs Judiciaire</p>
            <SegmentedBar
              value={amiableVal}
              onChange={handleAmiableChange}
              min={0}
              max={100}
              step={5}
              activeColor={COL_AMIABLE}
              label="Amiable (mandat ad hoc, conciliation)"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs font-sans text-foreground">Judiciaire <span className="text-muted-foreground">(sauvegarde, RJ, LJ + contentieux liés)</span></span>
              <span className="text-xs font-sans font-bold text-foreground tabular-nums">{judiciaireVal}%</span>
            </div>
          </div>

          {/* Restructuring financier */}
          <div className="space-y-3 pl-3 border-l-2 border-border">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Part de restructuring financier (sur l'amiable)</p>
            <SegmentedBar
              value={restrFinancier}
              onChange={(v) => store.setField('restrFinancier', v)}
              min={0}
              max={100}
              step={5}
              activeColor={COL_FINANCIER}
              label="Restructuring financier"
            />
          </div>
        </div>

        {/* 2. Distressed M&A */}
        <div className="carter-card p-6 space-y-3">
          <p className="text-sm font-sans font-medium text-foreground">2. Distressed M&A / Reprises</p>
          <SegmentedBar
            value={distressedVal}
            onChange={handleDistressedChange}
            min={0}
            max={80}
            step={5}
            activeColor={COL_DISTRESSED}
            label="Part dans l'activité globale"
          />
        </div>

        {/* 3. Contentieux des affaires */}
        <div className="carter-card p-6 space-y-3">
          <p className="text-sm font-sans font-medium text-foreground">3. Contentieux des affaires</p>
          <SegmentedBar
            value={contentieuxVal}
            onChange={handleContentieuxChange}
            min={0}
            max={80}
            step={5}
            activeColor={COL_CONTENTIEUX}
            label="Part dans l'activité globale"
          />
        </div>

        {/* ── Recap Pie Chart ── */}
        <div className="carter-card p-6 space-y-4">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Camembert récapitulatif</p>
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-shrink-0" style={{ width: 220, height: 220 }}>
              <ResponsiveContainer width={220} height={220}>
                <PieChart>
                  <Pie data={chartData} cx="50%" cy="50%" innerRadius={40} outerRadius={85} dataKey="value" paddingAngle={1.5} stroke="hsl(var(--background))" strokeWidth={2} label={renderLabel} labelLine={false}>
                    {chartData.map((seg, i) => <Cell key={i} fill={seg.color} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => [`${v}%`, '']} contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 flex-1">
              {chartData.map(seg => (
                <div key={seg.name} className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: seg.color }} />
                  <span className="text-xs font-sans text-foreground/80 flex-1 truncate">{seg.name}</span>
                  <span className="text-xs font-sans font-bold text-foreground tabular-nums">{seg.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ II. POSITIONNEMENT ═══════ */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">II. Positionnement</p>
        </div>
        <p className="text-[11px] text-muted-foreground font-sans">Vous intervenez principalement :</p>
        <div className="flex flex-wrap gap-2">
          {POSITIONNEMENT_OPTIONS.map(opt => {
            const active = store.positionnementRestr.includes(opt);
            return (
              <button key={opt} type="button" onClick={() => toggleList('positionnementRestr', opt)}
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
      </section>

      {/* ═══════ III. CLIENTÈLE ═══════ */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">III. Clientèle</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {CLIENTELE_OPTIONS.map(opt => {
            const active = store.clienteleRestr.includes(opt);
            return (
              <button key={opt} type="button" onClick={() => toggleList('clienteleRestr', opt)}
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl font-normal tracking-tight">Aperçu de votre activité</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col md:flex-row gap-8 items-start py-4">
            <div className="md:w-[50%] space-y-4">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Répartition de l'activité</p>
              <div className="mx-auto" style={{ width: 220, height: 220 }}>
                <ResponsiveContainer width={220} height={220}>
                  <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%" innerRadius={40} outerRadius={85} dataKey="value" paddingAngle={1.5} stroke="hsl(var(--background))" strokeWidth={2} label={renderLabel} labelLine={false}>
                      {chartData.map((seg, i) => <Cell key={i} fill={seg.color} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => [`${v}%`, '']} contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1.5">
                {chartData.map(seg => (
                  <div key={seg.name} className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: seg.color }} />
                    <span className="text-[11px] font-sans text-foreground/80 flex-1">{seg.name}</span>
                    <span className="text-[11px] font-sans font-bold text-foreground tabular-nums">{seg.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:w-[50%] space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Positionnement</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {store.positionnementRestr.map(opt => (
                    <span key={opt} className="px-3 py-1.5 rounded-sm bg-foreground text-background text-[11px] font-sans font-medium">
                      {opt}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Clientèle</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {store.clienteleRestr.map(opt => (
                    <span key={opt} className="px-3 py-1.5 rounded-sm bg-muted text-foreground text-[11px] font-sans font-medium">
                      {opt}
                    </span>
                  ))}
                </div>
              </div>
            </div>
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
