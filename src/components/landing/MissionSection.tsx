import { motion } from 'motion/react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13 } },
};

const MissionSection = () => (
  <section id="notre-approche" className="bg-black relative overflow-hidden">
    {/* Ambient glow */}
    <motion.div
      aria-hidden
      className="absolute inset-0 pointer-events-none"
      animate={{
        background: [
          'radial-gradient(ellipse 70% 50% at 50% 60%, rgba(255,255,255,0.03) 0%, transparent 70%)',
          'radial-gradient(ellipse 80% 55% at 48% 55%, rgba(255,255,255,0.045) 0%, transparent 70%)',
          'radial-gradient(ellipse 70% 50% at 52% 60%, rgba(255,255,255,0.03) 0%, transparent 70%)',
        ],
      }}
      transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
    />

    <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-10 lg:px-16 py-28 md:py-40">

      {/* Header */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="mb-20 md:mb-28"
      >
        <motion.p variants={fadeUp} className="text-[10px] font-sans font-semibold tracking-[0.25em] uppercase text-white/25 mb-6">
          Notre approche
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="font-serif font-[300] text-[2rem] sm:text-[2.8rem] md:text-[3.4rem] text-white leading-[1.06] tracking-normal max-w-3xl"
        >
          Deux perspectives, un intermédiaire&nbsp;: <em className="italic">Logan.</em>
        </motion.h2>
      </motion.div>

      {/* 3 colonnes : Firms | Logan | Candidates */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-px bg-white/8"
      >
        {/* Firms */}
        <motion.div variants={fadeUp} className="bg-black px-8 py-10 flex flex-col gap-6">
          <span className="text-[10px] font-sans font-semibold tracking-[0.22em] uppercase text-white/25">Firms</span>
          <h3 className="font-serif font-[300] text-[1.25rem] text-white leading-snug">
            Vivez votre marché.
          </h3>
          <div className="w-6 h-px bg-white/15" />
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <p className="font-sans font-light text-[0.88rem] leading-[1.8] text-white/45">
                <span className="text-white/65 font-normal">Recherche ciblée —</span> Déposez votre recherche à titre strictement confidentiel, en préservant — ou non — l'identité de votre cabinet.
              </p>
            </div>
            <div className="w-4 h-px bg-white/10" />
            <div className="flex flex-col gap-2">
              <p className="font-sans font-light text-[0.88rem] leading-[1.8] text-white/45">
                <span className="text-white/65 font-normal">Veille active —</span> Explorez le marché et soyez opportuniste. Anticipez vos recrutements stratégiques pour chacun de vos départements.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Logan — centre */}
        <motion.div
          variants={fadeUp}
          className="bg-black px-8 md:px-10 py-10 flex flex-col items-center justify-center gap-5 text-center min-w-[160px]"
        >
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: 'top' }}
            className="hidden md:block w-px flex-1 bg-gradient-to-b from-transparent via-white/15 to-transparent min-h-[40px]"
          />
          <span className="font-serif text-[1.5rem] tracking-[0.02em] text-white font-[300]">Logan</span>
          <p className="font-sans font-light text-[0.82rem] leading-[1.75] text-white/35 max-w-[160px]">
            Un seul intermédiaire, de l'intention à la signature.
          </p>
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: 'top' }}
            className="hidden md:block w-px flex-1 bg-gradient-to-b from-transparent via-white/15 to-transparent min-h-[40px]"
          />
        </motion.div>

        {/* Candidates */}
        <motion.div variants={fadeUp} className="bg-black px-8 py-10 flex flex-col gap-6">
          <span className="text-[10px] font-sans font-semibold tracking-[0.22em] uppercase text-white/25">Candidates</span>
          <h3 className="font-serif font-[300] text-[1.25rem] text-white leading-snug">
            Reprenez le contrôle.
          </h3>
          <div className="w-6 h-px bg-white/15" />
          <div className="flex flex-col gap-4">
            <p className="font-sans font-light text-[0.88rem] leading-[1.8] text-white/45">
              Restez visible des cabinets qui vous intéressent — sans jamais exposer votre identité.
            </p>
            <p className="font-sans font-light text-[0.88rem] leading-[1.8] text-white/45">
              Étudiez chaque opportunité en amont avec un consultant dédié, à votre rythme et selon votre projet.
            </p>
            <p className="font-sans font-light text-[0.88rem] leading-[1.8] text-white/45">
              Votre anonymat est absolu. Jusqu'à ce que vous décidiez.
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Ligne de valeurs */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        className="mt-20 md:mt-24 flex flex-wrap justify-center gap-x-10 gap-y-4"
      >
        {['Confidentialité', 'Réactivité', 'Anonymat', 'Accompagnement', 'Transparence'].map((word) => (
          <motion.span
            key={word}
            variants={fadeUp}
            className="text-[10px] font-sans font-semibold tracking-[0.2em] uppercase text-white/20"
          >
            {word}
          </motion.span>
        ))}
      </motion.div>

    </div>
  </section>
);

export default MissionSection;
