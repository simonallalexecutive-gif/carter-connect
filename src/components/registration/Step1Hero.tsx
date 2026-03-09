import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useRegistrationStore } from '@/stores/registrationStore';
import { Scale } from 'lucide-react';

const Step1Hero = () => {
  const nextStep = useRegistrationStore(s => s.nextStep);

  return (
    <div className="min-h-screen gradient-navy flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 0.68, 0, 1.2] }}
        className="text-center max-w-2xl"
      >
        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-3">
            <Scale className="w-10 h-10 text-carter-accent" />
            <span className="font-sans text-3xl font-light tracking-[0.15em] uppercase text-cream-light">
              Carter
            </span>
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-sans font-extralight text-cream-light mb-6 leading-tight tracking-tight">
          Rejoignez le réseau<br />
          <span className="text-carter-accent font-light">confidentiel</span>
        </h1>
        <p className="text-base md:text-lg text-cream-light/50 font-sans font-light mb-10 max-w-lg mx-auto leading-relaxed">
          La plateforme de mise en relation entre avocats d'affaires et cabinets de premier plan.
        </p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.45 }}
        >
          <Button
            onClick={nextStep}
            size="lg"
            className="bg-carter-accent hover:bg-carter-accent-light text-accent-foreground font-sans text-sm font-medium px-10 py-6 rounded-lg tracking-wide"
          >
            Commencer mon inscription
          </Button>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-xs text-cream-light/30 font-sans font-light tracking-wide"
        >
          Inscription confidentielle · Profil validé sous 48h
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Step1Hero;
