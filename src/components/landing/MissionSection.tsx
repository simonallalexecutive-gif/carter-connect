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
              {['Confidentialité de vos recherches', 'Vision consolidée du marché des candidats pour tous vos départements', 'Recrutements stratégiques'].map((kw) => (
                <div key={kw} className="flex items-start gap-2.5">
                  <div className="w-1 h-1 rounded-full bg-black/20 shrink-0 mt-2" />
                  <span className="font-sans text-sm text-black/50 font-light">{kw}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Central bridge */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col items-center justify-center px-6 md:px-12 py-8 md:py-0"
          >
            {/* Horizontal connector line left */}
            <div className="hidden md:block absolute left-0 right-0" />
            
            {/* Connecting lines */}
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

            {/* Mobile badge */}
            <div className="flex md:hidden">
              <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center shadow-[0_8px_32px_-8px_rgba(0,0,0,0.4)]">
                <Handshake className="w-6 h-6 text-white/85" strokeWidth={1.5} />
              </div>
            </div>

            {/* Connector text */}
            <p className="font-sans text-[10px] md:text-[11px] text-center leading-[1.7] text-black/50 mt-5 max-w-[220px] font-medium">
              Logan identifie, qualifie et orchestre chaque mise en relation — de la première intention à la signature.
            </p>
          </motion.div>

          {/* Candidat */}
          <motion.div variants={fadeScale} className="group relative border border-black/[0.08] rounded-sm p-8 md:p-10 hover:border-black/20 transition-colors duration-500">
            <div className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center mb-6 group-hover:border-black/25 transition-colors duration-500">
              <User className="w-4.5 h-4.5 text-black/40 group-hover:text-black/70 transition-colors duration-500" strokeWidth={1.5} />
            </div>
            <h3 className="font-serif text-xl text-black mb-5 tracking-[-0.01em]">Candidat</h3>
            <div className="flex flex-col gap-3">
              {['Identité préservée', 'Attractivité boostée', 'Accès en temps réel aux meilleures opportunités'].map((kw) => (
                <div key={kw} className="flex items-start gap-2.5">
                  <div className="w-1 h-1 rounded-full bg-black/20 shrink-0 mt-2" />
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
          Logan est le seul <em>hub</em> confidentiel où se rencontrent les meilleurs cabinets et les profils qui ne se montrent nulle part ailleurs.
        </motion.p>
        <motion.div variants={fadeUp} className="w-12 h-px bg-black/15 mx-auto" />
      </motion.div>

      {/* Ecosystem quote */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="mb-20 md:mb-28 max-w-3xl mx-auto"
      >
        <motion.div variants={fadeUp} className="border-l-2 border-black/10 pl-8 py-2">
          <p className="font-serif text-lg sm:text-xl md:text-[1.35rem] leading-[1.6] text-black/60 italic">
            « Un écosystème discret, exigeant et structuré où chaque profil est validé et où chaque interaction est pilotée dans la plus stricte confidentialité. »
          </p>
        </motion.div>
      </motion.div>

      {/* Bottom pillars */}
      <motion.div
        variants={staggerSlow}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
      >
        {[
          { icon: Shield, title: 'Confidentialité absolue', text: 'Chaque échange est protégé. Aucune donnée n\'est partagée sans consentement explicite des deux parties.' },
          { icon: Eye, title: 'Sélectivité rigoureuse', text: 'Seuls les profils validés par nos chasseurs accèdent au réseau. La qualité prime sur le volume.' },
          { icon: Target, title: 'Précision chirurgicale', text: 'Chaque mise en relation est ciblée et contextualisée — ni bruit, ni approximation.' },
        ].map((item, i) => (
          <motion.div key={i} variants={fadeUp} className="flex flex-col items-start px-2">
            <div className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center mb-5">
              <item.icon className="w-4 h-4 text-black/40" strokeWidth={1.5} />
            </div>
            <h4 className="font-serif text-base text-black mb-2.5 tracking-[-0.01em]">{item.title}</h4>
            <p className="font-sans text-[13px] leading-[1.8] text-black/45 font-light">{item.text}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default MissionSection;
