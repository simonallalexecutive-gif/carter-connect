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
      <section className="mt-16 bg-white flex flex-col" style={{ height: 'calc(100svh - 64px)' }}>

        {/* Photo encadrée — marges blanches */}
        <div className="flex-1 px-4 sm:px-8 lg:px-12 pt-3 sm:pt-4 pb-3 sm:pb-4 overflow-hidden">
          <div className="relative h-full">
            <img
              src="/hero-paris.jpg"
              alt="Paris"
              className="w-full h-full object-cover object-center rounded-sm"
            />
            <div className="absolute inset-0 bg-black/40 rounded-sm" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20 rounded-sm" />

            {/* Texte + marquee superposés */}
            <div className="absolute inset-0 flex flex-col justify-between rounded-sm overflow-hidden">
              {/* Titre */}
              <div className="px-8 sm:px-12 lg:px-16 pt-10 sm:pt-14">
                <motion.h1
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="font-serif font-[300] text-[2rem] sm:text-[3.2rem] md:text-[4.2rem] lg:text-[5.2rem] text-white leading-[0.93] tracking-[-0.01em]"
                >
                  The Private<br />
                  Network for<br />
                  <em className="italic">Top-Tier</em><br />
                  Lawyers
                </motion.h1>
              </div>

              {/* CTA + sous-titre */}
              <div className="px-8 sm:px-12 lg:px-16 pb-4 sm:pb-6">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6"
                >
                  <p style={{ fontSize: '20px', fontWeight: 400, lineHeight: 1.45, letterSpacing: '0.01em', color: 'rgba(255,255,255,0.72)', whiteSpace: 'nowrap' }}>
                    Connecting top-tier lawyers with leading firms<br />
                    through a confidential, consultant-led process.
                  </p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-10">
                    <Link to="/candidat" className="font-sans text-[0.88rem] text-white border-b border-white pb-0.5 hover:text-white/50 transition-colors">
                      Je suis candidat →
                    </Link>
                    <Link to="/acces-cabinet" className="font-sans text-[0.88rem] text-white/45 border-b border-white/30 pb-0.5 hover:text-white hover:border-white transition-colors">
                      Je représente un cabinet →
                    </Link>
                  </div>
                </motion.div>
              </div>

              {/* Marquee cabinets — dans la photo, fond foncé, texte blanc */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="flex-shrink-0 relative overflow-hidden bg-black/30 backdrop-blur-[2px]" style={{ padding: '15.91px 0' }}
              >
                <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-r from-black/40 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-l from-black/40 to-transparent z-10 pointer-events-none" />
                <div className="flex animate-marquee whitespace-nowrap items-center justify-center">
                  {[...firmNames, ...firmNames].map((name, i) => (
                    <span key={i} className="mx-8 sm:mx-14 text-[0.902rem] font-serif font-[300] text-white select-none flex-shrink-0 tracking-[0.04em]">
                      {name}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
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
          className="mt-16 max-w-xl"
        >
          <p className="font-sans font-light text-[1rem] text-white/35 leading-[1.8] italic">
            "Logan se positionne comme l'infrastructure la plus exigeante et structurée du marché, offrant un accompagnement sur mesure, résolument confidentiel et parfaitement ciblé."
          </p>
          <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-white/20 mt-4">L'équipe Logan</p>
        </motion.div>
      </section>

      {/* ── CANDIDATS / LOGAN / CABINETS ── */}
      <section className="border-b border-black/8">

        {/* Trois colonnes */}
        <div className="grid md:grid-cols-3">

          {/* Candidats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="px-6 sm:px-10 lg:px-12 py-16 sm:py-20 border-b md:border-b-0 md:border-r border-black/8 flex flex-col justify-between"
          >
            <div>
              <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-black/25 mb-8">01 — Candidats</p>
              <h3 className="font-serif font-[300] text-[1.8rem] sm:text-[2.2rem] text-black leading-[1.04] mb-8">
                Accédez aux<br />meilleures<br />opportunités.
              </h3>
              <div className="space-y-6 mb-10">
                <div>
                  <p className="font-sans font-medium text-[0.78rem] text-black/70 tracking-wide uppercase mb-1.5">Mode actif</p>
                  <p className="font-sans font-light text-[0.88rem] text-black/50 leading-[1.8]">
                    Accédez aux opportunités les plus premiums du marché et soyez notifié en temps réel de chaque nouvelle offre. Si une opportunité vous intéresse, Logan vous accompagne à chaque étape du processus.
                  </p>
                </div>
                <div>
                  <p className="font-sans font-medium text-[0.78rem] text-black/70 tracking-wide uppercase mb-1.5">Mode passif</p>
                  <p className="font-sans font-light text-[0.88rem] text-black/50 leading-[1.8]">
                    Soyez visible auprès des cabinets les plus prestigieux à travers votre séniorité, votre expertise et votre projet — en conservant votre anonymat. Si un cabinet manifeste un intérêt, Logan vous en informe.
                  </p>
                </div>
              </div>
            </div>
            <Link to="/candidat" className="font-sans text-[0.88rem] text-black border-b border-black pb-0.5 hover:text-black/40 transition-colors self-start">
              Rejoindre le réseau →
            </Link>
          </motion.div>

          {/* Logan — intermédiaire */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.12 }}
            className="px-6 sm:px-10 lg:px-12 py-16 sm:py-20 border-b md:border-b-0 md:border-r border-black/8 bg-black flex flex-col justify-between"
          >
            <div>
              <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-white/30 mb-8">02 — Logan</p>
              <h3 className="font-serif font-[300] text-[1.8rem] sm:text-[2.2rem] text-white leading-[1.04] mb-8">
                Un seul<br />intermédiaire.<br />Confidentiel.
              </h3>
              <ul className="space-y-5 mb-10">
                {[
                  'Chaque mise en relation est pilotée par un consultant spécialisé.',
                  'Les deux parties ne se contactent jamais directement.',
                  'Logan valide, filtre et accompagne chaque échange.',
                  'Gratuit pour les candidats. Toujours.',
                ].map((line) => (
                  <li key={line} className="flex items-start gap-3">
                    <span className="mt-2 w-1 h-1 rounded-full bg-white/30 flex-shrink-0" />
                    <span className="font-sans font-light text-[0.88rem] text-white/60 leading-[1.8]">{line}</span>
                  </li>
                ))}
              </ul>
            </div>
            <span className="font-sans text-[0.78rem] text-white/25 tracking-[0.15em] uppercase">L'intermédiaire de confiance</span>
          </motion.div>

          {/* Cabinets */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.24 }}
            className="px-6 sm:px-10 lg:px-12 py-16 sm:py-20 flex flex-col justify-between"
          >
            <div>
              <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-black/25 mb-8">03 — Cabinets</p>
              <h3 className="font-serif font-[300] text-[1.8rem] sm:text-[2.2rem] text-black leading-[1.04] mb-8">
                Recrutez avec<br />précision et<br />discrétion.
              </h3>
              <div className="space-y-6 mb-10">
                <div>
                  <p className="font-sans font-medium text-[0.78rem] text-black/70 tracking-wide uppercase mb-1.5">Recherche confidentielle</p>
                  <p className="font-sans font-light text-[0.88rem] text-black/50 leading-[1.8]">
                    Déposez une recherche en préservant l'identité de votre cabinet. Elle s'adresse à une audience qualifiée et pertinente. Les candidats consultent les éléments principaux et manifestent leur intérêt auprès de Logan, qui opère l'intermédiation.
                  </p>
                </div>
                <div>
                  <p className="font-sans font-medium text-[0.78rem] text-black/70 tracking-wide uppercase mb-1.5">Veille de marché</p>
                  <p className="font-sans font-light text-[0.88rem] text-black/50 leading-[1.8]">
                    Accédez en temps réel aux profils en recherche active ou à l'écoute. Anticipez vos recrutements stratégiques et consultez la dynamique du marché. Si un profil vous intéresse, manifestez-le auprès de Logan — qui se charge du rapprochement.
                  </p>
                </div>
              </div>
            </div>
            <Link to="/acces-cabinet" className="font-sans text-[0.88rem] text-black border-b border-black pb-0.5 hover:text-black/40 transition-colors self-start">
              Accéder au réseau →
            </Link>
          </motion.div>

        </div>
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
