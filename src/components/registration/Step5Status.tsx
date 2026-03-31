import { motion } from 'motion/react';
import { useRegistrationStore } from '@/stores/registrationStore';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, ArrowRight, Plus, FileText, X, ShieldCheck } from 'lucide-react';
import { useRef } from 'react';

const Step5Status = () => {
  const store = useRegistrationStore();
  const isAdmin = store.isAdminMode;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canProceed = store.statutEcoute !== '' && store.visibilite !== '' &&
    (isAdmin || (store.consentement && store.consentementExactitude && store.consentementMiseEnRelation));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    store.setField('cvFile', file);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-2xl mx-auto px-6 py-10"
    >
      <div className="carter-divider mb-6" />
      <h2 className="text-3xl font-serif text-foreground mb-2 font-normal tracking-[-0.02em]">Statut & visibilité</h2>
      <p className="text-muted-foreground font-sans text-sm font-light mb-10">Définissez votre disponibilité et le niveau de confidentialité souhaité.</p>

      <div className="space-y-10">
        {/* Statut d'écoute */}
        <div>
          <Label className="font-sans text-xs font-light text-muted-foreground uppercase tracking-wider mb-4 block">Statut d'écoute</Label>
          <RadioGroup
            value={store.statutEcoute}
            onValueChange={v => store.setField('statutEcoute', v as 'actif' | 'passif' | 'inactif')}
            className="space-y-3"
          >
            {[
              { value: 'actif', label: 'Je suis en recherche active', desc: 'Je recherche activement une nouvelle opportunité' },
              { value: 'passif', label: 'Je reste à l\'écoute', desc: 'Ouvert aux opportunités mais pas en recherche active' },
            ].map(opt => (
              <label key={opt.value} className="flex items-start gap-3 p-5 rounded-sm border border-border hover:border-accent/30 transition-colors duration-300 cursor-pointer bg-card">
                <RadioGroupItem value={opt.value} className="mt-0.5" />
                <div>
                  <span className="font-sans font-medium text-sm">{opt.label}</span>
                  <p className="text-xs text-muted-foreground font-sans font-light mt-1">{opt.desc}</p>
                </div>
              </label>
            ))}
          </RadioGroup>
        </div>

        {/* Visibilité */}
        <div>
          <Label className="font-sans text-xs font-light text-muted-foreground uppercase tracking-wider mb-4 block">Niveau de visibilité</Label>
          <RadioGroup
            value={store.visibilite}
            onValueChange={v => store.setField('visibilite', v as 'confidentiel' | 'semi-confidentiel')}
            className="space-y-3"
          >
            <label className="flex items-start gap-3 p-5 rounded-sm border border-border hover:border-accent/30 transition-colors duration-300 cursor-pointer bg-card">
              <RadioGroupItem value="confidentiel" className="mt-0.5" />
              <div>
                <span className="font-sans font-medium text-sm">Confidentiel – fermé</span>
                <p className="text-xs text-muted-foreground font-sans font-light mt-1">Profil fermé aux cabinets, visible uniquement par Logan.</p>
              </div>
            </label>
            <label className="flex items-start gap-3 p-5 rounded-sm border border-border hover:border-accent/30 transition-colors duration-300 cursor-pointer bg-card">
              <RadioGroupItem value="semi-confidentiel" className="mt-0.5" />
              <div>
                <span className="font-sans font-medium text-sm">Confidentiel – ouvert</span>
                <p className="text-xs text-muted-foreground font-sans font-light mt-1.5 leading-relaxed">
                  Profil strictement anonymisé accessible aux cabinets. Votre identité est protégée et n'est jamais communiquée sans votre accord. Logan reste votre unique interlocuteur.
                </p>
              </div>
            </label>
          </RadioGroup>
        </div>

        {/* CV — discreet inline */}
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label className="font-sans text-xs font-light text-muted-foreground uppercase tracking-wider">CV</Label>
              <span className="text-[10px] text-muted-foreground/60 font-sans font-light">optionnel</span>
            </div>
            {!store.cvFile && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 text-xs font-sans font-light text-muted-foreground hover:text-foreground transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Ajouter
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="hidden"
          />
          {store.cvFile && (
            <div className="flex items-center gap-2 mt-2 px-3 py-2 rounded-sm border border-border bg-card">
              <FileText className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs font-sans font-light text-foreground truncate flex-1">{store.cvFile.name}</span>
              <button type="button" onClick={() => store.setField('cvFile', null)} className="text-muted-foreground hover:text-foreground">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          <div className="flex items-start gap-1.5 mt-2">
            <ShieldCheck className="w-3 h-3 text-muted-foreground/50 mt-0.5 shrink-0" />
            <p className="text-[10px] text-muted-foreground/60 font-sans font-light leading-relaxed">
              Logan s'engage à ne jamais transmettre votre CV sans votre accord explicite.
            </p>
          </div>
        </div>

        {/* Consentements — hidden in admin mode */}
        {!isAdmin && (
        <div className="carter-card p-8 space-y-5">
          <div>
            <p className="carter-label mb-2">Engagement</p>
            <h3 className="font-serif text-xl text-foreground font-normal">Consentements</h3>
          </div>

          {[
            { id: 'consentExact', field: 'consentementExactitude' as const, text: 'Je confirme que toutes les informations renseignées sont exactes et à jour.' },
            { id: 'consentMER', field: 'consentementMiseEnRelation' as const, text: 'J\'autorise Logan à utiliser mon profil pour des mises en relation confidentielles, avec mon accord préalable systématique avant toute transmission.' },
            { id: 'consent', field: 'consentement' as const, text: 'J\'accepte que mes données soient traitées par Logan conformément à la politique de confidentialité et au RGPD. Je peux demander la suppression de mon compte et de mes données à tout moment.' },
          ].map(consent => (
            <div key={consent.id} className="flex items-start gap-3">
              <Checkbox
                id={consent.id}
                checked={store[consent.field] as boolean}
                onCheckedChange={v => store.setField(consent.field, v as boolean)}
                className="mt-0.5"
              />
              <label htmlFor={consent.id} className="text-sm font-sans font-light text-muted-foreground cursor-pointer leading-relaxed">
                {consent.text}
              </label>
            </div>
          ))}
        </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6">
          <Button variant="outline" onClick={store.prevStep} className="font-sans font-light rounded-sm gap-2">
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
          <Button onClick={store.nextStep} disabled={!canProceed} className="bg-foreground text-background hover:bg-foreground/90 font-sans font-medium rounded-sm gap-2">
            Continuer
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default Step5Status;
