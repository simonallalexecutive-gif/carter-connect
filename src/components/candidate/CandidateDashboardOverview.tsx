import { useState } from 'react';
import { Briefcase, Send, Clock, Bell } from 'lucide-react';
import CandidateOffers from '@/components/candidate/CandidateOffers';
import CandidateProcesses from '@/components/candidate/CandidateProcesses';
import CandidateRequests from '@/components/candidate/CandidateRequests';
import CandidateNotifications from '@/components/candidate/CandidateNotifications';

type View = 'home' | 'offres' | 'demandes' | 'processus' | 'notifications';

const CARDS: {
  key: Exclude<View, 'home'>;
  label: string;
  subtitle: string;
  bullets: string[];
  cta: string;
  icon: typeof Briefcase;
  stat?: string;
}[] = [
  {
    key: 'offres',
    label: 'Opportunités',
    subtitle: 'Accès personnalisé',
    bullets: [
      'Opportunités sélectionnées pour votre profil',
      'Présentées en toute confidentialité',
      'Qualification par nos consultants',
    ],
    cta: 'CONSULTER →',
    icon: Briefcase,
  },
  {
    key: 'demandes',
    label: 'Mes demandes',
    subtitle: 'Suivi en temps réel',
    bullets: [
      'Marques d\'intérêt envoyées à votre consultant',
      'Positions que vous avez transmises',
      'Historique de vos échanges',
    ],
    cta: 'ACCÉDER →',
    icon: Send,
  },
  {
    key: 'processus',
    label: 'Processus en cours',
    subtitle: 'Avancement candidatures',
    bullets: [
      'Suivi des entretiens en cours',
      'Étapes franchies et prochaines actions',
      'Retours consultants en temps réel',
    ],
    cta: 'SUIVRE →',
    icon: Clock,
  },
  {
    key: 'notifications',
    label: 'Notifications',
    subtitle: 'Alertes & actualités',
    bullets: [
      'Nouvelles marques d\'intérêt sur votre profil',
      'Mises à jour de vos processus',
      'Messages de l\'équipe Logan',
    ],
    cta: 'VOIR →',
    icon: Bell,
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
        <p className="text-[10px] font-sans font-medium tracking-[0.2em] uppercase text-muted-foreground mb-2">
          Tableau de bord
        </p>
        <div className="w-8 h-px bg-foreground" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CARDS.map((card) => (
          <button
            key={card.key}
            onClick={() => setView(card.key)}
            className="group text-left rounded-lg overflow-hidden flex flex-col border border-border hover:border-foreground/20 transition-all hover:shadow-lg"
          >
            {/* Header sombre */}
            <div className="bg-[hsl(0,0%,10%)] px-6 pt-5 pb-4">
              <card.icon className="w-4 h-4 text-white/40 mb-3" />
              <p className="font-serif text-[17px] text-white font-light leading-tight mb-0.5">
                {card.label}
              </p>
              <p className="text-[9px] font-sans font-semibold tracking-[0.18em] uppercase text-white/35">
                {card.subtitle}
              </p>
            </div>

            {/* Corps blanc */}
            <div className="bg-background px-6 py-5 flex-1">
              <ul className="space-y-1.5">
                {card.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-[11px] text-muted-foreground font-sans leading-snug">
                    <span className="mt-[5px] w-1 h-1 rounded-full bg-foreground/25 flex-shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer sombre */}
            <div className="bg-[hsl(0,0%,10%)] px-6 py-3 flex items-center justify-end">
              <span className="text-[10px] font-sans font-bold tracking-[0.14em] text-white/70 group-hover:text-white transition-colors">
                {card.cta}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CandidateDashboardOverview;
