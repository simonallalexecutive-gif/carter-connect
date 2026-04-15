import { motion } from 'motion/react';
import { Shield, EyeOff, MessageCircle, UserCheck, Handshake, ArrowRight, Lock, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConfidentialityIntroProps {
  onContinue: () => void;
}

const steps = [
  {
    icon: EyeOff,
    label: 'Profil anonyme',
    description:
      'Nos cabinets partenaires n\'auront pas accès à votre identité ni à celle de votre cabinet actuel. Seules votre séniorité et votre expertise leur sont rendues accessibles.',
  },
  {
    icon: MessageCircle,
    label: 'Logan, seul intermédiaire',
    description:
      'Recevez une notification instantanée lorsqu\'un cabinet manifeste un intérêt pour votre profil : Logan intervient à votre demande pour en discuter et évaluer avec vous la pertinence d\'un rapprochement',
  },
  {
    icon: UserCheck,
    label: 'Vous êtes seul décisionnaire',
    description:
      'Si l\'opportunité vous intéresse, vous autorisez Logan à faire la mise en relation. Ce n\'est qu\'à ce moment précis que le cabinet pourra prendre connaissance de votre profil dans sa globalité.',
  },
  {
    icon: Handshake,
    label: 'Accompagnement personnalisé',
    description:
      'Le processus de recrutement est intégralement pris en main par Logan, du premier entretien à la signature.',
  },
];

const ConfidentialityIntro = ({ onContinue }: ConfidentialityIntroProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen bg-[#111111] flex items-center justify-center px-6 sm:px-12 lg:px-20 relative overflow-hidden"
    >
      <div className="max-w-xl w-full relative z-10 py-20">
        {/* Shield icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex justify-center mb-10"
        >
          <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center bg-white/[0.05]">
            <Shield className="w-6 h-6 text-white/40" />
          </div>
        </motion.div>

        <h1 className="text-2xl md:text-3xl font-serif font-normal text-white text-center mb-3 tracking-[-0.02em]">
          Vos informations restent<br />
          <em className="text-white/50 font-normal">strictement confidentielles</em>
        </h1>

        <p className="text-xs text-white/40 font-sans font-light text-center mb-5 max-w-md mx-auto leading-relaxed">
          Voici comment Logan garantit la confidentialité de votre profil à chaque étape.
        </p>

        {/* Time badges */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="flex items-center justify-center gap-6 mb-14"
        >
          <div className="flex items-center gap-2 text-white/50">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-[11px] font-sans font-light tracking-wide">Inscription en <span className="text-white font-medium">5 min</span></span>
          </div>
          <div className="w-px h-3 bg-white/15" />
          <div className="flex items-center gap-2 text-white/50">
            <Shield className="w-3.5 h-3.5" />
            <span className="text-[11px] font-sans font-light tracking-wide">Validation sous <span className="text-white font-medium">48h</span></span>
          </div>
        </motion.div>

        {/* Steps */}
        <div className="space-y-0">
          {steps.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex gap-4 relative"
            >
              {/* Vertical line + icon */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center bg-white/[0.05]">
                  <step.icon className="w-4 h-4 text-white/50" />
                </div>
                {i < steps.length - 1 && (
                  <div className="w-px flex-1 bg-white/10 my-1" />
                )}
              </div>
              <div className="pb-8">
                <p className="text-[13px] font-sans font-semibold text-white mb-1.5 tracking-wide">{step.label}</p>
                <p className="text-[12px] font-sans font-light text-white/45 leading-[1.7]">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="mt-14 text-center"
        >
          <Button
            onClick={onContinue}
            size="lg"
            className="bg-white text-black hover:bg-white/90 font-sans text-sm font-medium rounded-sm py-5 px-10 group"
          >
            J'ai compris, commencer l'inscription
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
          <p className="mt-6 text-[10px] text-white/25 font-sans font-light tracking-wide flex items-center justify-center gap-1.5">
            <Lock className="w-3 h-3" />
            Données chiffrées · Accès restreint · RGPD
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ConfidentialityIntro;
