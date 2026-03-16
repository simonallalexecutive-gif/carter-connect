import { motion } from 'motion/react';
import { useRegistrationStore } from '@/stores/registrationStore';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ChipSelector from '@/components/shared/ChipSelector';
import { ANGLAIS_OPTIONS, TYPES_CLIENTS, TAILLE_OPERATIONS, ACTIVITES_BY_PRACTICE, ACTIVITES_DEFAULT } from '@/lib/constants';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useMemo } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import FinanceActivityPanel from './FinanceActivityPanel';
import RestructuringActivityPanel from './RestructuringActivityPanel';

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

  const handlePercentChange = (key: string, value: number) => {
    store.setField('pourcentages', { ...store.pourcentages, [key]: value });
  };

  const selectedItems = allItems.filter(item => store.activites[item.key]);
  const hasActivites = selectedItems.length > 0;

  const chartData = useMemo(() => {
    return selectedItems.map(item => ({
      name: item.label,
      value: store.pourcentages[item.key] || 10,
    }));
  }, [selectedItems, store.pourcentages]);

  const totalPercent = chartData.reduce((sum, d) => sum + d.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-2xl mx-auto px-6 py-10"
    >
      <div className="carter-divider mb-6" />
      <h2 className="text-3xl font-serif text-foreground mb-2 font-normal tracking-[-0.02em]">Votre activité</h2>
      <p className="text-muted-foreground font-sans text-sm font-light mb-10">
        {store.departement
          ? `Sélectionnez vos domaines d'intervention en ${store.departement} et ajustez la répartition.`
          : 'Sélectionnez vos domaines d\'intervention et ajustez la répartition.'}
      </p>

      <div className="space-y-8">
        {/* Activity toggle chips by section */}
        {practiceActivities.sections.map(section => {
          const isFinance = store.departement === 'Banque & Finance';
          const isRestructuring = store.departement === 'Restructuring';
          const hasChildren = section.items.some(i => i.children && i.children.length > 0);

          if (isFinance && hasChildren) {
            return (
              <div key={section.title}>
                <Label className="font-sans text-xs font-light text-muted-foreground uppercase tracking-wider mb-3 block">{section.title}</Label>
                <FinanceActivityPanel items={section.items} />
              </div>
            );
          }

          if (isRestructuring && hasChildren) {
            return (
              <div key={section.title}>
                <Label className="font-sans text-xs font-light text-muted-foreground uppercase tracking-wider mb-3 block">{section.title}</Label>
                <RestructuringActivityPanel items={section.items} />
              </div>
            );
          }

          return (
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
          );
        })}

        {/* Generic Pie chart (non-finance, non-restructuring departments) */}
        {store.departement !== 'Banque & Finance' && store.departement !== 'Restructuring' && hasActivites && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="carter-card p-6"
          >
            <p className="carter-label mb-5">Pondération de votre activité</p>
            <div className="flex gap-8 items-start">
              {/* Pie chart */}
              <div className="w-40 h-40 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={38}
                      outerRadius={68}
                      dataKey="value"
                      paddingAngle={2}
                    >
                      {chartData.map((_, index) => (
                        <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [`${Math.round((value / totalPercent) * 100)}%`, '']}
                      contentStyle={{ fontSize: '11px', fontFamily: 'Inter', background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '4px', color: 'hsl(var(--foreground))' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Sliders + side info */}
              <div className="flex-1 space-y-4">
                {selectedItems.map((item, i) => (
                  <div key={item.key} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                        <span className="text-xs font-sans text-foreground">{item.label}</span>
                      </div>
                      <span className="text-xs font-sans font-bold text-foreground w-10 text-right">
                        {Math.round(((store.pourcentages[item.key] || 10) / totalPercent) * 100)}%
                      </span>
                    </div>
                    <Slider
                      value={[store.pourcentages[item.key] || 10]}
                      onValueChange={([v]) => handlePercentChange(item.key, v)}
                      min={10}
                      max={100}
                      step={10}
                      className="w-full"
                    />
                  </div>
                ))}

                {/* Side info tags */}
                {store.tailleOperations.length > 0 && (
                  <div className="pt-3 border-t border-border">
                    <div className="flex flex-wrap gap-1.5">
                      {store.tailleOperations.map(t => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded-sm bg-secondary text-foreground border border-border">{t}</span>
                      ))}
                    </div>
                  </div>
                )}
                {store.typesClients.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {store.typesClients.map(c => (
                      <span key={c} className="text-[10px] px-2 py-0.5 rounded-sm bg-secondary text-foreground border border-border">{c}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Taille des opérations */}
        <div>
          <Label className="font-sans text-xs font-light text-muted-foreground uppercase tracking-wider mb-3 block">Taille des opérations</Label>
          <ChipSelector
            options={TAILLE_OPERATIONS}
            selected={store.tailleOperations}
            onChange={v => store.setField('tailleOperations', v)}
          />
        </div>

        {/* Anglais */}
        <div>
          <Label className="font-sans text-xs font-light text-muted-foreground uppercase tracking-wider">Niveau d'anglais *</Label>
          <Select value={store.anglais} onValueChange={v => store.setField('anglais', v)}>
            <SelectTrigger className="mt-2"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
            <SelectContent>
              {ANGLAIS_OPTIONS.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Types clients */}
        <div>
          <Label className="font-sans text-xs font-light text-muted-foreground uppercase tracking-wider mb-3 block">Types de clients</Label>
          <ChipSelector
            options={TYPES_CLIENTS}
            selected={store.typesClients}
            onChange={v => store.setField('typesClients', v)}
          />
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={store.prevStep} className="font-sans font-light rounded-sm gap-2">
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
          <Button onClick={store.nextStep} disabled={!hasActivites} className="bg-foreground text-background hover:bg-foreground/90 font-sans font-medium rounded-sm gap-2">
            Continuer
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default Step3Activity;
