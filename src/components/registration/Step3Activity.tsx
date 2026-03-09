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

const CHART_COLORS = [
  'hsl(210, 55%, 35%)',
  'hsl(220, 62%, 15%)',
  'hsl(210, 45%, 45%)',
  'hsl(220, 56%, 28%)',
  'hsl(210, 35%, 55%)',
  'hsl(220, 40%, 40%)',
  'hsl(210, 25%, 60%)',
  'hsl(220, 30%, 50%)',
];

const Step3Activity = () => {
  const store = useRegistrationStore();

  // Get practice-specific activities
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

  // Chart data
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
      transition={{ duration: 0.55, ease: [0.22, 0.68, 0, 1.2] }}
      className="max-w-2xl mx-auto px-4 py-8"
    >
      <h2 className="text-3xl font-serif text-foreground mb-2">Votre activité</h2>
      <p className="text-muted-foreground font-sans font-light mb-8">
        {store.departement
          ? `Décrivez votre pratique en ${store.departement}.`
          : 'Décrivez votre pratique et vos domaines d\'expertise.'}
      </p>

      <div className="space-y-8">
        {/* Activities by section */}
        <div>
          <Label className="font-sans text-sm font-medium mb-3 block">Domaines d'activité *</Label>
          <div className="space-y-6">
            {practiceActivities.sections.map(section => (
              <div key={section.title}>
                <h4 className="text-xs font-sans font-medium text-muted-foreground uppercase tracking-wider mb-3">{section.title}</h4>
                <div className="space-y-2">
                  {section.items.map(item => {
                    const isActive = store.activites[item.key];
                    return (
                      <div key={item.key} className="space-y-2">
                        <button
                          type="button"
                          onClick={() => handleToggle(item.key)}
                          className={cn(
                            "px-4 py-2.5 rounded-full text-sm font-sans font-light transition-all duration-200 border",
                            isActive
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-popover text-foreground border-border hover:border-primary/40"
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
            className="carter-card p-6"
          >
            <h4 className="font-sans text-sm font-medium mb-4">Répartition de votre activité</h4>
            <div className="flex items-center gap-6">
              <div className="w-40 h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={65}
                      dataKey="value"
                      paddingAngle={2}
                    >
                      {chartData.map((_, index) => (
                        <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [`${Math.round((value / totalPercent) * 100)}%`, '']}
                      contentStyle={{ fontSize: '12px', fontFamily: 'DM Sans' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-1.5">
                {chartData.map((item, i) => (
                  <div key={item.name} className="flex items-center gap-2 text-sm font-sans font-light">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                    <span className="text-foreground">{item.name}</span>
                    <span className="text-muted-foreground ml-auto">{Math.round((item.value / totalPercent) * 100)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Anglais */}
        <div>
          <Label className="font-sans text-sm font-light">Niveau d'anglais</Label>
          <Select value={store.anglais} onValueChange={v => store.setField('anglais', v)}>
            <SelectTrigger className="mt-1"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
            <SelectContent>
              {ANGLAIS_OPTIONS.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Types clients */}
        <div>
          <Label className="font-sans text-sm font-medium mb-3 block">Types de clients</Label>
          <ChipSelector
            options={TYPES_CLIENTS}
            selected={store.typesClients}
            onChange={v => store.setField('typesClients', v)}
          />
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={store.prevStep} className="font-sans font-light">Retour</Button>
          <Button onClick={store.nextStep} disabled={!hasActivites} className="bg-carter-accent hover:bg-carter-accent-light text-accent-foreground font-sans font-medium">
            Continuer
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default Step3Activity;
