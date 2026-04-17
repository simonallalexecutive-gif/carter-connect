import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import heroCinema from '@/assets/hero-cinema.mp4';

// Dark taupe palette
const TAUPE_BG = '#3A322C';

const CinemaShowcaseSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.94, 1, 1, 0.98]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.3, 0, 0, 0.2]);

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: '110vh', backgroundColor: TAUPE_BG }}
      aria-label="Démonstration vidéo Logan — côté cabinet"
    >
      <div
        className="sticky top-0 h-screen w-full overflow-hidden flex flex-col pt-14 md:pt-16 pb-4"
        style={{ backgroundColor: TAUPE_BG }}
      >
        {/* Header — top-left aligned, font reduced ~30% */}
        <div className="px-6 sm:px-10 lg:px-16 mb-5 md:mb-6 max-w-3xl">
          <p className="text-[11px] font-sans font-medium tracking-[0.25em] uppercase text-white/40 mb-4">
            Votre espace cabinet
          </p>
          <h2 className="font-serif text-[1.35rem] sm:text-[1.7rem] md:text-[2rem] leading-[1.25] text-white/90">
            Une nouvelle approche du recrutement : accédez en temps réel au marché depuis votre espace cabinet et conservez <em className="italic">un temps d'avance</em>.
            <span className="block mt-2 text-white/55">Logan vous accompagne dans tous vos rapprochements.</span>
          </h2>
        </div>

        {/* Cinema video frame — thin border, padded interior (25% breathing room) */}
        <motion.div
          style={{ scale, backgroundColor: TAUPE_BG }}
          className="relative w-[92%] max-w-[1280px] mx-auto flex-1 min-h-0 overflow-hidden border border-white/15 p-6 sm:p-8 md:p-10"
        >
          <motion.div
            style={{ opacity: overlayOpacity, backgroundColor: TAUPE_BG }}
            className="pointer-events-none absolute inset-0 z-10"
          />

          <video
            src={heroCinema}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="relative z-0 w-full h-full object-contain"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default CinemaShowcaseSection;
