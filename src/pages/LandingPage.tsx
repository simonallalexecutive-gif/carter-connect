import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BenefitsSection from '@/components/landing/BenefitsSection';
import { ArrowRight } from 'lucide-react';
import heroVideo from '@/assets/hero-video-jessica.mp4';

const firmNames = [
  'bredin prat', 'darrois villey', 'gide', 'cleary gottlieb', 'de pardieu brocas',
  'freshfields', 'linklaters', 'clifford chance', 'allen & overy', 'sullivan & cromwell',
  'weil gotshal', 'skadden', 'latham & watkins', 'davis polk', 'hogan lovells',
  'white & case', 'willkie farr', 'dechert', 'goodwin procter', 'orrick',
  'august debouzy', 'bdgs', 'racine', 'fidal', 'jeantet',
];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

const commitments = [
  {
    title: 'Confidentialité absolue',
    text: 'Aucun cabinet n\'aura accès à votre identité tant que vous ne l\'aurez pas décidé.',
  },
  {
    title: 'Un consultant à vos côtés',
    text: 'Il lève le rideau et organise la mise en relation uniquement si l\'opportunité vous intéresse.',
  },
  {
    title: 'Accès exclusif en temps réel',
    text: 'Toutes les nouvelles opportunités sont transmises en priorité aux membres du réseau Logan avant toute diffusion.',
  },
];

const steps = [
  { number: '01', title: 'Créez votre profil', desc: 'Inscription en quelques minutes, entièrement confidentielle.' },
  { number: '02', title: 'Profil anonymisé', desc: 'Les cabinets consultent votre profil sans connaître votre identité.' },
  { number: '03', title: 'Mise en relation', desc: 'Logan orchestre les échanges avec les cabinets intéressés, avec votre accord préalable.' },
];

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
          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl lg:text-[5.5rem] font-serif font-normal text-white leading-[1.08] mb-8 tracking-[-0.01em]">
            Welcome to{' '}<em className="font-normal text-white/70">Logan</em>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-base md:text-lg text-white/60 font-sans font-light max-w-lg mb-3 leading-relaxed">
            La plateforme confidentielle de mise en relation entre avocats d'affaires et cabinets de premier plan.
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
                <span key={i} className="mx-8 md:mx-12 text-[11px] md:text-[13px] font-serif font-normal text-white/50 select-none flex-shrink-0 tracking-[0.05em]">
                  {name}
                </span>
              ))}
            </div>
          </div>

          {/* Static "Nos partenaires" chip — Harvey style */}
          <div className="flex-shrink-0 pl-6 pr-6 md:pr-10 relative z-20 bg-gradient-to-r from-transparent via-black/80 to-black">
            <span className="px-6 py-2 border border-white/40 rounded-sm text-[11px] font-normal tracking-[0.06em] text-white uppercase whitespace-nowrap cursor-default">
              Nos partenaires
            </span>
          </div>
        </div>
      </motion.div>
    </section>

    {/* Benefits — candidat / cabinet tabs */}
    <BenefitsSection />

    {/* Commitments */}
    <section className="carter-section bg-secondary">
      <div className="carter-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border border-border rounded-lg overflow-hidden"
        >
          <div className="p-10 md:p-12 border-b border-border">
            <p className="carter-label mb-4">Nos engagements</p>
            <h3 className="font-serif text-2xl md:text-3xl text-foreground font-normal">
              Une promesse de confiance
            </h3>
          </div>
          <div className="divide-y divide-border">
            {commitments.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-10 md:p-12 flex gap-8 items-start group hover:bg-card/50 transition-colors duration-500"
              >
                <span className="text-xs font-sans font-medium text-muted-foreground tracking-[0.15em] mt-1 flex-shrink-0">0{i + 1}</span>
                <div>
                  <h4 className="font-serif text-lg text-foreground mb-2 font-medium">{c.title}</h4>
                  <p className="font-sans text-sm text-muted-foreground font-light leading-relaxed">{c.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>

    {/* How it works */}
    <section className="carter-section bg-card">
      <div className="carter-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="carter-divider mb-8" />
          <h2 className="text-3xl md:text-5xl font-serif font-normal text-foreground tracking-[-0.02em]">Comment ça marche</h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-px bg-border rounded-lg overflow-hidden">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="bg-card p-10 md:p-12 group hover:bg-secondary transition-colors duration-500"
            >
              <span className="text-4xl font-serif text-muted-foreground/30 mb-6 block font-normal">{s.number}</span>
              <h3 className="font-serif text-xl text-foreground mb-3 font-medium">{s.title}</h3>
              <p className="font-sans text-sm text-muted-foreground font-light leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-32 bg-black relative">
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
          <h2 className="text-3xl md:text-5xl font-serif font-normal text-white mb-6 tracking-[-0.02em]">
            Intégrer le membership
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
