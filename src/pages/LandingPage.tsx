import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BenefitsSection from '@/components/landing/BenefitsSection';
import ValueProposition from '@/components/landing/ValueProposition';
import StatsTickerSection from '@/components/landing/StatsTickerSection';
import { ArrowRight } from 'lucide-react';
import heroVideo from '@/assets/hero-video-jessica.mp4';

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
    <section className="min-h-screen flex flex-col justify-center relative overflow-hidden bg-black">
      {/* Background image with gradient overlay */}
      <div className="absolute inset-0">
        <motion.video
          src={heroVideo}
          autoPlay
          muted
          loop
          playsInline
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 0.75, scale: 1 }}
          transition={{ duration: 2, ease: 'easeOut' }}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/45 to-black/85" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black" />
      </div>
      <div className="px-6 sm:px-8 lg:px-10 max-w-6xl relative z-10 pt-24 flex-1 flex items-center">
          <motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-3xl">
          <motion.p variants={fadeUp} className="text-xs font-sans font-medium tracking-[0.25em] uppercase text-white/50 mb-10">
            &nbsp;
          </motion.p>
          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl lg:text-[6.6rem] font-serif font-[500] text-white leading-[1.08] mb-8 tracking-[-0.01em] whitespace-nowrap">
            Leading Lawyers{' '}<span className="text-white/70">Connected</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg md:text-2xl text-white font-sans font-normal max-w-2xl mb-3 leading-relaxed whitespace-nowrap">
            La plateforme confidentielle de mise en relation entre avocats<br />d'affaires et cabinets de premier plan.
          </motion.p>
          <motion.div variants={fadeUp} className="mb-14" />
          <motion.div variants={fadeUp}>
            <Link to="/inscription">
              <Button size="lg" className="bg-white text-black border border-white hover:bg-white/90 font-sans text-sm font-medium px-8 py-6 rounded-sm tracking-wide group transition-all duration-300">
                Rejoindre Logan
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Logo marquee */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1.5 }}
        className="relative z-10 pb-10 overflow-hidden"
      >
        <div className="relative flex items-center py-1">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
          <div className="absolute right-[140px] top-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

          {/* Scrolling logos */}
          <div className="flex-1 overflow-hidden">
            <div className="flex animate-marquee whitespace-nowrap items-center">
              {[...firmNames, ...firmNames].map((name, i) => (
                <span key={i} className="mx-8 md:mx-12 text-[14px] md:text-[17px] font-sans font-medium text-white/50 select-none flex-shrink-0 tracking-wide">
                  {name}
                </span>
              ))}
            </div>
          </div>

          {/* Static "Nos partenaires" chip — Harvey style */}
          <div className="flex-shrink-0 pl-6 pr-6 md:pr-10 relative z-20 bg-gradient-to-r from-transparent via-black/80 to-black">
            <span className="px-6 py-2 border border-white/40 rounded-sm text-[14px] md:text-[17px] font-sans font-medium tracking-wide text-white whitespace-nowrap cursor-default">
              Nos partenaires
            </span>
          </div>
        </div>
      </motion.div>
    </section>

    {/* Value proposition */}
    <ValueProposition />

    {/* Mot de l'équipe */}
    <section className="py-24 md:py-32 bg-background overflow-hidden">
      <div className="carter-container">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-16 h-px bg-foreground/20 mx-auto mb-12 origin-center"
          />
          <motion.p
            initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="text-xl sm:text-2xl md:text-3xl lg:text-[2.5rem] font-serif font-normal text-foreground leading-[1.25] italic tracking-[-0.01em] mb-8"
          >
            «&nbsp;Logan est aujourd'hui la seule plateforme capable de connecter efficacement les cabinets et les candidats <strong className="font-bold">les plus qualifiés du marché</strong>, tout en préservant la <strong className="font-bold">confidentialité</strong> et en proposant un <strong className="font-bold">accompagnement sur mesure</strong> à chaque étape du processus.&nbsp;»
          </motion.p>
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
            className="inline-block text-xs font-sans font-medium tracking-[0.2em] uppercase text-muted-foreground"
          >
            — L'Équipe Logan
          </motion.span>
        </div>
      </div>
    </section>

    {/* Benefits — candidat / cabinet tabs */}
    <BenefitsSection />

    {/* Stats ticker */}
    <StatsTickerSection />


    {/* CTA */}
    <section className="py-24 md:py-32 bg-black relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-[0.08]" style={{ background: 'radial-gradient(circle, hsl(0 0% 50%), transparent 70%)' }} />
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
