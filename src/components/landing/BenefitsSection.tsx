import { motion } from 'framer-motion';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { User, Building2 } from 'lucide-react';

type Tab = 'candidat' | 'cabinet';

const candidatBenefits = [
  {
    number: '01',
    title: 'Informations en temps réel',
    desc: 'Marché, mouvements, opportunités — une vision constante et actualisée du marché juridique.',
  },
  {
    number: '02',
    title: 'Visibilité marché',
    desc: 'Dynamiques de recrutement, benchmarks et tendances du marché juridique haut de gamme.',
  },
  {
    number: '03',
    title: 'Accompagnement sur mesure',
    desc: 'Un consultant dédié à chaque étape, de la détection de l\'opportunité à la décision finale.',
  },
  {
    number: '04',
    title: 'Discrétion absolue',
    desc: 'Votre profil n\'est jamais diffusé sans votre consentement explicite.',
  },
];

const cabinetBenefits = [
  {
    number: '01',
    title: 'Vivier ultra-qualifié toute l\'année',
    desc: 'Chaque profil est validé manuellement par Carter. Accédez à un vivier actif pour tous vos besoins annuels.',
  },
  {
    number: '02',
    title: '0% de commission au placement',
    desc: 'Abonnement annuel illimité sans commission par placement. Contre 20–45K€ HT par recrutement en modèle traditionnel.',
  },
  {
    number: '03',
    title: 'Confidentialité absolue',
    desc: 'Votre recherche comme les profils consultés restent strictement anonymisés. Levée de rideau uniquement avec l\'accord du candidat.',
  },
  {
    number: '04',
    title: 'Accès prioritaire aux profils',
    desc: 'Les membres Carter sont notifiés en premier des nouveaux profils disponibles avant toute diffusion externe.',
  },
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
          className="grid md:grid-cols-2 gap-px bg-border rounded-lg overflow-hidden"
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
      </div>
    </section>
  );
};

export default BenefitsSection;
