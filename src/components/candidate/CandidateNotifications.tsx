import { useState } from 'react';
import { Bell, Star, ArrowRight, MessageCircle, CheckCircle2, Calendar } from 'lucide-react';
import { CANDIDATE_OFFERS } from '@/lib/candidateMockData';
import { shortSeniority, formatOfferDate } from './CandidateOffers';
import { toast } from 'sonner';

const INITIAL_NOTIFICATIONS = [
  {
    id: 'NOTIF-001',
    type: 'interest' as const,
    message: 'Un cabinet a manifesté un intérêt pour votre profil.',
    detail: 'Votre consultant Logan vous contactera sous 48h pour discuter de cette opportunité.',
    date: '2026-03-12',
    read: false,
    offerId: 'OFF-C-001',
  },
  {
    id: 'NOTIF-002',
    type: 'interest' as const,
    message: 'Un cabinet souhaite en savoir plus sur votre parcours.',
    detail: 'Souhaitez-vous que votre consultant organise un échange confidentiel ?',
    date: '2026-03-11',
    read: false,
    offerId: 'OFF-C-004',
  },
  {
    id: 'NOTIF-003',
    type: 'update' as const,
    message: 'Votre profil a été validé par l\'équipe Logan.',
    detail: 'Vous êtes désormais visible auprès de notre réseau de cabinets partenaires.',
    date: '2026-03-09',
    read: true,
    offerId: null,
  },
];

const CandidateNotifications = () => {
  const [expandedNotif, setExpandedNotif] = useState<string | null>(null);
  const [confirmedExchanges, setConfirmedExchanges] = useState<Set<string>>(new Set());

  const handleConfirmExchange = (notifId: string) => {
    setConfirmedExchanges((prev) => new Set(prev).add(notifId));
    toast.success('Votre souhait d\'échanger a été transmis à votre consultant Logan.', { duration: 5000 });
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-[10px] font-serif font-medium tracking-[0.2em] uppercase text-muted-foreground mb-2">Notifications</p>
        <div className="w-8 h-px bg-foreground" />
      </div>

      {INITIAL_NOTIFICATIONS.length === 0 ? (
        <div className="text-center py-16">
          <Bell className="w-8 h-8 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-sm font-serif text-muted-foreground">Aucune notification.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {INITIAL_NOTIFICATIONS.map((notif) => {
            const offer = notif.offerId ? CANDIDATE_OFFERS.find((o) => o.id === notif.offerId) : null;
            const isExpanded = expandedNotif === notif.id;
            const isConfirmed = confirmedExchanges.has(notif.id);

            return (
              <div
                key={notif.id}
                className="rounded-lg overflow-hidden transition-all duration-300"
                style={{ background: 'hsl(220 40% 13%)' }}
              >
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      notif.type === 'interest' ? 'bg-white/20 text-white' : 'bg-white/10 text-white/60'
                    }`}>
                      {notif.type === 'interest' ? <Star className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-4 mb-1">
                        <p className={`text-[13px] font-serif ${notif.read ? 'text-white/70' : 'text-white'}`}>
                          {notif.type === 'interest' && offer && (
                            <span className="text-base mr-1.5">{offer.natFlag}</span>
                          )}
                          {notif.message}
                        </p>
                        {!notif.read && <span className="w-2 h-2 rounded-full bg-white shrink-0" />}
                      </div>
                      <p className="text-[11px] font-serif text-white/50 leading-relaxed mb-2">{notif.detail}</p>

                      {notif.type === 'interest' && offer && offer.ranking && (
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-flex items-center gap-2 text-[12px] font-serif text-white bg-white/10 border border-white/10 rounded-full px-3 py-1">
                            <span className="text-base leading-none">{offer.natFlag}</span>
                            <span className="font-semibold">{offer.ranking}</span>
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-serif text-white/40">{new Date(notif.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}</span>
                        {notif.type === 'interest' && offer && (
                          <button
                            onClick={() => setExpandedNotif(isExpanded ? null : notif.id)}
                            className="inline-flex items-center gap-1 text-[10px] font-serif font-medium text-white hover:text-white/70 transition-colors underline underline-offset-2"
                          >
                            {isExpanded ? 'Masquer l\'offre' : 'Consulter l\'offre'}
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded offer preview — navy bg */}
                {isExpanded && offer && (
                  <div className="border-t border-white/10 p-5 rounded-b-lg" style={{ background: 'hsl(220 40% 13%)' }}>
                    <div className="mb-4">
                      <div className="flex items-center gap-0 mb-1.5 flex-wrap">
                        <span className="text-[16px] font-serif tracking-[-0.01em] text-white leading-none">{shortSeniority(offer.seniority)}</span>
                        <span className="mx-2.5 w-px h-5 bg-white/20 inline-block" />
                        <span className="text-[16px] font-serif tracking-[-0.01em] text-white leading-none">{offer.dept}</span>
                        {offer.ranking && (
                          <>
                            <span className="mx-2.5 w-px h-5 bg-white/20 inline-block" />
                            <span className="inline-flex items-center gap-2 text-[14px] font-serif text-white">
                              <span className="text-lg leading-none">{offer.natFlag}</span>
                              <span className="font-semibold">{offer.ranking}</span>
                            </span>
                          </>
                        )}
                      </div>
                      <p className="text-[12px] font-serif text-white/60 leading-relaxed mt-3">{offer.description}</p>
                      {offer.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {offer.tags.map((tag) => (
                            <span key={tag} className="text-[10px] font-serif px-2.5 py-1 rounded-full border border-white/10 text-white/60">{tag}</span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-1.5 text-[11px] text-white/50 font-serif">
                          <Calendar className="w-3 h-3" />
                          <span>Date de publication : {formatOfferDate(offer.postedAt)}</span>
                        </div>
                        <div className="text-[9px] tracking-[0.15em] uppercase text-white/40 font-serif">{offer.reference}</div>
                      </div>
                    </div>

                    {isConfirmed ? (
                      <div className="flex items-center gap-2 text-[13px] font-serif text-white/60 bg-white/10 rounded-lg px-4 py-3">
                        <CheckCircle2 className="w-4 h-4" />
                        Demande d'échange transmise à votre consultant Logan.
                      </div>
                    ) : (
                      <button
                        onClick={() => handleConfirmExchange(notif.id)}
                        className="w-full flex items-center justify-center gap-2 bg-white text-black py-3 rounded-lg text-[13px] font-serif font-semibold hover:bg-white/90 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Échanger avec un consultant sur cette opportunité
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CandidateNotifications;
