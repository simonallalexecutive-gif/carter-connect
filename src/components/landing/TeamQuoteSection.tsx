import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
const bgAsset = { url: '/quote-bg.jpg' };

const TeamQuoteSection = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] flex flex-col overflow-hidden bg-black"
    >
      {/* Background */}
      <motion.img
        src={bgAsset.url}
        alt=""
        aria-hidden
        style={{ y: bgY, willChange: 'transform' }}
        className="absolute inset-0 w-full h-full object-cover object-center opacity-100"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

      {/* Bloc centré verticalement sur toute la page */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-20 px-6 sm:px-10">
        <motion.p
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif font-[300] text-[1.9rem] sm:text-[2.5rem] md:text-[3rem] text-white leading-[1.08] tracking-normal text-center max-w-3xl"
        >
          Logan est la nouvelle infrastructure privilégiée et confidentielle du marché des avocats.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-lg text-center"
        >
          <blockquote className="font-serif italic font-light text-[0.9rem] sm:text-[0.99rem] leading-[1.75] text-white/50">
            <span className="font-serif text-white/20 text-2xl align-top mr-1 leading-none">"</span>
            Logan se positionne comme l'infrastructure la plus exigeante et structurée du marché, offrant un accompagnement sur mesure, résolument confidentiel et parfaitement ciblé.
            <span className="font-serif text-white/20 text-2xl align-bottom ml-1 leading-none">"</span>
          </blockquote>
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-[10px] font-sans tracking-[0.3em] uppercase text-white/25 mt-4 block"
          >
            L'équipe Logan
          </motion.span>
        </motion.div>
      </div>
    </section>

  );
};

export default TeamQuoteSection;
