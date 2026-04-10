import { motion } from 'motion/react';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const MissionSection = () => (
  <section id="notre-approche" className="relative overflow-hidden bg-white">
    <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-8 lg:px-10 py-20 md:py-36">

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="text-center mb-12 md:mb-20"
      >
        <motion.p variants={fadeUp} className="text-[11px] font-sans font-medium tracking-[0.25em] uppercase text-black/30 mb-6">
          Notre approche
        </motion.p>
        <motion.h2 variants={fadeUp} className="font-serif text-3xl sm:text-4xl md:text-[3rem] leading-[1.15] text-black mb-8 max-w-4xl mx-auto">
          Une infrastructure confidentielle de marché pour des rapprochements stratégiques ciblés
        </motion.h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-3xl mx-auto text-center"
      >
        <p className="font-sans text-[1.05rem] md:text-lg leading-[1.9] text-black/55">
          Logan structure, encadre et accompagne un écosystème discret et exigeant, réunissant les acteurs les plus prestigieux du marché des avocats d'affaires. Chaque interaction est qualifiée, chaque rapprochement est orchestré avec précision, dans une exigence absolue de confidentialité.
        </p>
      </motion.div>

      {/* Minimal separator */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="w-16 h-px bg-black/15 mx-auto my-14 origin-center"
      />

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="font-sans text-sm md:text-base leading-[1.8] text-black/40 text-center max-w-2xl mx-auto"
      >
        Logan préserve l'anonymat de chaque partie et intervient à leurs côtés pour les accompagner lorsque des rapprochements stratégiques s'imposent.
      </motion.p>
    </div>
  </section>
);

export default MissionSection;
