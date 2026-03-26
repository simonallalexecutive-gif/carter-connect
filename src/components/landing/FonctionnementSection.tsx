import { motion } from 'motion/react';
import { Building2, Eye, EyeOff, Search, ArrowRight, Shield, Users, Clock, Handshake, CheckCircle2 } from 'lucide-react';
import fonctionnementBg from '@/assets/fonctionnement-bg.jpeg';

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
  <section className="relative bg-[hsl(0,0%,96%)] overflow-hidden">
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-gradient-radial from-black/[0.02] to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 left-0 w-[500px] h-[300px] bg-gradient-radial from-black/[0.015] to-transparent rounded-full blur-3xl" />
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
        <motion.p variants={fadeUp} className="text-[11px] font-sans font-medium tracking-[0.25em] uppercase text-foreground/35 mb-6">
          Notre fonctionnement
        </motion.p>
        <motion.h2 variants={fadeUp} className="font-serif text-3xl sm:text-4xl md:text-[3.2rem] leading-[1.15] text-foreground/90 mb-6 max-w-3xl">
          Comment les cabinets utilisent Logan
        </motion.h2>
        <motion.div variants={fadeUp} className="flex items-center gap-3">
          <Building2 className="w-4 h-4 text-foreground/30" strokeWidth={1.5} />
          <p className="font-sans text-sm font-medium tracking-[0.15em] uppercase text-foreground/35">
            Perspective cabinets
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
        className="mb-20 md:mb-28"
      >
        <div className="flex items-center gap-3 mb-10">
          <span className="flex items-center justify-center w-8 h-8 rounded-full border border-foreground/15 text-xs font-sans font-semibold text-foreground/60">1</span>
          <h3 className="font-serif text-2xl md:text-[1.8rem] text-foreground/85">Déposer une recherche</h3>
        </div>

        {/* A. Mode confidentiel + B. Mode non confidentiel */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-10 mb-12">
          <div className="bg-white border border-foreground/[0.06] rounded-sm p-8 md:p-10 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <EyeOff className="w-5 h-5 text-foreground/30" strokeWidth={1.5} />
              <p className="font-sans text-xs font-semibold tracking-[0.2em] uppercase text-foreground/45">A. Mode confidentiel</p>
              <span className="ml-auto text-[10px] font-sans font-medium tracking-wider uppercase px-3 py-1 border border-foreground/15 rounded-sm text-foreground/40">
                Recommandé
              </span>
            </div>
            <p className="font-sans text-[0.95rem] leading-[1.75] text-foreground/60 mb-6">
              Le cabinet publie une opportunité de manière anonymisée. Les candidats accèdent à une description précise de l'offre, sans que l'identité du cabinet ne soit révélée.
            </p>
            <p className="font-sans text-xs font-medium tracking-[0.15em] uppercase text-foreground/35 mb-4">
              Informations visibles par les candidats
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-6">
              {[
                'Positionnement du cabinet',
                'Domaine de pratique',
                'Niveau de séniorité',
                'Structure de l\'équipe',
                'Fourchette de rétrocession',
                'Objectifs éventuels',
              ].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-foreground/25 mt-2 flex-shrink-0" />
                  <span className="font-sans text-sm text-foreground/50">{item}</span>
                </div>
              ))}
            </div>
            <p className="font-sans text-sm leading-[1.7] text-foreground/45">
              Ce n'est qu'en cas d'intérêt réel et qualifié qu'un candidat peut être mis en relation. L'identité du cabinet n'est alors révélée qu'à ce stade.
            </p>
            <p className="font-sans text-sm leading-[1.7] text-foreground/45 mt-3">
              En parallèle, Logan mène un travail continu de sourcing et peut proposer activement des profils pertinents dans le cadre du mandat.
            </p>
          </div>

          <div className="bg-white border border-foreground/[0.06] rounded-sm p-8 md:p-10 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Eye className="w-5 h-5 text-foreground/30" strokeWidth={1.5} />
              <p className="font-sans text-xs font-semibold tracking-[0.2em] uppercase text-foreground/45">B. Mode non confidentiel</p>
            </div>
            <p className="font-sans text-[0.95rem] leading-[1.75] text-foreground/60 mb-6">
              Le cabinet peut choisir de publier son offre de manière visible. L'opportunité est alors accessible à un pool restreint de candidats qualifiés et rigoureusement sélectionnés.
            </p>
            <p className="font-sans text-sm leading-[1.7] text-foreground/45">
              Logan accompagne le cabinet tout au long du processus, de la qualification des profils à la mise en relation.
            </p>

            <div className="mt-8 pt-6 border-t border-foreground/[0.06]">
              <p className="font-sans text-xs font-medium tracking-[0.15em] uppercase text-foreground/35 mb-4">Bénéfices</p>
              <div className="space-y-2">
                {['Visibilité maîtrisée', 'Accès direct à des candidats préqualifiés', 'Gain de temps dans le processus', 'Accompagnement sur mesure'].map((b) => (
                  <div key={b} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-foreground/25" strokeWidth={1.5} />
                    <span className="font-sans text-sm text-foreground/50">{b}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Benefits block for confidential mode */}
        <div className="bg-white border border-foreground/[0.06] rounded-sm p-8 md:p-10 mb-12 shadow-sm">
          <p className="font-sans text-xs font-medium tracking-[0.15em] uppercase text-foreground/35 mb-5">
            Bénéfices du mode confidentiel
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Shield, text: 'Confidentialité totale' },
              { icon: Users, text: 'Attractivité renforcée auprès de profils exigeants' },
              { icon: Search, text: 'Accès à des candidats difficilement visibles' },
              { icon: Handshake, text: 'Accompagnement actif par Logan' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex flex-col items-start gap-3">
                <Icon className="w-4.5 h-4.5 text-foreground/25" strokeWidth={1.5} />
                <span className="font-sans text-sm leading-[1.6] text-foreground/55">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Visual flow — 3 steps */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-0 mb-12">
          {flowSteps.map(({ label, icon: Icon }, i) => (
            <div key={label} className="flex items-center gap-4">
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full border border-foreground/10 bg-white flex items-center justify-center shadow-sm">
                  <Icon className="w-5 h-5 text-foreground/45" strokeWidth={1.5} />
                </div>
                <span className="font-sans text-xs font-medium text-foreground/45 text-center max-w-[120px]">{label}</span>
              </div>
              {i < flowSteps.length - 1 && (
                <ArrowRight className="w-4 h-4 text-foreground/20 hidden sm:block ml-4" strokeWidth={1.5} />
              )}
            </div>
          ))}
        </div>

        {/* Synthesis block */}
        <div className="border-l-2 border-foreground/10 pl-8 md:pl-12 max-w-3xl">
          <p className="font-sans text-xs font-medium tracking-[0.15em] uppercase text-foreground/35 mb-4">
            Synthèse
          </p>
          <p className="font-sans text-[1rem] leading-[1.8] text-foreground/60 mb-4">
            Publier une recherche avec Logan, c'est :
          </p>
          <div className="space-y-2">
            {[
              'Diffuser simplement un mandat',
              'Préserver sa confidentialité si souhaité',
              'Attirer des profils hautement qualifiés',
              'Bénéficier d\'un accompagnement actif et continu',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-foreground/20 flex-shrink-0" />
                <span className="font-sans text-sm text-foreground/55">{item}</span>
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
        className="mb-20 md:mb-28"
      >
        <div className="flex items-center gap-3 mb-10">
          <span className="flex items-center justify-center w-8 h-8 rounded-full border border-foreground/15 text-xs font-sans font-semibold text-foreground/60">2</span>
          <h3 className="font-serif text-2xl md:text-[1.8rem] text-foreground/85">Explorer le marché en continu</h3>
        </div>

        <div className="border-l-2 border-foreground/10 pl-8 md:pl-12 max-w-3xl mb-10">
          <p className="font-sans text-[1rem] leading-[1.8] text-foreground/60">
            Les cabinets peuvent accéder, à tout moment, à une vision structurée et dynamique du marché des candidats, par pratique et par niveau de séniorité.
          </p>
        </div>

        {/* Anonymised profile preview */}
        <div className="bg-white border border-foreground/[0.06] rounded-sm p-8 md:p-10 mb-10 shadow-sm">
          <p className="font-sans text-xs font-medium tracking-[0.15em] uppercase text-foreground/35 mb-6">
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
                <span className="font-sans text-sm font-medium text-foreground/65">{label}</span>
                <span className="font-sans text-xs text-foreground/35">{desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Interest + mediation */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-10 mb-10">
          <div className="bg-white border border-foreground/[0.06] rounded-sm p-8 md:p-10 shadow-sm">
            <p className="font-sans text-xs font-semibold tracking-[0.2em] uppercase text-foreground/35 mb-4">Manifestation d'intérêt</p>
            <p className="font-sans text-sm leading-[1.7] text-foreground/55">
              Le cabinet peut manifester son intérêt en un clic. L'identité du candidat n'est révélée que si celui-ci souhaite donner suite.
            </p>
          </div>
          <div className="bg-white border border-foreground/[0.06] rounded-sm p-8 md:p-10 shadow-sm">
            <p className="font-sans text-xs font-semibold tracking-[0.2em] uppercase text-foreground/35 mb-4">Logan, intermédiaire exclusif</p>
            <div className="space-y-2">
              {['Qualifier les intentions', 'Initier le rapprochement', 'Accompagner les échanges'].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-foreground/25" strokeWidth={1.5} />
                  <span className="font-sans text-sm text-foreground/50">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Concrete example */}
        <div className="bg-white border border-dashed border-foreground/[0.1] rounded-sm p-8 md:p-10 mb-10">
          <p className="font-sans text-xs font-medium tracking-[0.15em] uppercase text-foreground/30 mb-4">
            Exemple concret
          </p>
          <p className="font-serif text-base md:text-lg italic leading-[1.7] text-foreground/50">
            Identifier un collaborateur 6<sup>e</sup> année en financement LBO, actuellement en cabinet international, et initier une approche opportuniste, indépendamment de tout besoin immédiat.
          </p>
        </div>

        {/* Benefits */}
        <div className="bg-white border border-foreground/[0.06] rounded-sm p-8 md:p-10 shadow-sm">
          <p className="font-sans text-xs font-medium tracking-[0.15em] uppercase text-foreground/35 mb-5">Bénéfices</p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: Clock, text: 'Accès permanent au marché' },
              { icon: Search, text: 'Lecture claire des dynamiques par pratique' },
              { icon: ArrowRight, text: 'Capacité à agir au bon moment' },
              { icon: Users, text: 'Approche opportuniste, hors mandats classiques' },
              { icon: Shield, text: 'Maîtrise totale de la confidentialité' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-start gap-3">
                <Icon className="w-4 h-4 text-foreground/25 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                <span className="font-sans text-sm leading-[1.6] text-foreground/55">{text}</span>
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
        <p className="font-sans text-xs font-medium tracking-[0.25em] uppercase text-foreground/30 mb-8">
          Synthèse globale
        </p>
        <p className="font-serif text-xl sm:text-2xl md:text-[1.8rem] leading-[1.35] text-foreground/50 max-w-3xl mx-auto mb-8">
          Logan permet aux cabinets de publier des mandats en toute confidentialité, d'accéder en continu à un réseau hautement qualifié et d'initier des rapprochements ciblés, au bon moment.
        </p>
        <p className="font-sans text-sm leading-[1.7] text-foreground/35 max-w-xl mx-auto">
          Le tout dans un environnement structuré, sécurisé et strictement confidentiel, où chaque mise en relation est qualifiée, pertinente et accompagnée.
        </p>
      </motion.div>
    </div>
  </section>
);

export default FonctionnementSection;
