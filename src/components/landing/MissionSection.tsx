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
  <section id="notre-approche" className="bg-white relative overflow-hidden">
    <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-10 lg:px-16 py-28 md:py-40">

      {/* Header */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="mb-20 md:mb-28"
      >
        <motion.p variants={fadeUp} className="text-[10px] font-sans font-semibold tracking-[0.25em] uppercase text-black/30 mb-6">
          Notre approche
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="font-serif font-[300] text-[2rem] sm:text-[2.8rem] md:text-[3.4rem] text-black leading-[1.06] tracking-normal max-w-3xl"
        >
          Deux perspectives, un intermédiaire&nbsp;: <em className="italic">Logan.</em>
        </motion.h2>
      </motion.div>

      {/* 3 colonnes : Firms | Logan | Candidats */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr]"
      >
        {/* Firms */}
        <motion.div variants={fadeUp} className="px-0 md:pr-12 py-10 flex flex-col gap-6">
          <span className="text-[10px] font-sans font-semibold tracking-[0.22em] uppercase text-black/30">Firms</span>
          <h3 className="font-serif font-[300] text-[1.25rem] text-black leading-snug">
            Vivez votre marché.
          </h3>
          <div className="w-6 h-px bg-black/15" />
          <div className="flex flex-col gap-5">
            <p className="font-sans font-light text-[0.88rem] leading-[1.8] text-black/55">
              <span className="text-black/75 font-normal">Recherche ciblée —</span> Déposez votre recherche à titre strictement confidentiel, en préservant — ou non — l'identité de votre cabinet.
            </p>
            <div className="w-4 h-px bg-black/10" />
            <p className="font-sans font-light text-[0.88rem] leading-[1.8] text-black/55">
              <span className="text-black/75 font-normal">Veille active —</span> Explorez le marché et soyez opportuniste. Anticipez vos recrutements stratégiques pour chacun de vos départements.
            </p>
          </div>
        </motion.div>

        {/* Logan — centre */}
        <motion.div
          variants={fadeUp}
          className="px-10 md:px-14 py-10 flex flex-col items-center justify-center gap-6 text-center min-w-[180px]"
        >
          {/* Logan + flèches alignées */}
          <div className="relative flex items-center justify-center w-full">
            {/* Flèche gauche */}
            <div className="hidden md:flex absolute left-0 items-center w-20">
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                whileInView={{ scaleX: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: 'left' }}
                className="w-full h-px bg-gradient-to-r from-transparent to-black/20"
              />
              <span className="text-black/20 text-[8px] -ml-0.5">›</span>
            </div>

            <span className="font-serif text-[1.5rem] tracking-[0.02em] text-black font-[300]">Logan</span>

            {/* Flèche droite */}
            <div className="hidden md:flex absolute right-0 items-center w-20 flex-row-reverse">
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                whileInView={{ scaleX: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: 'right' }}
                className="w-full h-px bg-gradient-to-l from-transparent to-black/20"
              />
              <span className="text-black/20 text-[8px] -mr-0.5">‹</span>
            </div>
          </div>

          <p className="font-sans font-light text-[0.78rem] leading-[1.75] text-black/35 max-w-[140px]">
            Un seul intermédiaire, de l'intention à la signature.
          </p>
        </motion.div>

        {/* Candidats */}
        <motion.div variants={fadeUp} className="px-0 md:pl-12 py-10 flex flex-col gap-6">
          <span className="text-[10px] font-sans font-semibold tracking-[0.22em] uppercase text-black/30">Candidats</span>
          <h3 className="font-serif font-[300] text-[1.25rem] text-black leading-snug">
            Reprenez le contrôle.
          </h3>
          <div className="w-6 h-px bg-black/15" />
          <div className="flex flex-col gap-4">
            <p className="font-sans font-light text-[0.88rem] leading-[1.8] text-black/55">
              Restez visible des cabinets qui vous intéressent — sans jamais exposer votre identité.
            </p>
            <p className="font-sans font-light text-[0.88rem] leading-[1.8] text-black/55">
              Étudiez chaque opportunité en amont avec un consultant dédié, à votre rythme et selon votre projet.
            </p>
            <p className="font-sans font-light text-[0.88rem] leading-[1.8] text-black/55">
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
            className="text-[10px] font-sans font-semibold tracking-[0.2em] uppercase text-black/25"
          >
            {word}
          </motion.span>
        ))}
      </motion.div>

    </div>
  </section>
);

export default MissionSection;
