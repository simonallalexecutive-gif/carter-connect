import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import mountainBg from '@/assets/quote-mountain.jpeg';

const FounderSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.5, 0.7, 1], [0, 1, 1, 1, 0.3]);
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [60, 0, 0, -30]);

  return (
    <section
      ref={ref}
      className="relative flex items-center justify-center overflow-hidden border-t border-white/[0.06]"
      style={{ minHeight: '100svh' }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <motion.img
          src={mountainBg}
          alt=""
          className="w-full h-full object-cover"
          style={{ willChange: 'transform' }}
          initial={{ scale: 1.15 }}
          animate={{
            scale: [1.15, 1.05, 1.1, 1.03, 1.08],
            x: ['0%', '-1%', '0.5%', '-0.5%', '0%'],
            y: ['0%', '-0.5%', '0.3%', '-0.3%', '0%'],
          }}
          transition={{
            scale: { duration: 30, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' },
            x: { duration: 25, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' },
            y: { duration: 20, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' },
          }}
        />
      </div>

      <div className="absolute inset-0 bg-black/65" />

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

      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          opacity: [0, 0.12, 0.2, 0.08, 0],
          background: [
            'linear-gradient(125deg, rgba(255,200,120,0.15) 0%, transparent 50%)',
            'linear-gradient(145deg, rgba(255,210,140,0.1) 0%, transparent 55%)',
            'linear-gradient(135deg, rgba(255,180,100,0.18) 0%, transparent 45%)',
          ],
        }}
        transition={{ duration: 18, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' }}
      />

      <div className="max-w-6xl w-full mx-auto px-4 sm:px-8 lg:px-10 py-12 md:py-20 relative z-10 flex flex-col items-center justify-center min-h-[80svh]">
        {/* Quote — centered, larger */}
        <motion.div style={{ opacity, y }} className="text-center max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-[1.42rem] sm:text-[1.55rem] md:text-[1.73rem] lg:text-[2.1rem] leading-[1.4] text-white/70 italic tracking-[-0.02em] drop-shadow-lg"
          >
            «&nbsp;Logan se positionne comme la plateforme la plus exigeante
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
            <span className="text-[9px] font-sans font-medium tracking-[0.25em] uppercase text-white/30">
              — L'équipe Logan
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FounderSection;
