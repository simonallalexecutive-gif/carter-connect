import { motion } from 'motion/react';
import { Shield, Eye, Bell, Lock, Handshake, ArrowRight, CalendarCheck } from 'lucide-react';
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

const FonctionnementCandidatsSection = () => (
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
          Perspective candidats
        </motion.h2>
        <motion.p variants={fadeUp} className="font-sans text-[1.05rem] md:text-lg leading-[1.7] text-black/50 max-w-2xl">
          Logan offre aux candidats une présence permanente sur le marché, un accompagnement dédié et une confidentialité absolue.
        </motion.p>
      </motion.div>

      {/* ═══════════════════════════════════════════
          1. VISIBILITÉ CONFIDENTIELLE
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
          <h3 className="font-serif text-2xl md:text-[1.9rem] text-black">Rester visible, sans jamais s'exposer</h3>
        </motion.div>

        {/* Accent bar + body */}
        <motion.div variants={fadeUp} className="border-l-2 border-black/10 pl-8 md:pl-10 ml-1 mb-10 max-w-3xl">
          <p className="font-sans text-[0.98rem] leading-[1.85] text-black/55 mb-5">
            Intégrez un espace structuré et confidentiel qui vous confère une visibilité totale sur votre marché. Votre identité et celle de votre cabinet actuel ne sont jamais révélées sans votre accord — seules votre séniorité, votre expertise et le positionnement de votre cabinet dans Chambers sont accessibles.
          </p>
          <p className="font-sans text-[0.98rem] leading-[1.85] text-black/55 mb-5">
            Lorsqu'un cabinet manifeste un intérêt pour votre profil — dans le cadre d'un mandat ou de manière opportuniste — vous recevez une notification et pouvez échanger avec un consultant Logan avant tout rapprochement.
          </p>
          <p className="font-sans text-[0.98rem] leading-[1.85] text-black/55">
            Toute mise en relation est orchestrée par Logan, qui garantit la pertinence et la confidentialité de chaque échange.
          </p>
        </motion.div>

        {/* Key benefits — compact grid */}
        <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
          {[
            { icon: Lock, label: 'Anonymat garanti' },
            { icon: Bell, label: 'Notifications ciblées' },
            { icon: Shield, label: 'Échanges qualifiés' },
            { icon: Eye, label: 'Visibilité maîtrisée' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-start gap-3 py-4 border-t border-black/[0.06]">
              <Icon className="w-[18px] h-[18px] text-black/25 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
              <span className="font-sans text-sm leading-snug text-black/50">{label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* ═══════════════════════════════════════════
          2. ACCÉDER AUX MEILLEURES OPPORTUNITÉS
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
          <h3 className="font-serif text-2xl md:text-[1.9rem] text-black">Accéder aux opportunités les plus exclusives</h3>
        </motion.div>

        {/* Accent bar + body */}
        <motion.div variants={fadeUp} className="border-l-2 border-black/10 pl-8 md:pl-10 ml-1 mb-10 max-w-3xl">
          <p className="font-sans text-[0.98rem] leading-[1.85] text-black/55 mb-5">
            Consultez en temps réel les recherches les plus premiums du marché. Dès qu'une offre vous paraît pertinente, alertez Logan : un consultant se rapproche de vous pour échanger en détail.
          </p>
          <p className="font-sans text-[0.98rem] leading-[1.85] text-black/55">
            Si et seulement si l'échange confirme votre intérêt, et après avoir obtenu votre accord explicite, votre identité pourra être révélée au cabinet en vue d'une rencontre.
          </p>
        </motion.div>

        {/* Value props — two cards */}
        <motion.div variants={fadeUp} className="grid md:grid-cols-2 gap-6">
          <div className="border border-black/[0.08] rounded-sm p-7 md:p-9">
            <p className="font-sans text-xs font-semibold tracking-[0.2em] uppercase text-black/30 mb-3">Contrôle total</p>
            <p className="font-sans text-sm leading-[1.75] text-black/50">
              Rien ne se fait sans votre accord. Votre identité n'est jamais communiquée sans votre consentement préalable.
            </p>
          </div>
          <div className="border border-black/[0.08] rounded-sm p-7 md:p-9">
            <p className="font-sans text-xs font-semibold tracking-[0.2em] uppercase text-black/30 mb-3">Accompagnement dédié</p>
            <p className="font-sans text-sm leading-[1.75] text-black/50">
              Un consultant Logan à vos côtés pour échanger sur votre projet, vos ambitions et chaque opportunité identifiée.
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
          Logan vous permet de rester activement présent sur le marché des cabinets d'affaires, sans jamais vous exposer. Chaque mise en relation est qualifiée, accompagnée et strictement maîtrisée.
        </p>

        <div className="mt-10">
          <Link to="/prendre-rdv">
            <Button
              size="lg"
              className="bg-black text-white hover:bg-black/90 font-sans text-sm font-medium px-8 py-5 rounded-sm tracking-wide"
            >
              Prendre rendez-vous
              <CalendarCheck className="w-4 h-4 ml-2" strokeWidth={1.5} />
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
);

export default FonctionnementCandidatsSection;
