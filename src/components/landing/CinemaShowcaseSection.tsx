import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { Compass, Lock } from 'lucide-react';
import heroCinema from '@/assets/hero-cinema.mp4';

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
      className="relative bg-white"
      style={{ height: '150vh' }}
      aria-label="Démonstration vidéo Logan — côté cabinet"
    >
      <div className="sticky top-0 min-h-screen h-[125vh] w-full overflow-hidden flex flex-col bg-white pt-14 md:pt-16 pb-6">
        {/* Header — top-left aligned */}
        <div className="px-6 sm:px-10 lg:px-16 mb-9 md:mb-11 max-w-3xl">
          <p className="text-[10px] font-sans font-medium tracking-[0.25em] uppercase text-black/40 mb-4">
            Votre espace cabinet
          </p>
          <h2 className="font-serif text-[1.35rem] sm:text-[1.7rem] md:text-[2rem] leading-[1.25] text-black/90">
            Une nouvelle approche du recrutement : accédez en temps réel au marché depuis votre espace cabinet et conservez <em className="italic">un temps d'avance</em>.
          </h2>
          <p className="mt-3 font-sans text-[0.76rem] sm:text-[1rem] md:text-[1.018rem] font-[480] leading-[1.65] text-black/50">
            Logan vous accompagne dans tous vos rapprochements.
          </p>
        </div>

        {/* Raw video with dramatic zoom-in */}
        <motion.div
          style={{ scale, opacity, filter }}
          className="relative w-[92%] max-w-[1280px] mx-auto flex-1 min-h-0"
        >
          <video
            src={heroCinema}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full h-full object-contain"
          />
        </motion.div>

        {/* Caption pillars under video — WOW effect */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="mt-10 md:mt-14 px-6"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-12 bg-black/15" />
            <span className="font-sans text-[10px] font-medium tracking-[0.25em] uppercase text-black/40">
              Deux usages, un même espace
            </span>
            <div className="h-px w-12 bg-black/15" />
          </div>

          <div className="flex flex-col sm:flex-row items-stretch justify-center gap-4 sm:gap-6 max-w-3xl mx-auto">
            {[
              { icon: Compass, label: 'Explorer le marché' },
              { icon: Lock, label: 'Publier votre recherche à titre confidentiel' },
            ].map(({ icon: Icon, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.25 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="group relative flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-sm border border-black/10 bg-white hover:border-black/30 hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.25)] transition-all duration-700"
              >
                <div className="w-9 h-9 rounded-full flex items-center justify-center bg-black/[0.04] group-hover:bg-black/[0.08] transition-colors duration-500">
                  <Icon className="w-4 h-4 text-black/55 group-hover:text-black/80 transition-colors duration-500" strokeWidth={1.4} />
                </div>
                <span className="font-sans text-[0.82rem] sm:text-[0.88rem] font-medium tracking-[-0.005em] text-black/75 group-hover:text-black transition-colors duration-500">
                  {label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CinemaShowcaseSection;
