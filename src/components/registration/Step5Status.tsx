import { motion } from 'framer-motion';
import { useRegistrationStore } from '@/stores/registrationStore';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import FileDropzone from '@/components/shared/FileDropzone';
import { Eye, EyeOff, Zap } from 'lucide-react';

const Step5Status = () => {
  const store = useRegistrationStore();

  const canProceed = store.statutEcoute !== '' && store.visibilite !== '' && store.consentement;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 0.68, 0, 1.2] }}
      className="max-w-2xl mx-auto px-4 py-8"
    >
      <h2 className="text-3xl font-serif text-foreground mb-2">Statut & visibilité</h2>
      <p className="text-muted-foreground font-sans mb-8">Définissez votre disponibilité et le niveau de confidentialité souhaité.</p>

      <div className="space-y-8">
        {/* Statut d'écoute */}
        <div>
          <Label className="font-sans text-sm font-semibold mb-4 block">Statut d'écoute</Label>
          <RadioGroup
            value={store.statutEcoute}
            onValueChange={v => store.setField('statutEcoute', v as 'actif' | 'passif' | 'inactif')}
            className="space-y-3"
          >
            <label className="flex items-start gap-3 p-4 rounded-xl border border-border hover:border-primary/30 transition-colors cursor-pointer">
              <RadioGroupItem value="actif" className="mt-0.5" />
              <div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-carter-red" />
                  <span className="font-sans font-semibold text-sm">Actif</span>
                </div>
                <p className="text-xs text-muted-foreground font-sans mt-1">Je recherche activement une nouvelle opportunité</p>
              </div>
            </label>
            <label className="flex items-start gap-3 p-4 rounded-xl border border-border hover:border-primary/30 transition-colors cursor-pointer">
              <RadioGroupItem value="passif" className="mt-0.5" />
              <div>
                <span className="font-sans font-semibold text-sm">Passif</span>
                <p className="text-xs text-muted-foreground font-sans mt-1">Ouvert aux opportunités mais pas en recherche active</p>
              </div>
            </label>
            <label className="flex items-start gap-3 p-4 rounded-xl border border-border hover:border-primary/30 transition-colors cursor-pointer">
              <RadioGroupItem value="inactif" className="mt-0.5" />
              <div>
                <span className="font-sans font-semibold text-sm">Inactif</span>
                <p className="text-xs text-muted-foreground font-sans mt-1">Je ne souhaite pas être contacté pour le moment</p>
              </div>
            </label>
          </RadioGroup>
        </div>

        {/* Visibilité */}
        <div>
          <Label className="font-sans text-sm font-semibold mb-4 block">Niveau de visibilité</Label>
          <RadioGroup
            value={store.visibilite}
            onValueChange={v => store.setField('visibilite', v as 'confidentiel' | 'partiel')}
            className="space-y-3"
          >
            <label className="flex items-start gap-3 p-4 rounded-xl border border-border hover:border-primary/30 transition-colors cursor-pointer">
              <RadioGroupItem value="confidentiel" className="mt-0.5" />
              <div>
                <div className="flex items-center gap-2">
                  <EyeOff className="w-4 h-4 text-muted-foreground" />
                  <span className="font-sans font-semibold text-sm">Confidentiel</span>
                </div>
                <p className="text-xs text-muted-foreground font-sans mt-1">Profil visible uniquement par Carter. Aucun cabinet ne peut consulter votre profil.</p>
              </div>
            </label>
            <label className="flex items-start gap-3 p-4 rounded-xl border border-border hover:border-primary/30 transition-colors cursor-pointer">
              <RadioGroupItem value="partiel" className="mt-0.5" />
              <div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-carter-red" />
                  <span className="font-sans font-semibold text-sm">Partiel (anonymisé)</span>
                </div>
                <p className="text-xs text-muted-foreground font-sans mt-1">Profil anonymisé visible par les cabinets partenaires. Ni votre nom, ni votre cabinet ne seront communiqués.</p>
              </div>
            </label>
          </RadioGroup>
        </div>

        {/* CV */}
        <div>
          <Label className="font-sans text-sm font-semibold mb-3 block">CV (optionnel)</Label>
          <FileDropzone
            file={store.cvFile}
            onFileChange={f => store.setField('cvFile', f)}
          />
        </div>

        {/* Consentement RGPD */}
        <div className="carter-card p-6">
          <div className="flex items-start gap-3">
            <Checkbox
              id="consent"
              checked={store.consentement}
              onCheckedChange={v => store.setField('consentement', v as boolean)}
              className="mt-0.5"
            />
            <label htmlFor="consent" className="text-sm font-sans text-muted-foreground cursor-pointer">
              J'accepte que mes données soient traitées par Carter dans le cadre de ma recherche professionnelle, conformément à la politique de confidentialité et au RGPD. Je peux demander la suppression de mon compte et de mes données à tout moment.
            </label>
          </div>
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

export default Step5Status;
