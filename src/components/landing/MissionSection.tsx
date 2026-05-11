import { motion } from 'motion/react';
import { Building2, User, Award, Handshake, Shield, Eye, Target, Lock, Zap, Star, Users, CheckCircle } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const } },
};

const fadeScale = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const staggerSlow = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18 } },
};

const cardKeywordsLight = (items: string[]) => (
  <div className="flex flex-col gap-3 items-center">
    {items.map((kw) => (
      <span key={kw} className="font-sans text-sm text-black/55 font-light">{kw}</span>
    ))}
  </div>
);

const badgeRowLight = () => (
  <div className="flex items-center justify-center gap-4 pt-6 mt-8 border-t border-black/[0.08]">
    <div className="flex items-center justify-center gap-1.5 min-w-[110px] px-3.5 py-1.5 rounded-sm bg-black border border-black/20">
      <Award className="w-3.5 h-3.5 text-white/80 shrink-0" strokeWidth={1.5} />
      <span className="font-serif text-[10px] tracking-wide text-white/90 font-medium">Chambers</span>
    </div>
    <div className="flex items-center justify-center gap-1.5 min-w-[110px] px-3.5 py-1.5 rounded-sm bg-black border border-black/20">
      <Award className="w-3.5 h-3.5 text-white/80 shrink-0" strokeWidth={1.5} />
      <span className="font-serif text-[10px] tracking-wide text-white/90 font-medium">Legal 500</span>
    </div>
  </div>
);

const MissionSection = () => (
  <section id="notre-approche" className="relative overflow-hidden bg-white">
    <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-8 lg:px-10 py-24 md:py-40">

      {/* Header */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="mb-20 md:mb-28"
      >
        <motion.p variants={fadeUp} className="text-[11px] font-sans font-medium tracking-[0.25em] uppercase text-black/45 mb-6">
          Notre approche
        </motion.p>
        <motion.h2 variants={fadeUp} className="font-serif text-3xl sm:text-4xl md:text-[2.8rem] leading-[1.15] text-black/90 mb-5 max-w-4xl">
          Logan : l'infrastructure privilégiée et confidentielle qui repense le recrutement des avocats d'affaires.
        </motion.h2>
        <motion.p variants={fadeUp} className="font-sans text-[0.76rem] sm:text-[1rem] md:text-[1.018rem] font-[480] leading-[1.65] text-black/55 max-w-3xl">
          Logan structure et accompagne un écosystème discret et exigeant, composé de profils et de cabinets précieusement <span className="text-black/85">qualifiés et reconnus pour leur positionnement</span>.
        </motion.p>
      </motion.div>

      {/* Cabinet — Logan Bridge — Candidat — Unified light block */}
      <motion.div
        variants={staggerSlow}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="mb-20 md:mb-28 -mt-6 md:-mt-10"
      >
        <div className="bg-black/[0.03] border border-black/[0.06] backdrop-blur-sm rounded-lg p-6 sm:p-8 md:p-10 lg:p-12">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-stretch gap-0">
            {/* Cabinet */}
            <motion.div variants={fadeScale} className="group flex flex-col items-center text-center p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <Building2 className="w-5 h-5 text-black/50 group-hover:text-black/80 transition-colors duration-500" strokeWidth={1.5} />
                <h3 className="font-serif text-xl text-black tracking-[-0.01em]">Cabinets</h3>
              </div>
              {cardKeywordsLight(['Confidentialité de vos recherches', 'Vision consolidée du marché', 'Recrutements stratégiques'])}
              {badgeRowLight()}
            </motion.div>

            {/* Central bridge */}
            <motion.div
              variants={fadeUp}
              className="flex flex-col items-center justify-center px-4 md:px-10 py-8 md:py-0"
            >
              <div className="hidden md:flex items-center gap-0 w-full">
                <div className="flex-1 h-px bg-gradient-to-r from-black/[0.03] to-black/[0.12]" />
                <div className="relative mx-3">
                  <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center shadow-[0_8px_32px_-4px_rgba(0,0,0,0.15)]">
                    <Handshake className="w-5.5 h-5.5 text-white" strokeWidth={1.5} />
                  </div>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-black/[0.12] to-black/[0.03]" />
              </div>

              <div className="flex md:hidden">
                <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center shadow-[0_8px_32px_-4px_rgba(0,0,0,0.15)]">
                  <Handshake className="w-5.5 h-5.5 text-white" strokeWidth={1.5} />
                </div>
              </div>

              <p className="font-sans text-[10px] md:text-[11px] text-center leading-[1.7] text-black/45 mt-5 max-w-[240px] font-medium">
                Logan orchestre chaque mise en relation — de la première intention à la signature.
              </p>
            </motion.div>

            {/* Candidat */}
            <motion.div variants={fadeScale} className="group flex flex-col items-center text-center p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <User className="w-5 h-5 text-black/50 group-hover:text-black/80 transition-colors duration-500" strokeWidth={1.5} />
                <h3 className="font-serif text-xl text-black tracking-[-0.01em]">Candidats</h3>
              </div>
              {cardKeywordsLight(['Accès aux meilleures opportunités', 'Attractivité boostée', 'Identité préservée'])}
              {badgeRowLight()}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Two visions, one Logan — merged from former Fonctionnement section */}
      <motion.div
        id="fonctionnement"
        variants={staggerSlow}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="mb-20 md:mb-28"
      >
        <motion.div variants={fadeUp} className="mb-12 md:mb-16">
          <p className="text-[11px] font-sans font-medium tracking-[0.25em] uppercase text-black/45 mb-6">
            Deux visions, un seul intermédiaire
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-[2.4rem] leading-[1.15] text-black/90 mb-5 max-w-3xl">
            Logan opère chaque rapprochement, de l'intention à la signature.
          </h2>
          <p className="font-sans text-[0.95rem] md:text-[1.018rem] font-[480] leading-[1.7] text-black/55 max-w-3xl">
            Un cadre confidentiel, structuré et transparent — pour les cabinets comme pour les candidats.
          </p>
        </motion.div>

        {/* Logan central divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-6 mb-12 md:mb-14"
        >
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-black/[0.10] to-black/[0.06]" />
          <span className="font-serif text-[1.3rem] md:text-[1.5rem] tracking-[-0.02em] text-black/80 font-medium whitespace-nowrap">
            Logan
          </span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-black/[0.10] to-black/[0.06]" />
        </motion.div>

        {/* Two columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {/* Cabinets */}
          <motion.div variants={stagger} className="space-y-6">
            <motion.div variants={fadeUp} className="mb-1">
              <h3 className="font-serif text-xl md:text-2xl text-black/90 mb-1">Cabinets</h3>
              <p className="font-sans text-[0.82rem] text-black/40 font-light">Ne subissez plus votre marché : vivez-le.</p>
            </motion.div>
            {[
              { num: '01', icon: Shield, title: 'Lancez votre recherche en toute confidentialité', text: 'Adressez-vous à un pool de candidats qualifiés et rigoureusement sélectionnés, tout en préservant l\'identité de votre cabinet.' },
              { num: '02', icon: Eye, title: 'Accédez aux meilleurs profils du marché', text: 'Décryptez la dynamique du marché, restez opportuniste et anticipez vos recrutements pour l\'ensemble de vos départements.' },
            ].map((c) => (
              <motion.div key={c.num} variants={fadeUp} className="relative group p-7 md:p-8 rounded-sm border border-black/[0.08] bg-black/[0.015] hover:bg-black/[0.03] transition-colors duration-500">
                <span className="absolute -top-3 -right-2 font-serif text-[5rem] leading-none font-bold text-black/[0.04] select-none pointer-events-none">{c.num}</span>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center bg-black/[0.05]">
                    <c.icon className="w-4 h-4 text-black/55" strokeWidth={1.4} />
                  </div>
                  <h4 className="font-sans text-[0.9rem] font-semibold text-black/90 leading-[1.4]">{c.title}</h4>
                </div>
                <p className="font-sans text-[0.85rem] leading-[1.85] text-black/55 text-justify">{c.text}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Candidats */}
          <motion.div variants={stagger} className="space-y-6">
            <motion.div variants={fadeUp} className="mb-1">
              <h3 className="font-serif text-xl md:text-2xl text-black/90 mb-1">Candidats</h3>
              <p className="font-sans text-[0.82rem] text-black/40 font-light">Un espace confidentiel, un processus structuré.</p>
            </motion.div>
            {[
              { num: '01', icon: Eye, title: 'Accédez aux meilleures opportunités du marché', text: 'Identifiez une opportunité, étudiez sa pertinence au regard de votre projet et échangez avec un consultant en amont de tout rapprochement.' },
              { num: '02', icon: Shield, title: 'Cultivez votre attractivité sans compromettre votre anonymat', text: 'Restez en alerte et opportuniste : dès lors qu\'un cabinet manifeste un intérêt pour votre profil, Logan est à vos côtés pour en parler.' },
            ].map((c) => (
              <motion.div key={c.num} variants={fadeUp} className="relative group p-7 md:p-8 rounded-sm border border-black/[0.08] bg-black/[0.015] hover:bg-black/[0.03] transition-colors duration-500">
                <span className="absolute -top-3 -right-2 font-serif text-[5rem] leading-none font-bold text-black/[0.04] select-none pointer-events-none">{c.num}</span>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center bg-black/[0.05]">
                    <c.icon className="w-4 h-4 text-black/55" strokeWidth={1.4} />
                  </div>
                  <h4 className="font-sans text-[0.9rem] font-semibold text-black/90 leading-[1.4]">{c.title}</h4>
                </div>
                <p className="font-sans text-[0.85rem] leading-[1.85] text-black/55 text-justify">{c.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Pillars row */}
        <motion.div variants={fadeUp} className="w-full h-px my-14 bg-gradient-to-r from-transparent via-black/[0.10] to-transparent" />
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-6 md:gap-8 max-w-3xl mx-auto">
          {[
            { icon: Lock, label: 'Confidentialité' },
            { icon: Zap, label: 'Réactivité' },
            { icon: Star, label: 'Exclusivité' },
            { icon: Shield, label: 'Anonymat' },
            { icon: Users, label: 'Accompagnement' },
            { icon: CheckCircle, label: 'Transparence' },
          ].map(({ icon: Icon, label }) => (
            <motion.div key={label} variants={fadeUp} className="flex flex-col items-center text-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-black/[0.04] border border-black/[0.08]">
                <Icon className="w-4 h-4 text-black/45" strokeWidth={1.4} />
              </div>
              <span className="font-sans text-[0.7rem] font-medium tracking-[0.08em] uppercase text-black/45">{label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Bottom pillars */}
      <motion.div
        variants={staggerSlow}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        className="grid grid-cols-1 md:grid-cols-3 gap-0 max-w-4xl mx-auto"
      >
        {[
          { icon: Shield, title: 'Confidentialité absolue', text: 'Aucune donnée partagée sans consentement explicite.' },
          { icon: Eye, title: 'Sélectivité rigoureuse', text: 'Seuls les profils validés accèdent au réseau.' },
          { icon: Target, title: 'Précision chirurgicale', text: 'Chaque mise en relation est ciblée et contextualisée.' },
        ].map((item, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            className="flex flex-col items-center text-center px-6 py-10 md:py-12 border-b md:border-b-0 md:border-r border-black/[0.06] last:border-r-0 last:border-b-0"
          >
            <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center mb-6 shadow-[0_6px_24px_-6px_rgba(0,0,0,0.35)]">
              <item.icon className="w-5 h-5 text-white/90" strokeWidth={1.5} />
            </div>
            <h4 className="font-serif text-base text-black mb-3 tracking-[-0.01em]">{item.title}</h4>
            <p className="font-sans text-[13px] leading-[1.8] text-black/45 font-light max-w-[240px]">{item.text}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default MissionSection;
