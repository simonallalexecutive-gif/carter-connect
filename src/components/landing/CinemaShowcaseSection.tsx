import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import heroCinema from '@/assets/hero-cinema.mp4';

const CinemaShowcaseSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.92, 1, 1, 0.97]);
  const radius = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [20, 8, 8, 16]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.3, 0, 0, 0.2]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-white"
      style={{ height: '115vh' }}
      aria-label="Démonstration vidéo Logan — côté cabinet"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center bg-white pt-16 md:pt-20 pb-8">
        {/* Title — harmonized with MissionSection typography */}
        <div className="text-center px-4 sm:px-8 lg:px-10 mb-6 md:mb-8 max-w-5xl w-full">
          <p className="text-[11px] font-sans font-medium tracking-[0.25em] uppercase text-black/40 mb-6">
            Démonstration
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-[2.8rem] leading-[1.15] text-black/90">
            L'expérience Logan : <em className="italic">votre espace cabinet</em>
          </h2>
        </div>

        {/* Cinema video frame — full video visible (object-contain) */}
        <motion.div
          style={{ scale }}
          className="relative w-[92%] max-w-[1280px] flex-1 min-h-0 overflow-hidden bg-white"
        >
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
            className="w-full h-full object-contain"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default CinemaShowcaseSection;
