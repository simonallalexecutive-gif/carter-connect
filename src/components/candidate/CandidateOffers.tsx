import { useState, useMemo } from 'react';
import { CANDIDATE_OFFERS, type CandidateOffer, getOfferNatFlag } from '@/lib/candidateMockData';
import { CHAMBERS_DEPARTMENTS } from '@/lib/chambersRankings';
import { Calendar, CheckCircle2, ChevronDown, Filter, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import ActivityPieChart from '@/components/shared/ActivityPieChart';
import { useRegistrationStore } from '@/stores/registrationStore';
import { usePQE } from '@/hooks/usePQE';

export const formatOfferDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

export const shortSeniority = (s: string) => s.replace(/\s*\(.*\)/, '');

/** Extract structured info from seniority string */
const parseOfferSeniority = (s: string) => {
  const lower = s.toLowerCase();
  let title = 'Collaborateur';
  if (lower.includes('counsel')) title = 'Counsel';
  else if (lower.includes('associé')) title = 'Associé';

  // For collaborateurs, determine the bracket
  let seniorityRange: string | null = null;
  if (title === 'Collaborateur') {
    const match = s.match(/\((\d+)/);
    const startYears = match ? parseInt(match[1], 10) : 0;
    if (startYears < 3) seniorityRange = '0/3 ans';
    else if (startYears < 6) seniorityRange = '3/6 ans';
    else seniorityRange = '6 ans+';
  }
  return { title, seniorityRange };
};

const PRACTICE_FILTERS = [
  { key: 'all', label: 'Toutes' },
  ...CHAMBERS_DEPARTMENTS.map(d => ({ key: d.key, label: d.label })),
];

const NAT_FILTERS = [
  { key: 'all', label: 'Toutes', flag: '' },
  { key: 'FR', label: 'FR', flag: 'FR' },
  { key: 'US', label: 'US', flag: 'US' },
  { key: 'UK', label: 'UK', flag: 'UK' },
];

const SENIORITY_FILTERS = [
  { key: 'all', label: 'Toutes' },
  { key: 'collaborateur', label: 'Collaborateur' },
  { key: 'counsel', label: 'Counsel' },
  { key: 'associe', label: 'Associé' },
];

const CHAMBERS_FILTERS = [
  { key: 'all', label: 'Tous' },
  { key: 'ranked', label: 'Classé Chambers' },
  { key: 'band1', label: 'Band 1' },
  { key: 'band2', label: 'Band 2' },
  { key: 'band3', label: 'Band 3+' },
];

const CandidateOffers = () => {
  const [interestedOffers, setInterestedOffers] = useState<Set<string>>(new Set());
  const [expandedOffer, setExpandedOffer] = useState<string | null>(null);
  const { activites, sermentMois, sermentAnnee } = useRegistrationStore();
  const seniorityInfo = usePQE(sermentMois, sermentAnnee);
  const [showFilters, setShowFilters] = useState(false);
  const [practiceFilter, setPracticeFilter] = useState('all');
  const [natFilter, setNatFilter] = useState('all');
  const [seniorityFilter, setSeniorityFilter] = useState('all');
  const [chambersFilter, setChambersFilter] = useState('all');

  // Get candidate's active practices for relevance filtering
  const candidatePractices = useMemo(() => {
    const active = Object.entries(activites).filter(([, v]) => v).map(([k]) => k);
    return active;
  }, [activites]);

  const { departement } = useRegistrationStore();

  const filteredOffers = useMemo(() => {
    let offers = [...CANDIDATE_OFFERS];

    // Filter by candidate's practice (relevance) - show related practices
    const RELATED_DEPTS: Record<string, string[]> = {
      'M&A (dominante)': ['Corporate/M&A', 'Private Equity', 'Venture Capital', 'M&A'],
      'Private Equity (dominante)': ['Private Equity', 'Corporate/M&A', 'Venture Capital', 'M&A'],
      'Corporate': ['Corporate/M&A', 'Private Equity', 'M&A'],
      'Financement LBO': ['Banking & Finance', 'Financement LBO', 'Financement de projets'],
      'Financement de projets': ['Banking & Finance', 'Financement LBO', 'Financement de projets'],
      'Restructuring': ['Restructuring', 'Restructuring/Insolvency'],
      'Restructuring/Insolvency': ['Restructuring', 'Restructuring/Insolvency'],
      'Droit Social': ['Employment', 'Droit Social'],
      'Immobilier': ['Real Estate', 'Immobilier'],
      'Tax': ['Tax'],
      'Concurrence': ['Concurrence', 'Competition/EU'],
      'Droit Public': ['Droit Public', 'Public Law'],
    };
    // Only filter by practice if candidate has a departement set
    if (departement && departement.length > 0) {
      const relatedDepts = RELATED_DEPTS[departement] || [departement];
      offers = offers.filter(o => {
        if (relatedDepts.some(d => o.dept === d || o.dept.includes(d))) return true;
        if (o.activitySplit && Object.keys(o.activitySplit).some(k => relatedDepts.some(d => k === d || k.includes(d)))) return true;
        const chambersDept = CHAMBERS_DEPARTMENTS.find(d => d.label === departement);
        if (chambersDept && o.chambersDeptKey === chambersDept.key) return true;
        return false;
      });
    }

    // Practice filter
    if (practiceFilter !== 'all') {
      offers = offers.filter(o => {
        if (o.chambersDeptKey === practiceFilter) return true;
        const label = CHAMBERS_DEPARTMENTS.find(d => d.key === practiceFilter)?.label;
        if (label && o.dept === label) return true;
        if (label && o.activitySplit && Object.keys(o.activitySplit).some(k => k === label)) return true;
        return false;
      });
    }

    // Nationality filter
    if (natFilter !== 'all') {
      offers = offers.filter(o => o.nat === natFilter);
    }

    // Seniority filter
    if (seniorityFilter !== 'all') {
      offers = offers.filter(o => {
        const s = o.seniority.toLowerCase();
        if (seniorityFilter === 'collaborateur') return s.includes('collaborateur');
        if (seniorityFilter === 'counsel') return s.includes('counsel');
        if (seniorityFilter === 'associe') return s.includes('associé');
        return true;
      });
    }

    // Chambers filter
    if (chambersFilter !== 'all') {
      offers = offers.filter(o => {
        if (!o.chambersBand) return chambersFilter === 'all';
        if (chambersFilter === 'ranked') return true;
        if (chambersFilter === 'band1') return o.chambersBand === 1;
        if (chambersFilter === 'band2') return o.chambersBand === 2;
        if (chambersFilter === 'band3') return o.chambersBand >= 3;
        return true;
      });
    }

    return offers;
  }, [practiceFilter, natFilter, seniorityFilter, chambersFilter, departement, activites]);

  const handleInterest = (offer: CandidateOffer) => {
    if (interestedOffers.has(offer.id)) return;
    setInterestedOffers((prev) => new Set(prev).add(offer.id));
    toast.success(`Votre intérêt pour l'opportunité ${offer.reference} a été transmis à Logan.`, { duration: 5000 });
  };

  const activeFilterCount = [practiceFilter, natFilter, seniorityFilter, chambersFilter].filter(f => f !== 'all').length;

  return (
    <div>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-[10px] font-sans font-medium tracking-[0.2em] uppercase text-muted-foreground mb-2">Opportunités disponibles</p>
          <div className="w-8 h-px bg-foreground" />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-1.5 text-[11px] font-sans px-3 py-1.5 rounded-md border transition-colors ${showFilters ? 'bg-foreground text-background border-foreground' : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/30'}`}
          >
            <Filter className="w-3 h-3" />
            Filtres{activeFilterCount > 0 && ` (${activeFilterCount})`}
          </button>
          <span className="text-xs text-muted-foreground font-sans">{filteredOffers.length} offre{filteredOffers.length > 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Filters panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden mb-6"
          >
            <div className="p-5 rounded-lg border border-border bg-secondary/50 space-y-4">
              {/* Practice */}
              <div>
                <div className="text-[8px] font-bold tracking-[0.14em] uppercase text-muted-foreground mb-2">Pratique</div>
                <div className="flex flex-wrap gap-1.5">
                  {PRACTICE_FILTERS.map(f => (
                    <button
                      key={f.key}
                      onClick={() => setPracticeFilter(f.key)}
                      className={`text-[10px] font-sans px-2.5 py-1 rounded-full border transition-colors ${practiceFilter === f.key ? 'bg-foreground text-background border-foreground' : 'border-border text-foreground/60 hover:border-foreground/30'}`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Nationality */}
              <div>
                <div className="text-[8px] font-bold tracking-[0.14em] uppercase text-muted-foreground mb-2">Nationalité du cabinet</div>
                <div className="flex flex-wrap gap-1.5">
                  {NAT_FILTERS.map(f => (
                    <button
                      key={f.key}
                      onClick={() => setNatFilter(f.key)}
                      className={`text-[10px] font-sans px-2.5 py-1 rounded-full border transition-colors ${natFilter === f.key ? 'bg-foreground text-background border-foreground' : 'border-border text-foreground/60 hover:border-foreground/30'}`}
                    >
                      {f.flag ? `${f.flag} ${f.label}` : f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Seniority */}
              <div>
                <div className="text-[8px] font-bold tracking-[0.14em] uppercase text-muted-foreground mb-2">Séniorité recherchée</div>
                <div className="flex flex-wrap gap-1.5">
                  {SENIORITY_FILTERS.map(f => (
                    <button
                      key={f.key}
                      onClick={() => setSeniorityFilter(f.key)}
                      className={`text-[10px] font-sans px-2.5 py-1 rounded-full border transition-colors ${seniorityFilter === f.key ? 'bg-foreground text-background border-foreground' : 'border-border text-foreground/60 hover:border-foreground/30'}`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chambers */}
              <div>
                <div className="text-[8px] font-bold tracking-[0.14em] uppercase text-muted-foreground mb-2">Classement Chambers</div>
                <div className="flex flex-wrap gap-1.5">
                  {CHAMBERS_FILTERS.map(f => (
                    <button
                      key={f.key}
                      onClick={() => setChambersFilter(f.key)}
                      className={`text-[10px] font-sans px-2.5 py-1 rounded-full border transition-colors ${chambersFilter === f.key ? 'bg-foreground text-background border-foreground' : 'border-border text-foreground/60 hover:border-foreground/30'}`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {activeFilterCount > 0 && (
                <button
                  onClick={() => { setPracticeFilter('all'); setNatFilter('all'); setSeniorityFilter('all'); setChambersFilter('all'); }}
                  className="text-[10px] text-muted-foreground hover:text-foreground font-sans underline underline-offset-2"
                >
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-5">
        <AnimatePresence mode="popLayout">
          {filteredOffers.map((offer, index) => {
            const isInterested = interestedOffers.has(offer.id);
            const isExpanded = expandedOffer === offer.id;
            const hasMultipleExpertises = offer.activitySplit && Object.keys(offer.activitySplit).length >= 2;
            const isHidden = expandedOffer !== null && !isExpanded;
            if (isHidden) return null;
            const flag = getOfferNatFlag(offer);

            return (
              <motion.div
                key={offer.id}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12, transition: { duration: 0.25 } }}
                transition={{ delay: expandedOffer ? 0 : index * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-lg overflow-hidden transition-shadow duration-500 hover:shadow-xl border border-black/[0.08]"
                style={{ background: 'hsl(40, 20%, 95%)' }}
              >
                  <button type="button" className="w-full text-left p-6 md:p-8" onClick={() => setExpandedOffer(isExpanded ? null : offer.id)}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {(() => {
                          const parsed = parseOfferSeniority(offer.seniority);
                          const natLabel = offer.nat ? `Cabinet ${offer.nat}` : '';
                          const hasChambers = !!offer.chambersBand;
                          return (
                            <>
                              <div className="flex items-center gap-0 mb-2 flex-wrap">
                                <span className="text-[14px] font-sans font-semibold text-black/90 leading-none">{parsed.title}</span>
                                <span className="mx-2.5 w-px h-5 bg-black/20 inline-block" />
                                <span className="text-[14px] font-sans font-semibold text-black/90 leading-none">{offer.dept}</span>
                                {parsed.seniorityRange && (
                                  <>
                                    <span className="mx-2.5 w-px h-5 bg-black/20 inline-block" />
                                    <span className="text-[14px] font-sans font-semibold text-black/90 leading-none">{parsed.seniorityRange}</span>
                                  </>
                                )}
                                {isInterested && (
                                  <span className="ml-3 inline-flex items-center gap-1 text-[10px] text-black/50 font-sans">
                                    <CheckCircle2 className="w-3.5 h-3.5" />Intérêt transmis
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mb-3 flex-wrap">
                                {natLabel && (
                                  <span className="text-[10px] font-sans font-bold text-black/70 leading-none border border-black/20 rounded px-2 py-1">{natLabel}</span>
                                )}
                                <span className="text-[10px] font-sans font-bold text-black/70 leading-none border border-black/20 rounded px-2 py-1">Chambers : {hasChambers ? 'Oui' : 'Non'}</span>
                              </div>
                            </>
                          );
                        })()}
                        

                        {!isExpanded && offer.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {offer.tags.slice(0, 4).map((tag) => (
                              <span key={tag} className="text-[10px] px-2.5 py-1 rounded-full border border-black/15 text-black/60 font-sans">{tag}</span>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-1.5 text-[11px] text-black/55 font-sans">
                            <Calendar className="w-3 h-3" />
                            <span>Date de publication : {formatOfferDate(offer.postedAt)}</span>
                          </div>
                          <div className="text-[9px] tracking-[0.15em] uppercase text-black/30 font-sans">{offer.reference}</div>
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-black/[0.06] shrink-0 mt-1">
                        <ChevronDown className={`w-5 h-5 text-black/60 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                  </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden">
                      <div className="border-t border-foreground/10">
                        <div className="p-6 md:p-8 bg-white text-foreground">

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
                                  <div className="font-sans text-base font-bold text-foreground">{offer.tt || '—'}</div>
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
                            <div className="mt-2 text-[10px] text-muted-foreground">Un consultant Logan vous contactera sous 48h pour échanger plus en détails sur cette opportunité</div>
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
