import { motion } from 'motion/react';
import { Lock, Bell, Shield, CalendarCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const steps = [
  {
    num: '01',
    title: 'Intégrez un espace confidentiel',
    desc: 'Votre identité n\'est jamais révélée. Seuls votre séniorité, votre expertise et le positionnement de votre cabinet sont visibles.',
  },
  {
    num: '02',
    title: 'Consultez les meilleures opportunités',
    desc: 'Accédez en temps réel aux recherches les plus premiums du marché. Alertez Logan dès qu\'une offre vous correspond.',
  },
  {
    num: '03',
    title: 'Échangez avant toute mise en relation',
    desc: 'Un consultant Logan vous accompagne. Votre identité n\'est communiquée qu\'avec votre accord explicite.',
  },
];

const FonctionnementCandidatsSection = () => (
  <section className="relative overflow-hidden py-28 md:py-40 bg-white">
    <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-10">

      {/* Header */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="mb-20 md:mb-28"
      >
        <motion.p variants={fadeUp} className="text-[11px] font-sans font-medium tracking-[0.25em] uppercase text-black/30 mb-5">
          Notre fonctionnement
        </motion.p>
        <motion.h2 variants={fadeUp} className="font-serif text-3xl sm:text-4xl md:text-[3rem] leading-[1.15] text-black mb-5">
          Perspective candidats
        </motion.h2>
        <motion.p variants={fadeUp} className="font-sans text-base md:text-lg leading-[1.7] text-black/45 max-w-xl">
          Restez visible sur le marché en toute discrétion — avec un consultant dédié à chaque étape.
        </motion.p>
      </motion.div>

      {/* Steps */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="mb-20 md:mb-24"
      >
        {steps.map(({ num, title, desc }, i) => (
          <motion.div
            key={num}
            variants={fadeUp}
            className={`grid grid-cols-[auto_1fr] gap-6 md:gap-10 py-10 ${i < steps.length - 1 ? 'border-b border-black/[0.06]' : ''}`}
          >
            <span className="font-serif text-[2.5rem] md:text-[3.5rem] leading-none text-black/[0.05] font-medium select-none w-16 md:w-20">
              {num}
            </span>
            <div>
              <h3 className="font-serif text-xl md:text-2xl text-black mb-3 leading-[1.25]">{title}</h3>
              <p className="font-sans text-[0.95rem] leading-[1.8] text-black/45 max-w-2xl">{desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom bar: tags + CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-wrap items-center justify-between gap-6 pt-10 border-t border-black/[0.06]"
      >
        <div className="flex flex-wrap gap-3">
          {[
            { icon: Lock, label: 'Anonymat garanti' },
            { icon: Bell, label: 'Alertes ciblées' },
            { icon: Shield, label: 'Contrôle total' },
          ].map(({ icon: Icon, label }) => (
            <span key={label} className="inline-flex items-center gap-2 text-xs font-sans text-black/30 border border-black/[0.07] rounded-sm px-3 py-1.5">
              <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
              {label}
            </span>
          ))}
        </div>
        <Link to="/prendre-rdv">
          <Button
            size="sm"
            className="bg-black text-white hover:bg-black/90 font-sans text-xs font-medium tracking-wide rounded-sm px-6"
          >
            Prendre rendez-vous
            <CalendarCheck className="w-3.5 h-3.5 ml-2" strokeWidth={1.5} />
          </Button>
        </Link>
      </motion.div>
    </div>
  </section>
);

export default FonctionnementCandidatsSection;
