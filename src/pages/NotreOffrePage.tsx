import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const plans = [
  {
    name: 'Logan Access',
    tagline: 'Accéder au marché, en continu.',
    price: '2 500',
    engagement: '3 mois',
    successFee: '5 %',
    featured: false,
  },
  {
    name: 'Logan Select',
    tagline: 'Accélérer et sécuriser ses recrutements.',
    price: '4 000',
    engagement: '3 mois',
    successFee: '7 %',
    featured: true,
  },
  {
    name: 'Logan Exclusive',
    tagline: 'Mandats stratégiques et profils sensibles.',
    price: '6 000',
    engagement: '3 mois',
    successFee: '10 %',
    featured: false,
  },
];

const advantages = [
  { num: '01', title: 'Vivier qualifié', text: 'Un accès continu à un vivier ultra qualifié d\'avocats du marché des affaires.' },
  { num: '02', title: 'Confidentialité', text: 'Une approche strictement confidentielle, adaptée aux enjeux des cabinets d\'affaires.' },
  { num: '03', title: 'Technologie & humain', text: 'Une combinaison rare entre infrastructure technologique et accompagnement consultant.' },
  { num: '04', title: 'Modèle lisible', text: 'Un modèle économique transparent, plus efficient que les approches classiques.' },
];

const NotreOffrePage = () => (
  <div className="min-h-screen bg-white text-black">
    <Header />

    {/* Hero — left aligned, sobre */}
    <section className="pt-32 pb-14 md:pt-40 md:pb-16">
      <div className="max-w-5xl mx-auto px-6 sm:px-10">
        <motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-2xl">
          <motion.p
            variants={fadeUp}
            className="text-[10px] font-sans font-medium tracking-[0.22em] uppercase text-black/45 mb-5"
          >
            Modalités d'intervention
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="font-serif text-[2rem] md:text-[2.4rem] leading-[1.15] text-black mb-5 tracking-[-0.01em] font-normal"
          >
            Notre approche
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="font-sans text-[13px] leading-[1.75] text-black/60 max-w-xl"
          >
            Un accès continu au marché, associé à un accompagnement adapté à la nature et à la sensibilité des recherches. Les modalités sont définies en fonction des enjeux propres à chaque cabinet.
          </motion.p>
          <motion.div variants={fadeUp} className="w-10 h-px bg-black/20 mt-8" />
        </motion.div>
      </div>
    </section>

    {/* Plans */}
    <section className="pb-20 md:pb-24">
      <div className="max-w-5xl mx-auto px-6 sm:px-10">
        <p className="text-[10px] font-sans font-medium tracking-[0.22em] uppercase text-black/45 mb-8">
          Formules
        </p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 md:grid-cols-3 border-t border-b border-black/10"
        >
          {plans.map((plan, idx) => (
            <div
              key={plan.name}
              className={`relative p-7 md:p-8 flex flex-col ${idx < plans.length - 1 ? 'md:border-r border-black/10' : ''} ${idx > 0 ? 'border-t md:border-t-0 border-black/10' : ''}`}
            >
              {plan.featured && (
                <span className="text-[9px] font-sans font-medium tracking-[0.18em] uppercase text-black/50 mb-3">
                  · Recommandé
                </span>
              )}
              {!plan.featured && <span className="text-[9px] mb-3 invisible">·</span>}

              <h3 className="font-serif text-[1.2rem] text-black mb-1 font-normal">{plan.name}</h3>
              <p className="font-sans text-[12px] leading-[1.55] text-black/55 mb-7">{plan.tagline}</p>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="font-serif text-[26px] font-light text-black tabular-nums">{plan.price}</span>
                <span className="font-sans text-[12px] text-black/45">€ / mois</span>
              </div>

              <div className="space-y-2.5 mb-7 text-[12px] font-sans">
                <div className="flex items-center justify-between border-b border-black/[0.07] pb-2.5">
                  <span className="text-[10px] tracking-[0.14em] uppercase text-black/45">Engagement</span>
                  <span className="text-black/75">{plan.engagement}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] tracking-[0.14em] uppercase text-black/45">Success fee</span>
                  <span className="text-black/75">{plan.successFee}</span>
                </div>
              </div>

              <Link to="/demander-acces" className="mt-auto">
                <Button
                  variant="outline"
                  className="w-full font-sans text-[11px] font-medium py-3 rounded-sm tracking-wide border-black/30 text-black hover:bg-black hover:text-white hover:border-black"
                >
                  Demander un accès
                </Button>
              </Link>
            </div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* Pourquoi Logan — sober list */}
    <section className="pb-20 md:pb-28">
      <div className="max-w-5xl mx-auto px-6 sm:px-10">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <motion.p variants={fadeUp} className="text-[10px] font-sans font-medium tracking-[0.22em] uppercase text-black/45 mb-8">
            Pourquoi Logan
          </motion.p>

          <div className="grid sm:grid-cols-2 gap-x-12 gap-y-10 max-w-3xl">
            {advantages.map((a) => (
              <motion.div key={a.num} variants={fadeUp} className="flex flex-col gap-1.5">
                <div className="flex items-baseline gap-3">
                  <span className="font-serif text-[0.7rem] text-black/35 tabular-nums">{a.num}</span>
                  <h4 className="font-serif text-[0.98rem] text-black font-normal tracking-[-0.005em]">{a.title}</h4>
                </div>
                <p className="font-sans text-[12.5px] leading-[1.65] text-black/60 pl-7">
                  {a.text}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>

    {/* CTA — left aligned, sober */}
    <section className="pb-24 md:pb-32">
      <div className="max-w-5xl mx-auto px-6 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="border-t border-black/10 pt-10 max-w-2xl"
        >
          <p className="font-serif text-[1.3rem] md:text-[1.5rem] leading-[1.35] text-black/85 mb-6 font-normal">
            <em className="italic">Prêt</em> à accéder au marché des meilleurs talents&nbsp;?
          </p>
          <Link to="/demander-acces">
            <Button
              className="bg-black text-white hover:bg-black/90 font-sans text-[12px] font-medium px-6 py-3 rounded-sm tracking-wide gap-2"
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
