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
        <motion.p variants={fadeUp} className="text-[11.5px] font-sans font-semibold tracking-[0.25em] uppercase text-black/30 mb-6">
          Notre approche
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="font-serif font-[300] text-[2.3rem] sm:text-[3.22rem] md:text-[3.91rem] text-black leading-[1.06] tracking-normal max-w-3xl"
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
        className="grid grid-cols-1 md:grid-cols-[1fr_200px_1fr]"
      >
        {/* Firms */}
        <motion.div variants={fadeUp} className="px-0 md:pr-12 py-10 flex flex-col gap-6">
          <span className="text-[13.8px] font-sans font-bold tracking-[0.22em] uppercase text-black/30">Firms</span>
          <h3 className="font-serif font-[300] text-[1.44rem] text-black leading-snug italic">
            Vivez votre marché.
          </h3>
          <div className="w-6 h-px bg-black/15" />
          <div className="flex flex-col gap-5">
            <p className="font-sans font-light text-[1.01rem] leading-[1.8] text-black/55 text-justify">
              <span className="text-black/75 font-bold">Déposez votre recherche à titre confidentiel</span> et adressez-vous à une audience qualifiée tout en préservant l'identité de votre cabinet.
            </p>
            <div className="w-4 h-px bg-black/10" />
            <p className="font-sans font-light text-[1.01rem] leading-[1.8] text-black/55 text-justify">
              <span className="text-black/75 font-bold">Explorez le marché</span> : restez opportuniste et anticipez vos recrutements stratégiques pour chacun de vos départements.
            </p>
          </div>
        </motion.div>

        {/* Logan — centre */}
        <motion.div
          variants={fadeUp}
          className="py-10 flex flex-col items-center justify-center gap-6 text-center w-full"
        >
          {/* Logan + flèches sur la même ligne */}
          <div className="hidden md:flex items-center gap-4 w-full justify-center">
            {/* Flèche gauche */}
            <div className="flex items-center gap-0.5">
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                whileInView={{ scaleX: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: 'left' }}
                className="w-10 h-px bg-gradient-to-r from-transparent to-black/20"
              />
              <span className="text-black/20 text-[9.2px]">›</span>
            </div>

            <span className="text-[13.8px] font-sans font-bold tracking-[0.22em] uppercase text-black/30 shrink-0">Logan</span>

            {/* Flèche droite */}
            <div className="flex items-center gap-0.5 flex-row-reverse">
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                whileInView={{ scaleX: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: 'right' }}
                className="w-10 h-px bg-gradient-to-l from-transparent to-black/20"
              />
              <span className="text-black/20 text-[9.2px]">‹</span>
            </div>
          </div>
          {/* Mobile : juste Logan */}
          <span className="md:hidden text-[13.8px] font-sans font-bold tracking-[0.22em] uppercase text-black/30">Logan</span>

          <p className="font-sans font-light text-[0.9rem] leading-[1.75] text-black/35 max-w-[160px]">
            Votre seul intermédiaire, de l'intention à la signature.
          </p>
        </motion.div>

        {/* Candidats */}
        <motion.div variants={fadeUp} className="px-0 md:pl-12 py-10 flex flex-col gap-6">
          <span className="text-[13.8px] font-sans font-bold tracking-[0.22em] uppercase text-black/30">Candidats</span>
          <h3 className="font-serif font-[300] text-[1.44rem] text-black leading-snug italic">
            Reprenez le contrôle.
          </h3>
          <div className="w-6 h-px bg-black/15" />
          <div className="flex flex-col gap-5">
            <p className="font-sans font-light text-[1.01rem] leading-[1.8] text-black/55 text-justify">
              <span className="text-black/75 font-bold">Restez en alerte et attractif</span> : notification en temps réel des nouvelles opportunités ou marques d'intérêt des cabinets pour votre profil présentée sur une base anonyme.
            </p>
            <div className="w-4 h-px bg-black/10" />
            <p className="font-sans font-light text-[1.01rem] leading-[1.8] text-black/55 text-justify">
              <span className="text-black/75 font-bold">Profitez d'un accompagnement dédié</span> : pour chaque opportunité, un consultant dédié est à vos côtés pour intégrer votre projet et assurer la pertinence de chaque rencontre.
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
        {[
          { label: 'Confidentialité', bold: true },
          { label: 'Réactivité', bold: false },
          { label: 'Anonymat', bold: true },
          { label: 'Accompagnement', bold: false },
          { label: 'Transparence', bold: true },
        ].map(({ label, bold }) => (
          <motion.span
            key={label}
            variants={fadeUp}
            className={`text-[11.5px] font-sans tracking-[0.2em] uppercase ${bold ? 'font-bold text-black/60' : 'font-normal text-black/40'}`}
          >
            {label}
          </motion.span>
        ))}
      </motion.div>

    </div>
  </section>
);

export default MissionSection;
