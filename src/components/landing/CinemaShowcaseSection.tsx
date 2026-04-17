import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import heroCinema from '@/assets/hero-cinema.mp4';

const CinemaShowcaseSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.94, 1, 1, 0.98]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.25, 0, 0, 0.15]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-white"
      style={{ height: '110vh' }}
      aria-label="Démonstration vidéo Logan — côté cabinet"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col bg-white pt-14 md:pt-16 pb-4">
        {/* Header — top-left aligned */}
        <div className="px-6 sm:px-10 lg:px-16 mb-5 md:mb-6 max-w-3xl">
          <p className="text-[8px] font-sans font-medium tracking-[0.25em] uppercase text-black/40 mb-4">
            Votre espace cabinet
          </p>
          <h2 className="font-serif text-[1.35rem] sm:text-[1.7rem] md:text-[2rem] leading-[1.25] text-black/90">
            Une nouvelle approche du recrutement : accédez en temps réel au marché depuis votre espace cabinet et conservez <em className="italic">un temps d'avance</em>.
            <span className="block mt-2 text-black/55">Logan vous accompagne dans tous vos rapprochements.</span>
          </h2>
        </div>

        {/* Outer "device" frame — screen-in-screen effect */}
        <motion.div
          style={{ scale }}
          className="relative w-[92%] max-w-[1280px] mx-auto flex-1 min-h-0 rounded-[18px] bg-gradient-to-b from-neutral-100 to-neutral-200 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.25),0_0_0_1px_rgba(0,0,0,0.06)] p-3 sm:p-4 md:p-5"
        >
          {/* Top "browser-like" bar with traffic dots */}
          <div className="flex items-center gap-1.5 px-2 pb-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-300" />
          </div>

          {/* Inner screen */}
          <div className="relative w-full h-[calc(100%-1.75rem)] rounded-[10px] overflow-hidden bg-black ring-1 ring-black/10 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]">
            <motion.div
              style={{ opacity: overlayOpacity }}
              className="pointer-events-none absolute inset-0 z-10 bg-white"
            />
            <video
              src={heroCinema}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="w-full h-full object-contain bg-black"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CinemaShowcaseSection;
