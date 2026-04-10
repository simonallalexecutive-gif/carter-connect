import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import mountainBg from '@/assets/quote-mountain.jpeg';

const FounderSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.5, 0.7, 1], [0, 1, 1, 1, 0.3]);
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [60, 0, 0, -30]);
  const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1, 1.05]);
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  return (
    <section
      ref={ref}
      className="relative flex items-center justify-center overflow-hidden border-t border-white/[0.06]"

      style={{ minHeight: '100svh' }}
    >
      {/* Animated background image */}
      {/* Fixed background covering full viewport */}
      <div className="fixed inset-0 -z-10">
        <img
          src={mountainBg}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Dark overlay for text legibility */}
      {/* Additional overlay on the section itself */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Subtle animated radial glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: [
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,255,255,0.04) 0%, transparent 70%)',
            'radial-gradient(ellipse 70% 60% at 48% 52%, rgba(255,255,255,0.06) 0%, transparent 70%)',
            'radial-gradient(ellipse 60% 50% at 52% 48%, rgba(255,255,255,0.04) 0%, transparent 70%)',
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

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
            className="font-serif text-xl sm:text-2xl md:text-[2.24rem] lg:text-[2.72rem] leading-[1.2] text-white/90 italic tracking-[-0.02em] max-w-4xl mx-auto drop-shadow-lg"
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
            <span className="text-[10px] font-sans font-medium tracking-[0.25em] uppercase text-white/30">
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
