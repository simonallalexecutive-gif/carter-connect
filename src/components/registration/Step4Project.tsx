import { motion, AnimatePresence } from 'motion/react';
import { useRegistrationStore } from '@/stores/registrationStore';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight, Clock, Target, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Category {
  id: string;
  title: string;
  storeKey: 'moveRemuneration' | 'moveEvolution' | 'moveManagement' | 'moveExposition' | 'moveCulture';
  maxSelect: number;
  options: string[];
}

const CATEGORIES: Category[] = [
  {
    id: 'remuneration',
    title: 'Rémunération & conditions de travail',
    storeKey: 'moveRemuneration',
    maxSelect: 2,
    options: [
      'Une rémunération plus élevée',
      'Plus de flexibilité (télétravail, horaires)',
      'Un meilleur équilibre vie pro / vie perso',
    ],
  },
  {
    id: 'evolution',
    title: 'Évolution & développement professionnel',
    storeKey: 'moveEvolution',
    maxSelect: 2,
    options: [
      'De meilleures perspectives d\'évolution',
      'Monter plus rapidement en compétences',
      'Gagner en autonomie',
    ],
  },
  {
    id: 'management',
    title: 'Management & organisation interne',
    storeKey: 'moveManagement',
    maxSelect: 2,
    options: [
      'Un management de meilleure qualité',
      'Une communication interne plus fluide',
      'Une taille d\'équipe mieux adaptée',
    ],
  },
  {
    id: 'exposition',
    title: 'Exposition & type de pratique',
    storeKey: 'moveExposition',
    maxSelect: 2,
    options: [
      'Plus de contact direct avec les clients',
      'Un environnement plus international',
      'Davantage de conseil (vs contentieux)',
      'Davantage de contentieux (vs conseil)',
    ],
  },
  {
    id: 'culture',
    title: 'Culture & environnement de travail',
    storeKey: 'moveCulture',
    maxSelect: 2,
    options: [
      'Une culture et des valeurs plus alignées',
      'Une meilleure ambiance / esprit d\'équipe',
      'Des dossiers plus intéressants et variés',
    ],
  },
];

const CategoryCard = ({ category, index }: { category: Category; index: number }) => {
  const store = useRegistrationStore();
  const selected: string[] = store[category.storeKey] as string[];
  const priorities: string[] = store.movePriorities;
  const isPriority = priorities.includes(category.id);

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      store.setField(category.storeKey, selected.filter(o => o !== option));
    } else if (selected.length < category.maxSelect) {
      store.setField(category.storeKey, [...selected, option]);
    }
  };

  const togglePriority = () => {
    if (isPriority) {
      store.setField('movePriorities', priorities.filter(p => p !== category.id));
    } else {
      store.setField('movePriorities', [...priorities, category.id]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="carter-card p-5 space-y-4"
    >
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-serif text-base text-foreground font-normal tracking-[-0.01em]">
          <span className="text-muted-foreground/60 mr-2">{index + 1}.</span>
          {category.title}
        </h3>
        <span className="text-[11px] text-muted-foreground font-sans font-light whitespace-nowrap">
          {selected.length}/{category.maxSelect}
        </span>
      </div>

      <div className="space-y-1.5">
        {category.options.map(option => {
          const isSelected = selected.includes(option);
          const isDisabled = !isSelected && selected.length >= category.maxSelect;

          return (
            <button
              key={option}
              type="button"
              onClick={() => !isDisabled && toggleOption(option)}
              disabled={isDisabled}
              className={cn(
                "w-full text-left px-4 py-2.5 rounded-md text-sm font-sans font-light transition-all duration-200 flex items-center gap-3 border",
                isSelected
                  ? "bg-foreground text-background border-foreground"
                  : isDisabled
                    ? "border-border/40 text-muted-foreground/40 cursor-not-allowed"
                    : "border-border hover:border-foreground/30 text-foreground cursor-pointer"
              )}
            >
              <span className={cn(
                "flex-shrink-0 w-4 h-4 rounded-full border flex items-center justify-center transition-all",
                isSelected ? "border-background bg-background" : "border-current opacity-30"
              )}>
                {isSelected && <Check className="w-2.5 h-2.5 text-foreground" />}
              </span>
              {option}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2.5 pt-1">
        <Checkbox
          id={`priority-${category.id}`}
          checked={isPriority}
          onCheckedChange={togglePriority}
        />
        <Label
          htmlFor={`priority-${category.id}`}
          className="font-sans text-xs font-light text-muted-foreground cursor-pointer"
        >
          Ce critère est prioritaire pour moi
        </Label>
      </div>
    </motion.div>
  );
};

const Step4Project = () => {
  const store = useRegistrationStore();

  const allSelections = [
    ...store.moveRemuneration,
    ...store.moveEvolution,
    ...store.moveManagement,
    ...store.moveExposition,
    ...store.moveCulture,
  ];

  const totalSelections = allSelections.length;
  const priorityCategories = CATEGORIES.filter(c => store.movePriorities.includes(c.id));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-2xl mx-auto px-6 py-10"
    >
      <div className="carter-divider mb-6" />

      <h2 className="text-3xl font-serif text-foreground mb-2 font-normal tracking-[-0.02em]">
        Construisons votre prochain move idéal
      </h2>
      <p className="text-muted-foreground font-sans text-sm font-light mb-3">
        Sélectionnez ce que vous souhaitez améliorer dans votre prochain cabinet.
      </p>
      <p className="text-muted-foreground font-sans text-xs font-light mb-8">
        👉 Choisissez vos priorités — cela nous permet de vous proposer les meilleures opportunités.
      </p>

      <div className="flex items-center gap-5 mb-8">
        <span className="inline-flex items-center gap-1.5 text-xs font-sans font-light text-muted-foreground bg-secondary px-3 py-1.5 rounded-full">
          <Clock className="w-3 h-3" /> 1 minute
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs font-sans font-light text-muted-foreground bg-secondary px-3 py-1.5 rounded-full">
          <Target className="w-3 h-3" /> 5 choix maximum
        </span>
      </div>

      <div className="space-y-4">
        {CATEGORIES.map((cat, i) => (
          <CategoryCard key={cat.id} category={cat} index={i} />
        ))}
      </div>

      {/* Summary */}
      <AnimatePresence>
        {totalSelections > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8"
          >
            <div className="carter-card p-6 bg-card">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-4 h-4 text-foreground" />
                <p className="font-serif text-base text-foreground font-normal">Votre prochain move idéal</p>
              </div>

              {priorityCategories.length > 0 && (
                <div className="mb-4">
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-sans font-light mb-2">Vos priorités</p>
                  <div className="flex flex-wrap gap-2">
                    {priorityCategories.map(cat => (
                      <span key={cat.id} className="inline-flex items-center gap-1.5 text-xs font-sans font-medium bg-foreground text-background px-3 py-1 rounded-full">
                        <Target className="w-3 h-3" />
                        {cat.title}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                {allSelections.map((sel, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm font-sans font-light text-foreground">
                    <Check className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                    {sel}
                  </div>
                ))}
              </div>

              <p className="text-xs text-muted-foreground font-sans font-light mt-4">
                👉 Nous allons maintenant vous proposer des opportunités alignées avec vos attentes.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-8">
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
