import { motion } from 'motion/react';
import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

import MissionSection from '@/components/landing/MissionSection';

import FAQSection from '@/components/landing/FAQSection';
import TeamQuoteSection from '@/components/landing/TeamQuoteSection';
const heroBoardroom = { url: '/hero-bg.jpg' };

const firmNames = [
  'Linklaters', 'Kirkland & Ellis', 'Ropes & Gray', 'Darrois Villey', 'Bredin Prat',
  'Gibson Dunn', 'Cleary Gottlieb', 'BDGS', 'Sullivan & Cromwell', 'Weil Gotshal',
  'Willkie Farr', 'Latham & Watkins', 'A&O Shearman', 'Goodwin Procter', 'Mayer Brown',
  'Orrick', 'DLA Piper', 'De Pardieu Brocas', 'Baker McKenzie', 'Freshfields',
  'Gide', 'Clifford Chance', 'Jones Day', 'Hogan Lovells', 'Paul Hastings',
  'McDermott', 'Skadden', 'Ashurst', 'Herbert Smith', 'Proskauer Rose',
  'Moncey Avocats', 'King & Spalding', 'White & Case',
];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
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
  <div className="min-h-screen bg-background">
    <Header />

    {/* Hero */}
    <section className="h-[100svh] flex flex-col relative overflow-hidden bg-black" style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
      {/* Background video — cinematic, sombre, premium */}
      <div className="absolute inset-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2.5, ease: 'easeOut' }}
          className="w-full h-full"
          style={{ willChange: 'opacity' }}
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
          >
            <source src="/hero-bg.mp4" type="video/mp4" />
          </video>
        </motion.div>
        {/* Overlays pour assombrir et donner du relief */}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/10 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-black/20" />
      </div>
      <div className="px-4 sm:px-8 lg:px-10 max-w-6xl relative z-10 pt-20 sm:pt-24 flex-1 flex items-center pb-4">
        <motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-[min(95vw,72rem)]">
          <motion.h1
            variants={fadeUp}
            className="text-[1.35rem] sm:text-[2.32rem] md:text-[3.09rem] lg:text-[3.94rem] font-serif font-[300] text-white leading-[1.1] mb-3 md:mb-5 tracking-normal whitespace-nowrap"
          >
            The Private Network for <em className="italic">Top-Tier</em> Lawyers
          </motion.h1>
          <motion.p variants={fadeUp} className="text-[0.86rem] sm:text-[1.14rem] md:text-[1.16rem] text-white font-sans font-[480] leading-[1.65] max-w-[72rem]">
            Un cercle privé d'excellence, structuré et piloté par des consultants spécialisés, dédié aux profils et cabinets d'affaires les plus qualifiés du marché.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 sm:mt-20 flex flex-wrap items-center gap-3">
            <Link to="/candidat">
              <Button
                className="bg-white text-black hover:bg-white/90 font-sans text-[12.3px] font-normal px-3.5 py-1.5 rounded-sm border border-white transition-colors duration-200 tracking-wide"
              >
                Request access
              </Button>
            </Link>
            <Link to="/acces-cabinet">
              <Button
                variant="ghost"
                className="text-white/70 hover:text-white hover:bg-white/8 font-sans text-[12.3px] font-normal px-3.5 py-1.5 rounded-sm border border-white/30 hover:border-white/60 transition-colors duration-200 tracking-wide"
              >
                Request access for my firm →
              </Button>
            </Link>
          </motion.div>
          <motion.div variants={fadeUp} className="mb-2 md:mb-4" />
        </motion.div>
      </div>

      {/* Logo marquee — flush at bottom, no gap */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1.5 }}
        className="relative z-10 w-full"
      >
        <div className="relative flex items-center py-5 bg-white/[0.06] backdrop-blur-md border-t border-white/[0.08]">
          <div className="absolute left-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-r from-black/40 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-l from-black/40 to-transparent z-10 pointer-events-none sm:hidden" />
          <div className="flex-1 overflow-hidden">
            <div className="flex animate-marquee whitespace-nowrap items-center">
              {[...firmNames, ...firmNames].map((name, i) => (
                <span key={i} className="mx-4 md:mx-14 text-sm md:text-[1.05rem] font-serif font-[400] text-white select-none flex-shrink-0 tracking-[0.04em]">
                  {name}
                </span>
              ))}
            </div>
          </div>
          <div className="hidden sm:flex flex-shrink-0 items-center pl-6 pr-6 md:pr-10 relative z-20">
            <div className="absolute inset-y-0 -left-16 right-0 bg-gradient-to-r from-transparent via-black/80 to-black pointer-events-none" />
            <span className="relative inline-block px-3.5 py-1.5 border border-white rounded-sm text-[12.3px] font-sans font-normal tracking-wide text-white whitespace-nowrap cursor-default">
              Nos partenaires
            </span>
          </div>
        </div>
      </motion.div>
    </section>

    {/* Notre approche — fusion des deux sections */}
    <div id="notre-approche">
      <MissionSection />
    </div>

    {/* Citation + Qui sommes-nous */}
    <div id="qui-sommes-nous">
      <TeamQuoteSection />

      {/* Description équipe */}
      <section className="bg-[#f4f0eb] px-6 sm:px-10 py-28 md:py-36">
        <div className="max-w-2xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="text-[9px] font-sans font-semibold tracking-[0.28em] uppercase text-black/30 mb-10"
          >
            Qui sommes-nous
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif font-[300] text-[1.9rem] sm:text-[2.4rem] text-black leading-[1.12] mb-12"
          >
            Pensé par des spécialistes<br className="hidden sm:block" /> du marché.
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-8 h-px bg-black/20 origin-left mb-12"
          />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="font-sans font-light text-[1rem] sm:text-[1.05rem] text-black/60 leading-[1.9] mb-16 text-justify"
          >
            Logan a été pensé et conçu par des consultants et chasseurs de têtes spécialisés sur le marché des avocats. Notre objectif est de <span className="underline decoration-[0.5px] underline-offset-3">repenser différemment notre rôle</span> et notre collaboration, tant côté candidats que cabinets d'avocats — en proposant à chacun un <span className="font-semibold text-black/80">espace confidentiel, structuré et qualifié</span> pour accélérer leur recrutement, tout en continuant de leur proposer une intermédiation et un accompagnement sur-mesure.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="text-right"
          >
            <p className="font-serif text-[1.1rem] text-black font-[400] leading-tight mb-1">Simon Allal</p>
            <p className="font-sans text-[0.78rem] text-black/45 font-light tracking-wide">Founder</p>
          </motion.div>
        </div>
      </section>
    </div>

    {/* FAQ */}
    <div id="faq">
      <FAQSection />
    </div>

    {/* CTA — texture cuir en fond */}
    <div className="relative overflow-hidden bg-black">
      <section className="min-h-[100svh] relative flex items-center">
        {/* Photo texture cuir */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/texture-cuir.jpg')" }}
        />
        {/* Voile sombre pour lisibilité du texte */}
        <div className="absolute inset-0 bg-black/55" />

        <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-10 relative z-10 py-32 md:py-44 w-full">
          <div className="flex flex-col items-center text-center">


            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-white tracking-[0.04em] block mb-6"
            >
              Legal recruitment, redefined.
            </motion.span>

            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-16 h-px bg-white/30 mb-8"
            />

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.6 }}
              className="text-white/55 font-sans font-light text-sm leading-relaxed mb-10 max-w-sm"
            >
              Inscription confidentielle en moins de 10 minutes.<br />
              Profil validé sous 48h.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.8 }}
              className="flex flex-col sm:flex-row items-center gap-3 mt-4"
            >
              <Link to="/candidat">
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-white/90 font-sans text-[12.3px] font-normal px-8 py-5 rounded-sm tracking-wide"
                >
                  Request access
                </Button>
              </Link>
              <Link to="/acces-cabinet">
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-white/70 hover:text-white hover:bg-white/8 font-sans text-[12.3px] font-normal px-8 py-5 rounded-sm border border-white/30 hover:border-white/60 transition-colors tracking-wide"
                >
                  Request access for my firm →
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 1.2 }}
              className="mt-24 flex flex-row flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:gap-x-16 md:gap-x-24"
            >
              {['confidentiel.', 'structuré.', 'décisif.'].map((word, i) => (
                <motion.span
                  key={word}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 1.4 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="font-serif italic text-[0.75rem] sm:text-lg md:text-[1.39rem] text-white tracking-[0.16em] sm:tracking-[0.22em] font-medium"
                  style={{ fontVariant: 'small-caps', wordSpacing: '0.15em', textShadow: '0 2px 24px rgba(255,255,255,0.18)' }}
                >
                  {word}
                </motion.span>
              ))}

            </motion.div>
          </div>
        </div>
      </section>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  </div>
  );
};

export default LandingPage;
