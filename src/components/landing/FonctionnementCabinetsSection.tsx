import { motion } from 'motion/react';
import { Shield, Search, Eye, Building2, ArrowRight } from 'lucide-react';
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

const FonctionnementCabinetsSection = () => (
  <section className="relative overflow-hidden py-24 md:py-36" style={{ background: '#111111' }}>
    <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-10">

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="text-center mb-16 md:mb-24"
      >
        <motion.p variants={fadeUp} className="text-[11px] font-sans font-medium tracking-[0.25em] uppercase text-white/30 mb-5">
          Notre fonctionnement
        </motion.p>
        <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-full bg-white/[0.06] flex items-center justify-center">
            <Building2 className="w-4 h-4 text-white/50" strokeWidth={1.5} />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-[3rem] leading-[1.15] text-white">
            Cabinets
          </h2>
        </motion.div>
        <motion.p variants={fadeUp} className="font-sans text-base md:text-lg leading-[1.7] text-white/45 max-w-xl mx-auto">
          Attirez les meilleurs profils et gardez un temps d'avance — en toute confidentialité.
        </motion.p>
      </motion.div>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="grid md:grid-cols-2 gap-12 md:gap-16 mb-12"
      >
        <motion.div variants={fadeUp}>
          <h4 className="font-sans text-[0.95rem] font-semibold text-white tracking-[-0.01em] mb-3">
            Recrutez en toute confidentialité
          </h4>
          <p className="font-sans text-[0.92rem] leading-[1.8] text-white/50">
            Déposez votre recherche anonyme et adressez-vous à un pool de candidats ultra qualifiés — sans jamais exposer l'identité de votre cabinet.
          </p>
        </motion.div>
        <motion.div variants={fadeUp}>
          <h4 className="font-sans text-[0.95rem] font-semibold text-white tracking-[-0.01em] mb-3">
            Analysez la dynamique du marché
          </h4>
          <p className="font-sans text-[0.92rem] leading-[1.8] text-white/50">
            Consultez les profils les plus convoités par expertise et séniorité. Gardez un temps d'avance sur vos concurrents.
          </p>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-wrap items-center gap-4"
      >
        <div className="flex flex-wrap gap-3">
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
        </div>
        <div className="ml-auto">
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
        </div>
      </motion.div>
    </div>
  </section>
);

export default FonctionnementCabinetsSection;
