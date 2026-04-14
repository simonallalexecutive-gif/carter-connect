import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import mountainBg from '@/assets/quote-mountain.jpeg';

const FounderSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.5, 0.7, 1], [0, 1, 1, 1, 0.3]);
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [60, 0, 0, -30]);

  const taglineWords = 'Un écosystème enrichi chaque jour par nos consultants spécialisés et piloté dans la plus stricte confidentialité.'.split(' ');

  return (
    <section
      ref={ref}
      className="relative flex items-end justify-end overflow-hidden border-t border-white/[0.06]"
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

      <div className="max-w-6xl w-full mx-auto px-4 sm:px-8 lg:px-10 py-12 md:py-20 relative z-10 flex flex-col min-h-[80svh]">
        {/* Top-left ecosystem tagline — bright text */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="self-start max-w-lg text-left mt-[-10%] mb-auto relative"
        >
          <motion.div
            className="absolute -inset-8 pointer-events-none rounded-full"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2, delay: 0.5 }}
            style={{
              background: 'radial-gradient(ellipse 100% 80% at 30% 50%, rgba(255,255,255,0.06) 0%, transparent 70%)',
              filter: 'blur(20px)',
            }}
          />

          <p className="font-sans text-[0.9rem] sm:text-[0.96rem] md:text-[1.01rem] leading-[1.6] font-light tracking-wide relative">
            {taglineWords.map((word, i) => (
              <motion.span
                key={i}
                className="inline-block mr-[0.3em] text-white/90"
                initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: 0.4 + i * 0.04,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {word}
              </motion.span>
            ))}
          </p>
        </motion.div>

        {/* Quote — subdued text */}
        <motion.div style={{ opacity, y }} className="text-right max-w-2xl ml-auto mr-[-5%] mt-auto mb-[-1%]">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-[0.82rem] sm:text-[0.9rem] md:text-[1rem] lg:text-[1.21rem] leading-[1.4] text-white/35 italic tracking-[-0.02em] drop-shadow-lg"
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
