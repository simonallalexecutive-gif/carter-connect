import { motion } from 'motion/react';
import { Shield, Cpu, Building2, UserCheck, Lock, Bell, Search, Eye, ArrowRight, CalendarCheck } from 'lucide-react';
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

const pillars = [
  { icon: Shield, label: 'Confidentialité' },
  { icon: Cpu, label: 'Technologie' },
  { icon: Building2, label: 'Accès continu' },
  { icon: UserCheck, label: 'Sur-mesure' },
];

const cabinetSteps = [
  { title: 'Recherche confidentielle', desc: 'Publiez vos critères sans jamais exposer l\'identité de votre cabinet.' },
  { title: 'Pool ultra qualifié', desc: 'Accédez à des profils vérifiés par séniorité, expertise et positionnement.' },
  { title: 'Rapprochement orchestré', desc: 'Logan qualifie et accompagne chaque mise en relation.' },
];

const candidatSteps = [
  { title: 'Espace confidentiel', desc: 'Votre identité n\'est jamais révélée. Seuls votre séniorité et expertise sont visibles.' },
  { title: 'Opportunités premium', desc: 'Accédez en temps réel aux recherches les plus exclusives du marché.' },
  { title: 'Échange maîtrisé', desc: 'Votre identité n\'est communiquée qu\'avec votre accord explicite.' },
];

const MissionSection = () => (
  <section className="relative overflow-hidden" style={{ background: '#111111' }}>
    <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-10">

      {/* ── Header ── */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="pt-28 md:pt-40 pb-16 md:pb-24"
      >
        <motion.p variants={fadeUp} className="text-[11px] font-sans font-medium tracking-[0.25em] uppercase text-white/25 mb-6">
          Notre approche
        </motion.p>
        <motion.h2 variants={fadeUp} className="font-serif text-3xl sm:text-4xl md:text-[3rem] leading-[1.12] text-white mb-6">
          Une infrastructure confidentielle<br className="hidden md:inline" /> de marché
        </motion.h2>
        <motion.p variants={fadeUp} className="font-sans text-base md:text-lg leading-[1.7] text-white/40 max-w-2xl">
          Logan structure un écosystème discret réunissant les acteurs les plus prestigieux du marché des avocats d'affaires.
        </motion.p>

        {/* Pillar chips */}
        <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mt-10">
          {pillars.map(({ icon: Icon, label }) => (
            <span key={label} className="inline-flex items-center gap-2 text-xs font-sans text-white/30 border border-white/[0.08] rounded-sm px-4 py-2">
              <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
              {label}
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* ── Divider ── */}
      <div className="border-t border-white/[0.06]" />

      {/* ── Two perspectives side by side on desktop, stacked on mobile ── */}
      <div className="grid md:grid-cols-2 gap-0">

        {/* Cabinets */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="py-16 md:py-24 md:pr-12 md:border-r border-white/[0.06]"
        >
          <motion.div variants={fadeUp} className="mb-10">
            <span className="text-[10px] font-sans font-medium tracking-[0.25em] uppercase text-white/20 mb-3 block">
              Perspective
            </span>
            <h3 className="font-serif text-2xl md:text-[1.75rem] text-white leading-[1.2]">
              Cabinets
            </h3>
          </motion.div>

          <div className="space-y-8">
            {cabinetSteps.map(({ title, desc }, i) => (
              <motion.div key={i} variants={fadeUp} className="flex gap-4">
                <span className="font-serif text-sm text-white/60 font-medium select-none leading-none pt-0.5 w-6 flex-shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h4 className="font-sans text-sm font-medium text-white/80 mb-1.5">{title}</h4>
                  <p className="font-sans text-[0.85rem] leading-[1.7] text-white/35">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center gap-4">
            <div className="flex gap-2">
              {[
                { icon: Shield, label: 'Confidentialité' },
                { icon: Search, label: 'Pool qualifié' },
                { icon: Eye, label: 'Vision marché' },
              ].map(({ icon: Icon, label }) => (
                <span key={label} className="inline-flex items-center gap-1.5 text-[10px] font-sans text-white/20 border border-white/[0.06] rounded-sm px-2.5 py-1">
                  <Icon className="w-3 h-3" strokeWidth={1.5} />
                  {label}
                </span>
              ))}
            </div>
            <Link to="/notre-offre" className="ml-auto">
              <Button
                variant="outline"
                size="sm"
                className="font-sans text-[11px] font-medium tracking-wide rounded-sm border-white/15 text-white hover:bg-white hover:text-black transition-colors h-8 px-4"
              >
                Notre offre
                <ArrowRight className="w-3 h-3 ml-1.5" strokeWidth={1.5} />
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Candidats */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="py-16 md:py-24 md:pl-12 border-t md:border-t-0 border-white/[0.06]"
        >
          <motion.div variants={fadeUp} className="mb-10">
            <span className="text-[10px] font-sans font-medium tracking-[0.25em] uppercase text-white/20 mb-3 block">
              Perspective
            </span>
            <h3 className="font-serif text-2xl md:text-[1.75rem] text-white leading-[1.2]">
              Candidats
            </h3>
          </motion.div>

          <div className="space-y-8">
            {candidatSteps.map(({ title, desc }, i) => (
              <motion.div key={i} variants={fadeUp} className="flex gap-4">
                <span className="font-serif text-sm text-white/60 font-medium select-none leading-none pt-0.5 w-6 flex-shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h4 className="font-sans text-sm font-medium text-white/80 mb-1.5">{title}</h4>
                  <p className="font-sans text-[0.85rem] leading-[1.7] text-white/35">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center gap-4">
            <div className="flex gap-2">
              {[
                { icon: Lock, label: 'Anonymat garanti' },
                { icon: Bell, label: 'Alertes ciblées' },
                { icon: Shield, label: 'Contrôle total' },
              ].map(({ icon: Icon, label }) => (
                <span key={label} className="inline-flex items-center gap-1.5 text-[10px] font-sans text-white/20 border border-white/[0.06] rounded-sm px-2.5 py-1">
                  <Icon className="w-3 h-3" strokeWidth={1.5} />
                  {label}
                </span>
              ))}
            </div>
            <Link to="/prendre-rdv" className="ml-auto">
              <Button
                size="sm"
                className="bg-white text-black hover:bg-white/90 font-sans text-[11px] font-medium tracking-wide rounded-sm h-8 px-4"
              >
                Prendre RDV
                <CalendarCheck className="w-3 h-3 ml-1.5" strokeWidth={1.5} />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Divider ── */}
      <div className="border-t border-white/[0.06]" />

      {/* ── Citation Logan ── */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 1 }}
        className="py-14 md:py-20 flex items-center gap-6"
      >
        <div className="w-8 border-t border-white/[0.1] flex-shrink-0" />
        <p className="font-sans text-sm md:text-[0.95rem] text-white/30 leading-[1.7] tracking-wide">
          « La plateforme la plus exigeante et structurée du marché. »
          <span className="text-white/15 ml-3">— Logan</span>
        </p>
      </motion.div>

    </div>
  </section>
);

export default MissionSection;
