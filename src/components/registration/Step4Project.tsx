import { motion } from 'framer-motion';
import { useRegistrationStore } from '@/stores/registrationStore';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import ChipSelector from '@/components/shared/ChipSelector';
import AutocompleteInput from '@/components/shared/AutocompleteInput';
import { QUALITES, AXES, NOGO_SUGGESTIONS, CABINETS } from '@/lib/constants';

const Step4Project = () => {
  const store = useRegistrationStore();

  const updateBullet = (index: number, value: string) => {
    const newBullets = [...store.bullets];
    newBullets[index] = value;
    store.setField('bullets', newBullets);
  };

  const canProceed = store.motivation.length >= 20;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 0.68, 0, 1.2] }}
      className="max-w-2xl mx-auto px-4 py-8"
    >
      <h2 className="text-3xl font-serif text-foreground mb-2">Votre projet</h2>
      <p className="text-muted-foreground font-sans mb-8">Ce que vous recherchez et ce qui vous motive.</p>

      <div className="space-y-8">
        {/* Qualités */}
        <div>
          <Label className="font-sans text-sm font-semibold mb-3 block">Qualités appréciées dans un cabinet</Label>
          <ChipSelector
            options={QUALITES}
            selected={store.qualitesAppreciees}
            onChange={v => store.setField('qualitesAppreciees', v)}
            maxSelect={5}
          />
          <p className="text-xs text-muted-foreground font-sans mt-1">Max 5 sélections</p>
        </div>

        {/* Axes */}
        <div>
          <Label className="font-sans text-sm font-semibold mb-3 block">Axes d'amélioration souhaités</Label>
          <ChipSelector
            options={AXES}
            selected={store.axesAmelioration}
            onChange={v => store.setField('axesAmelioration', v)}
            maxSelect={4}
          />
        </div>

        {/* Motivation */}
        <div>
          <Label className="font-sans text-sm">Motivation / Contexte de la recherche *</Label>
          <Textarea
            value={store.motivation}
            onChange={e => store.setField('motivation', e.target.value)}
            placeholder="Décrivez votre motivation et le contexte de votre recherche de mobilité..."
            className="mt-1 min-h-[120px]"
          />
          <p className="text-xs text-muted-foreground font-sans mt-1">{store.motivation.length}/500 caractères</p>
        </div>

        {/* Cabinets cibles */}
        <div>
          <Label className="font-sans text-sm font-semibold mb-3 block">Cabinets cibles</Label>
          <AutocompleteInput
            data={CABINETS}
            value={store.cabinetsCibles}
            onChange={v => store.setField('cabinetsCibles', v as string[])}
            placeholder="Ajouter un cabinet..."
            single={false}
            showMeta
          />
        </div>

        {/* No-Go */}
        <div>
          <Label className="font-sans text-sm font-semibold mb-3 block">No-Go (critères rédhibitoires)</Label>
          <ChipSelector
            options={NOGO_SUGGESTIONS}
            selected={store.noGo}
            onChange={v => store.setField('noGo', v)}
          />
        </div>

        {/* Process en cours */}
        <div className="flex items-center gap-3">
          <Checkbox
            id="processus"
            checked={store.processusCours === 'oui'}
            onCheckedChange={v => store.setField('processusCours', v ? 'oui' : '')}
          />
          <Label htmlFor="processus" className="font-sans text-sm cursor-pointer">J'ai des processus en cours avec d'autres cabinets</Label>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={store.prevStep} className="font-sans">Retour</Button>
          <Button onClick={store.nextStep} disabled={!canProceed} className="bg-carter-red hover:bg-carter-red-light text-accent-foreground font-sans">
            Continuer
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default Step4Project;
