import { motion } from 'motion/react';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FAQSection from '@/components/landing/FAQSection';

const firmNames = [
  'Linklaters', 'Kirkland & Ellis', 'Ropes & Gray', 'Darrois Villey', 'Bredin Prat',
  'Gibson Dunn', 'Cleary Gottlieb', 'BDGS', 'Sullivan & Cromwell', 'Weil Gotshal',
  'Willkie Farr', 'Latham & Watkins', 'A&O Shearman', 'Goodwin Procter', 'Mayer Brown',
  'Orrick', 'DLA Piper', 'De Pardieu Brocas', 'Baker McKenzie', 'Freshfields',
  'Gide', 'Clifford Chance', 'Jones Day', 'Hogan Lovells', 'Paul Hastings',
  'McDermott', 'Skadden', 'Ashurst', 'Herbert Smith', 'Proskauer Rose',
  'Moncey Avocats', 'King & Spalding', 'White & Case',
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const LandingPage = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* ── HERO ── */}
      <section className="min-h-[100svh] flex flex-col justify-between px-6 sm:px-10 lg:px-16 pt-28 sm:pt-32 pb-0 border-b border-black/8">
        <motion.div variants={stagger} initial="hidden" animate="visible">
          <motion.p variants={fadeUp} className="font-sans text-[10px] tracking-[0.3em] uppercase text-black/30 mb-12 sm:mb-16">
            Logan Executive — Paris, 2025
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="font-serif font-[300] text-[3.2rem] sm:text-[5.5rem] md:text-[7.5rem] lg:text-[9.5rem] text-black leading-[0.93] tracking-[-0.01em] mb-12 sm:mb-20"
          >
            The Private<br />
            Network for<br />
            <em className="italic">Top-Tier</em><br />
            Lawyers.
          </motion.h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8 pb-10"
        >
          <p className="font-sans font-light text-[0.9rem] text-black/50 max-w-xs leading-[1.8]">
            Un réseau confidentiel d'avocats d'affaires, constitué et enrichi chaque jour par des consultants spécialisés.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-10">
            <Link to="/candidat" className="font-sans text-[0.88rem] text-black border-b border-black pb-0.5 hover:text-black/40 transition-colors">
              Je suis candidat →
            </Link>
            <Link to="/acces-cabinet" className="font-sans text-[0.88rem] text-black/35 border-b border-black/20 pb-0.5 hover:text-black hover:border-black transition-colors">
              Je représente un cabinet →
            </Link>
          </div>
        </motion.div>

        {/* Marquee cabinets */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="border-t border-black/8 py-5 overflow-hidden"
        >
          <div className="flex animate-marquee whitespace-nowrap items-center">
            {[...firmNames, ...firmNames].map((name, i) => (
              <span key={i} className="mx-8 sm:mx-14 text-[0.82rem] font-serif font-[400] text-black/25 select-none flex-shrink-0 tracking-[0.04em]">
                {name}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── MANIFESTE ── */}
      <section className="bg-black px-6 sm:px-10 lg:px-16 py-28 sm:py-40">
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif font-[300] text-[1.9rem] sm:text-[3rem] md:text-[3.8rem] text-white leading-[1.06] max-w-5xl"
        >
          Logan est la nouvelle infrastructure privilégiée et confidentielle du marché des avocats d'affaires.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-16 max-w-lg"
        >
          <p className="font-sans font-light text-[0.88rem] text-white/35 leading-[1.9] italic">
            "Logan se positionne comme l'infrastructure la plus exigeante et structurée du marché, offrant un accompagnement sur mesure, résolument confidentiel et parfaitement ciblé."
          </p>
          <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-white/20 mt-4">L'équipe Logan</p>
        </motion.div>
      </section>

      {/* ── CANDIDATS / CABINETS ── */}
      <section className="grid md:grid-cols-2 border-b border-black/8">
        {/* Candidats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="px-6 sm:px-10 lg:px-16 py-20 sm:py-28 border-b md:border-b-0 md:border-r border-black/8 flex flex-col justify-between min-h-[420px]"
        >
          <div>
            <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-black/25 mb-10">01 — Candidats</p>
            <h2 className="font-serif font-[300] text-[2.2rem] sm:text-[3rem] text-black leading-[1.02] mb-8">
              Reprenez<br />le contrôle.
            </h2>
            <ul className="space-y-4 mb-10">
              {[
                'Déposez votre recherche à titre confidentiel.',
                'Notification en temps réel des opportunités.',
                'Un consultant dédié pour chaque rencontre.',
              ].map((line) => (
                <li key={line} className="flex items-start gap-3">
                  <span className="mt-2 w-1 h-1 rounded-full bg-black/25 flex-shrink-0" />
                  <span className="font-sans font-light text-[0.88rem] text-black/50 leading-[1.8]">{line}</span>
                </li>
              ))}
            </ul>
          </div>
          <Link to="/candidat" className="font-sans text-[0.88rem] text-black border-b border-black pb-0.5 hover:text-black/40 transition-colors self-start">
            Rejoindre le réseau →
          </Link>
        </motion.div>

        {/* Cabinets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="px-6 sm:px-10 lg:px-16 py-20 sm:py-28 flex flex-col justify-between min-h-[420px]"
        >
          <div>
            <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-black/25 mb-10">02 — Cabinets</p>
            <h2 className="font-serif font-[300] text-[2.2rem] sm:text-[3rem] text-black leading-[1.02] mb-8">
              Vivez<br />votre marché.
            </h2>
            <ul className="space-y-4 mb-10">
              {[
                'Accès à une base de profils qualifiés et anonymisés.',
                'Exploration autonome ou recrutement piloté.',
                'Confidentialité absolue à chaque étape.',
              ].map((line) => (
                <li key={line} className="flex items-start gap-3">
                  <span className="mt-2 w-1 h-1 rounded-full bg-black/25 flex-shrink-0" />
                  <span className="font-sans font-light text-[0.88rem] text-black/50 leading-[1.8]">{line}</span>
                </li>
              ))}
            </ul>
          </div>
          <Link to="/acces-cabinet" className="font-sans text-[0.88rem] text-black border-b border-black pb-0.5 hover:text-black/40 transition-colors self-start">
            Accéder au réseau →
          </Link>
        </motion.div>
      </section>

      {/* ── CHIFFRES ── */}
      <section className="px-6 sm:px-10 lg:px-16 py-20 sm:py-28 border-b border-black/8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 sm:gap-6">
          {[
            { value: '100%', label: 'Confidentiel' },
            { value: '0€', label: 'Pour les candidats' },
            { value: '1', label: 'Seul intermédiaire' },
            { value: '48h', label: 'Validation du profil' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.8 }}
            >
              <p className="font-serif font-[300] text-[3.5rem] sm:text-[4.5rem] text-black leading-none mb-2">{stat.value}</p>
              <p className="font-sans font-light text-[0.75rem] text-black/35 tracking-[0.15em] uppercase">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── QUI SOMMES-NOUS ── */}
      <section id="qui-sommes-nous" className="px-6 sm:px-10 lg:px-16 py-20 sm:py-32 border-b border-black/8 bg-[#f7f5f2]">
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-sans text-[10px] tracking-[0.3em] uppercase text-black/25 mb-10"
          >
            03 — Qui sommes-nous
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="font-serif font-[300] text-[2.2rem] sm:text-[3rem] md:text-[3.5rem] text-black leading-[1.05] mb-12"
          >
            Pensé par des spécialistes<br className="hidden sm:block" /> du marché.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="font-sans font-light text-[0.95rem] text-black/55 leading-[1.95] mb-12 text-justify"
          >
            Logan a été pensé et conçu par des consultants et chasseurs de têtes spécialisés sur le marché des avocats. Notre objectif est de repenser différemment notre rôle et notre collaboration, tant côté candidats que cabinets — en proposant à chacun un <strong className="font-medium text-black/75">espace confidentiel, structuré et qualifié</strong> pour accélérer leur recrutement, tout en continuant de leur proposer une intermédiation et un accompagnement sur-mesure.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="font-serif text-[1rem] text-black font-[400]">Simon Allal</p>
            <p className="font-sans text-[0.75rem] text-black/35 font-light tracking-wide mt-0.5">Founder, Logan Executive</p>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <div id="faq">
        <FAQSection />
      </div>

      {/* ── CTA FINAL ── */}
      <section className="relative overflow-hidden bg-black min-h-[80svh] flex flex-col justify-between px-6 sm:px-10 lg:px-16 py-20 sm:py-28">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-sans text-[10px] tracking-[0.3em] uppercase text-white/25 relative z-10"
        >
          Logan Executive
        </motion.p>

        <div className="relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif font-[300] text-[3rem] sm:text-[5rem] md:text-[7rem] text-white leading-[0.93] mb-12 sm:mb-16"
          >
            Rejoignez<br /><em className="italic">Logan.</em>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-start gap-6 sm:gap-12"
          >
            <Link to="/candidat" className="font-sans text-[0.9rem] text-white border-b border-white pb-0.5 hover:text-white/50 hover:border-white/50 transition-colors">
              Je suis candidat →
            </Link>
            <Link to="/acces-cabinet" className="font-sans text-[0.9rem] text-white/35 border-b border-white/20 pb-0.5 hover:text-white hover:border-white transition-colors">
              Je représente un cabinet →
            </Link>
          </motion.div>
        </div>
      </section>

      <div className="bg-black">
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;
