import { useState } from 'react';
import { CANDIDATE_OFFERS, type CandidateOffer } from '@/lib/candidateMockData';
import { Calendar, CheckCircle2, BarChart3, EyeOff, Users, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import ActivityPieChart from '@/components/shared/ActivityPieChart';
import { useRegistrationStore } from '@/stores/registrationStore';
import { usePQE } from '@/hooks/usePQE';

export const formatOfferDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

export const shortSeniority = (s: string) => s.replace(/\s*\(.*\)/, '');

const CandidateOffers = () => {
  const [interestedOffers, setInterestedOffers] = useState<Set<string>>(new Set());
  const [expandedOffer, setExpandedOffer] = useState<string | null>(null);
  const { activites, sermentMois, sermentAnnee } = useRegistrationStore();
  const seniorityInfo = usePQE(sermentMois, sermentAnnee);

  const parseSeniorityRange = (seniority: string): [number, number] | null => {
    const match = seniority.match(/\((\d+)-(\d+)\s*(?:PQE|ans)\)/);
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
        const range = parseSeniorityRange(offer.seniority);
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
                className="rounded-2xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)] border border-white/[0.06] relative bg-foreground text-background"
              >
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />

                {/* Card preview — clickable */}
                <button type="button" className="w-full text-left relative z-10" onClick={() => setExpandedOffer(isExpanded ? null : offer.id)}>
                  <div className="p-6 md:p-7">
                    {/* Header row */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="text-[8px] tracking-[0.2em] uppercase text-background/30 font-medium">Opportunité · Présentée par LOGAN</div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/[0.08] border border-background/[0.06]">
                        <EyeOff className="w-2.5 h-2.5 text-background/40" />
                        <span className="text-[7px] tracking-[0.1em] uppercase text-background/40 font-medium">Confidentiel</span>
                      </div>
                    </div>

                    {/* Seniority & Dept */}
                    <div className="font-serif text-lg font-bold leading-tight mb-0.5">
                      {shortSeniority(offer.seniority)} · {offer.dept}
                    </div>
                    <div className="text-[11px] text-background/45 mb-1">Cabinet anonyme · Identité protégée</div>

                    {/* Ranking badge */}
                    {offer.ranking && (
                      <div className="flex items-center gap-3 mt-4 mb-5 px-4 py-3 rounded-xl bg-background/[0.06] border border-background/[0.08] backdrop-blur-sm">
                        <div className="w-8 h-8 rounded-lg bg-background/[0.08] flex items-center justify-center flex-shrink-0">
                          <BarChart3 className="w-4 h-4 text-background/50" />
                        </div>
                        <div>
                          <div className="text-[11px] font-semibold text-background/80">Cabinet du {offer.ranking.split(' · ')[0]}</div>
                          <div className="text-[9px] text-background/35">Classement {offer.ranking.split(' · ')[1] || offer.dept}</div>
                        </div>
                      </div>
                    )}

                    {/* Key info grid */}
                    <div className="grid grid-cols-2 gap-3">
                      {offer.retroStr && (
                        <div className="px-3 py-2.5 rounded-lg bg-background/[0.05] border border-background/[0.06]">
                          <div className="text-[8px] uppercase text-background/25 tracking-[0.1em] mb-1">Rétrocession</div>
                          <div className="font-serif text-sm font-bold text-background">{offer.retroStr}</div>
                        </div>
                      )}
                      {offer.equipe && (
                        <div className="px-3 py-2.5 rounded-lg bg-background/[0.05] border border-background/[0.06]">
                          <div className="text-[8px] uppercase text-background/25 tracking-[0.1em] mb-1">Équipe</div>
                          <div className="font-serif text-sm font-bold text-background">{offer.equipe.replace(/\(s\)/g, '')}</div>
                        </div>
                      )}
                    </div>

                    {/* Context footer */}
                    {offer.contexte && (
                      <div className="pt-4 mt-5 border-t border-background/[0.08] flex items-center justify-between">
                        <span className="text-[9px] text-background/30 uppercase tracking-[0.12em] font-medium">Contexte</span>
                        <span className="text-[11px] font-semibold text-background/70">{offer.contexte}</span>
                      </div>
                    )}

                    {/* Interest badge + reference */}
                    <div className="flex items-center justify-between mt-4">
                      {isInterested ? (
                        <span className="inline-flex items-center gap-1.5 text-[10px] text-background/50 font-sans">
                          <CheckCircle2 className="w-3.5 h-3.5" />Intérêt transmis
                        </span>
                      ) : (
                        <span className="text-[10px] text-background/30 font-sans">Cliquez pour consulter le détail →</span>
                      )}
                      <div className="text-[9px] tracking-[0.15em] uppercase text-background/20 font-sans">{offer.reference}</div>
                    </div>
                  </div>
                </button>

                {/* Expanded detail */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden relative z-10">
                      <div className="border-t border-background/[0.08]">
                        {/* Detail content on slightly lighter dark bg */}
                        <div className="p-6 md:p-8 bg-background/[0.03]">

                          {hasMultipleExpertises && offer.activitySplit && (
                            <div className="mb-6 pb-5 border-b border-background/[0.08]">
                              <div className="text-[8px] font-bold tracking-[0.14em] uppercase text-background/30 mb-4">Répartition de l'activité</div>
                              <div className="flex items-start gap-6">
                                <ActivityPieChart data={offer.activitySplit} size={120} innerRadius={28} outerRadius={52} showLegend={false} darkMode />
                                <div className="flex-1 space-y-2.5">
                                  {Object.entries(offer.activitySplit).map(([name, value]) => (
                                    <div key={name}>
                                      <div className="flex justify-between items-center mb-0.5">
                                        <span className="text-xs font-medium text-background/80">{name}</span>
                                        <span className="text-xs font-bold text-background">{value}%</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="mb-6 pb-5 border-b border-background/[0.08]">
                            <div className="text-[8px] font-bold tracking-[0.14em] uppercase text-background/30 mb-3">Description du poste</div>
                            <p className="text-sm text-background/60 leading-relaxed">{offer.description}</p>
                          </div>

                          {offer.tags.length > 0 && (
                            <div className="mb-6 pb-5 border-b border-background/[0.08]">
                              <div className="text-[8px] font-bold tracking-[0.14em] uppercase text-background/30 mb-3">Expertise</div>
                              <div className="flex flex-wrap gap-1.5">
                                {offer.tags.map((tag) => (
                                  <span key={tag} className="text-[10px] px-3 py-1.5 rounded-full bg-background/[0.08] text-background/70 font-medium border border-background/[0.06]">{tag}</span>
                                ))}
                              </div>
                            </div>
                          )}

                          {offer.profilCriteres && offer.profilCriteres.length > 0 && (
                            <div className="mb-6 pb-5 border-b border-background/[0.08]">
                              <div className="text-[8px] font-bold tracking-[0.14em] uppercase text-background/30 mb-3">Profil idéal</div>
                              <div className="flex flex-wrap gap-1.5">
                                {offer.profilCriteres.map((c) => (
                                  <span key={c} className="text-[10px] bg-background/[0.06] border border-background/[0.08] rounded-full px-3 py-1.5 text-background/70 font-medium">{c}</span>
                                ))}
                              </div>
                            </div>
                          )}

                          {(offer.retroStr || offer.heures || offer.tt) && (
                            <div className="mb-6 pb-5 border-b border-background/[0.08]">
                              <div className="text-[8px] font-bold tracking-[0.14em] uppercase text-background/30 mb-3">Rémunération & conditions</div>
                              <div className="grid grid-cols-3 gap-3">
                                <div className="bg-background/[0.06] border border-background/[0.08] rounded-lg p-4 text-center">
                                  <div className="text-[8px] uppercase tracking-[0.1em] text-background/30 mb-2">Rétrocession</div>
                                  <div className="font-serif text-base font-bold text-background">{offer.retroStr || 'Confidentiel'}</div>
                                </div>
                                <div className="bg-background/[0.06] border border-background/[0.08] rounded-lg p-4 text-center">
                                  <div className="text-[8px] uppercase tracking-[0.1em] text-background/30 mb-2">Heures / an</div>
                                  <div className="font-serif text-base font-bold text-background">{offer.heures || 'Non communiqué'}</div>
                                </div>
                                <div className="bg-background/[0.06] border border-background/[0.08] rounded-lg p-4 text-center">
                                  <div className="text-[8px] uppercase tracking-[0.1em] text-background/30 mb-2">Télétravail</div>
                                  <div className="font-serif text-base font-bold text-background">{offer.tt || '—'}</div>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="text-center pt-2">
                            <p className="text-[10px] text-background/40 mb-4 leading-relaxed">
                              LOGAN qualifie l'opportunité des deux côtés avant toute mise en relation. Votre identité reste confidentielle jusqu'à accord mutuel.
                            </p>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleInterest(offer); }}
                              disabled={isInterested}
                              className={`w-full py-3.5 font-bold text-sm rounded-lg transition-all duration-300 ${isInterested ? 'bg-background/10 text-background/50 cursor-default' : 'bg-background text-foreground hover:bg-background/90'}`}
                            >
                              {isInterested ? (
                                <span className="flex items-center justify-center gap-2"><CheckCircle2 className="w-4 h-4" />Intérêt transmis à Logan</span>
                              ) : 'Je suis intéressé(e) →'}
                            </button>
                            <div className="mt-2 text-[10px] text-background/30">0% commission · Levée de rideau conditionnée à votre accord</div>
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
