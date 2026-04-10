import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

const FounderSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.5, 0.7, 1], [0, 1, 1, 1, 0.3]);
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [60, 0, 0, -30]);

  return (
    <section
      ref={ref}
      className="relative flex items-center justify-center overflow-hidden border-t border-white/[0.06]"
      style={{ background: 'hsl(0 0% 5%)', minHeight: '100svh' }}
    >
      {/* Subtle radial glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,255,255,0.03) 0%, transparent 70%)',
      }} />

      <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-14 py-24 md:py-32 relative z-10">
        <motion.div style={{ opacity, y }} className="text-center">
          {/* Decorative line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-16 h-px bg-white/20 mx-auto mb-12 origin-center"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-2xl sm:text-3xl md:text-[2.8rem] lg:text-[3.4rem] leading-[1.2] text-white/80 italic tracking-[-0.02em] max-w-4xl mx-auto"
          >
            «&nbsp;Logan se positionne comme la plateforme la plus exigeante et structurée du marché, offrant un accompagnement sur mesure, résolument confidentiel et parfaitement ciblé.&nbsp;»
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-10"
          >
            <span className="text-[10px] font-sans font-medium tracking-[0.25em] uppercase text-white/20">
              — L'équipe Logan
            </span>
          </motion.div>

          {/* Decorative line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-16 h-px bg-white/20 mx-auto mt-12 origin-center"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default FounderSection;
