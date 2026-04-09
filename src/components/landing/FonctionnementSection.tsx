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

const FonctionnementSection = () => (
  <section className="relative overflow-hidden py-16 md:py-36" style={{ background: '#111111' }}>
    <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-10">

      {/* ── Header ── */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="text-center mb-20 md:mb-28"
      >
        <motion.p variants={fadeUp} className="text-[11px] font-sans font-medium tracking-[0.25em] uppercase text-white/30 mb-5">
          Notre fonctionnement
        </motion.p>
        <motion.h2 variants={fadeUp} className="font-serif text-3xl sm:text-4xl md:text-[3rem] leading-[1.15] text-white mb-5">
          Deux perspectives, une même exigence
        </motion.h2>
        <motion.p variants={fadeUp} className="font-sans text-[1.02rem] md:text-lg leading-[1.7] text-white/45 max-w-xl mx-auto">
          Chaque interaction est qualifiée, confidentielle et orchestrée par Logan.
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
            <div className="w-9 h-9 rounded-full bg-white/[0.06] flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white/50" strokeWidth={1.5} />
            </div>
            <h3 className="font-serif text-2xl md:text-[1.7rem] text-white">Cabinets</h3>
          </motion.div>

          <div className="space-y-6">
            <motion.div variants={fadeUp}>
              <h4 className="font-sans text-[0.95rem] font-semibold text-white tracking-[-0.01em] mb-2">
                Attirez les meilleurs en toute confidentialité
              </h4>
              <p className="font-sans text-[0.92rem] leading-[1.8] text-white/50">
                Déposez votre recherche anonyme et adressez-vous à un pool de candidats ultra qualifiés — sans jamais exposer l'identité de votre cabinet.
              </p>
            </motion.div>
            <motion.div variants={fadeUp}>
              <h4 className="font-sans text-[0.95rem] font-semibold text-white tracking-[-0.01em] mb-2">
                Analysez la dynamique du marché en temps réel
              </h4>
              <p className="font-sans text-[0.92rem] leading-[1.8] text-white/50">
                Consultez les profils les plus convoités par expertise et séniorité. Gardez un temps d'avance sur vos concurrents.
              </p>
            </motion.div>
          </div>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mt-8">
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

          <motion.div variants={fadeUp} className="mt-8">
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
            <div className="w-9 h-9 rounded-full bg-white/[0.06] flex items-center justify-center">
              <User className="w-4 h-4 text-white/50" strokeWidth={1.5} />
            </div>
            <h3 className="font-serif text-2xl md:text-[1.7rem] text-white">Candidats</h3>
          </motion.div>

          <div className="space-y-6">
            <motion.div variants={fadeUp}>
              <h4 className="font-sans text-[0.95rem] font-semibold text-white tracking-[-0.01em] mb-2">
                Visibilité sans exposition
              </h4>
              <p className="font-sans text-[0.92rem] leading-[1.8] text-white/50">
                Restez présent sur le marché en toute discrétion. Votre identité n'est jamais communiquée sans votre accord.
              </p>
            </motion.div>
            <motion.div variants={fadeUp}>
              <h4 className="font-sans text-[0.95rem] font-semibold text-white tracking-[-0.01em] mb-2">
                Opportunités exclusives
              </h4>
              <p className="font-sans text-[0.92rem] leading-[1.8] text-white/50">
                Consultez les recherches les plus premiums en temps réel. Un consultant Logan vous accompagne avant tout rapprochement.
              </p>
            </motion.div>
          </div>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mt-8">
            {[
              { icon: Lock, label: 'Anonymat garanti' },
              { icon: Bell, label: 'Alertes ciblées' },
              { icon: Shield, label: 'Contrôle total' },
            ].map(({ icon: Icon, label }) => (
              <span key={label} className="inline-flex items-center gap-2 text-xs font-sans text-white/35 border border-white/[0.08] rounded-sm px-3 py-1.5">
                <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
                {label}
              </span>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="mt-8">
            <Link to="/prendre-rdv">
              <Button
                variant="outline"
                size="sm"
                className="font-sans text-xs font-medium tracking-wide rounded-sm border-white/20 text-white hover:bg-white hover:text-black transition-colors"
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
