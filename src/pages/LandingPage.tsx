import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import ctaGradientBg from '@/assets/cta-gradient-bg.jpeg';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

import FounderSection from '@/components/landing/FounderSection';

import MissionSection from '@/components/landing/MissionSection';
import FonctionnementSection from '@/components/landing/FonctionnementSection';
import CinemaShowcaseSection from '@/components/landing/CinemaShowcaseSection';
import FAQSection from '@/components/landing/FAQSection';
import StatsTickerSection from '@/components/landing/StatsTickerSection';
import heroBoardroom from '@/assets/hero-landing-bg.jpeg';

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
  const location = useLocation();
  const showCabinetDemo = location.hash === '#votre-espace-cabinet';

  return (
  <div className="min-h-screen bg-background">
    <Header />

    {/* Hero */}
    <section className="h-[100svh] flex flex-col relative overflow-hidden bg-black" style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
      {/* Background photo with cinematic living Ken Burns */}
      <div className="absolute inset-0">
        <motion.img
          src={heroBoardroom}
          alt=""
          initial={{ opacity: 0, scale: 1.18, x: '0%', y: '0%' }}
          animate={{
            opacity: 1,
            scale: [1.18, 1.08, 1.12, 1.06, 1.1, 1.05],
            x: ['0%', '-1.5%', '0.5%', '-0.8%', '0.3%', '0%'],
            y: ['0%', '-0.8%', '0.3%', '-0.5%', '0.2%', '0%'],
          }}
          transition={{
            opacity: { duration: 2, ease: 'easeOut' },
            scale: { duration: 40, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' },
            x: { duration: 35, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' },
            y: { duration: 30, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' },
          }}
          className="w-full h-full object-cover"
          style={{ willChange: 'transform' }}
        />
        <motion.div
          className="absolute inset-0"
          animate={{
            opacity: [0, 0.18, 0.28, 0.1, 0.22, 0.06, 0.15],
            background: [
              'radial-gradient(ellipse 80% 60% at 65% 25%, rgba(255,200,120,0.45) 0%, rgba(255,160,60,0.15) 40%, transparent 70%)',
              'radial-gradient(ellipse 70% 55% at 80% 35%, rgba(255,210,130,0.4) 0%, rgba(255,170,70,0.12) 45%, transparent 75%)',
              'radial-gradient(ellipse 90% 65% at 60% 40%, rgba(255,190,100,0.35) 0%, rgba(255,150,50,0.18) 35%, transparent 65%)',
              'radial-gradient(ellipse 75% 50% at 75% 30%, rgba(255,200,120,0.4) 0%, rgba(255,160,60,0.1) 40%, transparent 70%)',
            ],
          }}
          transition={{ duration: 20, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }}
        />
        <motion.div
          className="absolute inset-0"
          animate={{
            opacity: [0.05, 0.14, 0.2, 0.08, 0.16, 0.05],
            background: [
              'linear-gradient(125deg, rgba(255,180,80,0.22) 0%, transparent 50%, rgba(180,140,255,0.06) 100%)',
              'linear-gradient(145deg, rgba(255,190,90,0.18) 0%, transparent 55%, rgba(200,160,255,0.1) 100%)',
              'linear-gradient(135deg, rgba(255,170,70,0.25) 0%, transparent 45%, rgba(160,120,255,0.08) 100%)',
            ],
          }}
          transition={{ duration: 28, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' }}
        />
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: [0.6, 0.75, 0.65, 0.8, 0.7] }}
          transition={{ duration: 15, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }}
          style={{
            background: 'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, rgba(0,0,0,0.5) 100%)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/25 to-black/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/70" />
      </div>
      <div className="px-4 sm:px-8 lg:px-10 max-w-6xl relative z-10 pt-20 sm:pt-24 flex-1 flex items-center pb-4">
        <motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-[min(95vw,72rem)]">
          <div className="inline-block">
          <motion.h1 variants={fadeUp} className="text-[1.8rem] sm:text-[3rem] md:text-[4rem] lg:text-[5.1rem] font-serif font-[500] text-white leading-[1.1] mb-3 md:mb-5 tracking-[-0.03em] whitespace-nowrap">
              Connecting <em className="italic">Top-Tier</em> Legal Minds
            </motion.h1>
          </div>
          <motion.p variants={fadeUp} className="text-[0.95rem] sm:text-[1.252rem] md:text-[1.273rem] text-white font-sans font-[480] leading-[1.65] max-w-[72rem]">
            Un réseau confidentiel, piloté par des chasseurs spécialisés, conçu pour les candidats<br className="hidden sm:inline" />{' '}et cabinets d'avocats les plus exigeants du marché.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8 sm:mt-20">
            <Link to="/demander-acces">
              <Button
                className="bg-white text-black hover:bg-white/90 font-sans font-normal text-[12.3px] px-3 py-1.5 border border-white rounded-sm tracking-wide"
              >
                Request access
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
                <span key={i} className="mx-4 md:mx-14 text-sm md:text-[1.05rem] font-serif font-medium text-white select-none flex-shrink-0 tracking-wide">
                  {name}
                </span>
              ))}
            </div>
          </div>
          <div className="hidden sm:flex flex-shrink-0 items-center pl-6 pr-6 md:pr-10 relative z-20">
            <div className="absolute inset-y-0 -left-16 right-0 bg-gradient-to-r from-transparent via-black/80 to-black pointer-events-none" />
            <span className="relative inline-block px-5 py-2 border border-white/40 rounded-sm text-sm font-sans font-light tracking-wide text-white whitespace-nowrap cursor-default leading-none">
              Nos partenaires
            </span>
          </div>
        </div>
      </motion.div>
    </section>

    {/* Notre approche */}
    <div id="notre-approche">
      <MissionSection />
    </div>

    {/* Notre fonctionnement */}
    <div id="fonctionnement">
      <FonctionnementSection />
    </div>

    {/* Démonstration vidéo cinéma — effet WoW Harvey.ai style */}
    <CinemaShowcaseSection />

    {/* Citation Logan — full page WOW */}
    <FounderSection />

    {/* FAQ */}
    <div id="faq">
      <FAQSection />
    </div>

    {/* Stats ticker */}
    <StatsTickerSection />

    {/* CTA */}
    {/* CTA + Footer wrapper with shared gradient background */}
    <div className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={ctaGradientBg}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      <section className="min-h-[100svh] relative flex items-center">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-10 relative z-10 py-32 md:py-44">
          <div className="flex flex-col items-center text-center">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-2xl sm:text-3xl md:text-4xl text-white tracking-[0.04em] block mb-6 drop-shadow-lg"
            >
              <em className="italic">Legal recruitment, redefined.</em>
            </motion.span>

            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="w-16 h-px bg-white/30 mb-8"
            />

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 1 }}
              className="text-white/60 font-sans font-light text-sm leading-relaxed mb-10 max-w-sm drop-shadow-md"
            >
              Inscription confidentielle en moins de 10 minutes.<br />
              Profil validé sous 48h.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 1.2 }}
            >
              <Link to="/demander-acces">
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-white/90 font-sans text-sm font-medium px-8 py-5 rounded-sm tracking-wide shadow-lg mt-4"
                >
                  Request access
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 1.6 }}
              className="mt-24 flex flex-row items-center justify-center gap-12 sm:gap-16 md:gap-24"
            >
              {['confidentiel.', 'structuré.', 'décisif.'].map((word, i) => (
                <motion.span
                  key={word}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 1.8 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="font-serif text-lg sm:text-xl md:text-2xl text-white/35 tracking-[0.18em] font-light drop-shadow-md italic"
                  style={{ fontVariant: 'small-caps', wordSpacing: '0.15em' }}
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
