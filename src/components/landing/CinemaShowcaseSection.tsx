import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import heroCinema from '@/assets/hero-cinema.mp4';

const CinemaShowcaseSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Harvey.ai-style scroll-driven cinema reveal
  const scale = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [0.78, 1, 1, 0.92]);
  const radius = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [32, 6, 6, 24]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.7, 0, 0, 0.5]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.15, 0.35], [0, 1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 0.35], [40, -20]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-black"
      style={{ height: '220vh' }}
      aria-label="Démonstration vidéo Logan"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Ambient grain / glow background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(255,255,255,0.06),transparent_70%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        </div>

        {/* Floating tagline (only visible at entry) */}
        <motion.div
          style={{ opacity: titleOpacity, y: titleY }}
          className="absolute top-[8%] left-0 right-0 z-30 text-center px-6 pointer-events-none"
        >
          <p className="text-white/40 font-sans text-[10px] sm:text-[11px] tracking-[0.3em] uppercase mb-3">
            Démonstration
          </p>
          <h2 className="text-white font-serif text-2xl sm:text-4xl md:text-5xl tracking-[-0.02em] leading-[1.1]">
            <em className="italic">L'expérience Logan</em>
          </h2>
        </motion.div>

        {/* Cinema video frame */}
        <motion.div
          style={{ scale, borderRadius: radius }}
          className="relative w-[92%] max-w-[1400px] aspect-video overflow-hidden shadow-[0_60px_120px_-30px_rgba(0,0,0,0.8)] ring-1 ring-white/10"
        >
          {/* Subtle inner border highlight */}
          <div className="pointer-events-none absolute inset-0 z-20 ring-1 ring-inset ring-white/[0.06] rounded-[inherit]" />

          {/* Vignette */}
          <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_80%_70%_at_50%_50%,transparent_55%,rgba(0,0,0,0.45)_100%)] rounded-[inherit]" />

          {/* Dark overlay tied to scroll */}
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

        {/* Bottom caption */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-20%' }}
          transition={{ duration: 1.4, delay: 0.2 }}
          className="absolute bottom-[6%] left-0 right-0 text-center px-6 z-20"
        >
          <p className="text-white/35 font-sans text-[10px] sm:text-[11px] tracking-[0.25em] uppercase">
            Une infrastructure pensée pour les avocats les plus exigeants
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CinemaShowcaseSection;
