import { motion } from 'motion/react';
import { Building2, User, ArrowLeftRight, Award } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const MissionSection = () => (
  <section
    id="notre-approche"
    className="relative overflow-hidden"
    style={{ background: '#FDFCFB' }}
  >
    <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 py-24 md:py-36">
      {/* Eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mb-12"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase font-sans font-semibold text-black/40">
          Notre approche
        </span>
      </motion.div>

      {/* Headline + lead */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20 items-end mb-24 md:mb-32"
      >
        <motion.h2
          variants={fadeUp}
          className="lg:col-span-8 font-serif text-[2.25rem] sm:text-5xl md:text-[4.25rem] leading-[1.05] tracking-[-0.015em] text-black/90 font-normal"
        >
          Logan est{' '}
          <span className="relative inline-block">
            <span className="text-black/30">une plateforme de recrutement</span>
            <span className="absolute left-0 top-[55%] w-full h-[3px] bg-black -rotate-2 rounded-full" />
          </span>
          <br />
          <span className="italic">la nouvelle infrastructure</span> privilégiée et confidentielle du marché des avocats.
        </motion.h2>

        <motion.p
          variants={fadeUp}
          className="lg:col-span-4 pb-2 font-sans text-base md:text-lg text-black/55 leading-[1.7] max-w-sm font-light"
        >
          Nous structurons un écosystème discret et exigeant, où chaque mise en relation est orchestrée avec la précision d'un cabinet de conseil stratégique.
        </motion.p>
      </motion.div>

      {/* Infrastructure bridge */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="relative"
      >
        <div className="absolute top-1/2 left-0 w-full h-px bg-black/10 -translate-y-1/2 z-0 hidden md:block" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative z-10">
          {/* Cabinets */}
          <motion.div
            variants={fadeUp}
            className="bg-white border border-black/[0.06] p-8 md:p-10 flex flex-col h-full shadow-[0_20px_50px_rgba(0,0,0,0.025)]"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 flex items-center justify-center border border-black/[0.08]">
                <Building2 className="w-4.5 h-4.5 text-black/70" strokeWidth={1.2} />
              </div>
              <h3 className="font-sans font-medium text-[0.95rem] uppercase tracking-[0.18em] text-black/85">
                Cabinets
              </h3>
            </div>
            <ul className="space-y-5 font-sans text-sm text-black/55">
              {[
                'Confidentialité totale des recherches',
                'Vision consolidée du marché',
                'Recrutements stratégiques',
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 leading-relaxed">
                  <span className="w-1 h-1 bg-black mt-2 shrink-0" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex gap-3">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-sans font-semibold tracking-[0.12em] border px-2.5 py-1 border-black/15 text-black/45">
                <Award className="w-3 h-3" strokeWidth={1.5} /> CHAMBERS
              </span>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-sans font-semibold tracking-[0.12em] border px-2.5 py-1 border-black/15 text-black/45">
                <Award className="w-3 h-3" strokeWidth={1.5} /> LEGAL 500
              </span>
            </div>
          </motion.div>

          {/* Logan — intermediary */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col items-center justify-center text-center px-4 py-12 md:py-0"
          >
            <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center shadow-[0_20px_60px_-10px_rgba(0,0,0,0.45)] mb-6 transform hover:scale-105 transition-transform duration-500">
              <ArrowLeftRight className="w-9 h-9 text-white" strokeWidth={1.4} />
            </div>
            <div className="px-4 py-2" style={{ background: '#FDFCFB' }}>
              <p className="text-[11px] font-sans font-semibold uppercase tracking-[0.22em] text-black/85 mb-2">
                Logan Intermédiation
              </p>
              <p className="font-serif italic text-sm text-black/55 max-w-[220px] mx-auto leading-relaxed">
                De la première intention à la signature finale.
              </p>
            </div>
          </motion.div>

          {/* Candidats */}
          <motion.div
            variants={fadeUp}
            className="bg-white border border-black/[0.06] p-8 md:p-10 flex flex-col h-full shadow-[0_20px_50px_rgba(0,0,0,0.025)]"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 flex items-center justify-center border border-black/[0.08]">
                <User className="w-4.5 h-4.5 text-black/70" strokeWidth={1.2} />
              </div>
              <h3 className="font-sans font-medium text-[0.95rem] uppercase tracking-[0.18em] text-black/85">
                Candidats
              </h3>
            </div>
            <ul className="space-y-5 font-sans text-sm text-black/55">
              {[
                'Accès aux meilleures opportunités',
                'Attractivité boostée',
                'Identité strictement préservée',
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 leading-relaxed">
                  <span className="w-1 h-1 bg-black mt-2 shrink-0" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-10">
              <div className="h-px w-full bg-black/[0.08] mb-4" />
              <p className="text-[10px] font-sans text-black/40 uppercase tracking-[0.22em]">
                Accompagnement sur-mesure
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Pillars */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        className="mt-28 md:mt-32 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 border-t border-black/[0.08] pt-14 md:pt-16"
      >
        {[
          {
            num: '01',
            title: 'Confidentialité',
            text: 'Une discrétion absolue, garantie par une infrastructure technique et humaine de premier plan.',
          },
          {
            num: '02',
            title: 'Sélectivité',
            text: 'Un écosystème fermé aux profils et cabinets les plus exigeants du marché juridique.',
          },
          {
            num: '03',
            title: 'Précision',
            text: 'Une analyse chirurgicale des besoins pour une mise en relation à haute valeur ajoutée.',
          },
        ].map((p) => (
          <motion.div key={p.num} variants={fadeUp}>
            <h4 className="text-[11px] font-sans font-semibold uppercase tracking-[0.22em] text-black/85 mb-4">
              {p.num}. {p.title}
            </h4>
            <p className="font-sans text-sm text-black/50 leading-[1.8] font-light">
              {p.text}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default MissionSection;
