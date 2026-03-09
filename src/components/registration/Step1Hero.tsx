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
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-carter-red/20 flex items-center justify-center">
            <Scale className="w-8 h-8 text-carter-red" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-cream-light mb-6 leading-tight">
          Rejoignez le réseau<br />
          <span className="italic text-carter-red">Carter</span>
        </h1>
        <p className="text-lg md:text-xl text-cream-light/70 font-sans font-light mb-10 max-w-lg mx-auto">
          La plateforme confidentielle de mise en relation entre avocats d'affaires et cabinets de premier plan.
        </p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.45 }}
        >
          <Button
            onClick={nextStep}
            size="lg"
            className="bg-carter-red hover:bg-carter-red-light text-accent-foreground font-sans text-base px-10 py-6 rounded-xl"
          >
            Commencer mon inscription
          </Button>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-sm text-cream-light/40 font-sans"
        >
          Inscription confidentielle · Profil validé sous 48h
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Step1Hero;
