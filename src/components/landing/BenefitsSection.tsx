import { motion } from 'framer-motion';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { User, Building2, Eye, Bell, Handshake } from 'lucide-react';

type Tab = 'candidat' | 'cabinet';

const candidatBenefits = [
  {
    number: '01',
    icon: Eye,
    title: 'Restez connecté à votre marché',
    desc: 'Rendez-vous attractif aux yeux des cabinets tout en préservant votre identité et celle de votre cabinet. Un cabinet pourra manifester son intérêt pour votre profil sur la base de trois éléments : votre expertise, votre séniorité, votre projet.',
  },
  {
    number: '02',
    icon: Bell,
    title: 'Gardez le contrôle de vos démarches',
    desc: 'Si un cabinet manifeste son intérêt pour votre profil, vous recevrez une notification de Logan afin que vous puissiez prendre connaissance de l\'opportunité. Le nom du cabinet est à ce stade confidentiel mais vous aurez accès à sa nationalité, son ranking, et les grandes lignes de sa recherche.',
  },
  {
    number: '03',
    icon: Handshake,
    title: 'Bénéficiez d\'un accompagnement sur mesure',
    desc: 'Alertez Logan si l\'opportunité reçue vous paraît pertinente afin qu\'un consultant se rapproche de vous pour vous en parler et s\'assurer de la pertinence de votre projet avec celle d\'une rencontre.',
  },
];

const cabinetBenefits = [
  {
    number: '01',
    icon: Eye,
    title: 'Visualisez les profils en un clin d\'œil',
    desc: 'Accédez aux profils à l\'écoute du marché dans votre spécialité. Expertise, séniorité, projet : l\'essentiel est là. Manifestez — ou non — votre intérêt en toute discrétion.',
  },
  {
    number: '02',
    icon: Bell,
    title: 'Logan orchestre chaque étape',
    desc: 'Dès qu\'un profil retient votre attention, Logan prend le relais : validation de la pertinence, mise en relation, gestion intégrale du processus jusqu\'à l\'aboutissement.',
  },
  {
    number: '03',
    icon: Handshake,
    title: 'Économique, efficace, confidentiel',
    desc: 'Un abonnement annuel, un vivier premium toute l\'année pour tous vos départements. Pas de commission au placement, pas de surprise.',
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
            <em className="text-muted-foreground font-normal">Logan</em>
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
          className="space-y-0"
        >
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className={cn(
                'group flex items-start gap-8 md:gap-12 p-8 md:p-12 transition-colors duration-500 hover:bg-secondary/60',
                i < benefits.length - 1 && 'border-b border-border'
              )}
            >
              {/* Number + Icon */}
              <div className="flex-shrink-0 flex flex-col items-center gap-4 pt-1">
                <span className="text-xs font-sans font-medium text-muted-foreground tracking-[0.15em]">{b.number}</span>
                <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover:border-foreground/30 transition-colors duration-500">
                  <b.icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors duration-500" />
                </div>
              </div>
              {/* Content */}
              <div className="flex-1">
                <h3 className="font-serif text-xl md:text-2xl text-foreground mb-3 font-normal">{b.title}</h3>
                <p className="font-sans text-sm text-muted-foreground font-light leading-relaxed max-w-2xl">{b.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BenefitsSection;
