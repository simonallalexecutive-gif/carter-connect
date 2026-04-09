import { motion } from 'motion/react';
import { Shield, Cpu, Building2, UserCheck } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const pillars = [
  { icon: Shield, title: 'Confidentialité absolue', desc: 'Anonymat garanti pour chaque partie à chaque étape du processus.' },
  { icon: Cpu, title: 'Technologie & expertise', desc: "Un matching intelligent, validé et enrichi par l'intervention humaine." },
  { icon: Building2, title: 'Accès continu', desc: 'Un vivier qualifié accessible en permanence, tous départements confondus.' },
  { icon: UserCheck, title: 'Accompagnement sur-mesure', desc: 'Un consultant dédié qui orchestre chaque rapprochement stratégique.' },
];

const MissionSection = () => (
  <section className="relative overflow-hidden bg-white">
    <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-8 lg:px-10 py-28 md:py-40">

      {/* Header */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="mb-20 md:mb-28 max-w-3xl"
      >
        <motion.p variants={fadeUp} className="text-[11px] font-sans font-medium tracking-[0.25em] uppercase text-black/30 mb-6">
          Notre approche
        </motion.p>
        <motion.h2 variants={fadeUp} className="font-serif text-3xl sm:text-4xl md:text-[3rem] leading-[1.12] text-black mb-6">
          Une infrastructure confidentielle<br className="hidden md:inline" /> de marché
        </motion.h2>
        <motion.p variants={fadeUp} className="font-sans text-base md:text-lg leading-[1.7] text-black/45">
          Logan structure un écosystème discret réunissant les acteurs les plus prestigieux du marché des avocats d'affaires, dans une exigence absolue de confidentialité.
        </motion.p>
      </motion.div>

      {/* Pillars — editorial stacked layout */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="mb-24 md:mb-32"
      >
        <div className="grid md:grid-cols-2 gap-0">
          {pillars.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              variants={fadeUp}
              className={`p-8 md:p-10 ${i < 2 ? 'border-b border-black/[0.06]' : ''} ${i % 2 === 0 ? 'md:border-r border-black/[0.06]' : ''}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-black/[0.04] flex items-center justify-center">
                  <Icon className="w-4 h-4 text-black/30" strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-lg font-medium text-black/85">{title}</h3>
              </div>
              <p className="font-sans text-sm leading-[1.75] text-black/40 pl-11">{desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Citation Logan — full-width editorial */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        <div className="border-t border-black/[0.06] pt-16 md:pt-20">
          <div className="grid md:grid-cols-[1fr_2fr] gap-8 md:gap-16 items-start">
            <div>
              <span className="font-serif text-7xl md:text-8xl text-black/[0.06] leading-none select-none block -mb-4">"</span>
              <span className="text-[10px] font-sans font-medium tracking-[0.2em] uppercase text-black/25 block mt-6">
                — L'équipe Logan
              </span>
            </div>
            <p className="font-serif text-xl md:text-[1.65rem] text-black/55 italic font-normal leading-[1.55] tracking-[-0.01em]">
              Logan se positionne comme la plateforme la plus exigeante et structurée du marché, offrant un accompagnement sur mesure, résolument confidentiel et parfaitement ciblé.
            </p>
          </div>
        </div>
      </motion.div>

    </div>
  </section>
);

export default MissionSection;
