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

/* ---------- Side Card ---------- */
interface SideCardProps {
  num: string;
  title: string;
  text: string;
  icon: React.ElementType;
  dark?: boolean;
}

const SideCard = ({ num, title, text, icon: Icon, dark = false }: SideCardProps) => {
  const titleColor = dark ? 'text-white' : 'text-black';
  const textColor = dark ? 'text-white/40' : 'text-black/40';
  const iconColor = dark ? 'text-white/20' : 'text-black/15';
  const numColor = dark ? 'text-white/[0.06]' : 'text-black/[0.04]';

  return (
    <motion.div variants={fadeUp} className="relative flex flex-col h-full">
      {/* Watermark number */}
      <span className={`absolute -top-2 -right-1 font-serif text-[5rem] leading-none font-bold ${numColor} select-none pointer-events-none`}>
        {num}
      </span>
      <Icon className={`w-[18px] h-[18px] ${iconColor} mb-4`} strokeWidth={1.3} />
      <h4 className={`font-sans text-[0.88rem] font-semibold ${titleColor} tracking-[-0.01em] mb-2 leading-[1.4] pr-8`}>
        {title}
      </h4>
      <p className={`font-sans text-[0.85rem] leading-[1.85] ${textColor} text-justify mt-auto`}>
        {text}
      </p>
    </motion.div>
  );
};

/* ---------- Central Logan ---------- */
interface LoganCenterProps {
  subtitle: string;
  dark?: boolean;
}

const LoganCenter = ({ subtitle, dark = false }: LoganCenterProps) => (
  <motion.div variants={fadeUp} className="flex flex-col items-center justify-center text-center py-6 md:py-0 md:px-2">
    <span className={`font-serif text-[1.35rem] md:text-[1.5rem] tracking-[-0.02em] ${dark ? 'text-white' : 'text-black'} font-medium`}>
      Logan
    </span>
    <p className={`font-sans text-[0.75rem] leading-[1.65] ${dark ? 'text-white/25' : 'text-black/25'} mt-2 max-w-[190px]`}>
      {subtitle}
    </p>
  </motion.div>
);

/* ---------- Gradient connector ---------- */
const GradientLine = ({ dark = false }: { dark?: boolean }) => {
  const color = dark
    ? 'from-transparent via-white/[0.10] to-transparent'
    : 'from-transparent via-black/[0.07] to-transparent';
  return (
    <div className="hidden md:flex items-center">
      <div className={`h-px w-full bg-gradient-to-r ${color}`} />
    </div>
  );
};

/* ---------- Section wrapper ---------- */
interface SectionBlockProps {
  label: string;
  title: string;
  desc: string;
  dark?: boolean;
  children: React.ReactNode;
}

const SectionBlock = ({ label, title, desc, dark = false, children }: SectionBlockProps) => (
  <section className={`relative overflow-hidden py-20 md:py-32 ${dark ? '' : 'bg-white'}`} style={dark ? { background: '#111111' } : undefined}>
    <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-10">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="mb-14 md:mb-20"
      >
        <motion.p variants={fadeUp} className={`text-[11px] font-sans font-medium tracking-[0.25em] uppercase ${dark ? 'text-white/30' : 'text-black/30'} mb-4`}>
          {label}
        </motion.p>
        <motion.h2 variants={fadeUp} className={`font-serif text-3xl sm:text-4xl md:text-[2.8rem] leading-[1.15] ${dark ? 'text-white' : 'text-black'} mb-3`}>
          {title}
        </motion.h2>
        <motion.p variants={fadeUp} className={`font-sans text-[0.95rem] md:text-base leading-[1.8] ${dark ? 'text-white/40' : 'text-black/45'} max-w-2xl text-justify`}>
          {desc}
        </motion.p>
      </motion.div>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="grid grid-cols-1 md:grid-cols-[1fr_28px_auto_28px_1fr] gap-10 md:gap-0 items-center"
      >
        {children}
      </motion.div>
    </div>
  </section>
);

/* ---------- Cabinets ---------- */
const CabinetPage = () => (
  <SectionBlock
    label="Notre fonctionnement"
    title="Cabinets"
    desc="Un processus structuré et confidentiel pour accéder aux candidats les plus qualifiés du marché."
    dark
  >
    <SideCard
      num="01"
      title="Lancez votre recherche en toute confidentialité"
      text="Adressez-vous à un pool de candidats qualifiés et rigoureusement sélectionnés, tout en préservant l'identité de votre cabinet."
      icon={Shield}
      dark
    />
    <GradientLine dark />
    <LoganCenter subtitle="Nous opérons chaque rapprochement, de l'intention à la signature." dark />
    <GradientLine dark />
    <SideCard
      num="02"
      title="Accédez en temps réel aux meilleurs profils du marché"
      text="Décryptez la dynamique du marché, restez opportuniste et anticipez vos recrutements pour l'ensemble de vos départements."
      icon={Eye}
      dark
    />
  </SectionBlock>
);

/* ---------- Candidats ---------- */
const CandidatPage = () => (
  <SectionBlock
    label="Notre fonctionnement"
    title="Candidats"
    desc="Accédez aux opportunités les plus exclusives tout en préservant votre anonymat."
  >
    <SideCard
      num="01"
      title="Accédez aux meilleures opportunités du marché"
      text="Identifiez une opportunité, étudiez sa pertinence au regard de votre projet et échangez avec un consultant en amont de tout rapprochement."
      icon={Eye}
    />
    <GradientLine />
    <LoganCenter subtitle="Votre seul intermédiaire, dans un cadre confidentiel et transparent." />
    <GradientLine />
    <SideCard
      num="02"
      title="Cultivez votre attractivité sans compromettre votre anonymat"
      text="Restez en alerte et opportuniste sur votre marché : dès lors qu'un cabinet manifeste un intérêt pour votre profil, Logan est à vos côtés pour en parler."
      icon={Shield}
    />
  </SectionBlock>
);

const FonctionnementSection = () => (
  <>
    <CabinetPage />
    <CandidatPage />
  </>
);

export default FonctionnementSection;
