import { motion } from 'motion/react';
import { Shield, EyeOff, Search, Zap, Users, Handshake, ArrowRight, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CabinetConfidentialityIntroProps {
  onContinue: () => void;
}

const steps = [
  {
    icon: EyeOff,
    title: 'Identité du cabinet préservée',
    description: 'Votre identité reste strictement anonyme aux yeux des candidats. Aucun avocat ne peut savoir quel cabinet consulte son profil ou manifeste un intérêt.',
  },
  {
    icon: Search,
    title: 'Recherche visible, identité masquée',
    description: 'Vos recherches sont visibles sur la plateforme sans que l\'identité de votre cabinet ne soit révélée. Les candidats voient une opportunité, jamais un nom.',
  },
  {
    icon: Zap,
    title: 'Accès en temps réel',
    description: 'Logan vous propose un accès en temps réel aux candidats pertinents et en recherche active, avec possibilité d\'activer l\'intervention de Logan pour opérer un rapprochement.',
  },
  {
    icon: Users,
    title: 'Logan, force de proposition',
    description: 'En parallèle de vos recherches, Logan peut être force de propositions en identifiant proactivement des profils correspondant à vos critères.',
  },
  {
    icon: Handshake,
    title: 'Accompagnement de A à Z',
    description: 'Logan vous accompagne à chaque étape du processus de recrutement, de la recherche initiale jusqu\'à l\'intégration du candidat.',
  },
];

const CabinetConfidentialityIntro = ({ onContinue }: CabinetConfidentialityIntroProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen bg-black flex items-center justify-center px-6 sm:px-12 lg:px-20 relative overflow-hidden"
    >
      {/* Ambient */}
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full border border-white/[0.04] pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-[350px] h-[350px] rounded-full border border-white/[0.03] pointer-events-none" />

      <div className="max-w-xl w-full relative z-10 py-20">
        {/* Shield icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center bg-white/[0.03]">
            <Shield className="w-7 h-7 text-white/60" />
          </div>
        </motion.div>

        <div className="w-10 h-px bg-white/20 mx-auto mb-6" />

        <h1 className="text-2xl md:text-3xl font-serif font-normal text-white text-center mb-3 tracking-[-0.02em]">
          Votre recherche reste<br />
          <em className="text-white/50 font-normal">strictement confidentielle</em>
        </h1>

        <p className="text-xs text-white/40 font-sans font-light text-center mb-12 max-w-md mx-auto leading-relaxed">
          Voici comment Logan garantit la confidentialité de votre cabinet à chaque étape.
        </p>

        {/* Steps */}
        <div className="space-y-0">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex gap-4 relative"
            >
              {/* Vertical line */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center bg-white/[0.03]">
                  <step.icon className="w-4 h-4 text-white/50" />
                </div>
                {i < steps.length - 1 && (
                  <div className="w-px flex-1 bg-white/10 my-1" />
                )}
              </div>
              <div className="pb-6">
                <p className="text-sm font-sans font-medium text-white mb-1">{step.title}</p>
                <p className="text-xs font-sans font-light text-white/50 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="mt-10 text-center"
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

export default CabinetConfidentialityIntro;
