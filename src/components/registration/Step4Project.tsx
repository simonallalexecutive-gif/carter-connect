import { motion, AnimatePresence } from 'motion/react';
import { useRegistrationStore } from '@/stores/registrationStore';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const PRIORITIES = [
  'Rémunération',
  'Flexibilité et organisation',
  'Équilibre pro/perso',
  'Perspectives',
  'Responsabilité et autonomie',
  'Qualité du management',
  'Pratique et dossiers',
  'Ambiance et esprit d\'équipe',
  'Formation et encadrement',
];

const MAX_SELECT = 3;

const Step4Project = () => {
  const store = useRegistrationStore();
  const selected: string[] = store.movePriorities;

  const toggle = (item: string) => {
    if (selected.includes(item)) {
      store.setField('movePriorities', selected.filter(s => s !== item));
    } else if (selected.length < MAX_SELECT) {
      store.setField('movePriorities', [...selected, item]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-[780px] mx-auto"
    >
      

      <div className="text-[9px] font-bold text-muted-foreground tracking-[0.16em] uppercase mb-3 flex items-center gap-2">
        <span className="w-5 h-[1.5px] bg-foreground rounded-sm" />
        Étape 3 / 5
      </div>
      <h2 className="font-sans text-3xl md:text-4xl font-normal text-foreground leading-tight mb-2.5">
        Vos priorités, vos exigences.
      </h2>
      <p className="text-muted-foreground font-sans text-sm font-light mb-8">
        Sélectionnez jusqu'à {MAX_SELECT} critères qui comptent le plus pour vous.
      </p>

      <div className="grid grid-cols-3 gap-3">
        {PRIORITIES.map((item, i) => {
          const isSelected = selected.includes(item);
          const isDisabled = !isSelected && selected.length >= MAX_SELECT;

          return (
            <motion.button
              key={item}
              type="button"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: i * 0.035 }}
              onClick={() => !isDisabled && toggle(item)}
              disabled={isDisabled}
              className={cn(
                "relative px-4 py-4 rounded-xl text-sm font-sans font-light border transition-all duration-200 select-none text-center leading-snug",
                isSelected
                  ? "bg-foreground text-background border-foreground shadow-md scale-[1.02]"
                  : isDisabled
                    ? "border-border/40 text-muted-foreground/40 cursor-not-allowed"
                    : "border-border hover:border-foreground/40 text-foreground cursor-pointer hover:shadow-sm"
              )}
            >
              <span className="flex items-center justify-center gap-1.5">
                {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                {item}
              </span>
            </motion.button>
          );
        })}
      </div>

      <div className="text-center mt-4">
        <span className="text-xs font-sans font-light text-muted-foreground">
          {selected.length}/{MAX_SELECT} sélectionnés
        </span>
      </div>

      {/* Récapitulatif */}
      <AnimatePresence>
        {selected.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-6 rounded-xl border border-border bg-muted/30 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-foreground" />
                <span className="text-sm font-sans font-medium text-foreground">
                  Vos priorités
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {selected.map((item, i) => (
                  <motion.span
                    key={item}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ duration: 0.2, delay: i * 0.05 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-foreground text-background text-xs font-sans font-light"
                  >
                    <Check className="w-3 h-3" />
                    {item}
                  </motion.span>
                ))}
              </div>
              <p className="text-xs font-sans font-light text-muted-foreground mt-3">
                Nous utiliserons ces critères pour vous proposer les meilleures opportunités.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-10">
        <Button variant="outline" onClick={store.prevStep} className="font-sans font-light rounded-sm gap-2">
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Button>
          <Button onClick={store.nextStep} className="bg-foreground text-background hover:bg-foreground/90 font-sans font-medium rounded-sm gap-2">
            Continuer
            <ArrowRight className="w-4 h-4" />
          </Button>
      </div>
    </motion.div>
  );
};

export default Step4Project;
