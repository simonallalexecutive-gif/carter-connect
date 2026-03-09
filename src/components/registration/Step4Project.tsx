import { motion } from 'framer-motion';
import { useRegistrationStore } from '@/stores/registrationStore';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import ChipSelector from '@/components/shared/ChipSelector';
import AutocompleteInput from '@/components/shared/AutocompleteInput';
import { QUALITES, AXES, NOGO_SUGGESTIONS, CABINETS } from '@/lib/constants';
import { CalendarCheck } from 'lucide-react';

const CRENEAUX_RDV = [
  "Lundi matin", "Lundi après-midi",
  "Mardi matin", "Mardi après-midi",
  "Mercredi matin", "Mercredi après-midi",
  "Jeudi matin", "Jeudi après-midi",
  "Vendredi matin", "Vendredi après-midi",
];

const Step4Project = () => {
  const store = useRegistrationStore();

  const canProceed = store.motivation.length >= 20;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 0.68, 0, 1.2] }}
      className="max-w-2xl mx-auto px-4 py-8"
    >
      <h2 className="text-3xl font-serif text-foreground mb-2">Votre projet</h2>
      <p className="text-muted-foreground font-sans font-light mb-8">Ce que vous recherchez et ce qui vous anime.</p>

      <div className="space-y-8">
        {/* Qualités */}
        <div>
          <Label className="font-sans text-sm font-medium mb-3 block">Qualités appréciées dans un cabinet</Label>
          <ChipSelector
            options={QUALITES}
            selected={store.qualitesAppreciees}
            onChange={v => store.setField('qualitesAppreciees', v)}
            maxSelect={5}
          />
          <p className="text-xs text-muted-foreground font-sans font-light mt-1">Max 5 sélections</p>
        </div>

        {/* Axes */}
        <div>
          <Label className="font-sans text-sm font-medium mb-3 block">Axes d'amélioration souhaités</Label>
          <ChipSelector
            options={AXES}
            selected={store.axesAmelioration}
            onChange={v => store.setField('axesAmelioration', v)}
            maxSelect={4}
          />
        </div>

        {/* Motivation */}
        <div>
          <Label className="font-sans text-sm font-light">Motivation / Contexte de la recherche *</Label>
          <Textarea
            value={store.motivation}
            onChange={e => store.setField('motivation', e.target.value)}
            placeholder="Décrivez votre motivation et le contexte de votre recherche..."
            className="mt-1 min-h-[120px]"
          />
          <p className="text-xs text-muted-foreground font-sans font-light mt-1">{store.motivation.length}/500 caractères</p>
        </div>

        {/* Cabinets cibles */}
        <div>
          <Label className="font-sans text-sm font-medium mb-3 block">Cabinets cibles</Label>
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
          <Label className="font-sans text-sm font-medium mb-3 block">Critères rédhibitoires (No-Go)</Label>
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
          <Label htmlFor="processus" className="font-sans text-sm font-light cursor-pointer">J'ai des processus en cours avec d'autres cabinets</Label>
        </div>

        {/* RDV Carter */}
        <div className="carter-card p-6 space-y-4">
          <div className="flex items-center gap-3">
            <CalendarCheck className="w-5 h-5 text-carter-accent" />
            <h3 className="font-serif text-lg text-foreground">Prendre rendez-vous avec Carter</h3>
          </div>
          <p className="text-sm font-sans font-light text-muted-foreground">
            Un premier échange confidentiel de 30 minutes pour discuter de votre projet et de vos attentes.
          </p>
          <div className="flex items-center gap-3">
            <Checkbox
              id="rdv"
              checked={store.souhaitePrendreRdv}
              onCheckedChange={v => store.setField('souhaitePrendreRdv', v as boolean)}
            />
            <Label htmlFor="rdv" className="font-sans text-sm font-medium cursor-pointer">Je souhaite prendre rendez-vous</Label>
          </div>
          {store.souhaitePrendreRdv && (
            <div>
              <Label className="font-sans text-sm font-light mb-2 block">Créneaux préférés</Label>
              <div className="grid grid-cols-2 gap-2">
                {CRENEAUX_RDV.map(c => (
                  <label key={c} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="creneau"
                      checked={store.creneauPrefere === c}
                      onChange={() => store.setField('creneauPrefere', c)}
                      className="accent-[hsl(var(--carter-accent))]"
                    />
                    <span className="font-sans text-sm font-light">{c}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={store.prevStep} className="font-sans font-light">Retour</Button>
          <Button onClick={store.nextStep} disabled={!canProceed} className="bg-carter-accent hover:bg-carter-accent-light text-accent-foreground font-sans font-medium">
            Continuer
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default Step4Project;
