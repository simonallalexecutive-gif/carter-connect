import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { Compass, Lock } from 'lucide-react';
import heroCinema from '@/assets/hero-cinema-v2.mov';

const CinemaShowcaseSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Dramatic zoom-in at entry, then subtle settle
  const scale = useTransform(scrollYProgress, [0, 0.35, 0.7, 1], [0.55, 1, 1, 0.96]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.85, 1], [0.4, 1, 1, 0.85]);
  const blur = useTransform(scrollYProgress, [0, 0.3], [12, 0]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);

  return (
    <section
      ref={sectionRef}
      id="votre-espace-cabinet"
      className="relative bg-white"
      style={{ height: '150vh' }}
      aria-label="Démonstration vidéo Logan — côté cabinet"
    >
      <div className="sticky top-0 min-h-screen h-[125vh] w-full overflow-hidden flex flex-col bg-white pt-14 md:pt-16 pb-6">
        {/* Editorial header */}
        <div className="px-6 sm:px-8 lg:px-10 mb-10 md:mb-14 max-w-6xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12"
          >
            <span className="text-[10px] tracking-[0.3em] uppercase font-sans font-semibold text-black/40">
              Votre espace cabinet
            </span>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20 items-end">
            <motion.h2
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-8 font-serif text-[2.25rem] sm:text-5xl md:text-[4.25rem] leading-[1.05] tracking-[-0.015em] text-black/90 font-normal"
            >
              Accédez en temps réel au marché et conservez{' '}
              <span className="italic">un temps d'avance</span>.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-4 pb-2 font-sans text-base md:text-lg text-black/55 leading-[1.7] max-w-sm font-light"
            >
              Une nouvelle approche du recrutement. Logan vous accompagne dans tous vos rapprochements.
            </motion.p>
          </div>
        </div>

        {/* Raw video with dramatic zoom-in */}
        <motion.div
          style={{ scale, opacity, filter }}
          className="relative w-[99%] max-w-[1920px] mx-auto flex-1 min-h-0"
        >
          <video
            ref={(el) => {
              if (el) el.playbackRate = 0.75;
            }}
            src={heroCinema}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full h-full object-contain"
          />
        </motion.div>

        {/* Inline pillars — editorial style */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          className="mt-10 md:mt-14 px-6 max-w-6xl mx-auto w-full pt-8 border-t border-black/[0.08] flex flex-wrap items-center justify-center gap-x-10 gap-y-4"
        >
          {[
            { icon: Compass, label: 'Explorer le marché' },
            { icon: Lock, label: 'Publier votre recherche à titre confidentiel' },
          ].map(({ icon: Icon, label }) => (
            <motion.div
              key={label}
              variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } } }}
              className="group flex items-center gap-2.5"
            >
              <Icon className="w-3.5 h-3.5 text-black/40 group-hover:text-black/80 transition-colors duration-500" strokeWidth={1.5} />
              <span className="font-sans text-[10px] uppercase tracking-[0.22em] text-black/40 group-hover:text-black/85 transition-colors duration-500">
                {label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CinemaShowcaseSection;
