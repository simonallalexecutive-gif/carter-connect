import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BenefitsSection from '@/components/landing/BenefitsSection';
import ValueProposition from '@/components/landing/ValueProposition';
import StatsTickerSection from '@/components/landing/StatsTickerSection';
import { ArrowRight } from 'lucide-react';
import heroVideoAsset from '@/assets/hero-video-abstract-bw.mp4.asset.json';
import founderPhoto from '@/assets/founder-simon.jpeg';

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
      {/* Background video with gradient overlay */}
      <div className="absolute inset-0">
        <motion.video
          src={heroVideoAsset.url}
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
          <motion.p variants={fadeUp} className="text-xs font-sans font-medium tracking-[0.25em] uppercase text-white/50 mb-6 md:mb-10">
            &nbsp;
          </motion.p>
          <motion.h1 variants={fadeUp} className="text-[1.65rem] sm:text-[2rem] md:text-[2.78rem] lg:text-[4.2rem] font-serif font-[500] text-white leading-[1.12] md:leading-[1.08] mb-6 md:mb-8 tracking-[-0.01em]">
            Connecting top{' '}<span className="text-white/70">legal minds</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-base sm:text-lg md:text-xl text-white/80 font-sans font-light max-w-2xl mb-3 leading-relaxed">
            Le premier hub confidentiel, piloté par des chasseurs spécialisés, dédié aux candidats et cabinets d'affaires les plus exigeants du marché.
          </motion.p>
          <motion.div variants={fadeUp} className="mb-8 md:mb-14" />
          <motion.div variants={fadeUp}>
            <Link to="/demo">
              <Button size="lg" className="bg-white text-black border border-white hover:bg-white/90 font-sans text-sm font-medium px-6 sm:px-8 py-5 sm:py-6 rounded-sm tracking-wide group transition-all duration-300">
                Rejoindre Logan
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom-right citation */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-48 md:bottom-60 right-6 sm:right-8 lg:right-10 z-10 max-w-sm md:max-w-md text-right"
      >
        <p className="font-serif text-lg sm:text-xl md:text-[1.35rem] text-white/60 italic leading-snug mb-2 font-[500] tracking-[-0.01em]">
          «&nbsp;Logan se positionne comme la plateforme la plus exigeante et structurée du marché, offrant un accompagnement sur mesure, résolument confidentiel et parfaitement ciblé.&nbsp;»
        </p>
        <span className="text-[10px] sm:text-[11px] font-sans font-medium tracking-[0.15em] uppercase text-white/40">
          — L'équipe Logan
        </span>
      </motion.div>

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
                <span key={i} className="mx-4 md:mx-10 text-[11px] md:text-[14.5px] font-serif font-normal text-white/50 select-none flex-shrink-0 tracking-wide">
                  {name}
                </span>
              ))}
            </div>
          </div>

          {/* Static "Nos partenaires" chip — hidden on small mobile */}
          <div className="hidden sm:block flex-shrink-0 pl-8 pr-6 md:pr-10 relative z-20 bg-gradient-to-r from-transparent via-black to-black">
            <span className="inline-block px-5 py-2 border border-white/40 rounded-sm text-[12px] md:text-[14.5px] font-serif font-normal tracking-wide text-white whitespace-nowrap cursor-default leading-none">
              Nos partenaires
            </span>
          </div>
        </div>
      </motion.div>
    </section>

    {/* Benefits — candidat / cabinet tabs */}
    <BenefitsSection />

    {/* Qui sommes-nous */}
    <section className="py-24 md:py-32 bg-foreground overflow-hidden">
      <div className="carter-container">
        <div className="max-w-4xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs font-sans font-medium tracking-[0.2em] uppercase text-white/50 mb-8 text-center"
          >
            Qui sommes-nous
          </motion.p>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-16 h-px bg-white/20 mx-auto mb-16 origin-center"
          />

          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
            {/* Photo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex-shrink-0"
            >
              <div className="w-48 h-48 md:w-56 md:h-56 rounded-full bg-black border border-white/20 overflow-hidden">
                <img src={founderPhoto} alt="Simon Allal, fondateur de Logan" className="w-full h-full object-cover object-[45%_25%]" />
              </div>
            </motion.div>

            {/* Bio */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              className="text-center md:text-left flex-1"
            >
              <h3 className="font-serif text-2xl md:text-3xl text-white font-normal mb-2 tracking-[-0.01em]">
                Simon Allal
              </h3>
              <p className="text-xs font-sans font-medium tracking-[0.2em] uppercase text-white/50 mb-6">
                Fondateur
              </p>
              <p className="font-sans text-sm md:text-base text-white/60 font-light leading-relaxed mb-8 max-w-lg">
                Fort d'une expertise approfondie du marché juridique, Simon Allal a fondé Logan avec la conviction qu'une approche confidentielle, ciblée et humaine pouvait transformer le recrutement des avocats d'affaires.
              </p>
              <Link to="/a-propos" className="inline-flex items-center gap-2 text-sm font-sans font-medium text-white/70 hover:text-white transition-colors duration-300 group">
                À propos
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>





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
