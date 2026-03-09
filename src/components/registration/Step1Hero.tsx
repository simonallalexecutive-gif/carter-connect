import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useRegistrationStore } from '@/stores/registrationStore';
import { ArrowRight } from 'lucide-react';

const Step1Hero = () => {
  const nextStep = useRegistrationStore(s => s.nextStep);

  return (
    <div className="min-h-screen gradient-dark flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
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
            onClick={nextStep}
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
    </div>
  );
};

export default Step1Hero;
