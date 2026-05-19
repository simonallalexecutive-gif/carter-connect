import { motion, useScroll, useTransform } from 'motion/react';
import { Shield, Eye, Lock, Zap, Star, Users, CheckCircle } from 'lucide-react';
import { useRef } from 'react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

/* ---------- Card ---------- */
interface CardProps {
  num: string;
  title: string;
  text: string;
  icon: React.ElementType;
}

const Card = ({ num, title, text, icon: Icon }: CardProps) => (
  <motion.div
    variants={fadeUp}
    className="relative group"
  >
    <div className="relative p-8 md:p-10 rounded-sm border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-700 h-full">
      {/* Big number watermark */}
      <span className="absolute -top-3 -right-2 font-serif text-[5rem] leading-none font-bold text-white/[0.03] select-none pointer-events-none group-hover:text-white/[0.06] transition-colors duration-700">
        {num}
      </span>

      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-full flex items-center justify-center bg-white/[0.06] group-hover:bg-white/[0.10] transition-colors duration-500">
          <Icon className="w-4 h-4 text-white/40 group-hover:text-white/60 transition-colors duration-500" strokeWidth={1.4} />
        </div>
        <h4 className="font-sans text-[0.9rem] font-semibold text-white/90 tracking-[-0.01em] leading-[1.4]">
          {title}
        </h4>
      </div>

      <p className="font-sans text-[0.85rem] leading-[1.9] text-white/40 text-justify group-hover:text-white/55 transition-colors duration-500">
        {text}
      </p>
    </div>
  </motion.div>
);

/* ---------- Pillar ---------- */
interface PillarProps {
  icon: React.ElementType;
  label: string;
}

const Pillar = ({ icon: Icon, label }: PillarProps) => (
  <motion.div variants={fadeUp} className="flex flex-col items-center text-center gap-3">
    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/[0.05] border border-white/[0.06]">
      <Icon className="w-4 h-4 text-white/35" strokeWidth={1.4} />
    </div>
    <span className="font-sans text-[0.75rem] font-medium tracking-[0.08em] uppercase text-white/40">
      {label}
    </span>
  </motion.div>
);

/* ---------- Main Section ---------- */
const FonctionnementSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.6, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ background: '#111111' }}
    >
      {/* Animated glow effects */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: bgY }}
      >
        <motion.div
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full blur-[180px]"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)',
            opacity: glowOpacity,
          }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] rounded-full blur-[150px]"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.025) 0%, transparent 70%)',
            opacity: glowOpacity,
          }}
        />
      </motion.div>

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-8 lg:px-10 py-28 md:py-44">
        {/* Section header */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mb-20 md:mb-28"
        >
          {/* Eyebrow removed */}
          <motion.h2 variants={fadeUp} className="font-serif text-3xl sm:text-4xl md:text-[2.8rem] leading-[1.15] text-white mb-5">
            Deux visions, un seul intermédiaire : Logan.
          </motion.h2>
          <motion.p variants={fadeUp} className="font-sans text-[0.95rem] md:text-base leading-[1.8] text-white/40 max-w-2xl text-justify">
            Logan opère chaque rapprochement de l'intention à la signature, dans un cadre confidentiel, structuré et transparent.
          </motion.p>
        </motion.div>

        {/* Central Logan divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-6 mb-16 md:mb-20"
        >
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/[0.10] to-white/[0.06]" />
          <span className="font-serif text-[1.3rem] md:text-[1.5rem] tracking-[-0.02em] text-white/80 font-medium whitespace-nowrap">
            Logan
          </span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-white/[0.10] to-white/[0.06]" />
        </motion.div>

        {/* Two columns: Cabinets & Candidats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {/* Cabinets column */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="space-y-6"
          >
            <motion.div variants={fadeUp} className="mb-3">
              <h3 className="font-serif text-xl md:text-2xl text-white/90 mb-1">Cabinets</h3>
              <p className="font-sans text-[0.82rem] text-white/30 font-light">Ne subissez plus votre marché : vivez-le.</p>
            </motion.div>

            <Card
              num="01"
              title="Lancez votre recherche en toute confidentialité"
              text="Adressez-vous à un pool de candidats qualifiés et rigoureusement sélectionnés, tout en préservant l'identité de votre cabinet."
              icon={Shield}
            />
            <Card
              num="02"
              title="Accédez aux meilleurs profils du marché"
              text="Décryptez la dynamique du marché, restez opportuniste et anticipez vos recrutements pour l'ensemble de vos départements."
              icon={Eye}
            />
          </motion.div>

          {/* Candidats column */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="space-y-6"
          >
            <motion.div variants={fadeUp} className="mb-3">
              <h3 className="font-serif text-xl md:text-2xl text-white/90 mb-1">Candidats</h3>
              <p className="font-sans text-[0.82rem] text-white/30 font-light">Un espace confidentiel, un processus structuré.</p>
            </motion.div>

            <Card
              num="01"
              title="Accédez aux meilleures opportunités du marché"
              text="Identifiez une opportunité, étudiez sa pertinence au regard de votre projet et échangez avec un consultant en amont de tout rapprochement."
              icon={Eye}
            />
            <Card
              num="02"
              title="Cultivez votre attractivité sans compromettre votre anonymat"
              text="Restez en alerte et opportuniste sur votre marché : dès lors qu'un cabinet manifeste un intérêt pour votre profil, Logan est à vos côtés pour en parler."
              icon={Shield}
            />
          </motion.div>
        </div>

        {/* Bottom pillars */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="mt-24 md:mt-32"
        >
          <motion.div variants={fadeUp} className="w-full h-px mb-14 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-6 md:gap-8 max-w-3xl mx-auto">
            <Pillar icon={Lock} label="Confidentialité" />
            <Pillar icon={Zap} label="Réactivité" />
            <Pillar icon={Star} label="Exclusivité" />
            <Pillar icon={Shield} label="Anonymat" />
            <Pillar icon={Users} label="Accompagnement" />
            <Pillar icon={CheckCircle} label="Transparence" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FonctionnementSection;
