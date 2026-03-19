import { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import founderPhoto from '@/assets/founder-simon.jpeg';

const FounderSection = () => {
  const [posX, setPosX] = useState(45);
  const [posY, setPosY] = useState(25);
  const [editing, setEditing] = useState(false);

  return (
    <section className="py-20 md:py-28 bg-black overflow-hidden">
      <div className="carter-container">
        <div className="max-w-5xl mx-auto">
          {/* Section label */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs font-sans font-medium tracking-[0.2em] uppercase text-white/50 mb-14 text-center"
          >
            Qui sommes-nous
          </motion.p>

          {/* Citation — moved from hero */}
          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl mx-auto text-center mb-16 md:mb-20"
          >
            <p className="font-serif text-lg sm:text-xl md:text-[1.35rem] text-white/60 italic leading-snug mb-3 font-[500] tracking-[-0.01em]">
              «&nbsp;Logan se positionne comme la plateforme la plus exigeante et structurée du marché, offrant un accompagnement sur mesure, résolument confidentiel et parfaitement ciblé.&nbsp;»
            </p>
            <span className="text-[10px] sm:text-[11px] font-sans font-medium tracking-[0.15em] uppercase text-white/40">
              — L'équipe Logan
            </span>
          </motion.blockquote>

          {/* Founder card */}
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
            {/* Photo with crop control */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex-shrink-0 flex flex-col items-center gap-4"
            >
              <div
                className="w-48 h-48 md:w-56 md:h-56 rounded-full bg-black border border-white/20 overflow-hidden cursor-pointer group relative"
                onClick={() => setEditing(!editing)}
              >
                <img
                  src={founderPhoto}
                  alt="Simon Allal, fondateur de Logan"
                  className="w-full h-full object-cover transition-transform duration-300"
                  style={{ objectPosition: `${posX}% ${posY}%` }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <span className="text-white/0 group-hover:text-white/70 text-[10px] font-sans font-medium tracking-wider uppercase transition-colors">
                    Recadrer
                  </span>
                </div>
              </div>

              {/* Crop sliders — LinkedIn-style */}
              {editing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="w-48 md:w-56 space-y-3 pt-2"
                >
                  <div>
                    <label className="text-[9px] font-sans font-medium tracking-[0.15em] uppercase text-white/40 mb-1 block">
                      Horizontal
                    </label>
                    <Slider
                      value={[posX]}
                      onValueChange={([v]) => setPosX(v)}
                      min={0}
                      max={100}
                      step={1}
                      className="[&_[role=slider]]:h-3.5 [&_[role=slider]]:w-3.5 [&_[role=slider]]:border-white/60 [&_[role=slider]]:bg-white [&_.relative]:h-1 [&_.absolute]:bg-white/50 [&_.relative]:bg-white/20"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-sans font-medium tracking-[0.15em] uppercase text-white/40 mb-1 block">
                      Vertical
                    </label>
                    <Slider
                      value={[posY]}
                      onValueChange={([v]) => setPosY(v)}
                      min={0}
                      max={100}
                      step={1}
                      className="[&_[role=slider]]:h-3.5 [&_[role=slider]]:w-3.5 [&_[role=slider]]:border-white/60 [&_[role=slider]]:bg-white [&_.relative]:h-1 [&_.absolute]:bg-white/50 [&_.relative]:bg-white/20"
                    />
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setEditing(false); }}
                    className="w-full text-[10px] font-sans font-medium tracking-wider uppercase text-white/60 hover:text-white border border-white/20 rounded-sm py-1.5 transition-colors"
                  >
                    Valider
                  </button>
                </motion.div>
              )}
            </motion.div>

            {/* Bio */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              className="text-center md:text-left flex-1"
            >
              <h3 className="font-serif text-2xl md:text-3xl text-white font-normal mb-2 tracking-[-0.01em]">
                Simon Allal
              </h3>
              <p className="text-xs font-sans font-medium tracking-[0.2em] uppercase text-white/50 mb-6">
                Fondateur
              </p>
              <p className="font-sans text-sm md:text-base text-white/60 font-light leading-relaxed mb-8 max-w-lg">
                Fort d'une expertise approfondie du marché juridique, Simon Allal a fondé Logan avec la conviction qu'une approche confidentielle, ciblée et humaine pouvait transformer le recrutement des avocats d'affaires.
              </p>
              <Link to="/a-propos" className="inline-flex items-center gap-2 text-sm font-sans font-medium text-white/70 hover:text-white transition-colors duration-300 group">
                À propos
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderSection;
