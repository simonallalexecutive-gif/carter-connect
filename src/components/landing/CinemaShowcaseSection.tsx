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

  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.92, 1, 1, 0.97]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.3, 0, 0, 0.2]);

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: '125vh', backgroundColor: TAUPE_BG }}
      aria-label="Démonstration vidéo Logan — côté cabinet"
    >
      <div
        className="sticky top-0 h-screen w-full overflow-hidden flex flex-col pt-16 md:pt-20 pb-10"
        style={{ backgroundColor: TAUPE_BG }}
      >
        {/* Header — top-left aligned */}
        <div className="px-6 sm:px-10 lg:px-16 mb-6 md:mb-8 max-w-4xl">
          <p className="text-[11px] font-sans font-medium tracking-[0.25em] uppercase text-white/40 mb-6">
            Démonstration
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-[2.8rem] leading-[1.15] text-white/90">
            Une nouvelle approche du recrutement : accédez en temps réel au marché depuis votre espace cabinet et conservez <em className="italic">un temps d'avance</em>.
          </h2>
        </div>

        {/* Cinema video frame */}
        <motion.div
          style={{ scale, backgroundColor: TAUPE_BG }}
          className="relative w-[92%] max-w-[1280px] mx-auto flex-1 min-h-0 overflow-hidden"
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
            className="w-full h-full object-contain"
          />
        </motion.div>

        {/* Caption under the video */}
        <div className="px-6 sm:px-10 lg:px-16 mt-6 max-w-4xl">
          <p className="font-sans text-[0.9rem] sm:text-[1rem] md:text-[1.018rem] font-[480] leading-[1.65] text-white/55">
            Logan vous accompagne dans tous vos rapprochements.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CinemaShowcaseSection;
