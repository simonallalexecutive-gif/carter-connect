import { motion } from 'motion/react';
import { Lock, Crosshair, HeartHandshake, ScanSearch, Users, GitMerge } from 'lucide-react';

const pillars = [
  { icon: Lock, title: 'Confidentialité', desc: 'Votre identité reste protégée à chaque étape. Aucune information partagée sans votre accord.' },
  { icon: ScanSearch, title: 'Accès au marché', desc: 'Un vivier qualifié et actualisé en continu, accessible tout au long de l\'année.' },
  { icon: Crosshair, title: 'Ciblage', desc: 'Des rapprochements précis, fondés sur l\'expertise, la séniorité et le projet.' },
  { icon: HeartHandshake, title: 'Accompagnement', desc: 'Un consultant dédié valide chaque mise en relation et vous guide de bout en bout.' },
  { icon: Users, title: 'Réseau qualifié', desc: 'Un réseau fermé de profils rigoureusement sélectionnés dans chaque spécialité.' },
  { icon: GitMerge, title: 'Stratégie', desc: 'Un modèle transparent — abonnement annuel, sans commission au placement.' },
];

const BenefitsSection = () => {
  return (
    <section className="py-24 md:py-32 bg-foreground">
      <div className="carter-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <div className="w-12 h-px bg-white/30 mb-8" />
          <p className="text-xs font-sans font-medium tracking-[0.2em] uppercase text-white/50 mb-4">
            Nos engagements
          </p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-normal text-white tracking-[-0.01em] max-w-xl">
            Ce qui nous distingue
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border border-white/10 rounded-sm overflow-hidden">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="bg-foreground p-8 md:p-10 group hover:bg-white/[0.04] transition-colors duration-500"
            >
              <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center mb-6 group-hover:border-white/40 transition-colors duration-500">
                <p.icon className="w-4 h-4 text-white/60 group-hover:text-white transition-colors duration-500" />
              </div>
              <h3 className="font-serif text-lg text-white font-normal mb-2 tracking-[-0.01em]">
                {p.title}
              </h3>
              <p className="font-sans text-sm text-white/50 font-light leading-relaxed">
                {p.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
