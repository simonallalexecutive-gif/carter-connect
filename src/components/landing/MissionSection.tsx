import { motion } from 'motion/react';
import { Building2, User, Lock, Zap, Star, Shield, Users, CheckCircle } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14 } },
};

interface SidePoint {
  title: string;
  text: string;
}

const Side = ({
  icon: Icon,
  label,
  tagline,
  points,
  align,
}: {
  icon: React.ElementType;
  label: string;
  tagline: string;
  points: SidePoint[];
  align: 'left' | 'right';
}) => (
  <motion.div
    variants={stagger}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: '-60px' }}
    className={`flex flex-col gap-10 md:gap-12 ${align === 'right' ? 'md:items-end md:text-right' : 'md:items-start md:text-left'} items-start text-left`}
  >
    <motion.div variants={fadeUp} className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-full border border-black/10 flex items-center justify-center">
        <Icon className="w-4 h-4 text-black/70" strokeWidth={1.4} />
      </div>
      <div>
        <p className="text-[10px] font-sans font-medium tracking-[0.28em] uppercase text-black/40">{label}</p>
        <p className="font-serif text-[1.05rem] md:text-[1.15rem] text-black/90 italic mt-1">{tagline}</p>
      </div>
    </motion.div>

    <motion.div variants={fadeUp} className="w-10 h-px bg-black/15" />

    <div className="flex flex-col gap-8 md:gap-10 w-full max-w-sm">
      {points.map((p, i) => (
        <motion.div
          key={i}
          variants={fadeUp}
          className={`flex flex-col gap-2 ${align === 'right' ? 'md:items-end' : ''}`}
        >
          <div className="flex items-baseline gap-3">
            <span className="font-serif text-[0.7rem] text-black/35 tracking-[0.15em] tabular-nums">
              0{i + 1}
            </span>
            <h4
              className="font-sans text-[0.8rem] md:text-[0.85rem] text-black tracking-[0.18em] leading-snug font-semibold uppercase"
              style={{ fontVariant: 'small-caps' }}
            >
              {p.title}
            </h4>
          </div>
          <p className={`font-sans text-[0.82rem] md:text-[0.86rem] leading-[1.75] text-black/55 font-light ${align === 'right' ? 'md:text-right' : ''}`}>
            {p.text}
          </p>

        </motion.div>
      ))}
    </div>
  </motion.div>
);

const MissionSection = () => (
  <section id="notre-approche" className="relative overflow-hidden bg-white">
    {/* Subtle background veil */}
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none opacity-[0.025]"
      style={{
        backgroundImage:
          'linear-gradient(rgba(0,0,0,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.6) 1px, transparent 1px)',
        backgroundSize: '96px 96px',
      }}
    />

    <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 py-28 md:py-44">
      {/* Header */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="mb-24 md:mb-32 max-w-3xl"
      >
        <motion.p variants={fadeUp} className="text-[11px] font-sans font-medium tracking-[0.3em] uppercase text-black/40 mb-6">
          Notre approche
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="font-serif text-[2rem] sm:text-4xl md:text-[3rem] leading-[1.08] text-black tracking-[-0.02em] mb-8"
        >
          Deux perspectives,<br />
          <span className="italic text-black/85">un seul intermédiaire : Logan.</span>
        </motion.h2>

        <motion.p
          variants={fadeUp}
          className="font-sans text-[0.95rem] md:text-[1.02rem] font-[480] leading-[1.7] text-black/55 max-w-2xl"
        >
          Logan est la nouvelle infrastructure privilégiée et confidentielle du marché des avocats —
          un écosystème exigeant, où chaque rapprochement est orchestré de l'intention à la signature.
        </motion.p>
      </motion.div>

      {/* Axis — Cabinets | Logan | Candidats */}
      <div className="relative grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-12 md:gap-0 items-start">
        {/* Cabinets */}
        <div className="md:pr-16">
          <Side
            icon={Building2}
            label="Cabinets"
            tagline="Vivez votre marché."
            points={[
              {
                title: 'Recherches strictement confidentielles',
                text: "Adressez-vous à un pool de candidats qualifiés, sans jamais exposer l'identité de votre cabinet.",
              },
              {
                title: 'Vision consolidée du marché',
                text: 'Anticipez vos recrutements stratégiques pour chacun de vos départements.',
              },
            ]}
            align="right"
          />
        </div>

        {/* Central Logan axis */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="hidden md:flex flex-col items-center self-stretch px-6"
        >
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: 'top' }}
            className="w-px flex-1 bg-gradient-to-b from-black/[0.04] via-black/20 to-black/[0.04] min-h-[60px]"
          />
          <div className="my-5 flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center shadow-[0_12px_40px_-8px_rgba(0,0,0,0.4)]">
              <span className="font-serif text-white text-[0.95rem] tracking-[-0.01em]">L</span>
            </div>
            <span className="font-serif text-[0.95rem] tracking-[-0.01em] text-black/80">Logan</span>
            <span className="text-[10px] font-sans tracking-[0.25em] uppercase text-black/35">
              Intermédiaire
            </span>
          </div>
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: 'top' }}
            className="w-px flex-1 bg-gradient-to-b from-black/[0.04] via-black/20 to-black/[0.04] min-h-[60px]"
          />
        </motion.div>

        {/* Mobile Logan separator */}
        <div className="md:hidden flex items-center gap-4 my-2">
          <div className="flex-1 h-px bg-black/10" />
          <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center">
            <span className="font-serif text-white text-sm">L</span>
          </div>
          <div className="flex-1 h-px bg-black/10" />
        </div>

        {/* Candidats */}
        <div className="md:pl-16">
          <Side
            icon={User}
            label="Candidats"
            tagline="Préservez votre identité."
            points={[
              {
                title: 'Accès aux meilleures opportunités',
                text: "Étudiez chaque opportunité au regard de votre projet, en échangeant en amont avec un consultant dédié.",
              },
              {
                title: 'Attractivité sans compromis',
                text: "Restez visible des cabinets qui vous intéressent — sans jamais sacrifier votre anonymat.",
              },
            ]}
            align="left"
          />
        </div>
      </div>

      {/* Bottom pillars */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        className="mt-28 md:mt-36"
      >
        <motion.div variants={fadeUp} className="w-full h-px mb-14 bg-gradient-to-r from-transparent via-black/10 to-transparent" />
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-8 md:gap-6 max-w-4xl mx-auto">
          {[
            { icon: Lock, label: 'Confidentialité' },
            { icon: Zap, label: 'Réactivité' },
            { icon: Star, label: 'Exclusivité' },
            { icon: Shield, label: 'Anonymat' },
            { icon: Users, label: 'Accompagnement' },
            { icon: CheckCircle, label: 'Transparence' },
          ].map(({ icon: Icon, label }) => (
            <motion.div key={label} variants={fadeUp} className="flex flex-col items-center text-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center border border-black/10">
                <Icon className="w-4 h-4 text-black/55" strokeWidth={1.4} />
              </div>
              <span className="font-sans text-[0.7rem] font-medium tracking-[0.12em] uppercase text-black/50">
                {label}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

export default MissionSection;
