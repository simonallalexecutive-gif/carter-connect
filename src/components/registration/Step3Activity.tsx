import { motion, AnimatePresence } from 'motion/react';
import { useRegistrationStore } from '@/stores/registrationStore';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ChipSelector from '@/components/shared/ChipSelector';
import { ANGLAIS_OPTIONS, TYPES_CLIENTS, ACTIVITES_BY_PRACTICE, ACTIVITES_DEFAULT } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useMemo } from 'react';
import { buildQuantizedChartData } from '@/lib/percentages';
import { ArrowLeft, ArrowRight, Check, Minus, Plus } from 'lucide-react';
import FinanceActivityPanel from './FinanceActivityPanel';
import RestructuringActivityPanel from './RestructuringActivityPanel';
import SocialActivityPanel from './SocialActivityPanel';
import MaActivityPanel from './MaActivityPanel';
import RealEstateActivityPanel from './RealEstateActivityPanel';

const CHART_COLORS = [
  'hsl(215, 60%, 30%)',
  'hsl(215, 50%, 42%)',
  'hsl(220, 55%, 22%)',
  'hsl(210, 45%, 52%)',
  'hsl(218, 40%, 36%)',
  'hsl(222, 50%, 28%)',
  'hsl(212, 35%, 46%)',
  'hsl(225, 45%, 18%)',
];

const SPECIALIZED_DEPTS = ['Financement LBO', 'Financement de projets', 'Restructuring', 'Restructuring/Insolvency', 'Droit Social', 'M&A (dominante)', 'Private Equity (dominante)', 'Immobilier', 'Real Estate'];

const Step3Activity = () => {
  const store = useRegistrationStore();

  const practiceActivities = store.departement
    ? (ACTIVITES_BY_PRACTICE[store.departement] || ACTIVITES_DEFAULT)
    : ACTIVITES_DEFAULT;

  const allItems = practiceActivities.sections.flatMap(s => s.items);

  const handleToggle = (key: string) => {
    const newActivites = { ...store.activites, [key]: !store.activites[key] };
    store.setField('activites', newActivites);
    if (!store.activites[key]) {
      store.setField('pourcentages', { ...store.pourcentages, [key]: 10 });
    }
  };

  const handlePercentChange = (key: string, delta: number) => {
    const current = store.pourcentages[key] ?? 10;
    const next = Math.max(0, Math.min(100, current + delta));
    store.setField('pourcentages', { ...store.pourcentages, [key]: next });
  };

  const selectedItems = allItems.filter(item => store.activites[item.key]);
  const hasActivites = selectedItems.length > 0;

  const chartData = useMemo(() => {
    return buildQuantizedChartData(
      selectedItems.map((item, index) => ({
        key: item.key,
        name: item.label,
        raw: store.pourcentages[item.key] || 10,
        color: CHART_COLORS[index % CHART_COLORS.length],
      })),
    );
  }, [selectedItems, store.pourcentages]);

  const isSpecialized = SPECIALIZED_DEPTS.includes(store.departement);

  // Validation: specialized panels are always valid (they have their own controls), generic needs at least one activity selected
  const canProceedStep3 = isSpecialized || hasActivites;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-2xl mx-auto px-6 py-10"
    >
      <div className="carter-divider mb-6" />
      <h2 className="text-2xl font-sans text-foreground mb-2 font-medium tracking-[-0.02em]">Votre activité</h2>
      <p className="text-muted-foreground font-sans text-sm font-light mb-10">
        {store.departement
          ? `Sélectionnez vos domaines d'intervention en ${store.departement} et ajustez la répartition.`
          : 'Sélectionnez vos domaines d\'intervention et ajustez la répartition.'}
      </p>

      <div className="space-y-8">
        {/* Specialized panels */}
        {(store.departement === 'Financement LBO' || store.departement === 'Financement de projets') && practiceActivities.sections.filter(s => s.title === 'Type de financement').map(section => (
          <div key={section.title}>
            <Label className="font-sans text-xs font-light text-muted-foreground uppercase tracking-wider mb-3 block">{section.title}</Label>
            <FinanceActivityPanel items={section.items} />
          </div>
        ))}

        {(store.departement === 'Restructuring' || store.departement === 'Restructuring/Insolvency') && (
          <RestructuringActivityPanel />
        )}

        {store.departement === 'Droit Social' && (
          <div>
            <Label className="font-sans text-xs font-light text-muted-foreground uppercase tracking-wider mb-3 block">Nature de l'activité</Label>
            <SocialActivityPanel />
          </div>
        )}

        {(store.departement === 'M&A (dominante)' || store.departement === 'Private Equity (dominante)') && (
          <div>
            <Label className="font-sans text-xs font-light text-muted-foreground uppercase tracking-wider mb-3 block">Nature des opérations</Label>
            <MaActivityPanel />
          </div>
        )}

        {(store.departement === 'Immobilier' || store.departement === 'Real Estate') && (
          <RealEstateActivityPanel />
        )}




        {/* Generic sections for non-specialized departments */}
        {!isSpecialized && practiceActivities.sections.map(section => (
          <div key={section.title}>
            <Label className="font-sans text-xs font-light text-muted-foreground uppercase tracking-wider mb-3 block">{section.title}</Label>
            <div className="flex flex-wrap gap-2">
              {section.items.map(item => {
                const isActive = store.activites[item.key];
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleToggle(item.key)}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-4 py-2 rounded-sm text-sm font-sans font-light transition-all duration-200 border",
                      isActive
                        ? "bg-foreground text-background border-foreground"
                        : "bg-transparent text-foreground border-border hover:border-foreground/40"
                    )}
                  >
                    {isActive && <Check className="w-3 h-3" />}
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Activity Breakdown – Pie + Controls */}
        {!isSpecialized && (
          <AnimatePresence>
            {hasActivites && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="border border-border rounded-sm p-6 md:p-8 space-y-0">
                  {/* Répartition des dossiers */}
                  <p className="font-sans text-[11px] font-medium text-muted-foreground uppercase tracking-[0.15em] mb-5">Répartition des dossiers</p>

                  <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                    {/* Pie chart */}
                    <div className="flex-shrink-0" style={{ width: 200, height: 200 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={90}
                            dataKey="value"
                            paddingAngle={2}
                            stroke="hsl(var(--background))"
                            strokeWidth={2}
                            label={({ cx, cy, midAngle, innerRadius: ir, outerRadius: or, index }) => {
                              const RADIAN = Math.PI / 180;
                              const radius = ir + (or - ir) * 0.5;
                              const x = cx + radius * Math.cos(-midAngle * RADIAN);
                              const y = cy + radius * Math.sin(-midAngle * RADIAN);
                              const pct = chartData[index]?.value ?? 0;
                              if (pct < 15) return null;
                              return (
                                <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={700} fontFamily="Inter, sans-serif">
                                  {pct}%
                                </text>
                              );
                            }}
                            labelLine={false}
                          >
                            {chartData.map((_, index) => (
                              <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Controls */}
                    <div className="flex-1 w-full space-y-3">
                      {selectedItems.map((item, i) => {
                        const displayPercent = chartData.find(d => d.name === item.label)?.value ?? 0;
                        return (
                          <div key={item.key} className="flex items-center gap-3 py-2 border-b border-border last:border-b-0">
                            <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                            <span className="text-[13px] font-sans text-foreground flex-1 min-w-0 truncate">{item.label}</span>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handlePercentChange(item.key, -10)}
                                className="w-7 h-7 rounded-sm border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                              >
                                <Minus className="w-3 h-3 text-foreground" />
                              </button>
                              <span className="text-[13px] font-sans font-bold text-foreground w-12 text-center tabular-nums">
                                {displayPercent}%
                              </span>
                              <button
                                type="button"
                                onClick={() => handlePercentChange(item.key, 10)}
                                className="w-7 h-7 rounded-sm border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                              >
                                <Plus className="w-3 h-3 text-foreground" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                      <p className="text-[10px] text-muted-foreground font-sans pt-1">Ajustez le poids relatif de chaque activité par paliers de 10 points.</p>
                    </div>
                  </div>

                  {/* Positionnement — seamless continuation */}
                  <div className="pt-8">
                    <p className="font-sans text-[11px] font-medium text-muted-foreground uppercase tracking-[0.15em] mb-4">Positionnement</p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-sans text-foreground">Côté prêteur</span>
                        <span className="text-[13px] font-sans font-bold text-foreground tabular-nums">{store.positionnementPreteur ?? 50}%</span>
                      </div>
                      <div className="flex gap-1.5 flex-wrap">
                        {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(v => (
                          <button
                            key={v}
                            type="button"
                            onClick={() => store.setField('positionnementPreteur', v)}
                            className={cn(
                              "px-2.5 py-1.5 rounded-sm text-[11px] font-sans border transition-all min-w-[40px]",
                              (store.positionnementPreteur ?? 50) === v
                                ? "bg-foreground text-background border-foreground"
                                : "bg-transparent text-muted-foreground border-border hover:border-foreground"
                            )}
                          >
                            {v}%
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-sans text-foreground">Côté sponsor</span>
                        <span className="text-[13px] font-sans font-bold text-foreground tabular-nums">{100 - (store.positionnementPreteur ?? 50)}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Clientèle — seamless continuation */}
                  <div className="pt-8">
                    <p className="font-sans text-[11px] font-medium text-muted-foreground uppercase tracking-[0.15em] mb-4">Clientèle</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[13px] font-sans text-foreground">Clientèle française</span>
                      <span className="text-[13px] font-sans font-bold text-foreground tabular-nums">{store.clienteleFrancaise}%</span>
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                      {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(v => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => store.setField('clienteleFrancaise', v)}
                          className={cn(
                            "px-2.5 py-1.5 rounded-sm text-[11px] font-sans border transition-all min-w-[40px]",
                            store.clienteleFrancaise === v
                              ? "bg-foreground text-background border-foreground"
                              : "bg-transparent text-muted-foreground border-border hover:border-foreground"
                          )}
                        >
                          {v}%
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-[13px] font-sans text-foreground">Clientèle étrangère</span>
                      <span className="text-[13px] font-sans font-bold text-foreground tabular-nums">{100 - store.clienteleFrancaise}%</span>
                    </div>
                  </div>

                  {/* Taille des opérations — seamless continuation */}
                  <div className="pt-8">
                    <p className="font-sans text-[11px] font-medium text-muted-foreground uppercase tracking-[0.15em] mb-3">Taille des opérations</p>
                    <div className="flex flex-wrap gap-2">
                      {['Small cap', 'Mid cap', 'Large cap'].map(t => {
                        const active = (store.tailleOperations || []).includes(t);
                        return (
                          <button
                            key={t}
                            type="button"
                            onClick={() => {
                              const current = store.tailleOperations || [];
                              store.setField('tailleOperations', active ? current.filter(v => v !== t) : [...current, t]);
                            }}
                            className={cn(
                              "inline-flex items-center gap-1.5 px-4 py-2 rounded-sm text-[13px] font-sans font-light transition-all duration-200 border",
                              active
                                ? "bg-foreground text-background border-foreground"
                                : "bg-transparent text-foreground border-border hover:border-foreground/40"
                            )}
                          >
                            {active && <Check className="w-3 h-3" />}
                            {t}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Anglais – hidden for Restructuring & Immobilier (handled in panel) */}
        {store.departement !== 'Restructuring' && store.departement !== 'Restructuring/Insolvency' && store.departement !== 'Immobilier' && store.departement !== 'Real Estate' && (
          <div>
            <Label className="font-sans text-xs font-light text-muted-foreground uppercase tracking-wider">Niveau d'anglais *</Label>
            <Select value={store.anglais} onValueChange={v => store.setField('anglais', v)}>
              <SelectTrigger className="mt-2"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
              <SelectContent>
                {ANGLAIS_OPTIONS.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Types clients – hidden for Financement, Restructuring & Immobilier */}
        {store.departement !== 'Financement LBO' && store.departement !== 'Financement de projets' && store.departement !== 'Restructuring' && store.departement !== 'Restructuring/Insolvency' && store.departement !== 'Immobilier' && store.departement !== 'Real Estate' && (
          <div>
            <Label className="font-sans text-xs font-light text-muted-foreground uppercase tracking-wider mb-3 block">Types de clients</Label>
            <ChipSelector
              options={TYPES_CLIENTS}
              selected={store.typesClients}
              onChange={v => store.setField('typesClients', v)}
            />
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6">
          <Button variant="outline" onClick={store.prevStep} className="font-sans font-light rounded-sm gap-2">
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
          <Button onClick={store.nextStep} disabled={!canProceedStep3} className="bg-foreground text-background hover:bg-foreground/90 font-sans font-medium rounded-sm gap-2">
            Continuer
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default Step3Activity;
