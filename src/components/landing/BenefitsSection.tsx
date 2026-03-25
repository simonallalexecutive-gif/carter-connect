import { motion } from 'motion/react';
import { Shield, Target, UserCheck, Eye, Users, Sparkles } from 'lucide-react';

const engagements = [
  {
    id: 'confidentialite',
    icon: Shield,
    label: 'Confidentialité absolue',
    detail: 'Votre identité reste protégée à chaque étape. Aucune information partagée sans votre accord explicite.',
  },
  {
    id: 'ciblee',
    icon: Target,
    label: 'Approche ciblée',
    detail: 'Des rapprochements précis, fondés sur l\'expertise, la séniorité et les aspirations de chaque profil.',
  },
  {
    id: 'accompagnement',
    icon: UserCheck,
    label: 'Coaching personnalisé',
    detail: 'Un consultant dédié valide chaque mise en relation et vous guide de bout en bout, avec une attention personnalisée.',
  },
  {
    id: 'acces',
    icon: Eye,
    label: 'Visibilité continue',
    detail: 'Restez connecté en permanence aux mouvements du marché juridique, sans effort et en toute discrétion.',
  },
  {
    id: 'reseau',
    icon: Users,
    label: 'Réseau ultra qualifié',
    detail: 'Un vivier fermé de profils rigoureusement sélectionnés, mis à jour en continu dans chaque spécialité.',
  },
  {
    id: 'strategique',
    icon: Sparkles,
    label: 'Matching intelligent',
    detail: 'Un modèle transparent qui aligne les intérêts de toutes les parties pour des collaborations durables.',
  },
];

const BenefitsSection = () => {
  return (
    <section className="py-16 md:py-20" style={{ background: 'hsl(0 0% 38%)' }}>
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
          <p className="text-sm text-white/40 font-light max-w-md leading-relaxed mx-auto text-center">
            Ce qui nous distingue
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 rounded-sm overflow-hidden max-w-5xl mx-auto">
          {engagements.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="p-8 md:p-10 group hover:bg-white/[0.06] transition-colors duration-500"
              style={{ background: 'hsl(0 0% 38%)' }}
            >
              <div className="flex flex-col items-center gap-2 mb-5">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mx-auto group-hover:bg-white/15 transition-colors duration-500">
                  <item.icon className="w-4.5 h-4.5 text-white/40 group-hover:text-white/70 transition-colors duration-500" />
                </div>
                <span className="text-[10px] font-mono text-white/25">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className="font-serif text-lg text-white mb-3 tracking-[-0.01em] leading-snug text-center">
                {item.label}
              </h3>
              <p className="text-[13px] font-sans text-white/50 font-light leading-relaxed text-center">
                {item.detail}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
