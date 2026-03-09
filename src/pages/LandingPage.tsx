import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Shield, Users, Lock, ArrowRight, Briefcase, Eye, Clock, UserCheck, Bell, Handshake } from 'lucide-react';

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 0.68, 0, 1.2] as const } },
};

const benefits = [
  {
    icon: Clock,
    title: 'Informations en temps réel',
    desc: 'Marché, mouvements, opportunités — une vision constante et actualisée du marché juridique.',
  },
  {
    icon: Eye,
    title: 'Visibilité marché',
    desc: 'Dynamiques de recrutement, benchmarks et tendances du marché juridique haut de gamme.',
  },
  {
    icon: UserCheck,
    title: 'Accompagnement sur mesure',
    desc: 'Un consultant dédié à chaque étape, de la détection de l\'opportunité à la décision finale.',
  },
  {
    icon: Shield,
    title: 'Discrétion absolue',
    desc: 'Votre profil n\'est jamais diffusé sans votre consentement explicite.',
  },
];

const commitments = [
  {
    icon: Lock,
    text: 'Confidentialité absolue — aucun cabinet n\'aura accès à votre identité tant que vous ne l\'aurez pas décidé.',
  },
  {
    icon: UserCheck,
    text: 'Un consultant spécialisé à vos côtés — il lève le rideau et organise la mise en relation uniquement si l\'opportunité vous intéresse.',
  },
  {
    icon: Bell,
    text: 'Accès exclusif en temps réel — toutes les nouvelles opportunités sont transmises en priorité aux membres du réseau Carter avant toute diffusion.',
  },
];

const steps = [
  { icon: Briefcase, title: 'Créez votre profil', desc: 'Inscription en quelques minutes, entièrement confidentielle.' },
  { icon: Eye, title: 'Profil anonymisé', desc: 'Les cabinets consultent votre profil sans connaître votre identité.' },
  { icon: Handshake, title: 'Mise en relation', desc: 'Carter orchestre les échanges avec les cabinets intéressés, avec votre accord préalable.' },
];

const LandingPage = () => (
  <div className="min-h-screen">
    <Header />

    {/* Hero */}
    <section className="gradient-navy min-h-screen flex items-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-carter-accent blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 rounded-full bg-cream blur-3xl" />
      </div>
      <div className="carter-container relative z-10 pt-20">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="max-w-3xl"
        >
          <motion.p variants={fadeUp} className="text-carter-accent font-sans text-xs font-medium tracking-[0.25em] uppercase mb-8">
            Réseau confidentiel
          </motion.p>
          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl lg:text-8xl font-serif font-light text-cream-light leading-[1.05] mb-8 tracking-tight">
            Welcome to{' '}
            <span className="text-carter-accent italic">Carter</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-base md:text-lg text-cream-light/50 font-sans font-light max-w-xl mb-12 leading-relaxed">
            La plateforme confidentielle de mise en relation entre avocats d'affaires et cabinets de premier plan.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
            <Link to="/inscription">
              <Button size="lg" className="bg-carter-accent hover:bg-carter-accent-light text-accent-foreground font-sans text-sm font-medium px-8 py-6 rounded-lg tracking-wide">
                Rejoindre Carter
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>

    {/* Why Carter — Benefits */}
    <section className="carter-section bg-background">
      <div className="carter-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">
            Pourquoi rejoindre <em className="text-carter-accent">Carter</em>
          </h2>
          <p className="text-muted-foreground font-sans font-light max-w-lg mx-auto">
            Un service pensé pour les exigences du marché juridique haut de gamme.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.55 }}
              className="carter-card-elevated p-8 flex gap-5"
            >
              <div className="w-12 h-12 rounded-2xl bg-carter-accent/10 flex items-center justify-center flex-shrink-0">
                <b.icon className="w-6 h-6 text-carter-accent" />
              </div>
              <div>
                <h3 className="font-serif text-xl text-foreground mb-2">{b.title}</h3>
                <p className="font-sans text-sm text-muted-foreground font-light leading-relaxed">{b.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Commitments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="carter-card-elevated p-8 md:p-10"
        >
          <h3 className="font-serif text-2xl text-foreground mb-8 text-center">Nos engagements</h3>
          <div className="space-y-6">
            {commitments.map((c, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-carter-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <c.icon className="w-5 h-5 text-carter-accent" />
                </div>
                <p className="font-sans text-sm font-light text-foreground leading-relaxed">{c.text}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>

    {/* How it works */}
    <section className="carter-section bg-cream-light">
      <div className="carter-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">Comment ça marche</h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="w-12 h-12 rounded-full gradient-navy flex items-center justify-center mx-auto mb-5 text-cream-light font-sans font-medium text-sm">
                {i + 1}
              </div>
              <h3 className="font-serif text-xl text-foreground mb-2">{s.title}</h3>
              <p className="font-sans text-sm text-muted-foreground font-light">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="gradient-navy py-20">
      <div className="carter-container text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-serif font-light text-cream-light mb-6 tracking-tight">
            Intégrer le membership
          </h2>
          <p className="text-cream-light/50 font-sans font-light mb-8 max-w-md mx-auto">
            Inscription confidentielle en moins de 10 minutes. Profil validé sous 48h.
          </p>
          <Link to="/inscription">
            <Button size="lg" className="bg-carter-accent hover:bg-carter-accent-light text-accent-foreground font-sans text-sm font-medium px-10 py-6 rounded-lg">
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
