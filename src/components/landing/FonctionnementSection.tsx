import { motion } from 'motion/react';
import { Shield, Eye, Search, Handshake, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14 } },
};

const FonctionnementSection = () => (
  <section className="relative bg-white overflow-hidden py-24 md:py-36">
    <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10">

      {/* ── Header ── */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="mb-16 md:mb-24"
      >
        <motion.p variants={fadeUp} className="text-[11px] font-sans font-medium tracking-[0.25em] uppercase text-black/30 mb-6">
          Notre fonctionnement
        </motion.p>
        <motion.h2 variants={fadeUp} className="font-serif text-3xl sm:text-4xl md:text-[3.2rem] leading-[1.15] text-black mb-5 max-w-3xl">
          Perspective cabinets
        </motion.h2>
        <motion.p variants={fadeUp} className="font-sans text-[1.05rem] md:text-lg leading-[1.7] text-black/50 max-w-2xl">
          Logan offre aux cabinets deux leviers stratégiques complémentaires, dans une exigence absolue de confidentialité.
        </motion.p>
      </motion.div>

      {/* ═══════════════════════════════════════════
          1. DÉPOSER UNE RECHERCHE CONFIDENTIELLE
         ═══════════════════════════════════════════ */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="mb-20 md:mb-28"
      >
        {/* Number + title */}
        <motion.div variants={fadeUp} className="flex items-baseline gap-4 mb-4">
          <span className="font-serif text-[3.5rem] md:text-[4.5rem] leading-none text-black/[0.07] font-medium select-none">01</span>
          <h3 className="font-serif text-2xl md:text-[1.9rem] text-black">Déposer une recherche confidentielle</h3>
        </motion.div>

        {/* Accent bar + body */}
        <motion.div variants={fadeUp} className="border-l-2 border-black/10 pl-8 md:pl-10 ml-1 mb-10 max-w-3xl">
          <p className="font-sans text-[0.98rem] leading-[1.85] text-black/55 mb-5">
            L'identité du cabinet reste strictement protégée. Seuls sa nationalité et, le cas échéant, son positionnement Chambers sont diffusés.
          </p>
          <p className="font-sans text-[0.98rem] leading-[1.85] text-black/55 mb-5">
            Les critères essentiels de votre recherche — séniorité, pratique, structuration de l'équipe, niveau de rétrocession, contexte — sont mis à la disposition d'un pool de candidats rigoureusement qualifiés en amont par Logan. Votre mandat ne s'adresse qu'aux profils les plus pertinents.
          </p>
          <p className="font-sans text-[0.98rem] leading-[1.85] text-black/55">
            Logan est votre unique intermédiaire, sous deux formes&nbsp;: vous identifiez directement un profil dans votre espace cabinet, ou nous sourçons pour vous par approche directe et organisons la rencontre.
          </p>
        </motion.div>

        {/* Key benefits — compact grid */}
        <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
          {[
            { icon: Shield, label: 'Confidentialité totale' },
            { icon: Search, label: 'Pool de candidats qualifiés' },
            { icon: Handshake, label: 'Intermédiation sur-mesure' },
            { icon: Eye, label: 'Identité protégée' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-start gap-3 py-4 border-t border-black/[0.06]">
              <Icon className="w-[18px] h-[18px] text-black/25 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
              <span className="font-sans text-sm leading-snug text-black/50">{label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* ═══════════════════════════════════════════
          2. CONSULTER LE MARCHÉ EN CONTINU
         ═══════════════════════════════════════════ */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="mb-20 md:mb-28"
      >
        {/* Number + title */}
        <motion.div variants={fadeUp} className="flex items-baseline gap-4 mb-4">
          <span className="font-serif text-[3.5rem] md:text-[4.5rem] leading-none text-black/[0.07] font-medium select-none">02</span>
          <h3 className="font-serif text-2xl md:text-[1.9rem] text-black">Consulter votre marché, en continu</h3>
        </motion.div>

        {/* Accent bar + body */}
        <motion.div variants={fadeUp} className="border-l-2 border-black/10 pl-8 md:pl-10 ml-1 mb-10 max-w-3xl">
          <p className="font-sans text-[0.98rem] leading-[1.85] text-black/55 mb-5">
            Bénéficiez d'une vision lisible, structurée et dynamique du marché des candidats les plus convoités — par pratique et niveau de séniorité. Gardez un temps d'avance sur vos concurrents.
          </p>
          <p className="font-sans text-[0.98rem] leading-[1.85] text-black/55">
            Reprenez le contrôle de votre recrutement&nbsp;: manifestez, en temps utile ou par anticipation, un intérêt pour un profil. Logan se charge d'opérer le rapprochement.
          </p>
        </motion.div>

        {/* Value props — two cards */}
        <motion.div variants={fadeUp} className="grid md:grid-cols-2 gap-6">
          <div className="border border-black/[0.08] rounded-sm p-7 md:p-9">
            <p className="font-sans text-xs font-semibold tracking-[0.2em] uppercase text-black/30 mb-3">Vision marché</p>
            <p className="font-sans text-sm leading-[1.75] text-black/50">
              Accédez en permanence à une cartographie précise des talents disponibles, sans engagement et en toute discrétion.
            </p>
          </div>
          <div className="border border-black/[0.08] rounded-sm p-7 md:p-9">
            <p className="font-sans text-xs font-semibold tracking-[0.2em] uppercase text-black/30 mb-3">Action ciblée</p>
            <p className="font-sans text-sm leading-[1.75] text-black/50">
              Identifiez un profil pertinent et manifestez votre intérêt. Logan qualifie l'intention et initie le rapprochement.
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* ═══════════════════════════════════════════
          SYNTHÈSE
         ═══════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="text-center pt-4"
      >
        <p className="font-sans text-[1.05rem] md:text-lg leading-[1.7] text-black/40 max-w-3xl mx-auto mb-4">
          Publier un mandat confidentiel ou observer le marché en continu — Logan structure chaque interaction pour que vous agissiez au bon moment, avec les bons profils.
        </p>

        <div className="mt-10">
          <Link to="/notre-offre">
            <Button
              size="lg"
              className="bg-black text-white hover:bg-black/90 font-sans text-sm font-medium px-8 py-5 rounded-sm tracking-wide"
            >
              Découvrir notre offre
              <ArrowRight className="w-4 h-4 ml-2" strokeWidth={1.5} />
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
);

export default FonctionnementSection;
