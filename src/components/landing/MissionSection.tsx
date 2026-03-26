import { motion } from 'motion/react';
import { Shield, Eye, Brain, Handshake, Building2, UserCheck } from 'lucide-react';

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

      {/* ── Header ── */}
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

      {/* ── Manifesto ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-20 md:mb-28"
      >
        <div className="border-l-2 border-white/10 pl-8 md:pl-12 max-w-3xl">
          <p className="font-sans text-[1.05rem] md:text-lg leading-[1.8] text-white/60">
            Logan structure un écosystème discret et exigeant, réunissant les acteurs les plus prestigieux du marché des avocats d'affaires. Un environnement fermé, fondé sur la sélection, où cabinets et talents accèdent en continu à un réseau hautement qualifié et à des profils rares, rigoureusement identifiés.
          </p>
        </div>
      </motion.div>

      {/* ── Two sides — Cabinets / Candidats ── */}
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
            <Building2 className="w-5 h-5 text-white/25 mb-5" strokeWidth={1.5} />
            <p className="font-sans text-xs font-medium tracking-[0.2em] uppercase text-white/30 mb-4">Cabinets</p>
            <p className="font-sans text-base leading-[1.7] text-white/55">
              Un accès permanent au marché, permettant d'anticiper les recrutements dans une logique proactive, via un modèle par abonnement complété d'un success fee maîtrisé.
            </p>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-sm p-8 md:p-10">
            <UserCheck className="w-5 h-5 text-white/25 mb-5" strokeWidth={1.5} />
            <p className="font-sans text-xs font-medium tracking-[0.2em] uppercase text-white/30 mb-4">Candidats</p>
            <p className="font-sans text-base leading-[1.7] text-white/55">
              Un cadre structuré et confidentiel, offrant une visibilité constante auprès des meilleurs cabinets, sans jamais compromettre leur anonymat.
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── Market insight ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-20 md:mb-28"
      >
        <div className="border-l-2 border-white/10 pl-8 md:pl-12 max-w-3xl">
          <p className="font-sans text-[1.05rem] md:text-lg leading-[1.8] text-white/60">
            Le marché des avocats d'affaires ne se limite pas à des besoins ponctuels. Il repose sur des équilibres subtils, des temporalités spécifiques et des opportunités souvent informelles. Logan en donne un accès continu, permettant d'identifier et d'engager, avec discernement, les profils les plus pertinents — y compris les plus difficiles à capter.
          </p>
        </div>
      </motion.div>

      {/* ── Technology + Human ── */}
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
              icon: Brain,
              title: 'Technologie',
              desc: 'La technologie permet de structurer et de rendre lisible l\'information.',
            },
            {
              icon: Eye,
              title: 'Expertise humaine',
              desc: 'L\'intervention humaine en garantit l\'analyse, la justesse et l\'exigence.',
            },
            {
              icon: Shield,
              title: 'Qualité des rapprochements',
              desc: 'C\'est de cette combinaison que naît la qualité des rapprochements opérés.',
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

      {/* ── Orchestration ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-20 md:mb-28 text-center max-w-3xl mx-auto"
      >
        <Handshake className="w-6 h-6 text-white/20 mx-auto mb-6" strokeWidth={1.5} />
        <p className="font-sans text-[1.05rem] md:text-lg leading-[1.8] text-white/50">
          Lorsqu'une rencontre apparaît pertinente, Logan en évalue la cohérence et en orchestre la mise en relation, avant d'accompagner chaque partie avec rigueur tout au long du processus.
        </p>
      </motion.div>

      {/* ── Closing statement ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="text-center"
      >
        <p className="font-serif text-xl sm:text-2xl md:text-[1.8rem] leading-[1.4] text-white/35 max-w-2xl mx-auto mb-6">
          Logan connecte, en toute discrétion, les cabinets d'affaires et les talents les plus qualifiés du marché, sans jamais exposer leur identité.
        </p>
        <p className="font-sans text-sm leading-[1.7] text-white/25 max-w-xl mx-auto">
          Un environnement unique, où coexistent en continu les acteurs les plus exigeants et des profils qui ne se rendent visibles nulle part ailleurs.
        </p>
      </motion.div>
    </div>
  </section>
);

export default MissionSection;
