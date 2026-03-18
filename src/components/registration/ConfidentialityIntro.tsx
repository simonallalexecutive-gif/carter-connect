import { motion } from 'motion/react';
import { Shield, Eye, EyeOff, Handshake, ArrowRight, Lock, UserCheck, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConfidentialityIntroProps {
  onContinue: () => void;
}

const steps = [
  {
    icon: EyeOff,
    title: 'Profil anonyme',
    description: 'Aucun cabinet n\'a accès à votre identité (nom, prénom) ni au nom de votre cabinet actuel.',
  },
  {
    icon: Eye,
    title: 'Visibilité limitée',
    description: 'Seules votre séniorité et votre expertise sont visibles.',
  },
  {
    icon: MessageSquare,
    title: 'Logan vous contacte',
    description: 'Si un cabinet s\'intéresse à votre profil, Logan se rapproche de vous — spontanément ou à votre demande — pour vous donner davantage de précisions.',
    subOptions: [
      { label: 'Spontanément', detail: 'Un cabinet s\'intéresse à votre profil en dehors de toute recherche diffusée sur la plateforme (hors mandat).' },
      { label: 'À votre demande', detail: 'Vous consultez une offre déposée à titre confidentiel sur notre plateforme par un cabinet et souhaitez en savoir plus.' },
    ],
  },
  {
    icon: UserCheck,
    title: 'Vous décidez',
    description: 'Si l\'opportunité vous intéresse, vous autorisez Logan à faire la mise en relation : ce n\'est qu\'à ce moment précis que votre identité complète est transmise au cabinet.',
  },
  {
    icon: Handshake,
    title: 'Accompagnement intégral',
    description: 'Le processus de recrutement est intégralement pris en main par Logan.',
  },
];

const ConfidentialityIntro = ({ onContinue }: ConfidentialityIntroProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen bg-black flex items-center justify-center px-6 relative overflow-hidden"
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
          <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center bg-white/[0.04]">
            <Shield className="w-7 h-7 text-white/70" />
          </div>
        </motion.div>

        <div className="w-10 h-px bg-white/30 mx-auto mb-6" />

        <h1 className="text-2xl md:text-3xl font-serif font-normal text-white text-center mb-3 tracking-[-0.02em]">
          Vos informations restent<br />
          <em className="text-white/60 font-normal">strictement confidentielles</em>
        </h1>

        <p className="text-xs text-white/35 font-sans font-light text-center mb-12 max-w-md mx-auto leading-relaxed">
          Voici comment fonctionne la confidentialité sur Logan, à chaque étape du processus.
        </p>

        {/* Steps */}
        <div className="space-y-0">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex gap-4 relative"
            >
              {/* Vertical line */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center bg-white/[0.04]">
                  <step.icon className="w-4 h-4 text-white/60" />
                </div>
                {i < steps.length - 1 && (
                  <div className="w-px flex-1 bg-white/10 my-1" />
                )}
              </div>
              <div className="pb-6">
                <p className="text-sm font-sans font-medium text-white mb-1">{step.title}</p>
                <p className="text-xs font-sans font-light text-white/45 leading-relaxed">{step.description}</p>
                {'subOptions' in step && step.subOptions && (
                  <div className="mt-3 space-y-2">
                    {step.subOptions.map((opt) => (
                      <div key={opt.label} className="flex gap-2.5 items-start pl-1">
                        <div className="w-1 h-1 rounded-full bg-white/30 mt-1.5 flex-shrink-0" />
                        <div>
                          <span className="text-xs font-sans font-medium text-white/70">« {opt.label} »</span>
                          <span className="text-xs font-sans font-light text-white/40"> — {opt.detail}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
            className="bg-white text-black hover:bg-white/90 font-sans text-sm font-medium rounded-sm py-5 px-10 group border-0"
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
