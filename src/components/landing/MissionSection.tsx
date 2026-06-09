import { motion } from 'motion/react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13 } },
};

const COLS = [
  {
    num: '01',
    title: 'Pour les cabinets',
    body: 'Accédez à un vivier de profils qualifiés et pré-sélectionnés par des consultants spécialisés — en toute confidentialité, sans jamais exposer l\'identité de votre cabinet.',
  },
  {
    num: '02',
    title: 'Pour les candidats',
    body: 'Restez visible des cabinets qui vous intéressent, étudiez chaque opportunité en amont avec un consultant dédié — sans jamais sacrifier votre anonymat.',
  },
  {
    num: '03',
    title: 'Un seul intermédiaire',
    body: 'Logan orchestre chaque rapprochement de l\'intention à la signature, dans un cadre structuré, sécurisé et strictement confidentiel.',
  },
];

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
          className="font-serif font-[300] text-[2rem] sm:text-[2.8rem] md:text-[3.4rem] text-white leading-[1.06] tracking-normal max-w-2xl"
        >
          Deux perspectives,<br />
          <em className="italic">un seul intermédiaire.</em>
        </motion.h2>
      </motion.div>

      {/* 3 colonnes */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/8"
      >
        {COLS.map((c) => (
          <motion.div
            key={c.num}
            variants={fadeUp}
            className="bg-black px-8 py-10 flex flex-col gap-6"
          >
            <span className="font-serif text-[11px] text-white/20 tracking-widest">{c.num}</span>
            <h3 className="font-serif font-[300] text-[1.25rem] text-white leading-snug">
              {c.title}
            </h3>
            <div className="w-6 h-px bg-white/15" />
            <p className="font-sans font-light text-[0.88rem] leading-[1.8] text-white/45">
              {c.body}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Ligne de valeurs */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        className="mt-20 md:mt-24 flex flex-wrap gap-x-10 gap-y-4"
      >
        {['Confidentialité', 'Réactivité', 'Exclusivité', 'Anonymat', 'Accompagnement', 'Transparence'].map((word, i) => (
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
