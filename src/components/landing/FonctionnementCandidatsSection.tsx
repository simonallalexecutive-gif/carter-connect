import { motion } from 'motion/react';
import { UserCheck, Shield, Eye, Handshake, MessageCircle, CheckCircle2, Lock, ArrowRight } from 'lucide-react';
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
  { label: 'Profil validé', icon: UserCheck },
  { label: 'Consultation anonyme', icon: Eye },
  { label: 'Mise en relation qualifiée', icon: Handshake },
];

const FonctionnementCandidatsSection = () => (
  <section className="relative overflow-hidden">
    {/* Background image */}
    <div className="absolute inset-0">
      <img src={candidatsBg} alt="" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/75" />
    </div>

    <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-24 md:py-36">

      {/* Subtle separator from previous section */}
      <div className="absolute top-0 left-0 right-0 h-px bg-white/[0.06]" />

      {/* ── Header ── */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="mb-20 md:mb-28"
      >
        <motion.p variants={fadeUp} className="text-[11px] font-sans font-medium tracking-[0.25em] uppercase text-white/30 mb-6">
          Notre fonctionnement
        </motion.p>
        <motion.h2 variants={fadeUp} className="font-serif text-3xl sm:text-4xl md:text-[3.2rem] leading-[1.15] text-white/90 mb-6 max-w-3xl">
          Perspective candidats
        </motion.h2>
        <motion.div variants={fadeUp} className="flex items-center gap-3">
          <UserCheck className="w-4 h-4 text-white/30" strokeWidth={1.5} />
          <p className="font-sans text-sm font-medium tracking-[0.15em] uppercase text-white/35">
            Un accès structuré et confidentiel au marché
          </p>
        </motion.div>
      </motion.div>

      {/* ═══════════════════════════════════════════
          1. CONFIDENTIALITÉ
         ═══════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-20 md:mb-28"
      >
        <div className="flex items-center gap-3 mb-10">
          <span className="flex items-center justify-center w-8 h-8 rounded-full border border-white/15 text-xs font-sans font-semibold text-white/60">1</span>
          <h3 className="font-serif text-2xl md:text-[1.8rem] text-white/85">Intégrer un espace sélectif</h3>
        </div>

        <div className="border-l-2 border-white/10 pl-8 md:pl-12 max-w-3xl mb-10">
          <p className="font-sans text-[1rem] leading-[1.8] text-white/55">
            Une fois votre profil validé par Logan, vous intégrez un espace sélectif, structuré et en constante évolution. Cet environnement vous permet de rester en permanence connecté au marché des cabinets d'affaires, tout en conservant une confidentialité totale de votre démarche.
          </p>
        </div>

        <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-sm p-8 md:p-10">
          <Lock className="w-5 h-5 text-white/25 mb-5" strokeWidth={1.5} />
          <p className="font-sans text-xs font-medium tracking-[0.2em] uppercase text-white/30 mb-4">Confidentialité absolue</p>
          <p className="font-sans text-[1rem] leading-[1.8] text-white/55">
            Votre identité (nom, prénom) ainsi que votre cabinet actuel ne sont jamais exposés. Seules votre séniorité, votre expertise et votre projet professionnel sont visibles.
          </p>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════
          2. MARCHÉ ACTIF
         ═══════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-20 md:mb-28"
      >
        <div className="flex items-center gap-3 mb-10">
          <span className="flex items-center justify-center w-8 h-8 rounded-full border border-white/15 text-xs font-sans font-semibold text-white/60">2</span>
          <h3 className="font-serif text-2xl md:text-[1.8rem] text-white/85">Un marché actif, sans exposition</h3>
        </div>

        <div className="border-l-2 border-white/10 pl-8 md:pl-12 max-w-3xl mb-10">
          <p className="font-sans text-[1rem] leading-[1.8] text-white/55">
            Votre profil peut être consulté par des cabinets partenaires qualifiés. Ils peuvent manifester leur intérêt dans deux cadres :
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-10 mb-10">
          <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-sm p-8 md:p-10">
            <div className="flex items-center gap-3 mb-4">
              <EyeOff className="w-5 h-5 text-white/30" strokeWidth={1.5} />
              <p className="font-sans text-xs font-semibold tracking-[0.2em] uppercase text-white/45">Mandat actif</p>
            </div>
            <p className="font-sans text-sm leading-[1.7] text-white/50">
              Dans le cadre d'une recherche structurée menée par un cabinet partenaire.
            </p>
          </div>
          <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-sm p-8 md:p-10">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-5 h-5 text-white/30" strokeWidth={1.5} />
              <p className="font-sans text-xs font-semibold tracking-[0.2em] uppercase text-white/45">Logique opportuniste</p>
            </div>
            <p className="font-sans text-sm leading-[1.7] text-white/50">
              En dehors de tout besoin exprimé, lorsqu'un cabinet identifie un profil pertinent pour son développement.
            </p>
          </div>
        </div>

        <div className="border-l-2 border-white/10 pl-8 md:pl-12 max-w-3xl">
          <p className="font-sans text-sm leading-[1.7] text-white/40">
            Toute mise en relation est orchestrée par Logan, qui garantit la pertinence et la confidentialité des échanges.
          </p>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════
          3. ACCOMPAGNEMENT DÉDIÉ (mirrors step 2 of cabinets)
         ═══════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-20 md:mb-28"
      >
        <div className="flex items-center gap-3 mb-10">
          <span className="flex items-center justify-center w-8 h-8 rounded-full border border-white/15 text-xs font-sans font-semibold text-white/60">3</span>
          <h3 className="font-serif text-2xl md:text-[1.8rem] text-white/85">Un accompagnement dédié</h3>
        </div>

        <div className="border-l-2 border-white/10 pl-8 md:pl-12 max-w-3xl mb-10">
          <p className="font-sans text-[1rem] leading-[1.8] text-white/55 mb-6">
            Vous disposez d'un interlocuteur unique chez Logan pour :
          </p>
          <div className="space-y-3">
            {[
              'Échanger sur votre parcours et votre positionnement',
              'Affiner votre projet professionnel',
              'Être accompagné avant toute mise en relation',
              'Bénéficier de conseils à chaque étape du processus',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-white/20 flex-shrink-0" />
                <span className="font-sans text-sm text-white/50">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Rôle de Logan */}
        <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-sm p-8 md:p-10">
          <Handshake className="w-5 h-5 text-white/25 mb-5" strokeWidth={1.5} />
          <p className="font-sans text-xs font-medium tracking-[0.15em] uppercase text-white/30 mb-4">Rôle de Logan</p>
          <p className="font-sans text-[1rem] leading-[1.8] text-white/55">
            Logan intervient comme intermédiaire exclusif entre vous et les cabinets, de la première interaction jusqu'à la finalisation éventuelle d'une collaboration.
          </p>
        </div>
      </motion.div>

      {/* ── Bénéfices ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-20 md:mb-28"
      >
        <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-sm p-8 md:p-10">
          <p className="font-sans text-xs font-medium tracking-[0.15em] uppercase text-white/30 mb-6">Bénéfices</p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { icon: Eye, text: 'Visibilité continue auprès des meilleurs cabinets' },
              { icon: Shield, text: 'Anonymat total jusqu\'à un éventuel rapprochement' },
              { icon: ArrowRight, text: 'Accès à des opportunités visibles et invisibles du marché' },
              { icon: MessageCircle, text: 'Accompagnement sur mesure et confidentiel' },
              { icon: Lock, text: 'Contrôle total de votre démarche' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-start gap-3">
                <Icon className="w-4 h-4 text-white/20 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                <span className="font-sans text-sm leading-[1.6] text-white/50">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Visual flow — mirrors cabinets section ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-20 md:mb-28"
      >
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-0">
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
      </motion.div>

      {/* ── Positionnement clé ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-20 md:mb-28 text-center max-w-2xl mx-auto"
      >
        <CheckCircle2 className="w-6 h-6 text-white/20 mx-auto mb-6" strokeWidth={1.5} />
        <p className="font-serif text-xl sm:text-2xl md:text-[1.6rem] leading-[1.4] text-white/50 mb-3">
          Vous restez maître de vos décisions à chaque étape.
        </p>
        <p className="font-sans text-sm text-white/30">
          Rien ne se fait sans votre accord.
        </p>
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
        <p className="font-sans text-xs font-medium tracking-[0.25em] uppercase text-white/25 mb-8">
          Synthèse globale
        </p>
        <p className="font-serif text-xl sm:text-2xl md:text-[1.8rem] leading-[1.35] text-white/40 max-w-3xl mx-auto mb-8">
          Logan vous permet de rester activement présent sur le marché des cabinets d'affaires, sans jamais vous exposer.
        </p>
        <p className="font-sans text-sm leading-[1.7] text-white/25 max-w-xl mx-auto">
          Vous bénéficiez d'un accès continu aux meilleures opportunités, dans un cadre structuré, confidentiel et rigoureusement sélectionné. Chaque mise en relation est qualifiée, accompagnée et strictement maîtrisée.
        </p>
      </motion.div>
    </div>
  </section>
);

export default FonctionnementCandidatsSection;
