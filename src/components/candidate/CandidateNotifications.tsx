import { Bell, Star, Building2, ArrowRight } from 'lucide-react';

const MOCK_NOTIFICATIONS = [
  {
    id: 'NOTIF-001',
    type: 'interest' as const,
    message: 'Un cabinet Tier 1 en M&A 🇬🇧 a manifesté un intérêt pour votre profil.',
    detail: 'Votre consultant Logan vous contactera sous 48h pour discuter de cette opportunité.',
    date: '2026-03-12',
    read: false,
  },
  {
    id: 'NOTIF-002',
    type: 'interest' as const,
    message: 'Un cabinet Tier 1 en Fiscal 🇺🇸 souhaite en savoir plus sur votre parcours.',
    detail: 'Souhaitez-vous que votre consultant organise un échange confidentiel ?',
    date: '2026-03-11',
    read: false,
  },
  {
    id: 'NOTIF-003',
    type: 'update' as const,
    message: 'Votre profil a été validé par l\'équipe Logan.',
    detail: 'Vous êtes désormais visible auprès de notre réseau de cabinets partenaires.',
    date: '2026-03-09',
    read: true,
  },
];

const CandidateNotifications = () => (
  <div>
    <div className="mb-8">
      <p className="text-[10px] font-sans font-medium tracking-[0.2em] uppercase text-muted-foreground mb-2">Notifications</p>
      <div className="w-8 h-px bg-foreground" />
    </div>

    {MOCK_NOTIFICATIONS.length === 0 ? (
      <div className="text-center py-16">
        <Bell className="w-8 h-8 text-muted-foreground/30 mx-auto mb-4" />
        <p className="text-sm text-muted-foreground">Aucune notification.</p>
      </div>
    ) : (
      <div className="space-y-3">
        {MOCK_NOTIFICATIONS.map((notif) => (
          <div
            key={notif.id}
            className={`border rounded-lg p-5 transition-all duration-300 ${
              notif.read
                ? 'border-border bg-background'
                : 'border-foreground/20 bg-secondary/50 shadow-[var(--shadow-card)]'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                notif.type === 'interest' ? 'bg-foreground text-background' : 'bg-secondary text-muted-foreground'
              }`}>
                {notif.type === 'interest' ? <Star className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-4 mb-1">
                  <p className={`text-sm font-medium ${notif.read ? 'text-foreground/80' : 'text-foreground'}`}>{notif.message}</p>
                  {!notif.read && <span className="w-2 h-2 rounded-full bg-foreground shrink-0" />}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-2">{notif.detail}</p>
                <span className="text-[10px] text-muted-foreground">{new Date(notif.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default CandidateNotifications;
