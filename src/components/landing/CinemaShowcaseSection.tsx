import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import heroCinema from '@/assets/hero-cinema.mp4';

const CinemaShowcaseSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Dramatic zoom-in at entry, then subtle settle
  const scale = useTransform(scrollYProgress, [0, 0.35, 0.7, 1], [0.55, 1, 1, 0.96]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.85, 1], [0.4, 1, 1, 0.85]);
  const blur = useTransform(scrollYProgress, [0, 0.3], [12, 0]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);

  return (
    <section
      ref={sectionRef}
      className="relative bg-white"
      style={{ height: '120vh' }}
      aria-label="Démonstration vidéo Logan — côté cabinet"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col bg-white pt-14 md:pt-16 pb-6">
        {/* Header — top-left aligned */}
        <div className="px-6 sm:px-10 lg:px-16 mb-5 md:mb-6 max-w-3xl">
          <p className="text-[10px] font-sans font-medium tracking-[0.25em] uppercase text-black/40 mb-4">
            Votre espace cabinet
          </p>
          <h2 className="font-serif text-[1.35rem] sm:text-[1.7rem] md:text-[2rem] leading-[1.25] text-black/90">
            Une nouvelle approche du recrutement : accédez en temps réel au marché depuis votre espace cabinet et conservez <em className="italic">un temps d'avance</em>.
          </h2>
          <p className="mt-3 font-sans text-[0.76rem] sm:text-[1rem] md:text-[1.018rem] font-[480] leading-[1.65] text-black/50">
            Logan vous accompagne dans tous vos rapprochements.
          </p>
        </div>

        {/* Raw video with dramatic zoom-in */}
        <motion.div
          style={{ scale, opacity, filter }}
          className="relative w-[92%] max-w-[1280px] mx-auto flex-1 min-h-0"
        >
          <video
            src={heroCinema}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full h-full object-contain"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default CinemaShowcaseSection;
