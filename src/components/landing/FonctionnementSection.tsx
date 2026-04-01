import { motion } from 'motion/react';
import { Shield, Eye, Search, Lock, Bell, Building2, User, ArrowRight, CalendarCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cabinetPoints = [
  {
    num: '01',
    title: 'Recherche confidentielle',
    text: "Publiez un mandat sans révéler votre identité. Seules votre nationalité et votre position Chambers sont diffusées auprès d'un pool de candidats rigoureusement qualifiés.",
  },
  {
    num: '02',
    title: 'Vision marché en continu',
    text: 'Accédez en permanence à une cartographie des meilleurs profils par pratique et séniorité. Manifestez un intérêt — Logan opère le rapprochement.',
  },
];

const candidatPoints = [
  {
    num: '01',
    title: 'Visibilité sans exposition',
    text: "Restez présent sur le marché en toute discrétion. Votre identité n'est jamais communiquée sans votre accord — seuls votre séniorité, expertise et positionnement Chambers sont visibles.",
  },
  {
    num: '02',
    title: 'Opportunités exclusives',
    text: 'Consultez en temps réel les recherches les plus premiums. Échangez avec un consultant Logan avant tout rapprochement — rien ne se fait sans votre consentement explicite.',
  },
];

const FonctionnementSection = () => (
  <section className="relative overflow-hidden py-24 md:py-36" style={{ background: '#111111' }}>
    <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10">

      {/* ── Header ── */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="text-center mb-20 md:mb-28"
      >
        <motion.p variants={fadeUp} className="text-[11px] font-sans font-medium tracking-[0.25em] uppercase text-black/30 mb-5">
          Notre fonctionnement
        </motion.p>
        <motion.h2 variants={fadeUp} className="font-serif text-3xl sm:text-4xl md:text-[3rem] leading-[1.15] text-black mb-5">
          Deux perspectives, une même exigence
        </motion.h2>
        <motion.p variants={fadeUp} className="font-sans text-[1.02rem] md:text-lg leading-[1.7] text-black/45 max-w-2xl mx-auto">
          Logan est le seul intermédiaire. Chaque interaction est qualifiée, confidentielle et orchestrée.
        </motion.p>
      </motion.div>

      {/* ── Two columns ── */}
      <div className="grid md:grid-cols-2 gap-0 md:gap-0">

        {/* ▌ CABINETS */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="md:border-r border-white/[0.08] md:pr-12 lg:pr-16 pb-16 md:pb-0"
        >
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-10">
            <div className="w-9 h-9 rounded-full bg-black/[0.04] flex items-center justify-center">
              <Building2 className="w-4 h-4 text-black/40" strokeWidth={1.5} />
            </div>
            <h3 className="font-serif text-2xl md:text-[1.7rem] text-black">Cabinets</h3>
          </motion.div>

          <div className="space-y-8">
            {cabinetPoints.map(({ num, title, text }) => (
              <motion.div key={num} variants={fadeUp}>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="font-serif text-2xl text-black/[0.1] font-medium select-none">{num}</span>
                  <h4 className="font-sans text-[0.95rem] font-semibold text-black tracking-[-0.01em]">{title}</h4>
                </div>
                <p className="font-sans text-[0.92rem] leading-[1.8] text-black/50 pl-9">{text}</p>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-4 mt-10 pl-9">
            {[
              { icon: Shield, label: 'Confidentialité' },
              { icon: Search, label: 'Pool qualifié' },
              { icon: Eye, label: 'Vision marché' },
            ].map(({ icon: Icon, label }) => (
              <span key={label} className="inline-flex items-center gap-2 text-xs font-sans text-white/35 border border-white/[0.08] rounded-sm px-3 py-1.5">
                <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
                {label}
              </span>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="mt-10 pl-9">
            <Link to="/notre-offre">
              <Button
                variant="outline"
                size="sm"
                className="font-sans text-xs font-medium tracking-wide rounded-sm border-white/20 text-white hover:bg-white hover:text-black transition-colors"
              >
                Découvrir notre offre
                <ArrowRight className="w-3.5 h-3.5 ml-2" strokeWidth={1.5} />
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* ▌ CANDIDATS */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="md:pl-12 lg:pl-16 pt-16 md:pt-0 border-t md:border-t-0 border-white/[0.08]"
        >
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-10">
            <div className="w-9 h-9 rounded-full bg-black/[0.04] flex items-center justify-center">
              <User className="w-4 h-4 text-black/40" strokeWidth={1.5} />
            </div>
            <h3 className="font-serif text-2xl md:text-[1.7rem] text-black">Candidats</h3>
          </motion.div>

          <div className="space-y-8">
            {candidatPoints.map(({ num, title, text }) => (
              <motion.div key={num} variants={fadeUp}>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="font-serif text-2xl text-black/[0.1] font-medium select-none">{num}</span>
                  <h4 className="font-sans text-[0.95rem] font-semibold text-black tracking-[-0.01em]">{title}</h4>
                </div>
                <p className="font-sans text-[0.92rem] leading-[1.8] text-black/50 pl-9">{text}</p>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-4 mt-10 pl-9">
            {[
              { icon: Lock, label: 'Anonymat garanti' },
              { icon: Bell, label: 'Alertes ciblées' },
              { icon: Shield, label: 'Contrôle total' },
            ].map(({ icon: Icon, label }) => (
              <span key={label} className="inline-flex items-center gap-2 text-xs font-sans text-black/35 border border-black/[0.06] rounded-sm px-3 py-1.5">
                <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
                {label}
              </span>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="mt-10 pl-9">
            <Link to="/prendre-rdv">
              <Button
                variant="outline"
                size="sm"
                className="font-sans text-xs font-medium tracking-wide rounded-sm border-black/15 text-black hover:bg-black hover:text-white transition-colors"
              >
                Prendre rendez-vous
                <CalendarCheck className="w-3.5 h-3.5 ml-2" strokeWidth={1.5} />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default FonctionnementSection;
