import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
const bgAsset = { url: '/quote-bg.jpg' };

const TeamQuoteSection = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['8%', '-8%']);
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.96, 1.02, 1]);
  const bgY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Background */}
      <motion.img
        src={bgAsset.url}
        alt=""
        aria-hidden
        style={{ y: bgY, willChange: 'transform' }}
        className="absolute inset-0 w-full h-full object-cover object-center opacity-100"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />

      {/* Giant decorative quote mark */}
      <motion.div
        style={{ y, opacity }}
        className="absolute -top-10 left-1/2 -translate-x-1/2 font-serif text-[20rem] sm:text-[28rem] leading-none text-white/[0.06] select-none pointer-events-none"
        aria-hidden
      >
        “
      </motion.div>

      <motion.div
        style={{ scale }}
        className="relative z-10 max-w-4xl mx-auto px-6 sm:px-10 text-center"
      >
        <motion.blockquote
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="italic text-white text-sm sm:text-base md:text-[1.3rem] lg:text-[1.5rem] leading-[1.5] tracking-[-0.005em] max-w-3xl mx-auto font-light drop-shadow-lg relative"
          style={{ fontFamily: "'Cormorant Garamond', 'Garamond', serif" }}
        >
          <span className="font-serif text-white/40 text-3xl sm:text-4xl align-top mr-1 leading-none">“</span>
          Logan se positionne comme l'infrastructure la plus exigeante et structurée du marché, offrant un accompagnement sur mesure, résolument confidentiel et parfaitement ciblé.
          <span className="font-serif text-white/40 text-3xl sm:text-4xl align-bottom ml-1 leading-none">”</span>
        </motion.blockquote>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-14 sm:mt-16 h-px w-20 bg-white/40 origin-center"
        />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9, delay: 0.8 }}
          className="mt-7 flex flex-col items-center gap-1.5"
        >
          <span className="text-[11px] font-sans tracking-[0.3em] uppercase text-white/70">
            L'équipe Logan
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default TeamQuoteSection;
