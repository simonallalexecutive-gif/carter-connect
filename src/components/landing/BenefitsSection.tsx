import { motion } from 'motion/react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { User, Building2, ArrowRight, Lock, Crosshair, HeartHandshake, ScanSearch, Users, GitMerge } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

type Tab = 'candidat' | 'cabinet';

const candidatBenefits = [
  {
    number: '01',
    icon: Lock,
    title: 'Confidentialité absolue',
    desc: 'Votre identité et celle de votre cabinet restent protégées à chaque étape. Aucune information n\'est partagée sans votre accord explicite. Soyez visible sur la base de trois éléments : expertise, séniorité, projet.',
  },
  {
    number: '02',
    icon: ScanSearch,
    title: 'Un accès privilégié et constant à votre marché',
    desc: 'Restez connecté aux opportunités tout au long de l\'année. Si un cabinet manifeste son intérêt, vous recevez une notification avec sa nationalité, son ranking et les grandes lignes de sa recherche — en toute discrétion.',
  },
  {
    number: '03',
    icon: HeartHandshake,
    title: 'Un accompagnement personnalisé de bout en bout',
    desc: 'Un consultant dédié valide la pertinence de chaque mise en relation et vous accompagne à chaque étape pour garantir des rapprochements stratégiques et ciblés.',
  },
];

const cabinetBenefits = [
  {
    number: '01',
    icon: ScanSearch,
    title: 'Un vivier qualifié et actualisé en continu',
    desc: 'Accédez à un réseau fermé de profils rigoureusement sélectionnés dans votre spécialité. Expertise, séniorité, projet : l\'essentiel est là. Manifestez votre intérêt en toute confidentialité.',
  },
  {
    number: '02',
    icon: Crosshair,
    title: 'Des rapprochements ciblés, orchestrés par Logan',
    desc: 'Dès qu\'un profil retient votre attention, Logan prend le relais : validation de la pertinence, mise en relation, gestion intégrale du processus jusqu\'à l\'aboutissement.',
  },
  {
    number: '03',
    icon: GitMerge,
    title: 'Un modèle économique transparent et efficace',
    desc: 'Un abonnement annuel, un vivier premium toute l\'année pour tous vos départements. Pas de commission au placement, pas de surprise. Confidentialité absolue garantie.',
  },
];

const pillars = [
  { icon: Lock, label: 'Confidentialité' },
  { icon: Crosshair, label: 'Ciblage' },
  { icon: HeartHandshake, label: 'Accompagnement' },
  { icon: Users, label: 'Réseau qualifié' },
  { icon: GitMerge, label: 'Stratégie' },
];

const BenefitsSection = () => {
  const [tab, setTab] = useState<Tab>('candidat');
  const benefits = tab === 'candidat' ? candidatBenefits : cabinetBenefits;

  return (
    <section className="carter-section bg-background">
      <div className="carter-container">
        {/* Header with pillars */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="carter-divider mb-8" />
          <p className="text-xs font-sans font-medium tracking-[0.2em] uppercase text-muted-foreground mb-6">
            Notre plateforme
          </p>

          {/* Engagement pillars as inline chips */}
          <div className="flex flex-wrap gap-3 mb-10">
            {pillars.map((p, i) => (
              <motion.span
                key={p.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-sm text-xs font-sans font-medium text-muted-foreground"
              >
                <p.icon className="w-3.5 h-3.5" />
                {p.label}
              </motion.span>
            ))}
          </div>

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

        {/* Benefits list */}
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
                'group flex items-start justify-between gap-8 md:gap-12 p-8 md:p-12 transition-colors duration-500 hover:bg-secondary/60',
                i < benefits.length - 1 && 'border-b border-border'
              )}
            >
              <div className="flex items-start gap-8 md:gap-12 flex-1">
                <span className="flex-shrink-0 text-xs font-sans font-medium text-muted-foreground tracking-[0.15em] pt-2">{b.number}</span>
                <div className="flex-1">
                  <h3 className="font-serif text-xl md:text-2xl text-foreground mb-3 font-normal">{b.title}</h3>
                  <p className="font-sans text-sm text-muted-foreground font-light leading-relaxed max-w-2xl">{b.desc}</p>
                </div>
              </div>
              <div className="flex-shrink-0 w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover:border-foreground/30 transition-colors duration-500 mt-1">
                <b.icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors duration-500" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Demo CTA */}
        <div className="py-16 text-center">
          <Link to="/demo">
            <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90 font-sans text-sm font-medium px-10 py-6 rounded-sm tracking-wide group transition-all duration-300">
              Comment ça fonctionne concrètement ?
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
