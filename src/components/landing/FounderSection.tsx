import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Check, Move } from 'lucide-react';
import founderImg from '@/assets/founder-simon.jpeg';

const FounderSection = () => {
  const [editing, setEditing] = useState(false);
  const [posX, setPosX] = useState(50);
  const [posY, setPosY] = useState(30);
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    setConfirmed(true);
    setEditing(false);
  };

  return (
    <section className="py-14 md:py-20 overflow-hidden border-t border-foreground/[0.08]" style={{ background: 'hsl(0 0% 96%)' }}>
      <div className="carter-container">
        <div className="max-w-5xl mx-auto">
          {/* Section label */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs font-sans font-medium tracking-[0.2em] uppercase text-muted-foreground mb-16 md:mb-20 text-center"
          >
            Notre vision
          </motion.p>

          {/* Founder centered on top */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center mb-14 md:mb-16"
          >
            <div
              className="w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-2 border-foreground/10 shadow-lg cursor-pointer relative group mb-4"
              onClick={() => !confirmed && setEditing(!editing)}
            >
              <img
                src={founderImg}
                alt="Simon Allal, Fondateur de Logan"
                className="w-full h-full object-cover transition-all duration-300"
                style={{ objectPosition: `${posX}% ${posY}%` }}
              />
              {!confirmed && !editing && (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <Move className="w-5 h-5 text-white" />
                </div>
              )}
            </div>

            {editing && (
              <div className="w-48 space-y-3 bg-secondary p-4 rounded-lg border border-border mb-4">
                <div>
                  <label className="text-[11px] font-sans text-muted-foreground mb-1 block">Horizontal</label>
                  <Slider value={[posX]} onValueChange={([v]) => setPosX(v)} min={0} max={100} step={1} />
                </div>
                <div>
                  <label className="text-[11px] font-sans text-muted-foreground mb-1 block">Vertical</label>
                  <Slider value={[posY]} onValueChange={([v]) => setPosY(v)} min={0} max={100} step={1} />
                </div>
                <Button size="sm" onClick={handleConfirm} className="w-full gap-1.5 text-xs">
                  <Check className="w-3.5 h-3.5" /> Valider
                </Button>
              </div>
            )}

            <h3 className="font-serif text-2xl text-foreground font-normal mb-0.5 tracking-[-0.01em] text-center">
              Simon Allal
            </h3>
            <p className="text-[11px] font-sans font-medium tracking-[0.15em] uppercase text-muted-foreground mb-5">
              Fondateur
            </p>
            <p className="font-sans text-[0.92rem] text-foreground/70 font-light leading-relaxed text-center max-w-sm">
              Fort d'un réseau reconnu et d'une compréhension aiguë du marché des avocats, Simon a fondé Logan avec une conviction&nbsp;: l'expérience recrutement doit être repensée en proposant une approche plus structurée, plus confidentielle et plus exigeante.
            </p>
          </motion.div>

          {/* Logan team quote centered below */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl mx-auto text-center"
          >
            <p className="font-serif text-sm sm:text-base md:text-lg text-foreground/55 italic leading-relaxed mb-4 tracking-[-0.01em]">
              «&nbsp;Logan se positionne comme la plateforme la plus exigeante et structurée du marché, offrant un accompagnement sur mesure, résolument confidentiel et parfaitement ciblé.&nbsp;»
            </p>
            <span className="text-[10px] font-sans font-medium tracking-[0.15em] uppercase text-muted-foreground/60">
              — L'équipe Logan
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FounderSection;
