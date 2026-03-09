import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useRegistrationStore } from '@/stores/registrationStore';
import { ArrowRight, User, Building2 } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const Step1Hero = () => {
  const nextStep = useRegistrationStore(s => s.nextStep);
  const [showChoice, setShowChoice] = useState(false);

  return (
    <div className="min-h-screen gradient-dark flex items-center justify-center px-6">
      <AnimatePresence mode="wait">
        {!showChoice ? (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-2xl"
          >
            <div className="carter-divider mx-auto mb-10" />
            <span className="font-serif text-3xl tracking-[-0.02em] text-foreground block mb-12">
              Carter
            </span>
            <h1 className="text-3xl md:text-5xl font-serif font-normal text-foreground mb-6 leading-tight tracking-[-0.02em]">
              Rejoignez le réseau<br />
              <em className="text-accent font-normal">confidentiel</em>
            </h1>
            <p className="text-base text-muted-foreground font-sans font-light mb-12 max-w-md mx-auto leading-relaxed">
              La plateforme de mise en relation entre avocats d'affaires et cabinets de premier plan.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Button
                onClick={() => setShowChoice(true)}
                size="lg"
                className="bg-foreground text-background hover:bg-foreground/90 font-sans text-sm font-medium px-10 py-6 rounded-sm tracking-wide group"
              >
                Commencer mon inscription
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-10 text-xs text-muted-foreground/50 font-sans font-light tracking-wide"
            >
              Inscription confidentielle · Profil validé sous 48h
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="choice"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-2xl w-full"
          >
            <div className="carter-divider mx-auto mb-10" />
            <span className="font-serif text-3xl tracking-[-0.02em] text-foreground block mb-8">
              Carter
            </span>
            <h2 className="text-2xl md:text-4xl font-serif font-normal text-foreground mb-4 tracking-[-0.02em]">
              Vous êtes
            </h2>
            <p className="text-sm text-muted-foreground font-sans font-light mb-12 max-w-sm mx-auto">
              Sélectionnez votre profil pour accéder à l'espace dédié.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto mb-10">
              {[
                {
                  icon: User,
                  label: 'Candidat',
                  desc: 'Avocat en recherche d\'opportunités',
                  onClick: nextStep,
                },
                {
                  icon: Building2,
                  label: 'Cabinet',
                  desc: 'Cabinet à la recherche de talents',
                  onClick: () => {/* future: navigate to cabinet flow */},
                  disabled: true,
                },
              ].map(opt => (
                <button
                  key={opt.label}
                  onClick={opt.onClick}
                  disabled={opt.disabled}
                  className={cn(
                    "group relative p-8 rounded-sm border text-left transition-all duration-500",
                    opt.disabled
                      ? "border-border/50 opacity-50 cursor-not-allowed"
                      : "border-border hover:border-accent/50 cursor-pointer hover:bg-card/50"
                  )}
                >
                  <opt.icon className="w-6 h-6 text-accent mb-4" />
                  <h3 className="font-serif text-xl text-foreground mb-2 font-normal">{opt.label}</h3>
                  <p className="font-sans text-xs text-muted-foreground font-light leading-relaxed">{opt.desc}</p>
                  {opt.disabled && (
                    <span className="absolute top-4 right-4 text-[10px] font-sans font-medium text-muted-foreground tracking-wider uppercase">Bientôt</span>
                  )}
                  {!opt.disabled && (
                    <ArrowRight className="w-4 h-4 text-accent absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowChoice(false)}
              className="text-xs font-sans font-light text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Retour
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Step1Hero;
