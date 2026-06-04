import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Users, Cpu, BarChart3 } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
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
  { icon: Shield, text: "Une approche confidentielle adaptée aux enjeux des cabinets d'affaires" },
  { icon: Cpu, text: 'Une combinaison unique entre technologie et accompagnement humain' },
  { icon: BarChart3, text: 'Un modèle économique plus lisible et plus efficient' },
];

const NotreOffrePage = () => (
  <div className="min-h-screen bg-white text-black">
    <Header />

    {/* Hero */}
    <section className="pt-28 pb-16 md:pt-36 md:pb-20">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-10">
        <motion.div variants={stagger} initial="hidden" animate="visible">
          <motion.p
            variants={fadeUp}
            className="text-[10px] font-sans font-medium tracking-[0.22em] uppercase text-black/45 mb-5"
          >
            Modalités d'intervention
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="font-serif text-3xl md:text-[2.4rem] leading-[1.15] text-black mb-5 tracking-[-0.01em] font-normal"
          >
            Notre approche
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="font-sans text-[13.5px] leading-[1.75] text-black/65 max-w-2xl"
          >
            Logan propose un modèle fondé sur un accès continu, associé à un accompagnement adapté à la nature et à la sensibilité des recherches. Les modalités sont définies en fonction des enjeux propres à chaque cabinet.
          </motion.p>
        </motion.div>
      </div>
    </section>

    {/* Pricing cards */}
    <section className="pb-20 md:pb-28">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="relative rounded-sm p-7 flex flex-col border border-black/10 bg-white"
            >
              {plan.featured && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-sans font-medium tracking-[0.18em] uppercase px-3 py-1 bg-black text-white rounded-sm">
                  Recommandé
                </span>
              )}

              <h3 className="font-serif text-lg text-black mb-1.5 font-normal">{plan.name}</h3>
              <p className="font-sans text-[12px] leading-[1.55] text-black/55 mb-6">{plan.tagline}</p>

              <div className="flex-1">
                <div className="mb-5">
                  <span className="font-serif text-[28px] font-normal text-black">{plan.price} €</span>
                  <span className="font-sans text-[12px] ml-1 text-black/45">/ mois</span>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 pb-3 border-b border-black/10">
                    <span className="font-sans text-[10px] font-medium tracking-[0.14em] uppercase text-black/45">
                      Engagement
                    </span>
                    <span className="font-sans text-[12px] ml-auto text-black/75">{plan.engagement}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-sans text-[10px] font-medium tracking-[0.14em] uppercase text-black/45">
                      Success fee
                    </span>
                    <span className="font-sans text-[12px] ml-auto font-medium text-black/75">{plan.successFee}</span>
                  </div>
                </div>
              </div>

              <Link to="/demander-acces">
                <Button className="w-full font-sans text-[12px] font-medium py-4 rounded-sm tracking-wide bg-black text-white hover:bg-black/90">
                  Demander un accès
                </Button>
              </Link>
            </div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* Pourquoi Logan */}
    <section className="pb-20 md:pb-28">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="font-sans text-[10px] font-medium tracking-[0.22em] uppercase text-black/45 mb-6">
            Pourquoi Logan
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            {advantages.map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="border border-black/10 rounded-sm p-6 flex items-start gap-4 bg-white"
              >
                <Icon className="w-4 h-4 text-black/55 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                <p className="font-sans text-[13px] leading-[1.65] text-black/75">{text}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>

    {/* CTA */}
    <section className="pb-20 md:pb-28">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="font-serif text-xl md:text-2xl leading-[1.35] text-black/75 max-w-xl mx-auto mb-8 font-normal">
            Prêt à accéder au marché des meilleurs talents ?
          </p>
          <Link to="/demander-acces">
            <Button
              size="lg"
              className="bg-black text-white hover:bg-black/90 font-sans text-[12px] font-medium px-7 py-4 rounded-sm tracking-wide gap-2"
            >
              Demander un accès
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>

    <Footer />
  </div>
);

export default NotreOffrePage;
