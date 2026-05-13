import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

const FounderSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.5, 0.7, 1], [0, 1, 1, 1, 0.4]);
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [60, 0, 0, -30]);

  return (
    <section
      ref={ref}
      className="relative flex items-center justify-center overflow-hidden bg-white border-t border-black/[0.06]"
      style={{ minHeight: '100svh' }}
    >
      <div className="max-w-6xl w-full mx-auto px-4 sm:px-8 lg:px-10 py-12 md:py-20 relative z-10 flex flex-col items-center justify-center min-h-[80svh]">
        <motion.div style={{ opacity, y }} className="text-center max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-[1.42rem] sm:text-[1.55rem] md:text-[1.73rem] lg:text-[2.1rem] leading-[1.4] text-black/85 italic tracking-[-0.02em]"
          >
            «&nbsp;Logan se positionne comme l'infrastructure la plus exigeante
            <br />et structurée du marché, offrant un accompagnement sur mesure,
            <br />résolument confidentiel et parfaitement ciblé.&nbsp;»
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-5"
          >
            <span className="text-[10px] font-sans font-medium tracking-[0.25em] uppercase text-black/40">
              — L'équipe Logan
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FounderSection;
