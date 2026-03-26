import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight, Shield, Users, Cpu, BarChart3 } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const plans = [
  {
    name: 'Logan Access',
    tagline: 'Accéder au marché, en continu',
    price: '2 500',
    engagement: '3 mois',
    successFee: '5 %',
    featured: false,
  },
  {
    name: 'Logan Select',
    tagline: 'Accélérer et sécuriser ses recrutements',
    price: '4 000',
    engagement: '3 mois',
    successFee: '7 %',
    featured: true,
  },
  {
    name: 'Logan Exclusive',
    tagline: 'Mandats stratégiques et profils sensibles',
    price: '6 000',
    engagement: '3 mois',
    successFee: '10 %',
    featured: false,
  },
];

const advantages = [
  { icon: Users, text: 'Un accès continu à un vivier ultra qualifié' },
  { icon: Shield, text: 'Une approche confidentielle adaptée aux enjeux des cabinets d\'affaires' },
  { icon: Cpu, text: 'Une combinaison unique entre technologie et accompagnement humain' },
  { icon: BarChart3, text: 'Un modèle économique plus lisible et plus efficient' },
];

const NotreOffrePage = () => (
  <div className="min-h-screen bg-black">
    <Header />

    {/* Hero */}
    <section className="pt-32 pb-20 md:pt-40 md:pb-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black" />
      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 lg:px-10">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <motion.p variants={fadeUp} className="text-[11px] font-sans font-medium tracking-[0.25em] uppercase text-white/30 mb-6">
            Modalités d'intervention
          </motion.p>
          <motion.h1 variants={fadeUp} className="font-serif text-3xl sm:text-4xl md:text-[3.2rem] leading-[1.15] text-white/90 mb-8 max-w-3xl">
            Notre offre
          </motion.h1>
          <motion.p variants={fadeUp} className="font-sans text-[1.05rem] md:text-lg leading-[1.8] text-white/50 max-w-3xl">
            Logan propose un modèle fondé sur un accès continu, associé à un accompagnement adapté à la nature et à la sensibilité des recherches. Les modalités sont définies en fonction des enjeux propres à chaque cabinet.
          </motion.p>
        </motion.div>
      </div>
    </section>

    {/* Pricing cards */}
    <section className="pb-24 md:pb-36">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="grid md:grid-cols-3 gap-6 md:gap-8"
        >
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-sm p-8 md:p-10 flex flex-col ${
                plan.featured
                  ? 'bg-white text-black border-2 border-white'
                  : 'bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] text-white'
              }`}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-sans font-medium tracking-[0.2em] uppercase px-4 py-1.5 bg-black text-white rounded-sm">
                  Recommandé
                </span>
              )}

              <h3 className={`font-serif text-xl md:text-2xl mb-2 ${plan.featured ? 'text-black' : 'text-white/90'}`}>
                {plan.name}
              </h3>
              <p className={`font-sans text-sm leading-[1.6] mb-8 ${plan.featured ? 'text-black/50' : 'text-white/40'}`}>
                {plan.tagline}
              </p>

              <div className="flex-1">
                <div className="mb-6">
                  <span className={`font-serif text-3xl md:text-4xl font-medium ${plan.featured ? 'text-black' : 'text-white/85'}`}>
                    {plan.price} €
                  </span>
                  <span className={`font-sans text-sm ml-1 ${plan.featured ? 'text-black/40' : 'text-white/30'}`}>
                    / mois
                  </span>
                </div>

                <div className="space-y-4 mb-8">
                  <div className={`flex items-center gap-3 pb-4 border-b ${plan.featured ? 'border-black/10' : 'border-white/[0.08]'}`}>
                    <span className={`font-sans text-xs font-medium tracking-[0.15em] uppercase ${plan.featured ? 'text-black/40' : 'text-white/30'}`}>
                      Engagement
                    </span>
                    <span className={`font-sans text-sm ml-auto ${plan.featured ? 'text-black' : 'text-white/60'}`}>
                      {plan.engagement}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`font-sans text-xs font-medium tracking-[0.15em] uppercase ${plan.featured ? 'text-black/40' : 'text-white/30'}`}>
                      Success fee
                    </span>
                    <span className={`font-sans text-sm ml-auto font-medium ${plan.featured ? 'text-black' : 'text-white/60'}`}>
                      {plan.successFee}
                    </span>
                  </div>
                </div>
              </div>

              <Link to="/demander-acces">
                <Button
                  className={`w-full font-sans text-sm font-medium py-5 rounded-sm tracking-wide ${
                    plan.featured
                      ? 'bg-black text-white hover:bg-black/90'
                      : 'bg-white text-black hover:bg-white/90'
                  }`}
                >
                  Demander un accès
                </Button>
              </Link>
            </div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* Pourquoi Logan */}
    <section className="pb-24 md:pb-36">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="font-sans text-xs font-medium tracking-[0.25em] uppercase text-white/25 mb-8">
            Pourquoi Logan
          </p>

          <div className="grid sm:grid-cols-2 gap-6 md:gap-10">
            {advantages.map(({ icon: Icon, text }) => (
              <div key={text} className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-sm p-8 md:p-10 flex items-start gap-5">
                <Icon className="w-5 h-5 text-white/25 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                <p className="font-sans text-[0.95rem] leading-[1.7] text-white/55">{text}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>

    {/* CTA */}
    <section className="pb-24 md:pb-36">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="font-serif text-xl sm:text-2xl md:text-[1.8rem] leading-[1.35] text-white/40 max-w-2xl mx-auto mb-10">
            Prêt à accéder au marché des meilleurs talents ?
          </p>
          <Link to="/demander-acces">
            <Button
              size="lg"
              className="bg-white text-black hover:bg-white/90 font-sans text-sm font-medium px-8 py-5 rounded-sm tracking-wide gap-2"
            >
              Demander un accès
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>

    <Footer />
  </div>
);

export default NotreOffrePage;
