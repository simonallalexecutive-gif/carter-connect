import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

interface RowProps {
  num: string;
  title: string;
  text: string;
}

const Row = ({ num, title, text }: RowProps) => (
  <motion.div
    variants={fadeUp}
    className="group grid grid-cols-12 gap-6 md:gap-10 py-8 md:py-10 border-t border-white/[0.08] hover:border-white/[0.18] transition-colors duration-500"
  >
    <div className="col-span-2 md:col-span-1">
      <span className="font-serif text-sm md:text-base text-white/30 group-hover:text-white/60 transition-colors duration-500">
        {num}
      </span>
    </div>
    <h4 className="col-span-10 md:col-span-5 font-serif text-lg md:text-2xl leading-[1.25] text-white/90 tracking-[-0.01em]">
      {title}
    </h4>
    <p className="col-span-12 md:col-span-6 font-sans text-[0.9rem] md:text-[0.95rem] leading-[1.85] text-white/45 group-hover:text-white/65 text-justify transition-colors duration-500">
      {text}
    </p>
  </motion.div>
);

const FonctionnementSection = () => {
  return (
    <section className="relative overflow-hidden" style={{ background: '#111111' }}>
      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(255,255,255,0.04), transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 py-24 md:py-36">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase font-sans font-semibold text-white/40">
            Le rôle de Logan
          </span>
        </motion.div>

        {/* Headline + lead */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20 items-end mb-20 md:mb-28"
        >
          <motion.h2
            variants={fadeUp}
            className="lg:col-span-8 font-serif text-[2.25rem] sm:text-5xl md:text-[4.25rem] leading-[1.05] tracking-[-0.015em] text-white font-normal"
          >
            Deux visions,
            <br />
            <span className="italic text-white/70">un seul intermédiaire.</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="lg:col-span-4 pb-2 font-sans text-base md:text-lg text-white/45 leading-[1.7] max-w-sm font-light"
          >
            Logan opère chaque rapprochement — de l'intention à la signature — dans un cadre confidentiel, structuré et transparent.
          </motion.p>
        </motion.div>

        {/* Two columns — synthétique */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
          {/* Cabinets */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            <motion.div variants={fadeUp} className="flex items-baseline justify-between mb-6">
              <h3 className="font-sans text-[11px] uppercase tracking-[0.25em] text-white/85 font-semibold">
                Cabinets
              </h3>
              <ArrowUpRight className="w-4 h-4 text-white/30" strokeWidth={1.4} />
            </motion.div>

            <Row
              num="01"
              title="Recrutez en toute confidentialité."
              text="Un pool de candidats qualifiés, sans jamais exposer l'identité de votre cabinet."
            />
            <Row
              num="02"
              title="Anticipez le marché."
              text="Une vision continue des meilleurs profils, pour tous vos départements."
            />
          </motion.div>

          {/* Candidats */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            <motion.div variants={fadeUp} className="flex items-baseline justify-between mb-6">
              <h3 className="font-sans text-[11px] uppercase tracking-[0.25em] text-white/85 font-semibold">
                Candidats
              </h3>
              <ArrowUpRight className="w-4 h-4 text-white/30" strokeWidth={1.4} />
            </motion.div>

            <Row
              num="01"
              title="Accédez aux meilleures opportunités."
              text="Étudiez chaque opportunité avec un consultant, en amont de tout rapprochement."
            />
            <Row
              num="02"
              title="Restez visible. Restez anonyme."
              text="Dès qu'un cabinet manifeste un intérêt, Logan vous accompagne — sans jamais révéler votre identité."
            />
          </motion.div>
        </div>

        {/* Inline pillars — réduits */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="mt-20 md:mt-24 pt-10 border-t border-white/[0.08] flex flex-wrap items-center justify-center gap-x-12 gap-y-4"
        >
          {['Confidentialité', 'Exclusivité', 'Accompagnement'].map((label) => (
            <motion.span
              key={label}
              variants={fadeUp}
              className="font-sans text-[10px] uppercase tracking-[0.22em] text-white/40 hover:text-white/80 transition-colors duration-500"
            >
              {label}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FonctionnementSection;
