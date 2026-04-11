import { motion } from 'motion/react';
import { Building2, User, Handshake, ArrowRight, Zap } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const } },
};

const fadeScale = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const staggerSlow = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18 } },
};

const MissionSection = () => (
  <section id="notre-approche" className="relative overflow-hidden bg-white">
    <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-8 lg:px-10 py-24 md:py-40">

      {/* Header */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="text-center mb-20 md:mb-28"
      >
        <motion.p variants={fadeUp} className="text-[11px] font-sans font-medium tracking-[0.25em] uppercase text-black/30 mb-6">
          Notre approche
        </motion.p>
        <motion.h2 variants={fadeUp} className="font-serif text-3xl sm:text-4xl md:text-[2.8rem] leading-[1.15] text-black mb-8 max-w-4xl mx-auto">
          Logan n'est pas une plateforme de recrutement.
        </motion.h2>
        <motion.p variants={fadeUp} className="font-sans text-[1.05rem] md:text-lg leading-[1.9] text-black/55 max-w-3xl mx-auto">
          C'est une infrastructure confidentielle de marché. Nous offrons un accès constant à un réseau hautement qualifié — un cercle restreint de profils rares, rigoureusement sélectionnés.
        </motion.p>
      </motion.div>

      {/* Two audience blocks */}
      <motion.div
        variants={staggerSlow}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 mb-20 md:mb-28"
      >
        {/* Cabinets */}
        <motion.div variants={fadeScale} className="group relative border border-black/[0.08] rounded-sm p-8 md:p-10 hover:border-black/20 transition-colors duration-500">
          <div className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center mb-6 group-hover:border-black/25 transition-colors duration-500">
            <Building2 className="w-4.5 h-4.5 text-black/40 group-hover:text-black/70 transition-colors duration-500" strokeWidth={1.5} />
          </div>
          <h3 className="font-serif text-xl text-black mb-4 tracking-[-0.01em]">Firms</h3>
          <p className="font-sans text-sm leading-[1.85] text-black/45 font-light">
            Restez connectés à votre marché toute l'année, de manière proactive, grâce à un abonnement combiné à un success fee réduit.
          </p>
        </motion.div>

        {/* Candidats */}
        <motion.div variants={fadeScale} className="group relative border border-black/[0.08] rounded-sm p-8 md:p-10 hover:border-black/20 transition-colors duration-500">
          <div className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center mb-6 group-hover:border-black/25 transition-colors duration-500">
            <User className="w-4.5 h-4.5 text-black/40 group-hover:text-black/70 transition-colors duration-500" strokeWidth={1.5} />
          </div>
          <h3 className="font-serif text-xl text-black mb-4 tracking-[-0.01em]">Candidates</h3>
          <p className="font-sans text-sm leading-[1.85] text-black/45 font-light">
            Restez attractif aux yeux des meilleurs cabinets et bénéficiez d'un espace structuré, transparent et encadré pour saisir la bonne opportunité, tout en conservant votre anonymat.
          </p>
        </motion.div>
      </motion.div>

      {/* Intermediary role */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="max-w-3xl mx-auto mb-20 md:mb-28"
      >
        <motion.div variants={fadeUp} className="text-center">
          <p className="font-sans text-[1.02rem] leading-[1.9] text-black/60 font-light">
            Logan orchestre chaque rapprochement, en garantit la pertinence et accompagne chaque partie à chaque étape du processus jusqu'à sa concrétisation.
          </p>
        </motion.div>
      </motion.div>

      {/* Differentiator */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="text-center mb-20 md:mb-28"
      >
        <motion.p variants={fadeUp} className="font-serif text-xl sm:text-2xl md:text-[1.7rem] leading-[1.5] text-black max-w-3xl mx-auto mb-6">
          Logan est le seul endroit où l'on trouve simultanément les meilleurs cabinets et les profils qui ne se montrent nulle part ailleurs.
        </motion.p>
        <motion.div variants={fadeUp} className="w-12 h-px bg-black/15 mx-auto" />
      </motion.div>

      {/* Bottom taglines */}
      <motion.div
        variants={staggerSlow}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
      >
        {[
          { icon: ArrowRight, text: 'D\'une logique ponctuelle et opaque à une approche proactive et fluide.' },
          { icon: Zap, text: 'Les meilleures rencontres ne dépendent plus du timing, mais de la pertinence.' },
          { icon: Handshake, text: 'La chasse de tête réinventée : plus dynamique, plus structurée, plus ouverte.' },
        ].map((item, i) => (
          <motion.div key={i} variants={fadeUp} className="flex flex-col items-center text-center px-4">
            <div className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center mb-4">
              <item.icon className="w-3.5 h-3.5 text-black/35" strokeWidth={1.5} />
            </div>
            <p className="font-sans text-[13px] leading-[1.8] text-black/45 font-light">{item.text}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default MissionSection;
