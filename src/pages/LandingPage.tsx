import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import DiscoverSection from '@/components/landing/DiscoverSection';
import BenefitsSection from '@/components/landing/BenefitsSection';
import FounderSection from '@/components/landing/FounderSection';
import FAQSection from '@/components/landing/FAQSection';

import StatsTickerSection from '@/components/landing/StatsTickerSection';
import { ArrowRight } from 'lucide-react';
import heroVideoAsset from '@/assets/hero-video-abstract-bw.mp4.asset.json';
import heroBoardroom from '@/assets/hero-boardroom.jpeg';

const firmNames = [
  'Bredin Prat', 'Darrois Villey', 'Gide', 'Cleary Gottlieb', 'De Pardieu Brocas',
  'Freshfields', 'Linklaters', 'Clifford Chance', 'Allen & Overy', 'Sullivan & Cromwell',
  'Weil Gotshal', 'Skadden', 'Latham & Watkins', 'Davis Polk', 'Hogan Lovells',
  'White & Case', 'Willkie Farr', 'Dechert', 'Goodwin Procter', 'Orrick',
  'August Debouzy', 'BDGS', 'Racine', 'Fidal', 'Jeantet',
];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};


const LandingPage = () => (
  <div className="min-h-screen bg-background">
    <Header />

    {/* Hero */}
    <section className="min-h-screen md:min-h-[115vh] flex flex-col justify-center relative overflow-hidden bg-black">
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
        {/* Animated warm sunlight sweep — moves across the frame */}
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
        {/* Slow golden-hour shift with movement */}
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
        {/* Subtle vignette pulse */}
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
      <div className="px-6 sm:px-8 lg:px-10 max-w-6xl relative z-10 pt-24 flex-1 flex items-center">
        <motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-3xl">
          <motion.p variants={fadeUp} className="text-xs font-sans font-medium tracking-[0.25em] uppercase text-white/50 mb-2 md:mb-4">
            &nbsp;
          </motion.p>
          <div className="inline-block">
            <motion.h1 variants={fadeUp} className="text-[3rem] sm:text-[3.75rem] md:text-[5rem] lg:text-[6.5rem] font-serif font-[500] text-white leading-[1.05] md:leading-[1.02] mb-8 md:mb-10 tracking-[-0.03em] whitespace-nowrap">
              Curating Leading Lawyers
            </motion.h1>
            <motion.p variants={fadeUp} className="text-[0.92rem] sm:text-[0.98rem] md:text-[1.05rem] text-white font-sans font-[430] mb-3 leading-relaxed -mt-6" style={{ maxWidth: 'fit-content' }}>
              Un cercle d'excellence, confidentiel et sélectif, conçu et piloté par des chasseurs spécialisés
            </motion.p>
          </div>
          <motion.div variants={fadeUp} className="mb-20 md:mb-28" />
        </motion.div>
      </div>

      {/* Logo marquee */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1.5 }}
        className="relative z-10 pb-6 md:pb-10 overflow-hidden"
      >
        <div className="relative flex items-center py-1">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 md:right-[180px] top-0 bottom-0 w-12 md:w-20 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

          {/* Scrolling logos */}
          <div className="flex-1 overflow-hidden">
            <div className="flex animate-marquee whitespace-nowrap items-center">
              {[...firmNames, ...firmNames].map((name, i) => (
                <span key={i} className="mx-6 md:mx-14 text-sm font-sans font-medium text-white/50 select-none flex-shrink-0 tracking-wide">
                  {name}
                </span>
              ))}
            </div>
          </div>

          {/* Static "Nos partenaires" chip — hidden on small mobile */}
          <div className="hidden sm:block flex-shrink-0 pl-8 pr-6 md:pr-10 relative z-20 bg-gradient-to-r from-transparent via-black to-black">
            <span className="inline-block px-5 py-2 border border-white/40 rounded-sm text-sm font-sans font-medium tracking-wide text-white whitespace-nowrap cursor-default leading-none">
              Nos partenaires
            </span>
          </div>
        </div>
      </motion.div>
    </section>

    {/* Découvrir Logan — candidat / cabinet slides */}
    <DiscoverSection />

    {/* Qui sommes-nous */}
    <FounderSection />

    {/* Stats ticker */}
    <StatsTickerSection />

    {/* Nos engagements */}
    <BenefitsSection />

    {/* FAQ */}
    <FAQSection />


    {/* CTA */}
    <section className="py-24 md:py-32 bg-black relative overflow-hidden">
      <div className="absolute inset-0">
        <motion.video
          src={heroVideoAsset.url}
          autoPlay
          muted
          loop
          playsInline
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.4 }}
          viewport={{ once: true }}
          transition={{ duration: 2 }}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black" />
      </div>
      <div className="carter-container text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto"
        >
          <div className="w-12 h-px bg-white/30 mx-auto mb-8" />
          <h2 className="text-2xl md:text-4xl lg:text-[2.75rem] font-serif font-normal text-white mb-6 tracking-[-0.02em]">
            Intégrer le réseau
          </h2>
          <p className="text-white/50 font-sans font-light mb-10 leading-relaxed">
            Inscription confidentielle en moins de 10 minutes.<br />
            Profil validé sous 48h.
          </p>
          <Link to="/inscription">
            <Button size="lg" className="bg-white text-black hover:bg-white/90 font-sans text-sm font-medium px-10 py-6 rounded-sm tracking-wide">
              Commencer maintenant
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>

    <Footer />
  </div>
);

export default LandingPage;
