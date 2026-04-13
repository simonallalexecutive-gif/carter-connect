import { motion } from 'motion/react';
import { Shield, Eye, Handshake } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

/* ---------- Side Card ---------- */
interface SideCardProps {
  title: string;
  text: string;
  icon: React.ElementType;
  dark?: boolean;
}

const SideCard = ({ title, text, icon: Icon, dark = false }: SideCardProps) => {
  const bg = dark ? 'bg-white/[0.03]' : 'bg-black/[0.02]';
  const borderColor = dark ? 'border-white/[0.06]' : 'border-black/[0.05]';
  const titleColor = dark ? 'text-white' : 'text-black';
  const textColor = dark ? 'text-white/45' : 'text-black/45';
  const iconBg = dark ? 'bg-white/[0.06]' : 'bg-black/[0.04]';
  const iconColor = dark ? 'text-white/40' : 'text-black/30';

  return (
    <motion.div
      variants={fadeUp}
      className={`${bg} border ${borderColor} rounded-sm p-7 md:p-9 flex flex-col h-full transition-all duration-500`}
    >
      <div className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center mb-5`}>
        <Icon className={`w-[17px] h-[17px] ${iconColor}`} strokeWidth={1.5} />
      </div>
      <h4 className={`font-sans text-[0.88rem] font-semibold ${titleColor} tracking-[-0.01em] mb-3 leading-[1.4]`}>
        {title}
      </h4>
      <p className={`font-sans text-[0.88rem] leading-[1.85] ${textColor} text-justify mt-auto`}>
        {text}
      </p>
    </motion.div>
  );
};

/* ---------- Center Bridge Card ---------- */
interface BridgeCardProps {
  title: string;
  text: string;
  dark?: boolean;
}

const BridgeCard = ({ title, text, dark = false }: BridgeCardProps) => {
  const titleColor = dark ? 'text-white' : 'text-black';
  const textColor = dark ? 'text-white/45' : 'text-black/45';
  const lineColor = dark
    ? 'from-transparent via-white/[0.12] to-transparent'
    : 'from-transparent via-black/[0.08] to-transparent';

  return (
    <motion.div
      variants={fadeUp}
      className="flex flex-col items-center text-center h-full justify-center py-6 md:py-0"
    >
      {/* Top line */}
      <div className={`w-px h-8 bg-gradient-to-b ${lineColor} mb-5 hidden md:block`} />

      {/* Handshake badge */}
      <div className={`w-14 h-14 rounded-full ${dark ? 'bg-white' : 'bg-black'} flex items-center justify-center shadow-lg mb-5`}>
        <Handshake className={`w-[22px] h-[22px] ${dark ? 'text-[#111]' : 'text-white'}`} strokeWidth={1.5} />
      </div>

      <h4 className={`font-serif text-[1rem] md:text-[1.05rem] font-semibold ${titleColor} mb-3 leading-[1.3]`}>
        {title}
      </h4>

      <p className={`font-sans text-[0.85rem] leading-[1.8] ${textColor} max-w-[220px]`}>
        {text}
      </p>

      {/* Bottom line */}
      <div className={`w-px h-8 bg-gradient-to-b ${lineColor} mt-5 hidden md:block`} />
    </motion.div>
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
        className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 md:gap-0 items-stretch"
      >
        {/* Left */}
        <SideCard
          title="Lancez votre recherche en toute confidentialité"
          text="Adressez-vous à un pool de candidats qualifiés et rigoureusement sélectionnés, tout en préservant l'identité de votre cabinet."
          icon={Shield}
          dark
        />

        {/* Center — Logan bridge */}
        <div className="flex items-center justify-center md:px-8">
          <BridgeCard
            title="Logan à vos côtés"
            text="Nous opérons et concrétisons chaque rapprochement, de l'intention à la signature."
            dark
          />
        </div>

        {/* Right */}
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
        className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 md:gap-0 items-stretch"
      >
        {/* Left */}
        <SideCard
          title="Accédez aux meilleures opportunités du marché"
          text="Identifiez une opportunité, étudiez sa pertinence au regard de votre projet et échangez avec un consultant en amont de tout rapprochement."
          icon={Eye}
        />

        {/* Center — Logan bridge */}
        <div className="flex items-center justify-center md:px-8">
          <BridgeCard
            title="Logan, seul intermédiaire"
            text="Un accompagnement personnalisé dans un cadre strictement confidentiel, maîtrisé et transparent."
          />
        </div>

        {/* Right */}
        <SideCard
          title="Cultivez votre attractivité sans compromettre votre anonymat"
          text="Restez en alerte et opportuniste sur votre marché : dès lors qu'un cabinet manifeste un intérêt pour votre profil, Logan est à vos côtés pour en parler."
          icon={Shield}
        />
      </motion.div>
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
