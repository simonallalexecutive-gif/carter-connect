import { useState } from 'react';
import { Briefcase, Send, Clock, Bell, ArrowRight } from 'lucide-react';
import CandidateOffers from '@/components/candidate/CandidateOffers';
import CandidateProcesses from '@/components/candidate/CandidateProcesses';
import CandidateRequests from '@/components/candidate/CandidateRequests';
import CandidateNotifications from '@/components/candidate/CandidateNotifications';

type View = 'home' | 'offres' | 'demandes' | 'processus' | 'notifications';

const CARDS: { key: Exclude<View, 'home'>; label: string; desc: string; icon: typeof Briefcase; cta: string }[] = [
  {
    key: 'offres',
    label: 'Opportunités',
    desc: 'Découvrez les opportunités sélectionnées pour votre profil par nos consultants.',
    icon: Briefcase,
    cta: 'Consulter les opportunités',
  },
  {
    key: 'demandes',
    label: 'Demandes',
    desc: 'Suivez les marques d\'intérêt et demandes adressées à votre consultant Logan.',
    icon: Send,
    cta: 'Voir mes demandes',
  },
  {
    key: 'processus',
    label: 'Processus en cours',
    desc: 'Visualisez l\'avancement de vos candidatures et entretiens en cours.',
    icon: Clock,
    cta: 'Voir mes processus',
  },
  {
    key: 'notifications',
    label: 'Notifications',
    desc: 'Retrouvez les dernières actualités et marques d\'intérêt sur votre profil.',
    icon: Bell,
    cta: 'Voir mes notifications',
  },
];

const CandidateDashboardOverview = () => {
  const [view, setView] = useState<View>('home');

  if (view !== 'home') {
    return (
      <div>
        <button
          onClick={() => setView('home')}
          className="text-xs text-muted-foreground hover:text-foreground mb-6 flex items-center gap-1"
        >
          ← Retour au tableau de bord
        </button>
        {view === 'offres' && <CandidateOffers />}
        {view === 'demandes' && <CandidateRequests />}
        {view === 'processus' && <CandidateProcesses />}
        {view === 'notifications' && <CandidateNotifications />}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-[10px] font-sans font-medium tracking-[0.2em] uppercase text-muted-foreground mb-2">Tableau de bord</p>
        <div className="w-8 h-px bg-foreground" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CARDS.map((card) => (
          <button
            key={card.key}
            onClick={() => setView(card.key)}
            className="group relative text-left rounded-lg border-2 border-border p-6 transition-all hover:border-foreground hover:shadow-lg bg-background flex flex-col"
          >
            <card.icon className="w-5 h-5 text-foreground mb-3" />
            <div className="font-sans text-[11px] font-bold text-foreground tracking-wide mb-1">{card.label}</div>
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-4 flex-1">{card.desc}</p>
            <div className="flex items-center gap-2 text-[10px] font-semibold text-foreground mt-auto">
              <ArrowRight className="w-3.5 h-3.5" />
              {card.cta}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CandidateDashboardOverview;
