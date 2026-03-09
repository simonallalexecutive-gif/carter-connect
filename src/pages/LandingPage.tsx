import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Shield, Users, Lock, ArrowRight, Briefcase, Eye } from 'lucide-react';

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 0.68, 0, 1.2] as const } },
};

const features = [
  {
    icon: Shield,
    title: 'Confidentialité absolue',
    desc: 'Votre identité n\'est jamais révélée aux cabinets sans votre accord explicite.',
  },
  {
    icon: Users,
    title: 'Réseau premium',
    desc: 'Accès exclusif aux meilleurs cabinets d\'affaires français et internationaux.',
  },
  {
    icon: Lock,
    title: 'Données protégées',
    desc: 'Chiffrement de bout en bout et conformité RGPD intégrale.',
  },
];

const steps = [
  { icon: Briefcase, title: 'Créez votre profil', desc: 'Inscription en quelques minutes, entièrement confidentielle.' },
  { icon: Eye, title: 'Profil anonymisé', desc: 'Les cabinets consultent votre profil sans connaître votre identité.' },
  { icon: ArrowRight, title: 'Mise en relation', desc: 'Carter orchestre les mises en relation avec les cabinets intéressés.' },
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
      <div className="carter-container relative z-10 pt-16">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="max-w-3xl"
        >
          <motion.p variants={fadeUp} className="text-carter-accent font-sans text-sm font-semibold tracking-widest uppercase mb-6">
            Réseau confidentiel
          </motion.p>
          <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl lg:text-7xl font-serif text-cream-light leading-[1.1] mb-6">
            Welcome to <em className="text-carter-accent">Carter</em>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg md:text-xl text-cream-light/60 font-sans font-light max-w-xl mb-10">
            Carter met en relation les meilleurs avocats d'affaires avec les cabinets les plus prestigieux, en toute confidentialité.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
            <Link to="/inscription">
              <Button size="lg" className="bg-carter-accent hover:bg-carter-accent-light text-accent-foreground font-sans text-base px-8 py-6 rounded-xl">
                Rejoindre Carter
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>

    {/* Features */}
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
            Pourquoi <em className="text-carter-accent">Carter</em> ?
          </h2>
          <p className="text-muted-foreground font-sans max-w-lg mx-auto">
            Un service pensé pour les exigences du marché juridique haut de gamme.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.55 }}
              className="carter-card-elevated p-8 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-carter-accent/10 flex items-center justify-center mx-auto mb-5">
                <f.icon className="w-7 h-7 text-carter-accent" />
              </div>
              <h3 className="font-serif text-xl text-foreground mb-3">{f.title}</h3>
              <p className="font-sans text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
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
              <div className="w-12 h-12 rounded-full gradient-navy flex items-center justify-center mx-auto mb-5 text-cream-light font-sans font-bold">
                {i + 1}
              </div>
              <h3 className="font-serif text-xl text-foreground mb-2">{s.title}</h3>
              <p className="font-sans text-sm text-muted-foreground">{s.desc}</p>
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
          <h2 className="text-3xl md:text-4xl font-serif text-cream-light mb-6">
            Prêt à franchir le pas ?
          </h2>
          <p className="text-cream-light/60 font-sans mb-8 max-w-md mx-auto">
            Inscription confidentielle en moins de 10 minutes. Profil validé sous 48h.
          </p>
          <Link to="/inscription">
            <Button size="lg" className="bg-carter-red hover:bg-carter-red-light text-accent-foreground font-sans text-base px-10 py-6 rounded-xl">
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
