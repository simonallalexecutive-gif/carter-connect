import { motion } from 'motion/react';
import { Shield, Eye, Brain, Users } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

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
          Un réseau absolument confidentiel.
        </motion.h2>
        <motion.p variants={fadeUp} className="font-serif text-xl sm:text-2xl md:text-[1.7rem] leading-[1.4] text-white/40 max-w-3xl">
          Au service des acteurs les plus prestigieux du marché des avocats.
        </motion.p>
      </motion.div>

      {/* Core mission statement */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-20 md:mb-28"
      >
        <div className="border-l-2 border-white/10 pl-8 md:pl-12 max-w-3xl">
          <p className="font-sans text-[1.05rem] md:text-lg leading-[1.8] text-white/60">
            Logan agit comme un intermédiaire discret, intervenant uniquement lorsque des rapprochements stratégiques apparaissent pertinents. Le marché peut ainsi se découvrir sans se voir — chaque acteur conservant un anonymat absolu.
          </p>
        </div>
      </motion.div>

      {/* Two sides — Cabinets & Candidats */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-20 md:mb-28"
      >
        <p className="font-sans text-sm font-medium tracking-[0.15em] uppercase text-white/25 mb-10">
          Un accès permanent au marché
        </p>
        <div className="grid md:grid-cols-2 gap-6 md:gap-10">
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-sm p-8 md:p-10">
            <p className="font-sans text-xs font-medium tracking-[0.2em] uppercase text-white/30 mb-4">Cabinets</p>
            <p className="font-sans text-base leading-[1.7] text-white/55">
              Publiez vos mandats de manière simplifiée, attirez les talents les plus prestigieux tout au long de l'année, sans jamais exposer votre identité ni celle des candidats.
            </p>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-sm p-8 md:p-10">
            <p className="font-sans text-xs font-medium tracking-[0.2em] uppercase text-white/30 mb-4">Candidats</p>
            <p className="font-sans text-base leading-[1.7] text-white/55">
              Accédez à un vivier de mandats rares, rigoureusement sélectionnés. Suscitez l'intérêt des meilleurs cabinets sans jamais vous rendre visible.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Transformation — proactive model */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-20 md:mb-28 text-center max-w-3xl mx-auto"
      >
        <p className="font-sans text-[1.05rem] md:text-lg leading-[1.8] text-white/50">
          Avec Logan, les cabinets restent connectés à leur marché de manière{' '}
          <span className="text-white/70 font-medium">proactive et continue</span>, grâce à un abonnement combiné à un success fee réduit. Une dynamique permanente qui{' '}
          <span className="text-white/70 font-medium">optimise chaque opportunité de connexion</span>.
        </p>
      </motion.div>

      {/* Model pillars */}
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
          {[
            {
              icon: Shield,
              title: 'Confidentialité absolue',
              desc: 'Cabinets et candidats interagissent sans jamais exposer leur identité. Un espace sécurisé, structuré et transparent.',
            },
            {
              icon: Eye,
              title: 'Visibilité continue',
              desc: 'Le marché devient permanent, lisible et activable à tout moment. Les meilleures rencontres ne dépendent plus du timing.',
            },
            {
              icon: Brain,
              title: 'IA + Humain',
              desc: "L'IA optimise la détection et le matching. L'humain garantit la pertinence et la réussite de chaque alliance stratégique.",
            },
          ].map(({ icon: Icon, title, desc }) => (
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

      {/* Closing */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="text-center"
      >
        <p className="font-serif text-xl sm:text-2xl md:text-[1.8rem] leading-[1.4] text-white/35 max-w-2xl mx-auto">
          Logan réinvente la chasse de tête&nbsp;:<br />
          <span className="text-white/60">un espace collaboratif, structuré, transparent, et toujours en mouvement.</span>
        </p>
      </motion.div>
    </div>
  </section>
);

export default MissionSection;
