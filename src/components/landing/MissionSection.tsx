import { motion } from 'motion/react';
import { Building2, User, Award, Handshake, Shield, Eye, Target } from 'lucide-react';
import ctaGradientBg from '@/assets/cta-gradient-bg.jpeg';

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

const cardKeywordsDark = (items: string[]) => (
  <div className="flex flex-col gap-3 items-center">
    {items.map((kw) => (
      <span key={kw} className="font-sans text-sm text-white/50 font-light">{kw}</span>
    ))}
  </div>
);

const badgeRowDark = () => (
  <div className="flex items-center justify-center gap-4 pt-6 mt-8 border-t border-white/[0.08]">
    <div className="flex items-center justify-center gap-1.5 min-w-[110px] px-3.5 py-1.5 rounded-sm bg-white border border-white/20">
      <Award className="w-3.5 h-3.5 text-black/60 shrink-0" strokeWidth={1.5} />
      <span className="font-serif text-[10px] tracking-wide text-black/70 font-medium">Chambers</span>
    </div>
    <div className="flex items-center justify-center gap-1.5 min-w-[110px] px-3.5 py-1.5 rounded-sm bg-white border border-white/20">
      <Award className="w-3.5 h-3.5 text-black/60 shrink-0" strokeWidth={1.5} />
      <span className="font-serif text-[10px] tracking-wide text-black/70 font-medium">Legal 500</span>
    </div>
  </div>
);

const MissionSection = () => (
  <section id="notre-approche" className="relative overflow-hidden">
    {/* Gradient background — same as CTA */}
    <div className="absolute inset-0">
      <img
        src={ctaGradientBg}
        alt=""
        className="w-full h-full object-cover rotate-180"
      />
    </div>

    <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-8 lg:px-10 py-24 md:py-40">

      {/* Header */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="mb-20 md:mb-28"
      >
        <motion.p variants={fadeUp} className="text-[11px] font-sans font-medium tracking-[0.25em] uppercase text-white/40 mb-6">
          Notre approche
        </motion.p>
        <motion.h2 variants={fadeUp} className="font-serif text-3xl sm:text-4xl md:text-[2.8rem] leading-[1.15] text-white mb-5 max-w-4xl">
          Logan est <span className="line-through decoration-[0.5px] decoration-white/60 text-white/35">une plateforme de recrutement</span> la nouvelle infrastructure privilégiée et confidentielle du marché des avocats.
        </motion.h2>
        <motion.p variants={fadeUp} className="font-sans text-[0.76rem] sm:text-[1rem] md:text-[1.018rem] font-[480] leading-[1.65] text-white/50 max-w-3xl">
          Nous structurons et accompagnons un écosystème discret et exigeant, composé de profils et de cabinets précieusement <span className="text-white/90">qualifiés et reconnus pour leur positionnement</span>.
        </motion.p>
      </motion.div>

      {/* Cabinet — Logan Bridge — Candidat — Unified dark block */}
      <motion.div
        variants={staggerSlow}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="mb-20 md:mb-28 -mt-6 md:-mt-10"
      >
        <div className="bg-black/40 backdrop-blur-xl rounded-lg p-6 sm:p-8 md:p-10 lg:p-12 border border-white/[0.06]">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-stretch gap-0">
            {/* Cabinet */}
            <motion.div variants={fadeScale} className="group flex flex-col items-center text-center p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <Building2 className="w-5 h-5 text-white/50 group-hover:text-white/80 transition-colors duration-500" strokeWidth={1.5} />
                <h3 className="font-serif text-xl text-white tracking-[-0.01em]">Cabinets</h3>
              </div>
              {cardKeywordsDark(['Confidentialité de vos recherches', 'Vision consolidée du marché', 'Recrutements stratégiques'])}
              {badgeRowDark()}
            </motion.div>

            {/* Central bridge */}
            <motion.div
              variants={fadeUp}
              className="flex flex-col items-center justify-center px-4 md:px-10 py-8 md:py-0"
            >
              <div className="hidden md:flex items-center gap-0 w-full">
                <div className="flex-1 h-px bg-gradient-to-r from-white/[0.03] to-white/[0.12]" />
                <div className="relative mx-3">
                  <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-[0_8px_32px_-4px_rgba(255,255,255,0.15)]">
                    <Handshake className="w-5.5 h-5.5 text-[#0F0F0F]" strokeWidth={1.5} />
                  </div>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-white/[0.12] to-white/[0.03]" />
              </div>

              <div className="flex md:hidden">
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-[0_8px_32px_-4px_rgba(255,255,255,0.15)]">
                  <Handshake className="w-5.5 h-5.5 text-[#0F0F0F]" strokeWidth={1.5} />
                </div>
              </div>

              <p className="font-sans text-[10px] md:text-[11px] text-center leading-[1.7] text-white/40 mt-5 max-w-[240px] font-medium">
                Logan orchestre chaque mise en relation — de la première intention à la signature.
              </p>
            </motion.div>

            {/* Candidat */}
            <motion.div variants={fadeScale} className="group flex flex-col items-center text-center p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <User className="w-5 h-5 text-white/50 group-hover:text-white/80 transition-colors duration-500" strokeWidth={1.5} />
                <h3 className="font-serif text-xl text-white tracking-[-0.01em]">Candidats</h3>
              </div>
              {cardKeywordsDark(['Accès aux meilleures opportunités', 'Attractivité boostée', 'Identité préservée'])}
              {badgeRowDark()}
            </motion.div>
          </div>
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
        <motion.p variants={fadeUp} className="font-serif text-xl sm:text-2xl md:text-[1.7rem] leading-[1.5] text-white max-w-3xl mx-auto mb-6">
          Logan est le seul <em>hub</em> confidentiel et structuré où se rencontrent les meilleurs cabinets et les profils qui ne se montrent nulle part ailleurs.
        </motion.p>
        <motion.div variants={fadeUp} className="w-12 h-px bg-white/20 mx-auto" />
      </motion.div>

      {/* Bottom pillars */}
      <motion.div
        variants={staggerSlow}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        className="grid grid-cols-1 md:grid-cols-3 gap-0 max-w-4xl mx-auto"
      >
        {[
          { icon: Shield, title: 'Confidentialité absolue', text: 'Aucune donnée partagée sans consentement explicite.' },
          { icon: Eye, title: 'Sélectivité rigoureuse', text: 'Seuls les profils validés accèdent au réseau.' },
          { icon: Target, title: 'Précision chirurgicale', text: 'Chaque mise en relation est ciblée et contextualisée.' },
        ].map((item, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            className="flex flex-col items-center text-center px-6 py-10 md:py-12 border-b md:border-b-0 md:border-r border-white/[0.06] last:border-r-0 last:border-b-0"
          >
            <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mb-6 border border-white/[0.08] shadow-[0_6px_24px_-6px_rgba(0,0,0,0.35)]">
              <item.icon className="w-5 h-5 text-white/90" strokeWidth={1.5} />
            </div>
            <h4 className="font-serif text-base text-white mb-3 tracking-[-0.01em]">{item.title}</h4>
            <p className="font-sans text-[13px] leading-[1.8] text-white/50 font-light max-w-[240px]">{item.text}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default MissionSection;
