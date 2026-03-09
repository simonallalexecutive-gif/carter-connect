import { motion } from 'framer-motion';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { User, Building2 } from 'lucide-react';

type Tab = 'candidat' | 'cabinet';

const candidatBenefits = [
  {
    number: '01',
    title: 'Connecté en temps réel au marché',
    desc: 'Restez visible auprès des meilleurs cabinets tout en préservant votre anonymat. Seuls votre domaine d\'activité, votre séniorité et les grandes lignes de votre projet sont dévoilés — jamais votre identité.',
  },
  {
    number: '02',
    title: 'Devenez acteur de votre carrière',
    desc: 'Chaque nouvelle opportunité vous est transmise en priorité. Vous décidez — ou non — d\'alerter Logan pour en savoir plus. Aucune démarche n\'est engagée sans votre initiative.',
  },
  {
    number: '03',
    title: 'Accompagnement sur mesure',
    desc: 'Conseil, transparence, benchmark, feedback : un consultant dédié vous accompagne à chaque étape, jusqu\'à la signature de votre prochaine collaboration.',
  },
];

const cabinetBenefits = [
  {
    number: '01',
    title: 'Visualisez les profils en un clin d\'œil',
    desc: 'Accédez aux profils à l\'écoute du marché dans votre spécialité. Expertise, séniorité, projet : l\'essentiel est là. Manifestez — ou non — votre intérêt en toute discrétion.',
  },
  {
    number: '02',
    title: 'Carter orchestre chaque étape',
    desc: 'Dès qu\'un profil retient votre attention, Carter prend le relais : validation de la pertinence, mise en relation, gestion intégrale du processus jusqu\'à l\'aboutissement.',
  },
  {
    number: '03',
    title: 'Économique, efficace, confidentiel',
    desc: 'Un abonnement annuel, un vivier premium toute l\'année pour tous vos départements. Pas de commission au placement, pas de surprise.',
  },
];

const sharedValues = [
  'Accompagnement sur mesure',
  'Interlocuteur de confiance',
  'Confidentialité totale',
  'Préservation de l\'anonymat',
];

const BenefitsSection = () => {
  const [tab, setTab] = useState<Tab>('candidat');
  const benefits = tab === 'candidat' ? candidatBenefits : cabinetBenefits;

  return (
    <section className="carter-section bg-background">
      <div className="carter-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="carter-divider mb-8" />
          <h2 className="text-3xl md:text-5xl font-serif font-normal text-foreground leading-tight tracking-[-0.02em] mb-10">
            Pourquoi rejoindre<br />
            <em className="text-muted-foreground font-normal">Carter</em>
          </h2>

          {/* Tabs */}
          <div className="inline-flex border border-border rounded-sm overflow-hidden">
            {[
              { key: 'candidat' as Tab, label: 'Candidat', icon: User },
              { key: 'cabinet' as Tab, label: 'Cabinet', icon: Building2 },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  'flex items-center gap-2 px-6 py-3 text-sm font-sans font-medium transition-all duration-300',
                  tab === t.key
                    ? 'bg-foreground text-background'
                    : 'bg-background text-muted-foreground hover:text-foreground'
                )}
              >
                <t.icon className="w-4 h-4" />
                {t.label}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="grid md:grid-cols-3 gap-px bg-border rounded-lg overflow-hidden"
        >
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="bg-background p-10 md:p-12 group hover:bg-card transition-colors duration-500"
            >
              <span className="text-xs font-sans font-medium text-muted-foreground tracking-[0.15em] mb-6 block">{b.number}</span>
              <h3 className="font-serif text-xl md:text-2xl text-foreground mb-3 font-normal">{b.title}</h3>
              <p className="font-sans text-sm text-muted-foreground font-light leading-relaxed">{b.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Shared values — ce qui nous réunit */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-20 border border-border rounded-lg p-10 md:p-14 text-center"
        >
          <p className="text-xs font-sans font-medium tracking-[0.2em] uppercase text-muted-foreground mb-6">
            Ce qui nous réunit
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {sharedValues.map((v, i) => (
              <motion.span
                key={v}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="border border-border rounded-sm px-5 py-2.5 text-sm font-sans text-foreground font-medium"
              >
                {v}
              </motion.span>
            ))}
          </div>
          <p className="font-serif text-lg md:text-xl text-foreground/80 italic max-w-md mx-auto">
            Parce qu'un bon recrutement ne se fait pas attendre.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default BenefitsSection;
