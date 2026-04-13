import { motion } from 'motion/react';
import { Building2, User, ArrowRight, Zap, Handshake, MoveRight, MoveLeft, Award, BookOpen } from 'lucide-react';

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

      {/* Header — left-aligned */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="mb-20 md:mb-28"
      >
        <motion.p variants={fadeUp} className="text-[11px] font-sans font-medium tracking-[0.25em] uppercase text-black/30 mb-6">
          Notre approche
        </motion.p>
        <motion.h2 variants={fadeUp} className="font-serif text-3xl sm:text-4xl md:text-[2.8rem] leading-[1.15] text-black mb-8 max-w-4xl">
          Logan est <span className="line-through decoration-[0.5px] decoration-black/50 text-black/35">une plateforme de recrutement</span> la nouvelle infrastructure privilégiée et confidentielle du marché des avocats.
        </motion.h2>

        {/* Chambers & Legal 500 badges */}
        <motion.div variants={fadeUp} className="flex items-center gap-6">
          <div className="flex items-center gap-2.5 border border-black/10 rounded-sm px-5 py-2.5">
            <Award className="w-4 h-4 text-black/50" strokeWidth={1.5} />
            <span className="font-serif text-sm tracking-wide text-black/60">Chambers</span>
          </div>
          <div className="flex items-center gap-2.5 border border-black/10 rounded-sm px-5 py-2.5">
            <BookOpen className="w-4 h-4 text-black/50" strokeWidth={1.5} />
            <span className="font-serif text-sm tracking-wide text-black/60">Legal 500</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Cabinet — Logan Bridge — Candidat */}
      <motion.div
        variants={staggerSlow}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="mb-20 md:mb-28"
      >
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-stretch gap-0">
          {/* Cabinet */}
          <motion.div variants={fadeScale} className="group relative border border-black/[0.08] rounded-sm p-8 md:p-10 hover:border-black/20 transition-colors duration-500">
            <div className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center mb-6 group-hover:border-black/25 transition-colors duration-500">
              <Building2 className="w-4.5 h-4.5 text-black/40 group-hover:text-black/70 transition-colors duration-500" strokeWidth={1.5} />
            </div>
            <h3 className="font-serif text-xl text-black mb-5 tracking-[-0.01em]">Cabinet</h3>
            <div className="flex flex-col gap-3">
              {['Confidentialité', 'Lecture consolidée du marché', 'Recrutements stratégiques'].map((kw) => (
                <div key={kw} className="flex items-center gap-2.5">
                  <div className="w-1 h-1 rounded-full bg-black/20 shrink-0" />
                  <span className="font-sans text-sm text-black/50 font-light">{kw}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Central bridge — Logan as connector */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col items-center justify-center px-6 md:px-10 py-8 md:py-0"
          >
            {/* Top arrow (from Cabinet) */}
            <div className="hidden md:flex flex-col items-center gap-2 mb-4">
              <div className="w-px h-8 bg-gradient-to-b from-transparent to-black/15" />
              <MoveRight className="w-4 h-4 text-black/20 -rotate-90" strokeWidth={1.5} />
            </div>

            {/* Logan badge */}
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center shadow-lg">
                <Handshake className="w-5 h-5 text-white/80" strokeWidth={1.5} />
              </div>
            </div>

            {/* Connector text */}
            <p className="font-sans text-[10px] md:text-[11px] text-center leading-[1.7] text-black/50 mt-4 max-w-[220px] font-medium">
              Logan identifie, qualifie et orchestre chaque mise en relation — de la première intention à la signature.
            </p>

            {/* Bottom arrow (to Candidat) */}
            <div className="hidden md:flex flex-col items-center gap-2 mt-4">
              <MoveLeft className="w-4 h-4 text-black/20 -rotate-90" strokeWidth={1.5} />
              <div className="w-px h-8 bg-gradient-to-b from-black/15 to-transparent" />
            </div>

            {/* Mobile horizontal arrows */}
            <div className="flex md:hidden items-center gap-3 mt-3">
              <div className="w-8 h-px bg-black/15" />
              <Handshake className="w-3.5 h-3.5 text-black/25" strokeWidth={1.5} />
              <div className="w-8 h-px bg-black/15" />
            </div>
          </motion.div>

          {/* Candidat */}
          <motion.div variants={fadeScale} className="group relative border border-black/[0.08] rounded-sm p-8 md:p-10 hover:border-black/20 transition-colors duration-500">
            <div className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center mb-6 group-hover:border-black/25 transition-colors duration-500">
              <User className="w-4.5 h-4.5 text-black/40 group-hover:text-black/70 transition-colors duration-500" strokeWidth={1.5} />
            </div>
            <h3 className="font-serif text-xl text-black mb-5 tracking-[-0.01em]">Candidat</h3>
            <div className="flex flex-col gap-3">
              {['Identité préservée', 'Attractivité boostée', 'Accès en temps réel aux meilleures opportunités'].map((kw) => (
                <div key={kw} className="flex items-center gap-2.5">
                  <div className="w-1 h-1 rounded-full bg-black/20 shrink-0" />
                  <span className="font-sans text-sm text-black/50 font-light">{kw}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
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
          Logan est le seul hub confidentiel où se rencontrent les meilleurs cabinets et les profils qui ne se montrent nulle part ailleurs.
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
