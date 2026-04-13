import { motion } from 'motion/react';
import { Building2, User, Zap, Handshake, Award, BookOpen, Shield, Eye, Target } from 'lucide-react';

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

const cardKeywords = (items: string[]) => (
  <div className="flex flex-col gap-3">
    {items.map((kw) => (
      <div key={kw} className="flex items-start gap-2.5">
        <div className="w-1 h-1 rounded-full bg-black/20 shrink-0 mt-2" />
        <span className="font-sans text-sm text-black/50 font-light">{kw}</span>
      </div>
    ))}
  </div>
);

const badgeRow = () => (
  <div className="flex items-center gap-3 pt-6 mt-8 border-t border-black/[0.06]">
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-black/[0.04] border border-black/[0.06]">
      <Award className="w-3.5 h-3.5 text-black/50" strokeWidth={1.5} />
      <span className="font-serif text-[10px] tracking-wide text-black/55 font-medium">Chambers</span>
    </div>
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-black/[0.04] border border-black/[0.06]">
      <BookOpen className="w-3.5 h-3.5 text-black/50" strokeWidth={1.5} />
      <span className="font-serif text-[10px] tracking-wide text-black/55 font-medium">Legal 500</span>
    </div>
  </div>
);

const MissionSection = () => (
  <section id="notre-approche" className="relative overflow-hidden bg-white">
    <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-8 lg:px-10 py-24 md:py-40">

      {/* Header */}
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

        {/* Ecosystem quote — no border, no italic */}
        <motion.div variants={fadeUp} className="max-w-2xl">
          <p className="font-sans text-base sm:text-lg leading-[1.6] text-black/45">
            Un écosystème exigeant, discret et structuré, enrichi chaque jour par nos consultants spécialisés, au service d'une expérience de recrutement réinventée.
          </p>
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
          <motion.div variants={fadeScale} className="group relative border border-black/[0.08] rounded-sm p-8 md:p-10 hover:border-black/20 transition-colors duration-500 flex flex-col">
            <div className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center mb-6 group-hover:border-black/25 transition-colors duration-500">
              <Building2 className="w-4.5 h-4.5 text-black/40 group-hover:text-black/70 transition-colors duration-500" strokeWidth={1.5} />
            </div>
            <h3 className="font-serif text-xl text-black mb-5 tracking-[-0.01em]">Cabinet</h3>
            {cardKeywords(['Confidentialité de vos recherches', 'Vision consolidée du marché', 'Recrutements stratégiques'])}
            {badgeRow()}
          </motion.div>

          {/* Central bridge */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col items-center justify-center px-6 md:px-12 py-8 md:py-0"
          >
            <div className="hidden md:flex items-center gap-0 w-full">
              <div className="flex-1 h-px bg-gradient-to-r from-black/5 to-black/15" />
              <div className="relative mx-3">
                <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center shadow-[0_8px_32px_-8px_rgba(0,0,0,0.4)]">
                  <Handshake className="w-6 h-6 text-white/85" strokeWidth={1.5} />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white border border-black/10 flex items-center justify-center">
                  <Zap className="w-2.5 h-2.5 text-black/40" strokeWidth={2} />
                </div>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-black/15 to-black/5" />
            </div>

            <div className="flex md:hidden">
              <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center shadow-[0_8px_32px_-8px_rgba(0,0,0,0.4)]">
                <Handshake className="w-6 h-6 text-white/85" strokeWidth={1.5} />
              </div>
            </div>

            <p className="font-sans text-[10px] md:text-[11px] text-center leading-[1.7] text-black/50 mt-5 max-w-[220px] font-medium">
              Logan identifie, qualifie et orchestre chaque mise en relation — de la première intention à la signature.
            </p>
          </motion.div>

          {/* Candidat */}
          <motion.div variants={fadeScale} className="group relative border border-black/[0.08] rounded-sm p-8 md:p-10 hover:border-black/20 transition-colors duration-500 flex flex-col">
            <div className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center mb-6 group-hover:border-black/25 transition-colors duration-500">
              <User className="w-4.5 h-4.5 text-black/40 group-hover:text-black/70 transition-colors duration-500" strokeWidth={1.5} />
            </div>
            <h3 className="font-serif text-xl text-black mb-5 tracking-[-0.01em]">Candidat</h3>
            {cardKeywords(['Identité préservée', 'Attractivité boostée', 'Accès en temps réel aux meilleures opportunités'])}
            {badgeRow()}
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
          Logan est le seul <em>hub</em> confidentiel où se rencontrent les meilleurs cabinets et les profils qui ne se montrent nulle part ailleurs.
        </motion.p>
        <motion.div variants={fadeUp} className="w-12 h-px bg-black/15 mx-auto" />
      </motion.div>

      {/* Bottom pillars — impactful centered layout */}
      <motion.div
        variants={staggerSlow}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        className="grid grid-cols-1 md:grid-cols-3 gap-0 max-w-4xl mx-auto"
      >
        {[
          { icon: Shield, title: 'Confidentialité absolue', text: 'Chaque échange est protégé. Aucune donnée n\'est partagée sans consentement explicite des deux parties.' },
          { icon: Eye, title: 'Sélectivité rigoureuse', text: 'Seuls les profils validés par nos chasseurs accèdent au réseau. La qualité prime sur le volume.' },
          { icon: Target, title: 'Précision chirurgicale', text: 'Chaque mise en relation est ciblée et contextualisée — ni bruit, ni approximation.' },
        ].map((item, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            className="flex flex-col items-center text-center px-6 py-10 md:py-12 border-b md:border-b-0 md:border-r border-black/[0.06] last:border-r-0 last:border-b-0"
          >
            <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center mb-6 shadow-[0_6px_24px_-6px_rgba(0,0,0,0.35)]">
              <item.icon className="w-5 h-5 text-white/90" strokeWidth={1.5} />
            </div>
            <h4 className="font-serif text-base text-black mb-3 tracking-[-0.01em]">{item.title}</h4>
            <p className="font-sans text-[13px] leading-[1.8] text-black/45 font-light max-w-[240px]">{item.text}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default MissionSection;
