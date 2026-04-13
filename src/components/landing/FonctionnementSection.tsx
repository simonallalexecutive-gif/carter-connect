import { motion } from 'motion/react';
import { Shield, Eye } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18 } },
};

/* ---------- Side Card (no borders, airy) ---------- */
interface SideCardProps {
  title: string;
  text: string;
  icon: React.ElementType;
  dark?: boolean;
}

const SideCard = ({ title, text, icon: Icon, dark = false }: SideCardProps) => {
  const titleColor = dark ? 'text-white' : 'text-black';
  const textColor = dark ? 'text-white/40' : 'text-black/40';
  const iconColor = dark ? 'text-white/25' : 'text-black/20';

  return (
    <motion.div variants={fadeUp} className="flex flex-col h-full">
      <Icon className={`w-5 h-5 ${iconColor} mb-5`} strokeWidth={1.3} />
      <h4 className={`font-sans text-[0.88rem] font-semibold ${titleColor} tracking-[-0.01em] mb-3 leading-[1.45]`}>
        {title}
      </h4>
      <p className={`font-sans text-[0.85rem] leading-[1.85] ${textColor} text-justify mt-auto`}>
        {text}
      </p>
    </motion.div>
  );
};

/* ---------- Central Logan element ---------- */
interface LoganCenterProps {
  subtitle: string;
  dark?: boolean;
}

const LoganCenter = ({ subtitle, dark = false }: LoganCenterProps) => {
  const dotColor = dark ? 'bg-white/20' : 'bg-black/15';
  const lineColor = dark
    ? 'from-transparent via-white/[0.08] to-transparent'
    : 'from-transparent via-black/[0.06] to-transparent';

  return (
    <motion.div variants={fadeUp} className="flex flex-col items-center justify-center text-center py-8 md:py-0">
      {/* Vertical connector top (desktop) */}
      <div className={`hidden md:block w-px h-10 bg-gradient-to-b ${lineColor} mb-6`} />

      {/* Dot */}
      <div className={`w-2.5 h-2.5 rounded-full ${dotColor} mb-4`} />

      {/* Logan word */}
      <span className={`font-serif text-[1.4rem] md:text-[1.6rem] tracking-[-0.02em] ${dark ? 'text-white' : 'text-black'} font-medium`}>
        Logan
      </span>

      {/* Subtle subtitle */}
      <p className={`font-sans text-[0.78rem] leading-[1.7] ${dark ? 'text-white/30' : 'text-black/30'} mt-3 max-w-[200px]`}>
        {subtitle}
      </p>

      {/* Dot */}
      <div className={`w-2.5 h-2.5 rounded-full ${dotColor} mt-4`} />

      {/* Vertical connector bottom (desktop) */}
      <div className={`hidden md:block w-px h-10 bg-gradient-to-b ${lineColor} mt-6`} />
    </motion.div>
  );
};

/* ---------- Horizontal connectors on desktop ---------- */
const HorizontalLine = ({ dark = false }: { dark?: boolean }) => {
  const lineColor = dark
    ? 'from-transparent via-white/[0.08] to-transparent'
    : 'from-transparent via-black/[0.06] to-transparent';
  return (
    <div className={`hidden md:flex items-center`}>
      <div className={`h-px w-full bg-gradient-to-r ${lineColor}`} />
    </div>
  );
};

/* ---------- Cabinet Section ---------- */
const CabinetPage = () => (
  <section className="relative overflow-hidden py-20 md:py-36" style={{ background: '#111111' }}>
    <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-10">

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
          Cabinets
        </motion.h2>
        <motion.p variants={fadeUp} className="font-sans text-[0.95rem] md:text-base leading-[1.8] text-white/40 max-w-2xl text-justify">
          Un processus structuré et confidentiel pour accéder aux candidats les plus qualifiés du marché.
        </motion.p>
      </motion.div>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="grid grid-cols-1 md:grid-cols-[1fr_24px_auto_24px_1fr] gap-8 md:gap-0 items-center"
      >
        <SideCard
          title="Lancez votre recherche en toute confidentialité"
          text="Adressez-vous à un pool de candidats qualifiés et rigoureusement sélectionnés, tout en préservant l'identité de votre cabinet."
          icon={Shield}
          dark
        />
        <HorizontalLine dark />
        <LoganCenter subtitle="Nous opérons chaque rapprochement, de l'intention à la signature." dark />
        <HorizontalLine dark />
        <SideCard
          title="Accédez en temps réel aux meilleurs profils du marché"
          text="Décryptez la dynamique du marché, restez opportuniste et anticipez vos recrutements pour l'ensemble de vos départements."
          icon={Eye}
          dark
        />
      </motion.div>
    </div>
  </section>
);

/* ---------- Candidat Section ---------- */
const CandidatPage = () => (
  <section className="relative overflow-hidden py-20 md:py-36 bg-white">
    <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-10">

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
          Candidats
        </motion.h2>
        <motion.p variants={fadeUp} className="font-sans text-[0.95rem] md:text-base leading-[1.8] text-black/45 max-w-2xl text-justify">
          Accédez aux opportunités les plus exclusives tout en préservant votre anonymat.
        </motion.p>
      </motion.div>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="grid grid-cols-1 md:grid-cols-[1fr_24px_auto_24px_1fr] gap-8 md:gap-0 items-center"
      >
        <SideCard
          title="Accédez aux meilleures opportunités du marché"
          text="Identifiez une opportunité, étudiez sa pertinence au regard de votre projet et échangez avec un consultant en amont de tout rapprochement."
          icon={Eye}
        />
        <HorizontalLine />
        <LoganCenter subtitle="Votre seul intermédiaire, dans un cadre confidentiel et transparent." />
        <HorizontalLine />
        <SideCard
          title="Cultivez votre attractivité sans compromettre votre anonymat"
          text="Restez en alerte et opportuniste sur votre marché : dès lors qu'un cabinet manifeste un intérêt pour votre profil, Logan est à vos côtés pour en parler."
          icon={Shield}
        />
      </motion.div>
    </div>
  </section>
);

const FonctionnementSection = () => (
  <>
    <CabinetPage />
    <CandidatPage />
  </>
);

export default FonctionnementSection;
