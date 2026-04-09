import { motion } from 'motion/react';
import { Building2, UserCheck, Shield, Cpu } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const MissionSection = () => (
  <section className="relative overflow-hidden bg-white">
    <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-8 lg:px-10 py-20 md:py-36">

      {/* ── Header ── */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="mb-14 md:mb-20 text-center"
      >
        <motion.p variants={fadeUp} className="text-[11px] font-sans font-medium tracking-[0.25em] uppercase text-black/35 mb-6">
          Notre approche
        </motion.p>
        <motion.h2 variants={fadeUp} className="font-serif text-3xl sm:text-4xl md:text-[3rem] leading-[1.15] text-black/90 mb-5 max-w-2xl mx-auto">
          Une infrastructure confidentielle de marché
        </motion.h2>
        <motion.p variants={fadeUp} className="font-sans text-base md:text-lg leading-[1.7] text-black/50 max-w-2xl mx-auto">
          Logan structure un écosystème discret réunissant les acteurs les plus prestigieux du marché des avocats d'affaires, dans une exigence absolue de confidentialité.
        </motion.p>
      </motion.div>

      {/* ── Piliers ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="grid sm:grid-cols-2 gap-5 md:gap-6 mb-16 md:mb-20"
      >
        {[
          { icon: Shield, title: 'Confidentialité absolue', desc: 'Anonymat garanti pour chaque partie à chaque étape du processus.' },
          { icon: Cpu, title: 'Technologie & expertise', desc: 'Un matching intelligent, validé et enrichi par l'intervention humaine.' },
          { icon: Building2, title: 'Accès continu', desc: 'Un vivier qualifié accessible en permanence, tous départements confondus.' },
          { icon: UserCheck, title: 'Accompagnement sur-mesure', desc: 'Un consultant dédié qui orchestre chaque rapprochement stratégique.' },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="border border-black/[0.08] rounded-sm p-7 md:p-9 bg-black/[0.02]">
            <Icon className="w-5 h-5 text-black/25 mb-4" strokeWidth={1.5} />
            <p className="font-serif text-lg font-medium text-black/85 mb-2">{title}</p>
            <p className="font-sans text-sm leading-[1.7] text-black/45">{desc}</p>
          </div>
        ))}
      </motion.div>

      {/* ── Two sides — Cabinets / Candidats ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {/* Cabinets */}
          <div className="border border-black/[0.08] rounded-sm p-8 md:p-10 bg-black/[0.03]">
            <Building2 className="w-5 h-5 text-black/25 mb-5" strokeWidth={1.5} />
            <p className="font-sans text-xs font-medium tracking-[0.2em] uppercase text-black/30 mb-2">Cabinets</p>
            <p className="font-serif text-lg md:text-xl font-medium text-black/85 mb-3">
              Vivez votre marché, ne le subissez plus.
            </p>
            <p className="font-sans text-sm leading-[1.75] text-black/45">
              Accédez en temps réel à la dynamique de votre marché et restez opportuniste dans vos recrutements — dans une confidentialité totale.
            </p>
          </div>
          {/* Candidats */}
          <div className="border border-black/[0.08] rounded-sm p-8 md:p-10 bg-black/[0.03]">
            <UserCheck className="w-5 h-5 text-black/25 mb-5" strokeWidth={1.5} />
            <p className="font-sans text-xs font-medium tracking-[0.2em] uppercase text-black/30 mb-2">Candidats</p>
            <p className="font-serif text-lg md:text-xl font-medium text-black/85 mb-3">
              Restez attractif, en toute discrétion.
            </p>
            <p className="font-sans text-sm leading-[1.75] text-black/45">
              Bénéficiez d'une visibilité inégalée sur votre marché, tout en préservant votre identité — avec un consultant à vos côtés à chaque étape.
            </p>
          </div>
        </div>
      </motion.div>

    </div>
  </section>
);

export default MissionSection;
