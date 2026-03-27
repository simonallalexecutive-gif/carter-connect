import { motion } from 'motion/react';
import { Building2, Eye, EyeOff, Search, ArrowRight, Shield, Users, Clock, Handshake, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import candidatsBg from '@/assets/fonctionnement-candidats-bg.jpeg';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const flowSteps = [
  { label: 'Publication', icon: Building2 },
  { label: 'Visibilité anonymisée', icon: EyeOff },
  { label: 'Mise en relation qualifiée', icon: Handshake },
];

const FonctionnementSection = () => (
  <section className="relative overflow-hidden">
    {/* Background image */}
    <div className="absolute inset-0">
      <img src={candidatsBg} alt="" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/75" />
    </div>

    <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-24 md:py-36">

      {/* ── Header ── */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="mb-14 md:mb-20"
      >
        <motion.p variants={fadeUp} className="text-[11px] font-sans font-medium tracking-[0.25em] uppercase text-white/30 mb-6">
          Notre fonctionnement
        </motion.p>
        <motion.h2 variants={fadeUp} className="font-serif text-3xl sm:text-4xl md:text-[3.2rem] leading-[1.15] text-white/90 mb-6 max-w-3xl">
          Perspective cabinets
        </motion.h2>
        <motion.div variants={fadeUp} className="flex items-center gap-3">
          <Building2 className="w-4 h-4 text-white/30" strokeWidth={1.5} />
          <p className="font-sans text-sm font-medium tracking-[0.15em] uppercase text-white/35">
            Comment les cabinets utilisent Logan
          </p>
        </motion.div>
      </motion.div>

      {/* ═══════════════════════════════════════════
          1. DÉPOSER UNE RECHERCHE
         ═══════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-14 md:mb-20"
      >
        <div className="flex items-center gap-3 mb-8">
          <span className="flex items-center justify-center w-8 h-8 rounded-full border border-white/15 text-xs font-sans font-semibold text-white/60">1</span>
          <h3 className="font-serif text-2xl md:text-[1.8rem] text-white/85">Déposer une recherche</h3>
        </div>

        {/* Mode confidentiel — single card */}
        <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-sm p-8 md:p-10 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <EyeOff className="w-5 h-5 text-white/30" strokeWidth={1.5} />
            <p className="font-sans text-xs font-semibold tracking-[0.2em] uppercase text-white/45">Mode confidentiel</p>
            <span className="ml-auto text-[10px] font-sans font-medium tracking-wider uppercase px-3 py-1 border border-white/15 rounded-sm text-white/40">
              Par défaut
            </span>
          </div>
          <p className="font-sans text-[0.95rem] leading-[1.75] text-white/55 mb-6">
            Le cabinet publie une opportunité de manière anonymisée. Les candidats accèdent à une description précise de l'offre, sans que l'identité du cabinet ne soit révélée.
          </p>
          <p className="font-sans text-xs font-medium tracking-[0.15em] uppercase text-white/30 mb-4">
            Informations visibles par les candidats
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 mb-6">
            {[
              'Positionnement du cabinet',
              'Domaine de pratique',
              'Niveau de séniorité',
              'Structure de l\'équipe',
              'Fourchette de rétrocession',
              'Objectifs éventuels',
            ].map((item) => (
              <div key={item} className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-white/25 mt-2 flex-shrink-0" />
                <span className="font-sans text-sm text-white/45">{item}</span>
              </div>
            ))}
          </div>
          <p className="font-sans text-sm leading-[1.7] text-white/40">
            Ce n'est qu'en cas d'intérêt réel et qualifié qu'un candidat peut être mis en relation. L'identité du cabinet n'est alors révélée qu'à ce stade.
          </p>
          <p className="font-sans text-sm leading-[1.7] text-white/40 mt-3">
            En parallèle, Logan mène un travail continu de sourcing et peut proposer activement des profils pertinents dans le cadre du mandat.
          </p>
        </div>

        {/* Benefits block */}
        <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-sm p-8 md:p-10 mb-8">
          <p className="font-sans text-xs font-medium tracking-[0.15em] uppercase text-white/30 mb-5">
            Bénéfices
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Shield, text: 'Confidentialité totale' },
              { icon: Users, text: 'Attractivité renforcée auprès de profils exigeants' },
              { icon: Search, text: 'Accès à des candidats difficilement visibles' },
              { icon: Handshake, text: 'Accompagnement actif par Logan' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex flex-col items-start gap-3">
                <Icon className="w-4.5 h-4.5 text-white/20" strokeWidth={1.5} />
                <span className="font-sans text-sm leading-[1.6] text-white/50">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Visual flow — 3 steps */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-0 mb-8">
          {flowSteps.map(({ label, icon: Icon }, i) => (
            <div key={label} className="flex items-center gap-4">
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-sm flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white/40" strokeWidth={1.5} />
                </div>
                <span className="font-sans text-xs font-medium text-white/40 text-center max-w-[120px]">{label}</span>
              </div>
              {i < flowSteps.length - 1 && (
                <ArrowRight className="w-4 h-4 text-white/15 hidden sm:block ml-4" strokeWidth={1.5} />
              )}
            </div>
          ))}
        </div>

        {/* Synthesis inline */}
        <div className="border-l-2 border-white/10 pl-8 md:pl-12 max-w-3xl">
          <p className="font-sans text-sm leading-[1.8] text-white/50 mb-3">
            Publier une recherche avec Logan, c'est :
          </p>
          <div className="space-y-2">
            {[
              'Diffuser simplement un mandat',
              'Préserver sa confidentialité',
              'Attirer des profils hautement qualifiés',
              'Bénéficier d\'un accompagnement actif et continu',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-white/20 flex-shrink-0" />
                <span className="font-sans text-sm text-white/50">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════
          2. EXPLORER LE MARCHÉ EN CONTINU
         ═══════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-14 md:mb-20"
      >
        <div className="flex items-center gap-3 mb-10">
          <span className="flex items-center justify-center w-8 h-8 rounded-full border border-white/15 text-xs font-sans font-semibold text-white/60">2</span>
          <h3 className="font-serif text-2xl md:text-[1.8rem] text-white/85">Explorer le marché en continu</h3>
        </div>

        <div className="border-l-2 border-white/10 pl-8 md:pl-12 max-w-3xl mb-10">
          <p className="font-sans text-[1rem] leading-[1.8] text-white/55">
            Les cabinets peuvent accéder, à tout moment, à une vision structurée et dynamique du marché des candidats, par pratique et par niveau de séniorité.
          </p>
        </div>

        {/* Anonymised profile preview */}
        <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-sm p-8 md:p-10 mb-10">
          <p className="font-sans text-xs font-medium tracking-[0.15em] uppercase text-white/30 mb-6">
            Profils anonymisés — informations visibles
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Expertise', desc: 'Domaine de pratique principal' },
              { label: 'Séniorité', desc: 'Niveau d\'expérience' },
              { label: 'Positionnement', desc: 'Orientation marché' },
              { label: 'Structure actuelle', desc: 'Type de cabinet' },
            ].map(({ label, desc }) => (
              <div key={label} className="flex flex-col gap-1.5">
                <span className="font-sans text-sm font-medium text-white/60">{label}</span>
                <span className="font-sans text-xs text-white/30">{desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Interest + mediation */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-10 mb-10">
          <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-sm p-8 md:p-10">
            <p className="font-sans text-xs font-semibold tracking-[0.2em] uppercase text-white/30 mb-4">Manifestation d'intérêt</p>
            <p className="font-sans text-sm leading-[1.7] text-white/50">
              Le cabinet peut manifester son intérêt en un clic. L'identité du candidat n'est révélée que si celui-ci souhaite donner suite.
            </p>
          </div>
          <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-sm p-8 md:p-10">
            <p className="font-sans text-xs font-semibold tracking-[0.2em] uppercase text-white/30 mb-4">Logan, intermédiaire exclusif</p>
            <div className="space-y-2">
              {['Qualifier les intentions', 'Initier le rapprochement', 'Accompagner les échanges'].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white/20" strokeWidth={1.5} />
                  <span className="font-sans text-sm text-white/45">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-sm p-8 md:p-10">
          <p className="font-sans text-xs font-medium tracking-[0.15em] uppercase text-white/30 mb-5">Bénéfices</p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: Clock, text: 'Accès permanent au marché' },
              { icon: Search, text: 'Lecture claire des dynamiques par pratique' },
              { icon: ArrowRight, text: 'Capacité à agir au bon moment' },
              { icon: Users, text: 'Approche opportuniste, hors mandats classiques' },
              { icon: Shield, text: 'Maîtrise totale de la confidentialité' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-start gap-3">
                <Icon className="w-4 h-4 text-white/20 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                <span className="font-sans text-sm leading-[1.6] text-white/50">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════
          SYNTHÈSE GLOBALE
         ═══════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="text-center"
      >
        <p className="font-serif text-lg sm:text-xl md:text-[1.5rem] leading-[1.4] text-white/40 max-w-3xl mx-auto mb-4">
          Logan permet aux cabinets de publier des mandats en toute confidentialité, d'accéder en continu à un réseau hautement qualifié et d'initier des rapprochements ciblés, au bon moment.
        </p>
        <p className="font-sans text-sm leading-[1.7] text-white/25 max-w-xl mx-auto mb-10">
          Le tout dans un environnement structuré, sécurisé et strictement confidentiel, où chaque mise en relation est qualifiée, pertinente et accompagnée.
        </p>

        {/* Notre offre button */}
        <Link to="/notre-offre">
          <Button
            size="lg"
            className="bg-white text-black hover:bg-white/90 font-sans text-sm font-medium px-8 py-5 rounded-sm tracking-wide"
          >
            Notre offre
          </Button>
        </Link>
      </motion.div>
    </div>
  </section>
);

export default FonctionnementSection;
