import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Mail, Scale } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRegistrationStore } from '@/stores/registrationStore';

const Step7Confirm = () => {
  const navigate = useNavigate();
  const reset = useRegistrationStore(s => s.reset);

  const handleGoHome = () => {
    reset();
    navigate('/');
  };

  return (
    <div className="min-h-screen gradient-navy flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 0.68, 0, 1.2] }}
        className="text-center max-w-lg"
      >
        {/* Carter logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <Scale className="w-7 h-7 text-carter-accent" />
          <span className="font-sans text-xl font-light tracking-[0.15em] uppercase text-cream-light">Carter</span>
        </div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-20 h-20 rounded-full bg-carter-accent/20 flex items-center justify-center mx-auto mb-8"
        >
          <CheckCircle2 className="w-10 h-10 text-carter-accent" />
        </motion.div>

        <h1 className="text-3xl md:text-4xl font-sans font-extralight text-cream-light mb-4 tracking-tight">
          Profil soumis avec succès
        </h1>

        <p className="text-base text-cream-light/50 font-sans font-light mb-6 leading-relaxed">
          Votre profil sera examiné par l'équipe Carter sous <strong className="text-cream-light font-medium">48 heures ouvrées</strong>.
        </p>

        <div className="rounded-xl p-6 text-left mb-8 bg-cream-light/5 border border-cream-light/10">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-carter-accent mt-0.5" />
            <div>
              <p className="text-sm font-sans font-light text-cream-light/70">
                Un email de confirmation vous a été envoyé. Vous recevrez une notification dès que votre profil sera validé.
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={handleGoHome}
          variant="outline"
          className="font-sans font-light border-cream-light/20 text-cream-light hover:bg-cream-light/10"
        >
          Retour à l'accueil
        </Button>
      </motion.div>
    </div>
  );
};

export default Step7Confirm;
