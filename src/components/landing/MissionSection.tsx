import { motion } from 'motion/react';
import { Shield, Eye, Compass } from 'lucide-react';

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
    icon: Shield,
    title: 'Confidentialité absolue',
    desc: 'Logan préserve l'anonymat de chaque partie en amont de tout rapprochement potentiel. Aucune information n'est partagée sans accord explicite.',
  },
  {
    icon: Eye,
    title: 'Écosystème qualifié',
    desc: 'Chaque interaction est qualifiée, chaque rapprochement orchestré avec précision au sein d'un réseau réunissant les acteurs les plus prestigieux du marché.',
  },
  {
    icon: Compass,
    title: 'Accompagnement sur-mesure',
    desc: 'Logan est le seul intermédiaire. Nous pilotons chaque étape du processus, de l'identification à la finalisation du rapprochement.',
  },
];

const MissionSection = () => (
  <section id="notre-approche" className="relative overflow-hidden bg-white">
    <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-8 lg:px-10 py-20 md:py-36">

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="text-center mb-16 md:mb-24"
      >
        <motion.p variants={fadeUp} className="text-[11px] font-sans font-medium tracking-[0.25em] uppercase text-black/30 mb-6">
          Notre approche
        </motion.p>
        <motion.h2 variants={fadeUp} className="font-serif text-3xl sm:text-4xl md:text-[3rem] leading-[1.15] text-black mb-8 max-w-4xl mx-auto">
          Une infrastructure confidentielle de marché pour des rapprochements stratégiques ciblés
        </motion.h2>
        <motion.p variants={fadeUp} className="font-sans text-[1.05rem] md:text-lg leading-[1.9] text-black/55 max-w-3xl mx-auto">
          Logan structure, encadre et accompagne un écosystème discret et exigeant, réunissant les acteurs les plus prestigieux du marché des avocats d'affaires.
        </motion.p>
      </motion.div>

      {/* Pillar cards */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
      >
        {pillars.map((p) => (
          <motion.div
            key={p.title}
            variants={fadeUp}
            className="group relative border border-black/[0.08] rounded-sm px-7 py-8 hover:border-black/20 transition-colors duration-500"
          >
            <div className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center mb-5 group-hover:border-black/25 transition-colors duration-500">
              <p.icon className="w-4.5 h-4.5 text-black/40 group-hover:text-black/70 transition-colors duration-500" strokeWidth={1.5} />
            </div>
            <h3 className="font-serif text-lg text-black mb-3 tracking-[-0.01em]">{p.title}</h3>
            <p className="font-sans text-sm leading-[1.8] text-black/45 font-light">{p.desc}</p>
          </motion.div>
        ))}
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
