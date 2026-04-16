import { motion } from 'motion/react';
import { Shield, Eye, Search, Handshake, ArrowRight, Lock, Clock, Bell, Crosshair, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CabinetConfidentialityIntroProps {
  onContinue: () => void;
}

const CabinetConfidentialityIntro = ({ onContinue }: CabinetConfidentialityIntroProps) => {
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
          Confidentialité garantie,<br />
          <em className="text-white/50 font-normal">à chaque étape</em>
        </h1>

        <p className="text-xs text-white/40 font-sans font-light text-center mb-5 max-w-md mx-auto leading-relaxed">
          Voici comment Logan protège l'identité de votre cabinet tout au long du processus.
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
          {/* --- Step 1: Diffusion confidentielle (with sub-items) --- */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex gap-4 relative"
          >
            <div className="flex flex-col items-center flex-shrink-0">
              <div className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center bg-white/[0.05]">
                <Eye className="w-4 h-4 text-white/50" />
              </div>
              <div className="w-px flex-1 bg-white/10 my-1" />
            </div>
            <div className="pb-4">
              <p className="text-[13px] font-sans font-semibold text-white mb-1.5 tracking-wide">Diffusion confidentielle auprès d'un pool qualifié</p>
              <p className="text-[12px] font-sans font-light text-white/45 leading-[1.7] mb-4">
                Contexte, équipe, séniorité et expertise sont visibles — l'identité de votre cabinet reste masquée jusqu'au stade opportun.
              </p>
              {/* Sub-items */}
              <div className="space-y-2.5 pl-1 border-l border-white/[0.08] ml-0.5">
                {[
                  { icon: Bell, text: 'Notification immédiate dès qu\'un candidat manifeste un intérêt.' },
                  { icon: Crosshair, text: 'Activation de Logan à la demande pour un rapprochement ciblé.' },
                  { icon: UserCheck, text: 'Sourcing proactif mené en parallèle auprès de profils pertinents.' },
                ].map((sub, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.45 + i * 0.08, duration: 0.4 }}
                    className="flex items-start gap-2.5 pl-3"
                  >
                    <sub.icon className="w-3 h-3 text-white/30 mt-0.5 flex-shrink-0" />
                    <p className="text-[11px] font-sans font-light text-white/40 leading-[1.6]">{sub.text}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* --- Step 2: Vision temps réel --- */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex gap-4 relative"
          >
            <div className="flex flex-col items-center flex-shrink-0">
              <div className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center bg-white/[0.05]">
                <Search className="w-4 h-4 text-white/50" />
              </div>
              <div className="w-px flex-1 bg-white/10 my-1" />
            </div>
            <div className="pb-8">
              <p className="text-[13px] font-sans font-semibold text-white mb-1.5 tracking-wide">Vision en temps réel de votre marché</p>
              <p className="text-[12px] font-sans font-light text-white/45 leading-[1.7]">
                Accédez en continu aux profils à l'écoute, sur tous vos départements. Signalez votre intérêt en un instant — Logan établit le contact confidentiel.
              </p>
            </div>
          </motion.div>

          {/* --- Step 3: Intermédiaire unique --- */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.72, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex gap-4 relative"
          >
            <div className="flex flex-col items-center flex-shrink-0">
              <div className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center bg-white/[0.05]">
                <Handshake className="w-4 h-4 text-white/50" />
              </div>
            </div>
            <div className="pb-8">
              <p className="text-[13px] font-sans font-semibold text-white mb-1.5 tracking-wide">Logan, intermédiaire unique et discret</p>
              <p className="text-[12px] font-sans font-light text-white/45 leading-[1.7]">
                Mandat en cours ou opportunité spontanée — Logan évalue l'intérêt mutuel, organise le rapprochement et vous accompagne jusqu'à l'intégration.
              </p>
            </div>
          </motion.div>
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
