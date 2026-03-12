import { motion } from 'framer-motion';
import { useRegistrationStore } from '@/stores/registrationStore';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ChipSelector from '@/components/shared/ChipSelector';
import { ANGLAIS_OPTIONS, TYPES_CLIENTS, ACTIVITES_BY_PRACTICE, ACTIVITES_DEFAULT } from '@/lib/constants';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useMemo } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

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

  const hasActivites = Object.values(store.activites).some(Boolean);

  const chartData = useMemo(() => {
    return allItems
      .filter(item => store.activites[item.key])
      .map(item => ({
        name: item.label,
        value: store.pourcentages[item.key] || 10,
      }));
  }, [store.activites, store.pourcentages, allItems]);

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
          ? `Décrivez votre pratique en ${store.departement}.`
          : 'Décrivez votre pratique et vos domaines d\'expertise.'}
      </p>

      <div className="space-y-10">
        {/* Activities by section */}
        <div>
          <Label className="font-sans text-xs font-light text-muted-foreground uppercase tracking-wider mb-4 block">Domaines d'activité *</Label>
          <div className="space-y-8">
            {practiceActivities.sections.map(section => (
              <div key={section.title}>
                <h4 className="carter-label mb-4">{section.title}</h4>
                <div className="space-y-3">
                  {section.items.map(item => {
                    const isActive = store.activites[item.key];
                    return (
                      <div key={item.key} className="space-y-2">
                        <button
                          type="button"
                          onClick={() => handleToggle(item.key)}
                          className={cn(
                            "px-4 py-2.5 rounded-sm text-sm font-sans font-light transition-all duration-300 border",
                            isActive
                              ? "bg-foreground text-background border-foreground"
                              : "bg-transparent text-foreground border-border hover:border-accent/40"
                          )}
                        >
                          {item.label}
                          {isActive && store.pourcentages[item.key] ? ` — ${store.pourcentages[item.key]}%` : ''}
                        </button>
                        {isActive && (
                          <div className="flex items-center gap-3 pl-2 animate-fade-in">
                            <Slider
                              value={[store.pourcentages[item.key] || 10]}
                              onValueChange={([v]) => handlePercentChange(item.key, v)}
                              min={10}
                              max={100}
                              step={10}
                              className="w-48"
                            />
                            <span className="text-xs font-sans text-muted-foreground w-10 text-right">
                              {store.pourcentages[item.key] || 10}%
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity chart */}
        {chartData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="carter-card p-8"
          >
            <p className="carter-label mb-6">Répartition de votre activité</p>
            <div className="flex items-start gap-8">
              <div className="w-44 h-44 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      dataKey="value"
                      paddingAngle={2}
                    >
                      {chartData.map((_, index) => (
                        <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [`${Math.round((value / totalPercent) * 100)}%`, '']}
                      contentStyle={{ fontSize: '12px', fontFamily: 'Inter', background: 'hsl(30 8% 10%)', border: '1px solid hsl(30 8% 18%)', borderRadius: '4px', color: 'hsl(38 40% 92%)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  {chartData.map((item, i) => (
                    <div key={item.name} className="flex items-center gap-3 text-sm font-sans font-light">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                      <span className="text-foreground">{item.name}</span>
                      <span className="text-muted-foreground ml-auto text-xs">{Math.round((item.value / totalPercent) * 100)}%</span>
                    </div>
                  ))}
                </div>
                {/* Side info: taille opérations, clients */}
                {(store.tailleOperations.length > 0 || store.typesClients.length > 0) && (
                  <div className="pt-3 border-t border-border space-y-2">
                    {store.tailleOperations.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {store.tailleOperations.map(t => (
                          <span key={t} className="text-[10px] px-2 py-0.5 rounded-sm bg-secondary text-foreground border border-border">{t}</span>
                        ))}
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
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Anglais */}
        <div>
          <Label className="font-sans text-xs font-light text-muted-foreground uppercase tracking-wider">Niveau d'anglais</Label>
          <Select value={store.anglais} onValueChange={v => store.setField('anglais', v)}>
            <SelectTrigger className="mt-2"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
            <SelectContent>
              {ANGLAIS_OPTIONS.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Types clients */}
        <div>
          <Label className="font-sans text-xs font-light text-muted-foreground uppercase tracking-wider mb-4 block">Types de clients</Label>
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
