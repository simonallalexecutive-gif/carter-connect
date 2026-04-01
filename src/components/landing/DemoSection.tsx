import { motion } from 'motion/react';
import { Building2, User } from 'lucide-react';
import demoCabinet from '@/assets/demo-cabinet.mov';
import demoCandidat from '@/assets/demo-candidat.mov';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const demos = [
  {
    icon: Building2,
    title: 'Espace Cabinet',
    subtitle: 'Pilotez vos recherches, explorez le marché et identifiez les meilleurs profils en toute confidentialité.',
    video: demoCabinet,
  },
  {
    icon: User,
    title: 'Espace Candidat',
    subtitle: 'Consultez les opportunités, gérez vos préférences et restez visible sans jamais être exposé.',
    video: demoCandidat,
  },
];

const DemoSection = () => (
  <section className="relative overflow-hidden py-24 md:py-36" style={{ background: '#0a0a0a' }}>
    <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10">

      {/* Header */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="text-center mb-16 md:mb-24"
      >
        <motion.p variants={fadeUp} className="text-[11px] font-sans font-medium tracking-[0.25em] uppercase text-white/30 mb-5">
          Découvrez nos espaces
        </motion.p>
        <motion.h2 variants={fadeUp} className="font-serif text-3xl sm:text-4xl md:text-[3rem] leading-[1.15] text-white mb-5">
          Deux interfaces, une même excellence
        </motion.h2>
        <motion.p variants={fadeUp} className="font-sans text-[1.02rem] md:text-lg leading-[1.7] text-white/45 max-w-2xl mx-auto">
          Chaque espace est conçu pour offrir une expérience sur-mesure, confidentielle et intuitive.
        </motion.p>
      </motion.div>

      {/* Two columns */}
      <div className="grid md:grid-cols-2 gap-8 md:gap-10">
        {demos.map((demo, i) => (
          <motion.div
            key={demo.title}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="group"
          >
            {/* Label */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-full bg-white/[0.06] flex items-center justify-center">
                <demo.icon className="w-4 h-4 text-white/50" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-2xl md:text-[1.7rem] text-white">{demo.title}</h3>
            </div>
            <p className="font-sans text-[0.92rem] leading-[1.8] text-white/45 mb-6 max-w-md">
              {demo.subtitle}
            </p>

            {/* Video */}
            <div className="relative rounded-lg overflow-hidden border border-white/[0.08] bg-black">
              {/* Subtle glow behind the video */}
              <div className="absolute -inset-px rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 60%)' }}
              />
              <video
                src={demo.video}
                autoPlay
                muted
                loop
                playsInline
                className="w-full aspect-[9/16] object-cover object-top"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default DemoSection;
