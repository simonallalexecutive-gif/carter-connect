import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import teamQuoteBg from '@/assets/team-quote-bg.jpg';

const TeamQuoteSection = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1.05, 1.15]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Parallax cinematic background */}
      <motion.div style={{ y, scale }} className="absolute inset-0 will-change-transform">
        <img
          src={teamQuoteBg}
          alt=""
          loading="lazy"
          width={1920}
          height={1280}
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Layered overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/85" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />

      {/* Slow ambient orb */}
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: [
            'radial-gradient(ellipse 50% 40% at 50% 45%, rgba(255,190,110,0.10) 0%, transparent 70%)',
            'radial-gradient(ellipse 60% 50% at 48% 50%, rgba(255,200,130,0.14) 0%, transparent 72%)',
            'radial-gradient(ellipse 50% 40% at 52% 48%, rgba(255,190,110,0.10) 0%, transparent 70%)',
          ],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Subtle film grain */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
        }}
      />

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 max-w-5xl mx-auto px-6 sm:px-10 text-center"
      >
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="block text-[10px] sm:text-[11px] font-sans font-medium tracking-[0.4em] uppercase text-white/45 mb-10 sm:mb-14"
        >
          — Le mot de l'équipe Logan —
        </motion.span>

        {/* Opening quote mark */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-[5rem] sm:text-[7rem] md:text-[9rem] leading-none text-white/15 mb-[-2rem] sm:mb-[-3rem] select-none"
          aria-hidden
        >
          “
        </motion.div>

        <motion.blockquote
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.2, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif italic text-white text-[1.5rem] sm:text-[2rem] md:text-[2.6rem] lg:text-[2.9rem] leading-[1.35] tracking-[-0.015em] max-w-4xl mx-auto"
        >
          Logan se positionne comme l'<em className="not-italic font-medium text-white">infrastructure la plus exigeante</em> et structurée du marché, offrant un accompagnement sur mesure, <em className="not-italic font-medium text-white">résolument confidentiel</em> et parfaitement ciblé.
        </motion.blockquote>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-14 sm:mt-16 h-px w-24 bg-gradient-to-r from-transparent via-white/50 to-transparent origin-center"
        />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, delay: 0.85 }}
          className="mt-6 flex flex-col items-center gap-2"
        >
          <span className="text-[11px] sm:text-xs font-sans tracking-[0.3em] uppercase text-white/70">
            L'équipe Logan
          </span>
          <span className="text-[10px] font-sans tracking-[0.25em] uppercase text-white/35">
            Paris · Confidentiel
          </span>
        </motion.div>
      </motion.div>

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_transparent_50%,_rgba(0,0,0,0.7)_100%)]" />
    </section>
  );
};

export default TeamQuoteSection;
