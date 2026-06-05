import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRegistrationStore } from '@/stores/registrationStore';
import { cn } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Check } from 'lucide-react';
import SquareGauge from '@/components/shared/SquareGauge';

/* ── Palette ── */
const COL_COMMERCIAL = 'hsl(0, 0%, 8%)';
const COL_INVEST = 'hsl(220, 45%, 18%)';
const COL_CONSTRUCTION = 'hsl(0, 0%, 28%)';
const COL_SPORT = 'hsl(220, 45%, 18%)';

const TYPES_ARBITRAGE = [
  { key: 'arb_commercial', label: 'Arbitrage commercial', color: COL_COMMERCIAL },
  { key: 'arb_invest', label: 'Arbitrage d\'investissement', color: COL_INVEST },
  { key: 'arb_construction', label: 'Arbitrage construction', color: COL_CONSTRUCTION },
  { key: 'arb_sport', label: 'Arbitrage sportif', color: COL_SPORT },
] as const;

const INSTITUTIONS = [
  'ICC (CCI Paris)', 'LCIA', 'ICSID (CIRDI)', 'SCC', 'SIAC',
  'HKIAC', 'Ad hoc (CNUDCI/UNCITRAL)', 'Autre',
] as const;

const SECTEURS = [
  'Énergie', 'Construction / Infrastructure', 'M&A / Post-acquisition',
  'Télécoms', 'Pharma / Santé', 'Distribution', 'Tech / IP', 'Minier',
] as const;

const POSITIONNEMENTS = ['Demandeur', 'Défendeur', 'Arbitre / Tribunal'] as const;

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

const ArbitrationActivityPanel = () => {
  const store = useRegistrationStore();
  const setField = store.setField;

  // Percentages for each type
  const getPct = (key: string) => store.pourcentages[key] ?? 25;
  const handlePct = (key: string, v: number) => {
    setField('pourcentages', { ...store.pourcentages, [key]: v });
  };

  // Toggle type
  const toggleType = (key: string) => {
    setField('activites', { ...store.activites, [key]: !store.activites[key] });
    if (!store.activites[key]) {
      setField('pourcentages', { ...store.pourcentages, [key]: 25 });
    }
  };

  const selectedTypes = TYPES_ARBITRAGE.filter(t => store.activites[t.key]);

  // Toggle arrays
  const toggleArr = (field: 'arbInstitutions' | 'arbSecteurs' | 'arbPositionnements', val: string) => {
    const cur = (store as any)[field] || [];
    setField(field as any, cur.includes(val) ? cur.filter((v: string) => v !== val) : [...cur, val]);
  };

  // Anglais
  const anglaisPct = parseInt(store.anglais || '0', 10) || 0;
  const [anglaisInput, setAnglaisInput] = useState(String(anglaisPct));
  const handleAnglaisBlur = () => {
    let v = parseInt(anglaisInput, 10);
    if (isNaN(v)) v = 0;
    v = Math.max(0, Math.min(100, v));
    setAnglaisInput(String(v));
    setField('anglais', String(v));
  };

  // Domestic vs international
  const arbDomestique = (store as any).arbDomestique ?? 30;

  // Chart
  const chartData = useMemo(() => {
    const items = selectedTypes.map(t => ({ name: t.label, raw: getPct(t.key), color: t.color }));
    const total = items.reduce((s, i) => s + i.raw, 0);
    return items.map(i => ({ name: i.name, value: total > 0 ? Math.round((i.raw / total) * 100) : 0, color: i.color }));
  }, [selectedTypes, store.pourcentages]);

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
                <p className="text-[10px] font-sans font-medium text-muted-foreground uppercase tracking-[0.12em]">Types d'arbitrage</p>
                {chartData.map(seg => (
                  <div key={seg.name} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: seg.color }} />
                    <span className="text-[11px] font-sans text-foreground/80 flex-1 truncate">{seg.name}</span>
                    <span className="text-[11px] font-sans font-semibold text-foreground">{seg.value}%</span>
                  </div>
                ))}
              </div>

              {/* Dimension */}
              <div className="pt-3 border-t border-border space-y-1">
                <p className="text-[10px] font-sans font-medium text-muted-foreground uppercase tracking-[0.12em]">Dimension</p>
                <div className="flex justify-between text-[11px] font-sans">
                  <span className="text-foreground/80">FR Domestique</span>
                  <span className="font-semibold text-foreground">{arbDomestique}%</span>
                </div>
                <div className="flex justify-between text-[11px] font-sans">
                  <span className="text-foreground/80">International International</span>
                  <span className="font-semibold text-foreground">{100 - arbDomestique}%</span>
                </div>
              </div>

              {/* Anglais */}
              <div className="pt-3 border-t border-border space-y-1">
                <p className="text-[10px] font-sans font-medium text-muted-foreground uppercase tracking-[0.12em]">Activité en anglais</p>
                <p className="text-[11px] font-sans font-semibold text-foreground">{anglaisPct}%</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════ RIGHT: QUESTIONNAIRE ══════════ */}
      <div className="carter-card p-5 md:p-7 space-y-6 flex-1 min-w-0">

        {/* Types d'arbitrage */}
        <div className="space-y-2.5">
          <p className="font-sans text-[11px] font-medium text-muted-foreground uppercase tracking-[0.15em]">Type d'arbitrage</p>
          <div className="flex flex-wrap gap-2">
            {TYPES_ARBITRAGE.map(t => (
              <ChipButton key={t.key} active={!!store.activites[t.key]} onClick={() => toggleType(t.key)}>
                {t.label}
              </ChipButton>
            ))}
          </div>
        </div>

        {/* Répartition */}
        {selectedTypes.length > 1 && (
          <div className="space-y-3">
            <p className="font-sans text-[11px] font-medium text-muted-foreground uppercase tracking-[0.15em]">Répartition</p>
            {selectedTypes.map(t => (
              <SquareGauge
                key={t.key}
                value={getPct(t.key)}
                onChange={(v) => handlePct(t.key, v)}
                label={t.label}
                step={5}
              />
            ))}
          </div>
        )}

        {/* Institutions */}
        <div className="space-y-2.5">
          <p className="font-sans text-[11px] font-medium text-muted-foreground uppercase tracking-[0.15em]">Institutions de référence</p>
          <div className="flex flex-wrap gap-2">
            {INSTITUTIONS.map(inst => (
              <ChipButton key={inst} active={((store as any).arbInstitutions || []).includes(inst)} onClick={() => toggleArr('arbInstitutions', inst)}>
                {inst}
              </ChipButton>
            ))}
          </div>
        </div>

        {/* Positionnement */}
        <div className="space-y-2.5">
          <p className="font-sans text-[11px] font-medium text-muted-foreground uppercase tracking-[0.15em]">Positionnement</p>
          <div className="flex flex-wrap gap-2">
            {POSITIONNEMENTS.map(p => (
              <ChipButton key={p} active={((store as any).arbPositionnements || []).includes(p)} onClick={() => toggleArr('arbPositionnements', p)}>
                {p}
              </ChipButton>
            ))}
          </div>
        </div>

        {/* Secteurs */}
        <div className="space-y-2.5">
          <p className="font-sans text-[11px] font-medium text-muted-foreground uppercase tracking-[0.15em]">Secteurs d'intervention</p>
          <div className="flex flex-wrap gap-2">
            {SECTEURS.map(s => (
              <ChipButton key={s} active={((store as any).arbSecteurs || []).includes(s)} onClick={() => toggleArr('arbSecteurs', s)}>
                {s}
              </ChipButton>
            ))}
          </div>
        </div>

        {/* Dimension internationale */}
        <div className="space-y-2.5">
          <p className="font-sans text-[11px] font-medium text-muted-foreground uppercase tracking-[0.15em]">Dimension internationale</p>
          <SquareGauge
            value={arbDomestique}
            onChange={(v) => setField('arbDomestique' as any, v)}
            label="Dossiers domestiques"
            step={5}
          />
          <div className="flex justify-between text-[11px] font-sans text-muted-foreground">
            <span>FR Domestique {arbDomestique}%</span>
            <span>International International {100 - arbDomestique}%</span>
          </div>
        </div>

        {/* Anglais */}
        <div className="space-y-2.5">
          <p className="font-sans text-[11px] font-medium text-muted-foreground uppercase tracking-[0.15em]">Part d'activité en anglais</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              inputMode="numeric"
              value={anglaisInput}
              onChange={e => setAnglaisInput(e.target.value.replace(/\D/g, ''))}
              onBlur={handleAnglaisBlur}
              className="w-16 text-center text-sm font-sans font-bold border border-border rounded-sm px-2 py-1 bg-transparent text-foreground"
            />
            <span className="text-xs font-sans text-muted-foreground">%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArbitrationActivityPanel;
