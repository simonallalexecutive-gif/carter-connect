import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useCabinetStore } from '@/stores/cabinetStore';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const benefits = [
  { title: 'Visibilité continue du marché', desc: 'Informations en temps réel sur la dynamique des profils disponibles — sans attendre une candidature.' },
  { title: 'Vivier ultra-qualifié toute l\'année', desc: 'Chaque profil est validé manuellement par CARTER. Accédez à un vivier actif pour tous vos besoins annuels.' },
  { title: 'Accompagnement à chaque étape', desc: 'Un consultant CARTER dédié à vos côtés — de la publication de votre recherche au placement final.' },
  { title: 'Solution plus économique', desc: 'Abonnement annuel illimité sans commission par placement. Contre 20–45K€ HT par recrutement en modèle traditionnel.' },
  { title: 'Confidentialité absolue', desc: 'Votre recherche comme les profils consultés restent strictement anonymisés. La levée de rideau se fait uniquement avec l\'accord du candidat.' },
  { title: 'Accès prioritaire aux opportunités', desc: 'Les membres CARTER sont notifiés en premier des nouveaux profils disponibles avant toute diffusion externe.' },
];

const stats = [
  { value: '+300', label: 'Profils qualifiés' },
  { value: '0%', label: 'Commission au placement' },
  { value: '48h', label: 'Activation du compte' },
  { value: '100%', label: 'Confidentiel' },
];

const CabinetStep1Hero = () => {
  const setStep = useCabinetStore((s) => s.setStep);

  return (
    <div className="rounded-lg overflow-hidden">
      {/* Hero section - black */}
      <div className="bg-black relative overflow-hidden px-8 md:px-16 pt-16 pb-14">
        {/* Subtle circles */}
        <div className="absolute -top-24 -right-24 w-[440px] h-[440px] rounded-full border border-white/[0.04] pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-[280px] h-[280px] rounded-full border border-white/[0.03] pointer-events-none" />

        <motion.div variants={stagger} initial="hidden" animate="visible">
          {/* Badge */}
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 border border-white/10 rounded-sm px-3 py-1.5 mb-10">
            <span className="font-serif text-xs font-bold text-white/80 tracking-[0.1em]">CARTER</span>
            <span className="w-px h-3 bg-white/20" />
            <span className="text-[9px] text-white/40 tracking-[0.12em] uppercase">Réseau Privé · Espace Cabinet</span>
          </motion.div>

          <motion.h1 variants={fadeUp} className="font-serif text-4xl md:text-5xl font-normal text-white leading-[1.04] tracking-[-0.01em] mb-1">
            Welcome to
          </motion.h1>
          <motion.h1 variants={fadeUp} className="font-serif text-4xl md:text-5xl font-normal text-white/70 italic leading-[1.04] tracking-[-0.01em] mb-6">
            CARTER
          </motion.h1>

          <motion.p variants={fadeUp} className="text-base text-white/70 leading-relaxed max-w-xl mb-2 font-sans font-light">
            Le réseau confidentiel des avocats d'affaires.
          </motion.p>
          <motion.p variants={fadeUp} className="text-[15px] text-white/45 leading-relaxed max-w-xl mb-12 font-sans font-light">
            Devenez membre et bénéficiez d'un accès annuel illimité à un vivier ultra-qualifié — sans commission au placement.
          </motion.p>

          {/* Benefits grid */}
          <motion.div variants={fadeUp} className="grid md:grid-cols-2 gap-3 mb-12 max-w-2xl">
            {benefits.map((b) => (
              <div key={b.title} className="bg-white/[0.04] border border-white/[0.07] rounded p-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 bg-white/60 rounded-full flex-shrink-0" />
                  <span className="text-xs font-semibold text-white">{b.title}</span>
                </div>
                <p className="text-xs text-white/45 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="flex items-center gap-5 flex-wrap">
            <Button
              onClick={() => setStep(2)}
              size="lg"
              className="bg-white text-black hover:bg-white/90 font-sans text-sm font-bold px-8 py-6 rounded-sm tracking-wide group"
            >
              Rejoindre CARTER
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
            <span className="text-xs text-white/30 italic font-sans">Inscription en 4 étapes · Activation sous 48h</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Stats bar */}
      <div className="bg-secondary border-b border-border px-8 md:px-16 py-5 flex">
        {stats.map((s, i) => (
          <div key={s.label} className={`flex-1 text-center ${i < stats.length - 1 ? 'border-r border-border' : ''}`}>
            <div className="font-serif text-2xl font-bold text-foreground">{s.value}</div>
            <div className="text-[9px] text-muted-foreground mt-1 tracking-[0.08em] uppercase">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CabinetStep1Hero;
