import { motion } from 'framer-motion';
import { useRegistrationStore } from '@/stores/registrationStore';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import ChipSelector from '@/components/shared/ChipSelector';
import AutocompleteInput from '@/components/shared/AutocompleteInput';
import { QUALITES, AXES, NOGO_SUGGESTIONS, CABINETS } from '@/lib/constants';
import { CalendarIcon, ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useState } from 'react';

const CRENEAUX_HEURES = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00",
];

const Step4Project = () => {
  const store = useRegistrationStore();
  const [rdvDate, setRdvDate] = useState<Date | undefined>();
  const [rdvHeure, setRdvHeure] = useState('');

  const canProceed = true;

  const handleDateSelect = (date: Date | undefined) => {
    setRdvDate(date);
    if (date && rdvHeure) {
      store.setField('creneauPrefere', `${format(date, 'EEEE d MMMM yyyy', { locale: fr })} à ${rdvHeure}`);
    }
  };

  const handleHeureSelect = (heure: string) => {
    setRdvHeure(heure);
    if (rdvDate) {
      store.setField('creneauPrefere', `${format(rdvDate, 'EEEE d MMMM yyyy', { locale: fr })} à ${heure}`);
    }
  };

  const disabledDays = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6 || date < new Date();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-2xl mx-auto px-6 py-10"
    >
      <div className="carter-divider mb-6" />
      <h2 className="text-3xl font-serif text-foreground mb-2 font-normal tracking-[-0.02em]">Votre projet</h2>
      <p className="text-muted-foreground font-sans text-sm font-light mb-10">Ce que vous recherchez et ce qui vous anime.</p>

      <div className="space-y-10">
        {/* Qualités */}
        <div>
          <Label className="font-sans text-xs font-light text-muted-foreground uppercase tracking-wider mb-4 block">Ce que vous appréciez dans votre cabinet actuel</Label>
          <ChipSelector
            options={QUALITES}
            selected={store.qualitesAppreciees}
            onChange={v => store.setField('qualitesAppreciees', v)}
            maxSelect={5}
          />
          <p className="text-xs text-muted-foreground font-sans font-light mt-2">Max 5 sélections</p>
        </div>

        {/* Axes */}
        <div>
          <Label className="font-sans text-xs font-light text-muted-foreground uppercase tracking-wider mb-4 block">Axes d'amélioration souhaités</Label>
          <ChipSelector
            options={AXES}
            selected={store.axesAmelioration}
            onChange={v => store.setField('axesAmelioration', v)}
            maxSelect={4}
          />
        </div>

        {/* Motivation */}
        <div>
          <Label className="font-sans text-xs font-light text-muted-foreground uppercase tracking-wider">Motivation / Contexte</Label>
          <Textarea
            value={store.motivation}
            onChange={e => store.setField('motivation', e.target.value)}
            placeholder="Décrivez votre motivation et le contexte de votre recherche..."
            className="mt-2 min-h-[120px]"
          />
          <p className="text-xs text-muted-foreground font-sans font-light mt-2">{store.motivation.length}/500 caractères</p>
        </div>

        {/* Cabinets cibles */}
        <div>
          <Label className="font-sans text-xs font-light text-muted-foreground uppercase tracking-wider mb-4 block">Cabinets cibles</Label>
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
          <Label className="font-sans text-xs font-light text-muted-foreground uppercase tracking-wider mb-4 block">Critères rédhibitoires (No-Go)</Label>
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
        <div className="carter-card p-8 space-y-6">
          <div>
            <p className="carter-label mb-2">Premier échange</p>
            <h3 className="font-serif text-xl text-foreground font-normal">Prendre rendez-vous avec Logan</h3>
          </div>
          <p className="text-sm font-sans font-light text-muted-foreground">
            Un échange confidentiel de 30 minutes pour discuter de votre projet et de vos attentes.
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
            <div className="space-y-6 animate-fade-in">
              <div>
                <Label className="font-sans text-xs font-light text-muted-foreground uppercase tracking-wider mb-2 block">Choisir une date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-sans font-light rounded-sm",
                        !rdvDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {rdvDate ? format(rdvDate, "EEEE d MMMM yyyy", { locale: fr }) : "Sélectionner une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={rdvDate}
                      onSelect={handleDateSelect}
                      disabled={disabledDays}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {rdvDate && (
                <div className="animate-fade-in">
                  <Label className="font-sans text-xs font-light text-muted-foreground uppercase tracking-wider mb-3 block">Créneau horaire</Label>
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                    {CRENEAUX_HEURES.map(h => (
                      <button
                        key={h}
                        type="button"
                        onClick={() => handleHeureSelect(h)}
                        className={cn(
                          "px-3 py-2 rounded-sm text-sm font-sans font-light border transition-all duration-300",
                          rdvHeure === h
                            ? "bg-foreground text-background border-foreground"
                            : "border-border hover:border-accent/40 text-foreground"
                        )}
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {rdvDate && rdvHeure && (
                <div className="bg-secondary rounded-sm p-4 text-sm font-sans font-light text-foreground animate-fade-in border border-border">
                  <span className="font-medium">Créneau sélectionné :</span>{' '}
                  {format(rdvDate, "EEEE d MMMM yyyy", { locale: fr })} à {rdvHeure}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6">
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

export default Step4Project;
