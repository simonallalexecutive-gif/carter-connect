import { motion } from 'motion/react';
import { Shield, Eye, Search, Lock, Bell, Building2, User, ArrowRight, CalendarCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cabinetPoints = [
  {
    num: '01',
    title: 'Déposez votre recherche en toute confidentialité',
    text: "Identité protégée, accès à un pool de candidats ultra qualifiés, classés par séniorité et expertise.",
  },
  {
    num: '02',
    title: 'Analysez la dynamique du marché en temps réel',
    text: "Accédez à une lecture consolidée des candidats les plus convoités pour vos départements.",
  },
  {
    num: '03',
    title: 'Actionnez Logan pour un rapprochement ciblé',
    text: "Un consultant vous accompagne pour chaque mise en relation, orchestrée et confidentielle.",
  },
];

const candidatPoints = [
  {
    num: '01',
    title: 'Visibilité sans exposition',
    text: "Votre identité n'est jamais communiquée sans votre accord — seuls séniorité, expertise et positionnement Chambers sont visibles.",
  },
  {
    num: '02',
    title: 'Opportunités exclusives en temps réel',
    text: "Consultez les recherches les plus premiums. Échangez avec un consultant avant tout rapprochement.",
  },
  {
    num: '03',
    title: 'Un contrôle total sur votre carrière',
    text: "Rien ne se fait sans votre consentement explicite. Vous décidez du rythme et des étapes.",
  },
];

const FonctionnementSection = () => {
  const [activeTab, setActiveTab] = useState<'cabinet' | 'candidat'>('cabinet');

  const points = activeTab === 'cabinet' ? cabinetPoints : candidatPoints;
  const badges = activeTab === 'cabinet'
    ? [
        { icon: Shield, label: 'Confidentialité' },
        { icon: Search, label: 'Pool qualifié' },
        { icon: Eye, label: 'Vision marché' },
      ]
    : [
        { icon: Lock, label: 'Anonymat garanti' },
        { icon: Bell, label: 'Alertes ciblées' },
        { icon: Shield, label: 'Contrôle total' },
      ];

  return (
    <section className="relative overflow-hidden py-20 md:py-36" style={{ background: '#111111' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-10">

        {/* Header */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-14 md:mb-20"
        >
          <motion.p variants={fadeUp} className="text-[11px] font-sans font-medium tracking-[0.25em] uppercase text-white/30 mb-5">
            Notre fonctionnement
          </motion.p>
          <motion.h2 variants={fadeUp} className="font-serif text-3xl sm:text-4xl md:text-[3rem] leading-[1.15] text-white mb-5">
            Deux perspectives, une même exigence
          </motion.h2>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center mb-14 md:mb-20">
          <div className="inline-flex rounded-sm overflow-hidden border border-white/[0.12]">
            <button
              onClick={() => setActiveTab('cabinet')}
              className={cn(
                "flex items-center gap-2.5 px-8 py-3.5 text-sm font-sans font-medium tracking-wide transition-all duration-300",
                activeTab === 'cabinet'
                  ? "bg-white text-black"
                  : "bg-transparent text-white/50 hover:text-white/80"
              )}
            >
              <Building2 className="w-4 h-4" strokeWidth={1.5} />
              Cabinets
            </button>
            <button
              onClick={() => setActiveTab('candidat')}
              className={cn(
                "flex items-center gap-2.5 px-8 py-3.5 text-sm font-sans font-medium tracking-wide transition-all duration-300",
                activeTab === 'candidat'
                  ? "bg-white text-black"
                  : "bg-transparent text-white/50 hover:text-white/80"
              )}
            >
              <User className="w-4 h-4" strokeWidth={1.5} />
              Candidats
            </button>
          </div>
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto"
        >
          <div className="space-y-10">
            {points.map((point) => (
              <div key={point.num} className="flex gap-6">
                <span className="font-serif text-3xl text-white/[0.1] font-medium select-none flex-shrink-0 w-10 text-right">{point.num}</span>
                <div>
                  <h4 className="font-sans text-base font-semibold text-white tracking-[-0.01em] mb-2">{point.title}</h4>
                  <p className="font-sans text-[0.92rem] leading-[1.8] text-white/45">{point.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-3 mt-12 justify-center">
            {badges.map(({ icon: Icon, label }) => (
              <span key={label} className="inline-flex items-center gap-2 text-xs font-sans text-white/30 border border-white/[0.08] rounded-sm px-3 py-1.5">
                <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
                {label}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div className="flex justify-center mt-10">
            {activeTab === 'cabinet' ? (
              <Link to="/notre-offre">
                <Button
                  variant="outline"
                  size="sm"
                  className="font-sans text-xs font-medium tracking-wide rounded-sm border-white/20 text-white hover:bg-white hover:text-black transition-colors"
                >
                  Découvrir notre offre
                  <ArrowRight className="w-3.5 h-3.5 ml-2" strokeWidth={1.5} />
                </Button>
              </Link>
            ) : (
              <Link to="/prendre-rdv">
                <Button
                  variant="outline"
                  size="sm"
                  className="font-sans text-xs font-medium tracking-wide rounded-sm border-white/20 text-white hover:bg-white hover:text-black transition-colors"
                >
                  Prendre rendez-vous
                  <CalendarCheck className="w-3.5 h-3.5 ml-2" strokeWidth={1.5} />
                </Button>
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FonctionnementSection;
