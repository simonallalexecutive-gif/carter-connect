import { motion } from 'motion/react';
import { Shield, Eye, Zap, Brain, Users, Target } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const pillars = [
  {
    icon: Eye,
    title: 'Visibilité continue',
    desc: 'Le marché devient permanent, lisible et activable à tout moment.',
  },
  {
    icon: Shield,
    title: 'Confidentialité absolue',
    desc: 'Cabinets et candidats interagissent sans jamais exposer leur identité.',
  },
  {
    icon: Brain,
    title: 'IA + Humain',
    desc: "L'IA optimise la détection et le matching. L'humain garantit la justesse.",
  },
];

const results = [
  { icon: Target, text: 'Un accès permanent à un vivier hautement qualifié' },
  { icon: Zap, text: 'Une lecture en temps réel du marché' },
  { icon: Users, text: "Une capacité unique à capter les opportunités avant qu'elles n'existent" },
];

const MissionSection = () => (
  <section className="relative bg-[hsl(0,0%,4%)] overflow-hidden">
    {/* Subtle gradient accents */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-radial from-white/[0.02] to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[300px] bg-gradient-radial from-white/[0.015] to-transparent rounded-full blur-3xl" />
    </div>

    <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-24 md:py-36">
      {/* Header */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="mb-20 md:mb-28"
      >
        <motion.p variants={fadeUp} className="text-[11px] font-sans font-medium tracking-[0.25em] uppercase text-white/30 mb-6">
          Notre raison d'être
        </motion.p>
        <motion.h2 variants={fadeUp} className="font-serif text-3xl sm:text-4xl md:text-[3.2rem] leading-[1.15] text-white/90 mb-8 max-w-3xl">
          Logan n'est pas une plateforme de recrutement.
        </motion.h2>
        <motion.p variants={fadeUp} className="font-serif text-xl sm:text-2xl md:text-[1.7rem] leading-[1.4] text-white/40 max-w-3xl">
          C'est une infrastructure confidentielle de marché.
        </motion.p>
      </motion.div>

      {/* Core statement */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-20 md:mb-28"
      >
        <div className="border-l-2 border-white/10 pl-8 md:pl-12 max-w-3xl">
          <p className="font-sans text-[1.05rem] md:text-lg leading-[1.8] text-white/60">
            Nous connectons, en toute discrétion, les acteurs les plus prestigieux du marché des avocats — cabinets d'élite et talents rares — sans jamais exposer leur identité.
          </p>
        </div>
      </motion.div>

      {/* How it works — two sides */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-20 md:mb-28"
      >
        <p className="font-sans text-sm font-medium tracking-[0.15em] uppercase text-white/25 mb-10">
          Un marché continu, visible et activable
        </p>
        <div className="grid md:grid-cols-2 gap-6 md:gap-10">
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-sm p-8 md:p-10">
            <p className="font-sans text-xs font-medium tracking-[0.2em] uppercase text-white/30 mb-4">Cabinets</p>
            <p className="font-sans text-base leading-[1.7] text-white/55">
              Attirent les meilleurs profils sans se dévoiler.
            </p>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-sm p-8 md:p-10">
            <p className="font-sans text-xs font-medium tracking-[0.2em] uppercase text-white/30 mb-4">Candidats</p>
            <p className="font-sans text-base leading-[1.7] text-white/55">
              Suscitent de l'intérêt sans se rendre visibles.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Transformation statement */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-20 md:mb-28 text-center max-w-3xl mx-auto"
      >
        <p className="font-sans text-[1.05rem] md:text-lg leading-[1.8] text-white/50">
          Logan transforme le recrutement, en passant d'une logique{' '}
          <span className="text-white/70 font-medium">ponctuelle et opaque</span> à une approche{' '}
          <span className="text-white/70 font-medium">proactive, fluide et opportuniste</span>, où les meilleures rencontres ne dépendent plus du timing, mais de la{' '}
          <span className="text-white/70 font-medium">pertinence</span>.
        </p>
      </motion.div>

      {/* Three pillars */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="mb-20 md:mb-28"
      >
        <motion.p variants={fadeUp} className="font-sans text-sm font-medium tracking-[0.15em] uppercase text-white/25 mb-10">
          Notre modèle
        </motion.p>
        <div className="grid md:grid-cols-3 gap-px bg-white/[0.06] rounded-sm overflow-hidden">
          {pillars.map(({ icon: Icon, title, desc }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              className="bg-[hsl(0,0%,4%)] p-8 md:p-10 flex flex-col"
            >
              <Icon className="w-5 h-5 text-white/25 mb-6" strokeWidth={1.5} />
              <h3 className="font-sans text-sm font-semibold tracking-wide text-white/80 mb-3">{title}</h3>
              <p className="font-sans text-sm leading-[1.7] text-white/40">{desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Results */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="mb-20 md:mb-28"
      >
        <motion.p variants={fadeUp} className="font-sans text-sm font-medium tracking-[0.15em] uppercase text-white/25 mb-10">
          Résultat
        </motion.p>
        <div className="space-y-4">
          {results.map(({ icon: Icon, text }) => (
            <motion.div
              key={text}
              variants={fadeUp}
              className="flex items-start gap-5 py-5 border-b border-white/[0.06] last:border-0"
            >
              <Icon className="w-4 h-4 text-white/20 mt-1 flex-shrink-0" strokeWidth={1.5} />
              <p className="font-sans text-base leading-[1.6] text-white/55">{text}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Closing statement */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="text-center"
      >
        <p className="font-serif text-xl sm:text-2xl md:text-[1.8rem] leading-[1.4] text-white/35 max-w-2xl mx-auto">
          Logan réinvente la chasse de tête&nbsp;:<br />
          <span className="text-white/60">plus confidentielle, plus intelligente, plus continue.</span>
        </p>
      </motion.div>
    </div>
  </section>
);

export default MissionSection;
