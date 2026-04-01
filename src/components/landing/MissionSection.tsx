import { motion } from 'motion/react';
import { Building2, UserCheck } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const MissionSection = () => (
  <section className="relative bg-white overflow-hidden">
    <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-24 md:py-36">

      {/* ── Header ── */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="mb-10 md:mb-16"
      >
        <motion.p variants={fadeUp} className="text-[11px] font-sans font-medium tracking-[0.25em] uppercase text-black/30 mb-6">
          Notre approche
        </motion.p>
        <motion.h2 variants={fadeUp} className="font-serif text-3xl sm:text-4xl md:text-[3.2rem] leading-[1.15] text-black mb-6 max-w-3xl">
          Logan n'est pas une plateforme de recrutement.
        </motion.h2>
        <motion.p variants={fadeUp} className="font-serif text-xl sm:text-2xl md:text-[1.7rem] leading-[1.4] text-black/45 max-w-3xl">
          C'est une infrastructure confidentielle de marché.
        </motion.p>
      </motion.div>

      {/* ── Manifesto ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-14 md:mb-20"
      >
        <div className="border-l-2 border-black/10 pl-8 md:pl-12 max-w-3xl">
          <p className="font-sans text-[1.05rem] md:text-lg leading-[1.85] text-black/60">
            Logan structure un écosystème discret et exigeant, réunissant les acteurs les plus prestigieux du marché des avocats d'affaires, dans une exigence absolue de confidentialité. Vous disposez d'un accès continu à un réseau hautement qualifié, composé de profils rares et rigoureusement sélectionnés.
          </p>
        </div>
      </motion.div>

      {/* ── Centered bold statement ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-14 md:mb-20"
      >
        <p className="font-sans text-[1.05rem] md:text-lg leading-[1.7] text-black/70 font-bold text-center max-w-3xl mx-auto">
          Logan préserve l'anonymat de chaque partie et intervient à leurs côtés pour les accompagner lorsque des rapprochements stratégiques s'imposent.
        </p>
      </motion.div>

      {/* ── Two sides — Cabinets / Candidats ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="font-sans text-sm font-medium tracking-[0.15em] uppercase text-black/25 mb-10">
          Un marché continu, visible et activable
        </p>
        <div className="grid md:grid-cols-2 gap-6 md:gap-10">
          {/* Cabinets */}
          <div className="border border-black/[0.08] rounded-sm p-8 md:p-10">
            <Building2 className="w-5 h-5 text-black/25 mb-5" strokeWidth={1.5} />
            <p className="font-sans text-xs font-medium tracking-[0.2em] uppercase text-black/30 mb-2">Cabinets</p>
            <p className="font-serif text-base md:text-lg font-medium text-black/80 mb-4">
              Vivez votre marché, ne le subissez plus.
            </p>
            <p className="font-sans text-[0.95rem] leading-[1.75] text-black/50">
              Une identité protégée, un accès en temps réel à la dynamique de votre marché, accessible pour tous vos départements — pour rester en alerte et opportuniste dans vos recrutements, présents comme futurs.
            </p>
          </div>
          {/* Candidats */}
          <div className="border border-black/[0.08] rounded-sm p-8 md:p-10">
            <UserCheck className="w-5 h-5 text-black/25 mb-5" strokeWidth={1.5} />
            <p className="font-sans text-xs font-medium tracking-[0.2em] uppercase text-black/30 mb-2">Candidats</p>
            <p className="font-serif text-base md:text-lg font-medium text-black/80 mb-4">
              Restez attractif, dans la discrétion la plus totale.
            </p>
            <p className="font-sans text-[0.95rem] leading-[1.75] text-black/50">
              Un cadre structuré et transparent qui vous confère une visibilité inégalée sur votre marché, tout en préservant votre identité — avec, à chaque instant, un consultant à vos côtés pour vous accompagner à chaque étape de votre carrière.
            </p>
          </div>
        </div>
      </motion.div>

    </div>
  </section>
);

export default MissionSection;
