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
    <section className="py-24 md:py-32 bg-background">
      <div className="carter-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 flex flex-col items-center"
        >
          <p className="text-xs font-sans font-medium tracking-[0.2em] uppercase text-muted-foreground mb-4 text-center">
            Nos engagements
          </p>
          <p className="text-sm text-muted-foreground font-light max-w-md leading-relaxed mx-auto text-center">
            Ce qui nous distingue
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-sm overflow-hidden max-w-5xl mx-auto">
          {engagements.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="bg-background p-8 md:p-10 group hover:bg-secondary transition-colors duration-500"
            >
              <div className="flex items-start gap-4 mb-5">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 group-hover:bg-foreground/10 transition-colors duration-500">
                  <item.icon className="w-4.5 h-4.5 text-foreground/40 group-hover:text-foreground/70 transition-colors duration-500" />
                </div>
                <span className="text-[10px] font-mono text-muted-foreground/40 mt-2">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className="font-serif text-lg text-foreground mb-3 tracking-[-0.01em] leading-snug">
                {item.label}
              </h3>
              <p className="text-[13px] font-sans text-muted-foreground font-light leading-relaxed">
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
