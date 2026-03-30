import { motion } from 'motion/react';
import { useRegistrationStore } from '@/stores/registrationStore';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const PRIORITIES = [
  'Rémunération',
  'Flexibilité et organisation du travail',
  'Équilibre entre vie professionnelle et personnelle',
  'Perspectives d\'évolution',
  'Développement des compétences et autonomie',
  'Qualité du management',
  'Nature de la pratique',
  'Ambiance et esprit d\'équipe',
  'Qualité des dossiers',
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
      className="max-w-xl mx-auto px-6 py-10"
    >
      <div className="carter-divider mb-6" />

      <h2 className="text-3xl font-serif text-foreground mb-2 font-normal tracking-[-0.02em]">
        Vos priorités pour votre prochain move
      </h2>
      <p className="text-muted-foreground font-sans text-sm font-light mb-8">
        Sélectionnez jusqu'à {MAX_SELECT} critères qui comptent le plus pour vous.
      </p>

      <div className="flex flex-wrap gap-3 justify-center">
        {PRIORITIES.map((item, i) => {
          const isSelected = selected.includes(item);
          const isDisabled = !isSelected && selected.length >= MAX_SELECT;

          return (
            <motion.button
              key={item}
              type="button"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              onClick={() => !isDisabled && toggle(item)}
              disabled={isDisabled}
              className={cn(
                "relative px-5 py-3 rounded-full text-sm font-sans font-light border transition-all duration-200 select-none",
                isSelected
                  ? "bg-foreground text-background border-foreground shadow-md"
                  : isDisabled
                    ? "border-border/40 text-muted-foreground/40 cursor-not-allowed"
                    : "border-border hover:border-foreground/40 text-foreground cursor-pointer hover:shadow-sm"
              )}
            >
              <span className="flex items-center gap-2">
                {isSelected && <Check className="w-3.5 h-3.5" />}
                {item}
              </span>
            </motion.button>
          );
        })}
      </div>

      <div className="text-center mt-6">
        <span className="text-xs font-sans font-light text-muted-foreground">
          {selected.length}/{MAX_SELECT} sélectionnés
        </span>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-10">
        <Button variant="outline" onClick={store.prevStep} className="font-sans font-light rounded-sm gap-2">
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Button>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={store.nextStep} className="font-sans font-light text-muted-foreground text-xs rounded-sm">
            Passer cette étape
          </Button>
          <Button onClick={store.nextStep} className="bg-foreground text-background hover:bg-foreground/90 font-sans font-medium rounded-sm gap-2">
            Continuer
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default Step4Project;
