import { motion } from 'motion/react';

const TeamQuoteSection = () => {
  return (
    <section className="relative min-h-[70svh] flex items-center justify-center bg-white">
      <div className="relative z-10 max-w-3xl mx-auto px-6 sm:px-10 text-center">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="block text-[9px] font-sans font-medium tracking-[0.35em] uppercase text-black/30 mb-8 sm:mb-10"
        >
          — Le mot de l'équipe Logan —
        </motion.span>

        {/* Opening quote mark */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-serif text-[3rem] sm:text-[4rem] leading-none text-black/10 mb-[-1.5rem] select-none"
          aria-hidden
        >
          "
        </motion.div>

        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif italic text-black text-lg sm:text-xl md:text-[1.35rem] lg:text-[1.5rem] leading-[1.55] tracking-[-0.01em] max-w-2xl mx-auto"
        >
          Logan se positionne comme l'<em className="not-italic font-medium">infrastructure la plus exigeante</em> et structurée du marché, offrant un accompagnement sur mesure, <em className="not-italic font-medium">résolument confidentiel</em> et parfaitement ciblé.
        </motion.blockquote>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-10 sm:mt-12 h-px w-16 bg-black/20 origin-center"
        />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.65 }}
          className="mt-5 flex flex-col items-center gap-1.5"
        >
          <span className="text-[10px] font-sans tracking-[0.25em] uppercase text-black/60">
            L'équipe Logan
          </span>
          <span className="text-[9px] font-sans tracking-[0.2em] uppercase text-black/30">
            Paris · Confidentiel
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default TeamQuoteSection;
