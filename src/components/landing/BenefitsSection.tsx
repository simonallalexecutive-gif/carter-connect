import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

const engagements = [
  {
    id: 'confidentialite',
    label: 'Confidentialité absolue',
    detail: 'Votre identité reste protégée à chaque étape. Aucune information partagée sans votre accord explicite.',
  },
  {
    id: 'ciblee',
    label: 'Approche ciblée',
    detail: 'Des rapprochements précis, fondés sur l\'expertise, la séniorité et les aspirations de chaque profil.',
  },
  {
    id: 'accompagnement',
    label: 'Accompagnement individualisé et sur mesure',
    detail: 'Un consultant dédié valide chaque mise en relation et vous guide de bout en bout, avec une attention personnalisée.',
  },
  {
    id: 'acces',
    label: 'Un accès privilégié constant à votre marché',
    detail: 'Restez connecté en permanence aux mouvements du marché juridique, sans effort et en toute discrétion.',
  },
  {
    id: 'reseau',
    label: 'Un réseau qualifié et actualisé',
    detail: 'Un vivier fermé de profils rigoureusement sélectionnés, mis à jour en continu dans chaque spécialité.',
  },
  {
    id: 'strategique',
    label: 'Des rapprochements stratégiques',
    detail: 'Un modèle transparent qui aligne les intérêts de toutes les parties pour des collaborations durables.',
  },
];

const BenefitsSection = () => {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <section className="py-24 md:py-32 bg-foreground">
      <div className="carter-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 flex flex-col items-center"
        >
          <p className="text-xs font-sans font-medium tracking-[0.2em] uppercase text-white/50 mb-4 text-center">
            Nos engagements
          </p>
          <p className="text-sm text-white/50 font-light max-w-md leading-relaxed mx-auto text-center">
            Ce qui nous distingue
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-0">
          {engagements.map((item, i) => {
            const isActive = activeId === item.id;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <button
                  onClick={() => setActiveId(isActive ? null : item.id)}
                  className="w-full text-left group"
                >
                  <div className={cn(
                    'flex items-center justify-between py-6 border-b transition-all duration-500',
                    isActive ? 'border-white/30' : 'border-white/[0.08]'
                  )}>
                    <div className="flex items-center gap-5">
                      <span className={cn(
                        'text-[10px] font-mono tracking-wider transition-colors duration-500',
                        isActive ? 'text-white' : 'text-white/25'
                      )}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className={cn(
                        'font-serif text-lg md:text-xl tracking-[-0.01em] transition-all duration-500',
                        isActive ? 'text-white' : 'text-white/60 group-hover:text-white/80'
                      )}>
                        {item.label}
                      </span>
                    </div>
                    <motion.span
                      animate={{ rotate: isActive ? 45 : 0 }}
                      transition={{ duration: 0.3 }}
                      className={cn(
                        'text-lg font-light flex-shrink-0 ml-4 transition-colors duration-500',
                        isActive ? 'text-white' : 'text-white/30 group-hover:text-white/50'
                      )}
                    >
                      +
                    </motion.span>
                  </div>
                </button>
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pl-[3.25rem] pr-8 pb-6 pt-2 text-sm text-white/50 font-light leading-relaxed max-w-lg">
                        {item.detail}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
