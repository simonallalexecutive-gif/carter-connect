import { motion } from 'motion/react';
import { Shield, Eye, Search, Lock, Bell, CalendarCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cabinetPoints = [
  {
    num: '01',
    title: 'Lancez votre recherche en toute confidentialité',
    text: "Adressez-vous à un pool de candidats qualifiés et rigoureusement sélectionnés, tout en préservant l'identité de votre cabinet.",
    icon: Shield,
  },
  {
    num: '02',
    title: 'Accédez en temps réel aux meilleurs profils du marché',
    text: "Décryptez la dynamique du marché, restez opportuniste et anticipez vos recrutements pour l'ensemble de vos départements.",
    icon: Eye,
  },
  {
    num: '03',
    title: 'Actionnez Logan pour un rapprochement ciblé',
    text: "Que vous soyez en recherche ou opportuniste sur un profil, Logan est à vos côtés pour opérer et concrétiser chaque rapprochement.",
    icon: Search,
  },
];

const candidatPoints = [
  {
    num: '01',
    title: 'Accédez en temps réel aux meilleures opportunités du marché',
    text: "Identifiez une opportunité, étudiez sa pertinence au regard de votre projet et échangez avec un consultant en amont de tout rapprochement.",
    icon: Lock,
  },
  {
    num: '02',
    title: 'Cultivez votre attractivité sans compromettre votre anonymat',
    text: "Restez en alerte et opportuniste sur votre marché : dès lors qu'un cabinet manifeste un intérêt pour votre profil, Logan est à vos côtés pour en parler.",
    icon: Bell,
  },
  {
    num: '03',
    title: 'Logan comme seul intermédiaire',
    text: "Bénéficiez d'un accompagnement personnalisé dans un cadre strictement confidentiel, maîtrisé et transparent.",
    icon: Shield,
  },
];

/* ---------- Step Card Component ---------- */
interface StepCardProps {
  num: string;
  title: string;
  text: string;
  icon: React.ElementType;
  dark?: boolean;
}

const StepCard = ({ num, title, text, icon: Icon, dark = false }: StepCardProps) => {
  const borderColor = dark ? 'border-white/[0.08]' : 'border-black/[0.06]';
  const hoverBorder = dark ? 'hover:border-white/20' : 'hover:border-black/15';
  const numColor = dark ? 'text-white/[0.06]' : 'text-black/[0.05]';
  const titleColor = dark ? 'text-white' : 'text-black';
  const textColor = dark ? 'text-white/50' : 'text-black/50';
  const iconBg = dark ? 'bg-white/[0.06]' : 'bg-black/[0.04]';
  const iconColor = dark ? 'text-white/40' : 'text-black/35';
  const lineColor = dark ? 'bg-white/[0.08]' : 'bg-black/[0.06]';

  return (
    <motion.div
      variants={fadeUp}
      className={`group relative border ${borderColor} ${hoverBorder} rounded-sm p-8 md:p-10 transition-all duration-500 flex flex-col h-full`}
    >
      {/* Large faded number */}
      <span className={`absolute top-6 right-8 font-serif text-[4.5rem] md:text-[5.5rem] leading-none font-bold ${numColor} select-none pointer-events-none`}>
        {num}
      </span>

      {/* Icon */}
      <div className={`w-11 h-11 rounded-full ${iconBg} flex items-center justify-center mb-6`}>
        <Icon className={`w-[18px] h-[18px] ${iconColor}`} strokeWidth={1.5} />
      </div>

      {/* Accent line */}
      <div className={`w-8 h-px ${lineColor} mb-5`} />

      <h4 className={`font-sans text-[0.9rem] font-semibold ${titleColor} tracking-[-0.01em] mb-3 pr-10 min-h-[3.6rem] max-h-[4.5rem] flex items-start leading-[1.4]`}>
        {title}
      </h4>
      <p className={`font-sans text-[0.92rem] leading-[1.85] ${textColor} text-justify mt-auto`}>
        {text}
      </p>
    </motion.div>
  );
};

/* ---------- Cabinet Page ---------- */
const CabinetPage = () => (
  <section className="relative overflow-hidden py-20 md:py-36" style={{ background: '#111111' }}>
    <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-10">

      {/* Header — left-aligned */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="mb-16 md:mb-24"
      >
        <motion.p variants={fadeUp} className="text-[11px] font-sans font-medium tracking-[0.25em] uppercase text-white/30 mb-6">
          Notre fonctionnement
        </motion.p>
        <motion.h2 variants={fadeUp} className="font-serif text-3xl sm:text-4xl md:text-[2.8rem] leading-[1.15] text-white mb-5">
          Firms
        </motion.h2>
        <motion.p variants={fadeUp} className="font-sans text-[0.95rem] md:text-base leading-[1.8] text-white/40 max-w-2xl text-justify">
          Un processus structuré et confidentiel pour accéder aux candidats les plus qualifiés du marché.
        </motion.p>
      </motion.div>

      {/* Step cards — grid layout */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
      >
        {cabinetPoints.map((point) => (
          <StepCard key={point.num} {...point} dark />
        ))}
      </motion.div>
    </div>
  </section>
);

/* ---------- Candidat Page ---------- */
const CandidatPage = () => (
  <section className="relative overflow-hidden py-20 md:py-36 bg-white">
    <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-10">

      {/* Header — left-aligned */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="mb-16 md:mb-24"
      >
        <motion.p variants={fadeUp} className="text-[11px] font-sans font-medium tracking-[0.25em] uppercase text-black/30 mb-6">
          Notre fonctionnement
        </motion.p>
        <motion.h2 variants={fadeUp} className="font-serif text-3xl sm:text-4xl md:text-[2.8rem] leading-[1.15] text-black mb-5">
          Candidates
        </motion.h2>
        <motion.p variants={fadeUp} className="font-sans text-[0.95rem] md:text-base leading-[1.8] text-black/45 max-w-2xl text-justify">
          Accédez aux opportunités les plus exclusives tout en préservant votre anonymat.
        </motion.p>
      </motion.div>

      {/* Step cards — grid layout */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-14"
      >
        {candidatPoints.map((point) => (
          <StepCard key={point.num} {...point} />
        ))}
      </motion.div>

      <div className="flex justify-center">
        <Link to="/prendre-rdv">
          <Button variant="outline" size="sm" className="font-sans text-xs font-medium tracking-wide rounded-sm border-black/20 text-black hover:bg-black hover:text-white transition-colors">
            Prendre rendez-vous
            <CalendarCheck className="w-3.5 h-3.5 ml-2" strokeWidth={1.5} />
          </Button>
        </Link>
      </div>
    </div>
  </section>
);

/* ---------- Combined Export ---------- */
const FonctionnementSection = () => (
  <>
    <CabinetPage />
    <CandidatPage />
  </>
);

export default FonctionnementSection;
