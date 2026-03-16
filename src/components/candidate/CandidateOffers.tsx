import { useState } from 'react';
import { CANDIDATE_OFFERS, type CandidateOffer } from '@/lib/candidateMockData';
import { Calendar, CheckCircle2, ChevronDown, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import ActivityPieChart from '@/components/shared/ActivityPieChart';
import { useRegistrationStore } from '@/stores/registrationStore';
import { usePQE } from '@/hooks/usePQE';

export const formatOfferDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

/** Extracts a short seniority label like "Collaborateur Senior" from full seniority string */
export const shortSeniority = (s: string) => s.replace(/\s*\(.*\)/, '');

const CandidateOffers = () => {
  const [interestedOffers, setInterestedOffers] = useState<Set<string>>(new Set());
  const [expandedOffer, setExpandedOffer] = useState<string | null>(null);
  const { activites, sermentMois, sermentAnnee } = useRegistrationStore();
  const seniorityInfo = usePQE(sermentMois, sermentAnnee);

  const parsePQERange = (seniority: string): [number, number] | null => {
    const match = seniority.match(/\((\d+)-(\d+)\s*PQE\)/);
    if (match) return [parseInt(match[1]), parseInt(match[2])];
    return null;
  };

  const filteredOffers = (() => {
    const candidateExpertises = Object.entries(activites)
      .filter(([, active]) => active)
      .map(([name]) => name.toLowerCase());
    const hasProfile = seniorityInfo || candidateExpertises.length > 0;
    if (!hasProfile) return CANDIDATE_OFFERS;
    const matched = CANDIDATE_OFFERS.filter((offer) => {
      if (seniorityInfo) {
        const range = parsePQERange(offer.seniority);
        if (range && (seniorityInfo.years < range[0] - 2 || seniorityInfo.years > range[1] + 2)) return false;
      }
      if (candidateExpertises.length > 0) {
        const offerExpertises = new Set<string>();
        offerExpertises.add(offer.dept.toLowerCase());
        if (offer.activitySplit) Object.keys(offer.activitySplit).forEach((k) => offerExpertises.add(k.toLowerCase()));
        if (!candidateExpertises.some((e) => offerExpertises.has(e))) return false;
      }
      return true;
    });
    return matched.length > 0 ? matched : CANDIDATE_OFFERS;
  })();

  const handleInterest = (offer: CandidateOffer) => {
    if (interestedOffers.has(offer.id)) return;
    setInterestedOffers((prev) => new Set(prev).add(offer.id));
    toast.success(`Votre intérêt pour l'opportunité ${offer.reference} a été transmis à Logan.`, { duration: 5000 });
  };

  return (
    <div>
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="text-[10px] font-sans font-medium tracking-[0.2em] uppercase text-muted-foreground mb-2">Opportunités disponibles</p>
          <div className="w-8 h-px bg-foreground" />
        </div>
        <span className="text-xs text-muted-foreground font-sans">{filteredOffers.length} offre{filteredOffers.length > 1 ? 's' : ''}</span>
      </div>

      <div className="space-y-5">
        <AnimatePresence mode="popLayout">
          {filteredOffers.map((offer, index) => {
            const isInterested = interestedOffers.has(offer.id);
            const isExpanded = expandedOffer === offer.id;
            const hasMultipleExpertises = offer.activitySplit && Object.keys(offer.activitySplit).length >= 2;
            const isHidden = expandedOffer !== null && !isExpanded;
            if (isHidden) return null;

            return (
              <motion.div
                key={offer.id}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12, transition: { duration: 0.25 } }}
                transition={{ delay: expandedOffer ? 0 : index * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-lg overflow-hidden transition-shadow duration-500 hover:shadow-lg border border-border"
                style={{ background: 'hsl(0 0% 96%)' }}
              >
                <button type="button" className="w-full text-left p-6 md:p-8" onClick={() => setExpandedOffer(isExpanded ? null : offer.id)}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-0 mb-3 flex-wrap">
                        <span className="text-[16px] font-sans tracking-[-0.01em] text-foreground leading-none">{shortSeniority(offer.seniority)}</span>
                        <span className="mx-2.5 w-px h-5 bg-border inline-block" />
                        <span className="text-[16px] font-sans tracking-[-0.01em] text-foreground leading-none">{offer.dept}</span>
                        {offer.ranking && (
                          <>
                            <span className="mx-2.5 w-px h-5 bg-border inline-block" />
                            <span className="inline-flex items-center gap-2 text-[14px] font-sans text-foreground">
                              <span className="text-xs font-bold leading-none">{offer.natFlag}</span>
                              <span className="font-semibold">{offer.ranking}</span>
                            </span>
                          </>
                        )}
                        {isInterested && (
                          <span className="ml-3 inline-flex items-center gap-1 text-[10px] text-muted-foreground font-sans">
                            <CheckCircle2 className="w-3.5 h-3.5" />Intérêt transmis
                          </span>
                        )}
                      </div>

                      {!isExpanded && offer.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {offer.tags.slice(0, 4).map((tag) => (
                            <span key={tag} className="text-[10px] px-2.5 py-1 rounded-full border border-border text-muted-foreground font-sans">{tag}</span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-sans">
                          <Calendar className="w-3 h-3" />
                          <span>Date de publication : {formatOfferDate(offer.postedAt)}</span>
                        </div>
                        <div className="text-[9px] tracking-[0.15em] uppercase text-muted-foreground/60 font-sans">{offer.reference}</div>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-secondary shrink-0 mt-1">
                      <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden">
                      <div className="border-t border-border" style={{ background: 'hsl(0 0% 96%)' }}>
                        <div className="p-6 md:p-8">
                          <div className="mb-6 pb-5 border-b border-border">
                            <div className="text-[8px] tracking-[0.16em] uppercase text-muted-foreground font-sans mb-2">Opportunité · Présentée par LOGAN</div>
                            <div className="flex items-center gap-0 mb-1 flex-wrap">
                              <span className="font-sans text-[15px] tracking-[-0.01em] text-foreground">{shortSeniority(offer.seniority)}</span>
                              <span className="mx-2 w-px h-4 bg-border inline-block" />
                              <span className="font-sans text-[15px] tracking-[-0.01em] text-foreground">{offer.dept}</span>
                              {offer.ranking && (
                                <>
                                  <span className="mx-2 w-px h-4 bg-border inline-block" />
                                  <span className="inline-flex items-center gap-2 text-[13px] font-sans text-foreground">
                                    <span className="text-xs font-bold leading-none">{offer.natFlag}</span>
                                    <span className="font-semibold">{offer.ranking}</span>
                                  </span>
                                </>
                              )}
                            </div>
                            <div className="text-[11px] font-sans text-muted-foreground">Cabinet anonyme · Identité protégée</div>
                            <div className="flex flex-wrap gap-1.5 mt-4">
                              {offer.tags.map((tag) => (
                                <span key={tag} className="text-[10px] px-3 py-1.5 rounded-full bg-secondary text-foreground/70 font-medium">{tag}</span>
                              ))}
                            </div>
                          </div>

                          {hasMultipleExpertises && offer.activitySplit && (
                            <div className="mb-6 pb-5 border-b border-border">
                              <div className="text-[8px] font-bold tracking-[0.14em] uppercase text-muted-foreground mb-4">Répartition de l'activité</div>
                              <div className="flex items-start gap-6">
                                <ActivityPieChart data={offer.activitySplit} size={120} innerRadius={28} outerRadius={52} showLegend={false} />
                                <div className="flex-1 space-y-2.5">
                                  {Object.entries(offer.activitySplit).map(([name, value]) => (
                                    <div key={name}>
                                      <div className="flex justify-between items-center mb-0.5">
                                        <span className="text-xs font-medium text-foreground">{name}</span>
                                        <span className="text-xs font-bold text-foreground">{value}%</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="mb-6 pb-5 border-b border-border">
                            <div className="text-[8px] font-bold tracking-[0.14em] uppercase text-muted-foreground mb-3">Description du poste</div>
                            <p className="text-sm text-muted-foreground leading-relaxed">{offer.description}</p>
                          </div>

                          {(offer.contexte || offer.equipe) && (
                            <div className="mb-6 pb-5 border-b border-border">
                              <div className="text-[8px] font-bold tracking-[0.14em] uppercase text-muted-foreground mb-3">Contexte & équipe</div>
                              <div className="grid grid-cols-2 gap-4">
                                {offer.contexte && (<div><div className="text-[8px] uppercase tracking-[0.1em] text-muted-foreground mb-1">Contexte</div><div className="text-sm font-semibold text-foreground">{offer.contexte}</div></div>)}
                                {offer.equipe && (<div><div className="text-[8px] uppercase tracking-[0.1em] text-muted-foreground mb-1">Composition</div><div className="text-sm font-semibold text-foreground">{offer.equipe}</div></div>)}
                              </div>
                            </div>
                          )}

                          {offer.profilCriteres && offer.profilCriteres.length > 0 && (
                            <div className="mb-6 pb-5 border-b border-border">
                              <div className="text-[8px] font-bold tracking-[0.14em] uppercase text-muted-foreground mb-3">Profil idéal</div>
                              <div className="flex flex-wrap gap-1.5">
                                {offer.profilCriteres.map((c) => (
                                  <span key={c} className="text-[10px] bg-secondary border border-border rounded-full px-3 py-1.5 text-foreground font-medium">{c}</span>
                                ))}
                              </div>
                            </div>
                          )}

                          {(offer.retroStr || offer.heures || offer.tt) && (
                            <div className="mb-6 pb-5 border-b border-border">
                              <div className="text-[8px] font-bold tracking-[0.14em] uppercase text-muted-foreground mb-3">Rémunération & conditions</div>
                              <div className="grid grid-cols-3 gap-3">
                                <div className="bg-secondary rounded-lg p-4 text-center">
                                  <div className="text-[8px] uppercase tracking-[0.1em] text-muted-foreground mb-2">Rétrocession</div>
                                  <div className="font-sans text-base font-bold text-foreground">{offer.retroStr || 'Confidentiel'}</div>
                                </div>
                                <div className="bg-secondary rounded-lg p-4 text-center">
                                  <div className="text-[8px] uppercase tracking-[0.1em] text-muted-foreground mb-2">Heures / an</div>
                                  <div className="font-sans text-base font-bold text-foreground">{offer.heures || 'Non communiqué'}</div>
                                </div>
                                <div className="bg-secondary rounded-lg p-4 text-center">
                                  <div className="text-[8px] uppercase tracking-[0.1em] text-muted-foreground mb-2">Télétravail</div>
                                  <div className="font-serif text-base font-bold text-foreground">{offer.tt || '—'}</div>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="text-center pt-2">
                            <p className="text-[10px] text-muted-foreground mb-4 leading-relaxed">
                              LOGAN qualifie l'opportunité des deux côtés avant toute mise en relation. Votre identité reste confidentielle jusqu'à accord mutuel.
                            </p>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleInterest(offer); }}
                              disabled={isInterested}
                              className={`w-full py-3.5 font-bold text-sm rounded-lg transition-all duration-300 ${isInterested ? 'bg-secondary text-muted-foreground cursor-default' : 'bg-foreground text-background hover:bg-foreground/90'}`}
                            >
                              {isInterested ? (
                                <span className="flex items-center justify-center gap-2"><CheckCircle2 className="w-4 h-4" />Intérêt transmis à Logan</span>
                              ) : 'Je suis intéressé(e) par cette opportunité →'}
                            </button>
                            <div className="mt-2 text-[10px] text-muted-foreground">0% commission · Levée de rideau conditionnée à votre accord</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CandidateOffers;
