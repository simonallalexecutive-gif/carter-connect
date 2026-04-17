import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import heroCinema from '@/assets/hero-cinema.mp4';

const CinemaShowcaseSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Harvey.ai-style scroll-driven cinema reveal — softer, faster
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.88, 1, 1, 0.96]);
  const radius = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [24, 8, 8, 18]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.4, 0, 0, 0.25]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-white"
      style={{ height: '140vh' }}
      aria-label="Démonstration vidéo Logan — côté cabinet"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-start bg-white pt-[10vh] pb-[6vh]">
        {/* Title — fixed at top, always visible */}
        <div className="text-center px-6 mb-6 md:mb-8 max-w-4xl">
          <p className="text-black/40 font-sans text-[10px] sm:text-[11px] tracking-[0.3em] uppercase mb-3">
            Démonstration — côté cabinet
          </p>
          <h2 className="text-black font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-[-0.02em] leading-[1.1]">
            <em className="italic">L'expérience Logan</em>
          </h2>
          <p className="mt-3 text-black/50 font-sans text-xs sm:text-sm tracking-wide">
            Découvrez l'interface dédiée aux cabinets
          </p>
        </div>

        {/* Cinema video frame — sized to fit remaining viewport */}
        <motion.div
          style={{ scale, borderRadius: radius }}
          className="relative w-[92%] max-w-[1280px] flex-1 max-h-[62vh] aspect-video overflow-hidden shadow-[0_40px_80px_-30px_rgba(0,0,0,0.35)] ring-1 ring-black/10"
        >
          <div className="pointer-events-none absolute inset-0 z-20 ring-1 ring-inset ring-black/[0.06] rounded-[inherit]" />

          <motion.div
            style={{ opacity: overlayOpacity }}
            className="pointer-events-none absolute inset-0 z-10 bg-black rounded-[inherit]"
          />

          <video
            src={heroCinema}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default CinemaShowcaseSection;
