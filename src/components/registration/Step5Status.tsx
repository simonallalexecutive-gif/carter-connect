import { motion } from 'framer-motion';
import { useRegistrationStore } from '@/stores/registrationStore';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import FileDropzone from '@/components/shared/FileDropzone';
import { Eye, EyeOff, Zap, ShieldCheck, Bell, MessageSquare, Handshake } from 'lucide-react';

const Step5Status = () => {
  const store = useRegistrationStore();

  const canProceed = store.statutEcoute !== '' && store.visibilite !== '' &&
    store.consentement && store.consentementExactitude && store.consentementMiseEnRelation;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 0.68, 0, 1.2] }}
      className="max-w-2xl mx-auto px-4 py-8"
    >
      <h2 className="text-3xl font-serif text-foreground mb-2">Statut & visibilité</h2>
      <p className="text-muted-foreground font-sans font-light mb-8">Définissez votre disponibilité et le niveau de confidentialité souhaité.</p>

      <div className="space-y-8">
        {/* How it works — Confidentiality workflow */}
        <div className="carter-card-elevated p-6 space-y-4 border-carter-accent/20">
          <h3 className="font-serif text-lg text-foreground">Comment ça fonctionne</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-carter-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bell className="w-4 h-4 text-carter-accent" />
              </div>
              <div>
                <p className="font-sans text-sm font-medium text-foreground">1. Notification confidentielle</p>
                <p className="font-sans text-xs font-light text-muted-foreground mt-0.5">
                  Un cabinet manifeste un intérêt pour votre profil. Vous êtes notifié sans que votre identité ne soit révélée.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-carter-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <MessageSquare className="w-4 h-4 text-carter-accent" />
              </div>
              <div>
                <p className="font-sans text-sm font-medium text-foreground">2. Votre décision</p>
                <p className="font-sans text-xs font-light text-muted-foreground mt-0.5">
                  Vous choisissez de répondre favorablement ou non. Par exemple : <em className="text-foreground">"Oui, un échange à ce sujet avec Carter pourrait m'intéresser."</em>
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-carter-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Handshake className="w-4 h-4 text-carter-accent" />
              </div>
              <div>
                <p className="font-sans text-sm font-medium text-foreground">3. Accompagnement Carter</p>
                <p className="font-sans text-xs font-light text-muted-foreground mt-0.5">
                  Carter prend contact avec vous, s'assure de la cohérence de l'opportunité avec votre projet, puis organise la mise en relation et gère le processus jusqu'à son terme.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Statut d'écoute */}
        <div>
          <Label className="font-sans text-sm font-medium mb-4 block">Statut d'écoute</Label>
          <RadioGroup
            value={store.statutEcoute}
            onValueChange={v => store.setField('statutEcoute', v as 'actif' | 'passif' | 'inactif')}
            className="space-y-3"
          >
            <label className="flex items-start gap-3 p-4 rounded-xl border border-border hover:border-carter-accent/30 transition-colors cursor-pointer">
              <RadioGroupItem value="actif" className="mt-0.5" />
              <div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-carter-accent" />
                  <span className="font-sans font-medium text-sm">Actif</span>
                </div>
                <p className="text-xs text-muted-foreground font-sans font-light mt-1">Je recherche activement une nouvelle opportunité</p>
              </div>
            </label>
            <label className="flex items-start gap-3 p-4 rounded-xl border border-border hover:border-carter-accent/30 transition-colors cursor-pointer">
              <RadioGroupItem value="passif" className="mt-0.5" />
              <div>
                <span className="font-sans font-medium text-sm">Passif</span>
                <p className="text-xs text-muted-foreground font-sans font-light mt-1">Ouvert aux opportunités mais pas en recherche active</p>
              </div>
            </label>
            <label className="flex items-start gap-3 p-4 rounded-xl border border-border hover:border-carter-accent/30 transition-colors cursor-pointer">
              <RadioGroupItem value="inactif" className="mt-0.5" />
              <div>
                <span className="font-sans font-medium text-sm">Inactif</span>
                <p className="text-xs text-muted-foreground font-sans font-light mt-1">Je ne souhaite pas être contacté pour le moment</p>
              </div>
            </label>
          </RadioGroup>
        </div>

        {/* Visibilité */}
        <div>
          <Label className="font-sans text-sm font-medium mb-4 block">Niveau de visibilité</Label>
          <RadioGroup
            value={store.visibilite}
            onValueChange={v => store.setField('visibilite', v as 'confidentiel' | 'partiel')}
            className="space-y-3"
          >
            <label className="flex items-start gap-3 p-4 rounded-xl border border-border hover:border-carter-accent/30 transition-colors cursor-pointer">
              <RadioGroupItem value="confidentiel" className="mt-0.5" />
              <div>
                <div className="flex items-center gap-2">
                  <EyeOff className="w-4 h-4 text-muted-foreground" />
                  <span className="font-sans font-medium text-sm">Confidentiel</span>
                </div>
                <p className="text-xs text-muted-foreground font-sans font-light mt-1">Profil visible uniquement par Carter. Aucun cabinet ne peut consulter votre profil.</p>
              </div>
            </label>
            <label className="flex items-start gap-3 p-4 rounded-xl border border-border hover:border-carter-accent/30 transition-colors cursor-pointer">
              <RadioGroupItem value="partiel" className="mt-0.5" />
              <div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-carter-accent" />
                  <span className="font-sans font-medium text-sm">Partiel (anonymisé)</span>
                </div>
                <p className="text-xs text-muted-foreground font-sans font-light mt-1">Profil anonymisé visible par les cabinets partenaires. Ni votre nom, ni votre cabinet ne seront communiqués.</p>
              </div>
            </label>
          </RadioGroup>
        </div>

        {/* CV */}
        <div>
          <Label className="font-sans text-sm font-medium mb-3 block">CV (optionnel)</Label>
          <FileDropzone
            file={store.cvFile}
            onFileChange={f => store.setField('cvFile', f)}
          />
        </div>

        {/* Consentements */}
        <div className="carter-card p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-5 h-5 text-carter-accent" />
            <h3 className="font-serif text-lg text-foreground">Engagements & consentements</h3>
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              id="consentExact"
              checked={store.consentementExactitude}
              onCheckedChange={v => store.setField('consentementExactitude', v as boolean)}
              className="mt-0.5"
            />
            <label htmlFor="consentExact" className="text-sm font-sans font-light text-muted-foreground cursor-pointer">
              Je confirme que toutes les informations renseignées sont exactes et à jour.
            </label>
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              id="consentMER"
              checked={store.consentementMiseEnRelation}
              onCheckedChange={v => store.setField('consentementMiseEnRelation', v as boolean)}
              className="mt-0.5"
            />
            <label htmlFor="consentMER" className="text-sm font-sans font-light text-muted-foreground cursor-pointer">
              J'autorise Carter à utiliser mon profil pour des mises en relation confidentielles, avec mon accord préalable systématique avant toute transmission.
            </label>
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              id="consent"
              checked={store.consentement}
              onCheckedChange={v => store.setField('consentement', v as boolean)}
              className="mt-0.5"
            />
            <label htmlFor="consent" className="text-sm font-sans font-light text-muted-foreground cursor-pointer">
              J'accepte que mes données soient traitées par Carter conformément à la politique de confidentialité et au RGPD. Je peux demander la suppression de mon compte et de mes données à tout moment.
            </label>
          </div>
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

export default Step5Status;
