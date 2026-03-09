import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ArrowRight } from 'lucide-react';

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

const benefits = [
  {
    number: '01',
    title: 'Informations en temps réel',
    desc: 'Marché, mouvements, opportunités — une vision constante et actualisée du marché juridique.',
  },
  {
    number: '02',
    title: 'Visibilité marché',
    desc: 'Dynamiques de recrutement, benchmarks et tendances du marché juridique haut de gamme.',
  },
  {
    number: '03',
    title: 'Accompagnement sur mesure',
    desc: 'Un consultant dédié à chaque étape, de la détection de l\'opportunité à la décision finale.',
  },
  {
    number: '04',
    title: 'Discrétion absolue',
    desc: 'Votre profil n\'est jamais diffusé sans votre consentement explicite.',
  },
];

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
    text: 'Toutes les nouvelles opportunités sont transmises en priorité aux membres du réseau Carter avant toute diffusion.',
  },
];

const steps = [
  { number: '01', title: 'Créez votre profil', desc: 'Inscription en quelques minutes, entièrement confidentielle.' },
  { number: '02', title: 'Profil anonymisé', desc: 'Les cabinets consultent votre profil sans connaître votre identité.' },
  { number: '03', title: 'Mise en relation', desc: 'Carter orchestre les échanges avec les cabinets intéressés, avec votre accord préalable.' },
];

const LandingPage = () => (
  <div className="min-h-screen bg-background">
    <Header />

    {/* Hero — full black & white, Harvey-inspired */}
    <section className="min-h-screen flex items-center relative overflow-hidden bg-black">
      <div className="carter-container relative z-10 pt-24">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="max-w-3xl"
        >
          <motion.p variants={fadeUp} className="text-xs font-sans font-medium tracking-[0.25em] uppercase text-white/50 mb-10">
            Réseau confidentiel
          </motion.p>
          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl lg:text-[5.5rem] font-serif font-normal text-white leading-[1.08] mb-8 tracking-[-0.01em]">
            Welcome to{' '}
            <em className="font-normal">Carter</em>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-base md:text-lg text-white/60 font-sans font-light max-w-lg mb-14 leading-relaxed">
            La plateforme confidentielle de mise en relation entre avocats d'affaires et cabinets de premier plan.
          </motion.p>
          <motion.div variants={fadeUp}>
            <Link to="/inscription">
              <Button size="lg" className="bg-transparent text-white border border-white/30 hover:bg-white hover:text-black font-sans text-sm font-medium px-8 py-6 rounded-sm tracking-wide group transition-all duration-300">
                Rejoindre Carter
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>

    {/* Benefits */}
    <section className="carter-section bg-background">
      <div className="carter-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="carter-divider mb-8" />
          <h2 className="text-3xl md:text-5xl font-serif font-normal text-foreground leading-tight tracking-[-0.02em]">
            Pourquoi rejoindre<br />
            <em className="text-accent font-normal">Carter</em>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-px bg-border rounded-lg overflow-hidden mb-20">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="bg-background p-10 md:p-12 group hover:bg-card transition-colors duration-500"
            >
              <span className="text-xs font-sans font-medium text-accent tracking-[0.15em] mb-6 block">{b.number}</span>
              <h3 className="font-serif text-xl md:text-2xl text-foreground mb-3 font-normal">{b.title}</h3>
              <p className="font-sans text-sm text-muted-foreground font-light leading-relaxed">{b.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Commitments */}
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
                <span className="text-xs font-sans font-medium text-accent tracking-[0.15em] mt-1 flex-shrink-0">0{i + 1}</span>
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
              <span className="text-4xl font-serif text-accent/30 mb-6 block font-normal">{s.number}</span>
              <h3 className="font-serif text-xl text-foreground mb-3 font-medium">{s.title}</h3>
              <p className="font-sans text-sm text-muted-foreground font-light leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-32 bg-background relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-[0.03]" style={{ background: 'radial-gradient(circle, hsl(38 55% 72%), transparent 70%)' }} />
      </div>
      <div className="carter-container text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto"
        >
          <div className="carter-divider mx-auto mb-8" />
          <h2 className="text-3xl md:text-5xl font-serif font-normal text-foreground mb-6 tracking-[-0.02em]">
            Intégrer le membership
          </h2>
          <p className="text-muted-foreground font-sans font-light mb-10 leading-relaxed">
            Inscription confidentielle en moins de 10 minutes.<br />
            Profil validé sous 48h.
          </p>
          <Link to="/inscription">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-sans text-sm font-medium px-10 py-6 rounded-sm tracking-wide">
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
