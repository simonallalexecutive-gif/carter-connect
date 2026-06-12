import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13 } },
};

const PRACTICES = [
  'M&A', 'Private Equity', 'Financement', 'Droit social',
  'Droit immobilier', 'Fiscalité', 'Restructuring', 'Venture Capital',
];

const PROFILE_ITEMS = [
  { label: 'Séniorité', desc: 'Années d\'expérience et niveau de qualification post-qualification.' },
  { label: 'Expertise', desc: 'Pratique principale et éventuelles spécialités secondaires.' },
  { label: 'Cabinet d\'origine', desc: 'Nationalité et présence au classement Legal 500.' },
  { label: 'Projet du candidat', desc: 'Ce qu\'il rechercherait s\'il devait quitter son cabinet actuel.' },
  { label: 'Statut d\'écoute', desc: 'Actif — en recherche ouverte — ou Opportuniste — à l\'écoute d\'opportunités ciblées.' },
];

const Sep = () => (
  <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-16">
    <div className="h-px bg-white/10" />
  </div>
);

const FirmAccessPage = () => (
  <div className="min-h-screen bg-black">
    <Header />

    {/* Hero */}
    <section className="min-h-[72svh] flex flex-col justify-center relative px-6 sm:px-10 lg:px-16 pt-32 pb-20">
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: [
            'radial-gradient(ellipse 55% 45% at 50% 35%, rgba(255,255,255,0.045) 0%, transparent 70%)',
            'radial-gradient(ellipse 65% 55% at 48% 42%, rgba(255,255,255,0.06) 0%, transparent 70%)',
            'radial-gradient(ellipse 55% 45% at 52% 38%, rgba(255,255,255,0.045) 0%, transparent 70%)',
          ],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="max-w-5xl mx-auto w-full relative z-10">
        <motion.div variants={stagger} initial="hidden" animate="visible">
          <motion.p variants={fadeUp} className="text-[11px] font-sans tracking-[0.22em] uppercase text-white/35 mb-6">
            Pour les cabinets
          </motion.p>
          <motion.h1 variants={fadeUp} className="font-serif font-[300] text-[2.2rem] sm:text-[3.2rem] md:text-[4.1rem] text-white leading-[1.06] tracking-normal mb-8">
            Accédez aux profils les plus<br /><em className="italic">qualifiés du marché.</em>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-white/60 font-sans font-light text-[1rem] sm:text-[1.08rem] leading-[1.75] max-w-2xl mb-10">
            Logan est un réseau confidentiel d'avocats d'affaires, <strong className="text-white font-medium">constitué et enrichi chaque jour</strong> par des consultants spécialisés qui chassent, rencontrent et qualifient les <strong className="text-white font-medium">meilleurs candidats du marché</strong>. Chaque cabinet partenaire accède au réseau sur une base absolument <strong className="text-white font-medium">confidentielle, structurée et sécurisée</strong>.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4">
            <Link to="/cabinet-start">
              <Button className="bg-white text-black hover:bg-white/90 font-sans text-[12.3px] font-normal px-6 py-2.5 rounded-sm tracking-wide">
                Start
              </Button>
            </Link>
            <Link to="/cabinet-rdv" className="text-white/50 hover:text-white font-sans text-[12.3px] tracking-wide transition-colors duration-200 border-b border-white/20 hover:border-white/50 pb-px">
              Fixer un échange →
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>

    <Sep />

    {/* Pratiques couvertes */}
    <section className="py-20 px-6 sm:px-10 lg:px-16">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <p className="text-[11px] font-sans tracking-[0.22em] uppercase text-white/35 mb-6">Pratiques couvertes</p>
          <div className="flex flex-wrap gap-2.5">
            {PRACTICES.map((p) => (
              <span key={p} className="px-4 py-1.5 border border-white/20 rounded-sm text-[12.5px] font-sans font-normal tracking-wide text-white/70">
                {p}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>

    <Sep />

    {/* Deux modes d'accès */}
    <section className="py-24 px-6 sm:px-10 lg:px-16">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="mb-14">
          <p className="text-[11px] font-sans tracking-[0.22em] uppercase text-white/35 mb-4">Comment ça fonctionne</p>
          <h2 className="font-serif font-[300] text-[1.8rem] sm:text-[2.5rem] text-white leading-[1.1]">
            Deux façons de travailler<br />avec Logan.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-px bg-white/10">
          {/* Mode I */}
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.1 }} className="bg-black p-10 md:p-12 flex flex-col">
            <p className="text-[11px] font-sans tracking-[0.22em] uppercase text-white/30 mb-5">Mode I</p>
            <h3 className="font-serif font-[300] text-[1.45rem] text-white mb-7 leading-snug">
              Explorer le marché<br />en toute autonomie.
            </h3>
            <p className="text-white/60 font-sans font-light text-[0.93rem] leading-[1.8] mb-7">
              Accédez librement à la base Logan quand bon vous semble.
            </p>
            <div className="space-y-3 mb-7">
              {[
                'Parcourez les profils disponibles.',
                'Filtrez par pratique, séniorité ou statut d\'écoute.',
                'Identifiez les candidats qui correspondent à vos besoins du moment.',
              ].map((line) => (
                <div key={line} className="flex items-start gap-3">
                  <span className="mt-[0.45rem] w-1 h-1 rounded-full bg-white/25 flex-shrink-0" />
                  <p className="text-white/50 font-sans font-light text-[0.9rem] leading-[1.75]">{line}</p>
                </div>
              ))}
            </div>
            <p className="text-white/30 font-sans font-light text-[0.85rem] leading-[1.8] border-t border-white/10 pt-6 mt-auto">
              Aucun engagement, aucune contrainte — Logan vous donne une visibilité continue sur le marché
              pour vous permettre d'être opportuniste sur le bon profil, au bon moment.
            </p>
          </motion.div>

          {/* Mode II */}
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.22 }} className="bg-black p-10 md:p-12 flex flex-col">
            <p className="text-[11px] font-sans tracking-[0.22em] uppercase text-white/30 mb-5">Mode II</p>
            <h3 className="font-serif font-[300] text-[1.45rem] text-white mb-7 leading-snug">
              Piloter un recrutement<br />avec un consultant dédié.
            </h3>
            <p className="text-white/60 font-sans font-light text-[0.93rem] leading-[1.8] mb-7">
              Confiez votre recherche à un consultant Logan spécialisé sur le marché des avocats,
              qui vous accompagne de A à Z tout au long du processus.
            </p>
            <p className="text-white/30 font-sans font-light text-[0.85rem] leading-[1.8] border-t border-white/10 pt-6 mt-auto">
              Logan est à la disposition de chacun de vos départements et coordonne, avec justesse
              et efficacité, les échanges dans le respect le plus strict de la confidentialité des parties.
            </p>
          </motion.div>
        </div>

        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.3 }}
          className="mt-8 text-white/25 font-sans font-light text-[0.85rem] leading-relaxed text-center">
          Quel que soit le mode retenu, Logan enrichit quotidiennement sa base de candidats en chassant, rencontrant et qualifiant les meilleurs profils du marché.
        </motion.p>
      </div>
    </section>

    <Sep />

    {/* Conditions d'intervention */}
    <section className="py-24 px-6 sm:px-10 lg:px-16">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="mb-12">
          <p className="text-[11px] font-sans tracking-[0.22em] uppercase text-white/35 mb-4">Conditions d'intervention</p>
          <h2 className="font-serif font-[300] text-[1.8rem] sm:text-[2.4rem] text-white leading-[1.1] mb-7">
            Logan réinvente les conditions<br /><em className="italic">d'intervention.</em>
          </h2>
          <p className="text-white/55 font-sans font-light text-[0.93rem] leading-[1.85] max-w-2xl">
            Logan innove également sur les conditions d'intervention traditionnellement pratiquées sur le marché.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/8">
          {[
            { label: 'Plus rapide', desc: 'Un réseau constitué en amont, prêt à activer.' },
            { label: 'Plus confidentiel', desc: 'Aucune mise en relation hors intermédiation.' },
            { label: 'Plus transparent', desc: 'Un honoraire de résultat, clair et réduit.' },
            { label: 'Plus premium', desc: 'Des profils qualifiés, rencontrés, validés.' },
          ].map((p, i) => (
            <motion.div key={p.label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.08 }}
              className="bg-black p-6 md:p-8">
              <p className="text-white font-sans text-[0.82rem] font-medium tracking-wide mb-2">{p.label}</p>
              <p className="text-white/30 font-sans font-light text-[0.78rem] leading-[1.65]">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <Sep />

    {/* Confidentialité + Ce que vous visualisez */}
    <section className="py-24 px-6 sm:px-10 lg:px-16">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-16 md:gap-24 items-start">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="md:w-1/2">
          <p className="text-[11px] font-sans tracking-[0.22em] uppercase text-white/35 mb-6">Confidentialité absolue</p>
          <h2 className="font-serif font-[300] text-[1.8rem] sm:text-[2.4rem] text-white leading-[1.1] mb-7">
            Logan protège chaque partie,<br />à chaque étape.
          </h2>
          <div className="text-white/55 font-sans font-light text-[0.93rem] leading-[1.85] space-y-4">
            <p>L'identité des parties et les termes des échanges sont strictement confidentiels en dehors de tout rapprochement.</p>
            <p>Aucune mise en relation ne peut avoir lieu en dehors de notre intermédiation.</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.15 }} className="md:w-1/2 flex flex-col gap-1">
          <p className="text-[11px] font-sans tracking-[0.22em] uppercase text-white/35 mb-6">Ce que vous visualisez</p>
          {PROFILE_ITEMS.map((item, i) => (
            <motion.div key={item.label} initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 + i * 0.08 }}
              className="flex gap-5 py-5 border-b border-white/10 last:border-0">
              <span className="text-white/20 font-serif text-sm mt-0.5 flex-shrink-0 w-4">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <p className="text-white font-sans text-[0.88rem] font-medium tracking-wide mb-1">{item.label}</p>
                <p className="text-white/45 font-sans font-light text-[0.84rem] leading-[1.7]">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    <Sep />

    {/* CTA */}
    <section className="py-32 px-6 sm:px-10 lg:px-16">
      <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
        <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="font-serif italic text-[1.7rem] sm:text-[2.4rem] text-white tracking-[0.03em] mb-5">
          Rejoignez Logan et accédez aux profils les plus qualifiés du marché, <strong>en toute confidentialité.</strong>
        </motion.p>
        <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.2 }} className="w-14 h-px bg-white/25 mb-8" />
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.3 }}
          className="text-white/45 font-sans font-light text-[0.9rem] leading-relaxed mb-10 max-w-sm">
          Rejoignez le réseau Logan et accédez aux profils les plus qualifiés du marché,
          en toute confidentialité.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-5">
          <Link to="/cabinet-start">
            <Button size="lg" className="bg-white text-black hover:bg-white/90 font-sans text-sm font-normal px-10 py-5 rounded-sm tracking-wide">
              Start
            </Button>
          </Link>
          <Link to="/cabinet-rdv" className="text-white/50 hover:text-white font-sans text-[12.3px] tracking-wide transition-colors duration-200 border-b border-white/20 hover:border-white/50 pb-px">
            Fixer un échange →
          </Link>
        </motion.div>
      </div>
    </section>

    <Footer />
  </div>
);

export default FirmAccessPage;
