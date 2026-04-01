import { Briefcase, Send, Clock, Bell } from 'lucide-react';

interface Props {
  onNavigate: (tab: string) => void;
  notifCount: number;
}

const CARDS = [
  {
    key: 'offres',
    label: 'Opportunités',
    icon: Briefcase,
    desc: 'Consultez les opportunités disponibles correspondant à votre profil.',
    stat: '4 opportunités',
  },
  {
    key: 'demandes',
    label: 'Demandes',
    icon: Send,
    desc: 'Suivez vos demandes envoyées et leur avancement.',
    stat: '2 en attente',
  },
  {
    key: 'processus',
    label: 'Processus',
    icon: Clock,
    desc: 'Visualisez l\'état d\'avancement de vos processus de recrutement.',
    stat: '2 en cours',
  },
  {
    key: 'notifications',
    label: 'Notifications',
    icon: Bell,
    desc: 'Retrouvez toutes les alertes et mises à jour de votre espace.',
    stat: '',
  },
];

const CandidateDashboardOverview = ({ onNavigate, notifCount }: Props) => (
  <div>
    <div className="mb-8">
      <p className="text-[10px] font-sans font-medium tracking-[0.2em] uppercase text-muted-foreground mb-2">Tableau de bord</p>
      <div className="w-8 h-px bg-foreground" />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {CARDS.map((card) => (
        <button
          key={card.key}
          onClick={() => onNavigate(card.key)}
          className="group relative text-left rounded-lg p-5 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5 border border-black/[0.08]"
          style={{ background: 'hsl(40, 20%, 95%)' }}
        >
          <card.icon className="w-5 h-5 text-black/60 mb-3" />
          <div className="font-sans text-[11px] font-bold text-black/90 tracking-wide mb-1">{card.label}</div>
          <p className="font-sans text-[11px] text-black/55 leading-relaxed mb-3">{card.desc}</p>
          <div className="flex items-center justify-between">
            {card.stat && (
              <span className="font-sans text-[10px] font-bold text-black/70 border border-black/20 rounded px-2 py-0.5">{card.stat}</span>
            )}
            {card.key === 'notifications' && notifCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-black text-white text-[9px] font-bold flex items-center justify-center">
                {notifCount}
              </span>
            )}
          </div>
        </button>
      ))}
    </div>
  </div>
);

export default CandidateDashboardOverview;
