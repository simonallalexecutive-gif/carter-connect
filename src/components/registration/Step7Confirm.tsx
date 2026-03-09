import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, Mail } from 'lucide-react';
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
    <div className="min-h-screen gradient-dark flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center max-w-lg"
      >
        <span className="font-serif text-xl tracking-[-0.02em] text-foreground block mb-12">Logan</span>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-8"
        >
          <Check className="w-8 h-8 text-accent" />
        </motion.div>

        <h1 className="text-3xl md:text-4xl font-serif font-normal text-foreground mb-4 tracking-[-0.02em]">
          Profil soumis avec succès
        </h1>

        <p className="text-base text-muted-foreground font-sans font-light mb-8 leading-relaxed">
          Votre profil sera examiné par l'équipe Logan sous <strong className="text-foreground font-medium">48 heures ouvrées</strong>.
        </p>

        <div className="rounded-sm p-6 text-left mb-10 bg-card border border-border">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-accent mt-0.5" />
            <p className="text-sm font-sans font-light text-muted-foreground leading-relaxed">
              Un email de confirmation vous a été envoyé. Vous recevrez une notification dès que votre profil sera validé.
            </p>
          </div>
        </div>

        <Button
          onClick={handleGoHome}
          variant="outline"
          className="font-sans font-light rounded-sm border-border text-foreground hover:bg-card"
        >
          Retour à l'accueil
        </Button>
      </motion.div>
    </div>
  );
};

export default Step7Confirm;
