import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

const TeamQuoteSection = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['8%', '-8%']);
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.96, 1.02, 1]);

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] flex items-center justify-center bg-white overflow-hidden"
    >
      {/* Ambient luminous backdrop */}
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: [
            'radial-gradient(ellipse 60% 50% at 30% 40%, rgba(0,0,0,0.04) 0%, transparent 70%)',
            'radial-gradient(ellipse 70% 60% at 70% 60%, rgba(0,0,0,0.05) 0%, transparent 70%)',
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,0,0,0.04) 0%, transparent 70%)',
          ],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Giant decorative quote mark in background */}
      <motion.div
        style={{ y, opacity }}
        className="absolute -top-10 left-1/2 -translate-x-1/2 font-serif text-[28rem] sm:text-[40rem] leading-none text-black/[0.035] select-none pointer-events-none"
        aria-hidden
      >
        "
      </motion.div>

      <motion.div
        style={{ scale }}
        className="relative z-10 max-w-5xl mx-auto px-6 sm:px-10 text-center"
      >
        <motion.blockquote
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="italic text-black text-xl sm:text-2xl md:text-[1.85rem] lg:text-[2.15rem] leading-[1.4] tracking-[-0.005em] max-w-4xl mx-auto font-light"
          style={{ fontFamily: "'Cormorant Garamond', 'Garamond', serif" }}
        >
          Logan se positionne comme l'
          <em className="not-italic font-medium relative inline-block">
            infrastructure la plus exigeante
            <motion.span
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1.2, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: 'left' }}
              className="absolute left-0 right-0 -bottom-1 h-px bg-black/40"
            />
          </em>{' '}
          et structurée du marché, offrant un accompagnement sur mesure,{' '}
          <em className="not-italic font-medium relative inline-block">
            résolument confidentiel
            <motion.span
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1.2, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: 'left' }}
              className="absolute left-0 right-0 -bottom-1 h-px bg-black/40"
            />
          </em>{' '}
          et parfaitement ciblé.
        </motion.blockquote>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-14 sm:mt-16 h-px w-20 bg-black/30 origin-center"
        />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9, delay: 0.8 }}
          className="mt-7 flex flex-col items-center gap-1.5"
        >
          <span className="text-[11px] font-sans tracking-[0.3em] uppercase text-black/60">
            L'équipe Logan
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default TeamQuoteSection;
