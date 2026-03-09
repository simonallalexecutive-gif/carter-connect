import { motion } from 'framer-motion';
import { useRegistrationStore } from '@/stores/registrationStore';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TagCloud from '@/components/shared/TagCloud';
import ChipSelector from '@/components/shared/ChipSelector';
import { ANGLAIS_OPTIONS, TYPES_CLIENTS } from '@/lib/constants';

const Step3Activity = () => {
  const store = useRegistrationStore();

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 0.68, 0, 1.2] }}
      className="max-w-2xl mx-auto px-4 py-8"
    >
      <h2 className="text-3xl font-serif text-foreground mb-2">Votre activité</h2>
      <p className="text-muted-foreground font-sans mb-8">Décrivez votre pratique et vos domaines d'expertise.</p>

      <div className="space-y-8">
        {/* Activités */}
        <div>
          <Label className="font-sans text-sm font-semibold mb-3 block">Domaines d'activité *</Label>
          <TagCloud
            activites={store.activites}
            pourcentages={store.pourcentages}
            onToggle={handleToggle}
            onPercentChange={handlePercentChange}
          />
        </div>

        {/* Anglais */}
        <div>
          <Label className="font-sans text-sm">Niveau d'anglais</Label>
          <Select value={store.anglais} onValueChange={v => store.setField('anglais', v)}>
            <SelectTrigger className="mt-1"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
            <SelectContent>
              {ANGLAIS_OPTIONS.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Types clients */}
        <div>
          <Label className="font-sans text-sm font-semibold mb-3 block">Types de clients</Label>
          <ChipSelector
            options={TYPES_CLIENTS}
            selected={store.typesClients}
            onChange={v => store.setField('typesClients', v)}
          />
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={store.prevStep} className="font-sans">Retour</Button>
          <Button onClick={store.nextStep} disabled={!hasActivites} className="bg-carter-accent hover:bg-carter-accent-light text-accent-foreground font-sans">
            Continuer
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default Step3Activity;
