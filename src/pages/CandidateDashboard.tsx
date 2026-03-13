import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Footer from '@/components/layout/Footer';
import { CANDIDATE_OFFERS, type CandidateOffer } from '@/lib/candidateMockData';
import { MapPin, Calendar, CheckCircle2, ChevronDown, Building2, Star, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import ActivityPieChart from '@/components/shared/ActivityPieChart';
import { useRegistrationStore } from '@/stores/registrationStore';
import { usePQE } from '@/hooks/usePQE';
import SeniorityBadge from '@/components/shared/SeniorityBadge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

/* Alternating visual styles for cards */
const CARD_STYLES = [
  { bg: 'bg-foreground', text: 'text-background', muted: 'text-background/50', border: 'border-background/10', tagBg: 'bg-background/10', tagText: 'text-background/70', btnBg: 'bg-background text-foreground hover:bg-background/90', btnDone: 'bg-background/20 text-background/60' },
  { bg: 'bg-background', text: 'text-foreground', muted: 'text-muted-foreground', border: 'border-border', tagBg: 'bg-secondary', tagText: 'text-foreground/70', btnBg: 'bg-foreground text-background hover:bg-foreground/90', btnDone: 'bg-secondary text-muted-foreground' },
] as const;

const CandidateDashboard = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [interestedOffers, setInterestedOffers] = useState<Set<string>>(new Set());
  const [expandedOffer, setExpandedOffer] = useState<string | null>(null);
  const { photoPreviewUrl, prenom, nom, departement, cabinet, sermentMois, sermentAnnee, activites } = useRegistrationStore();
  const seniorityInfo = usePQE(sermentMois, sermentAnnee);

  /* ---------- Filter offers by seniority + expertise ---------- */
  const parsePQERange = (seniority: string): [number, number] | null => {
    const match = seniority.match(/\((\d+)-(\d+)\s*PQE\)/);
    if (match) return [parseInt(match[1]), parseInt(match[2])];
    return null;
  };

  const filteredOffers = CANDIDATE_OFFERS.filter((offer) => {
    // Seniority filter: candidate PQE must fall within offer range
    if (seniorityInfo) {
      const range = parsePQERange(offer.seniority);
      if (range) {
        const [min, max] = range;
        // Allow ±2 years tolerance for flexibility
        if (seniorityInfo.years < min - 2 || seniorityInfo.years > max + 2) return false;
      }
    }

    // Expertise filter: offer dept or activitySplit keys must overlap with candidate's active expertises
    const candidateExpertises = Object.entries(activites)
      .filter(([, active]) => active)
      .map(([name]) => name.toLowerCase());

    if (candidateExpertises.length > 0) {
      const offerExpertises = new Set<string>();
      offerExpertises.add(offer.dept.toLowerCase());
      if (offer.activitySplit) {
        Object.keys(offer.activitySplit).forEach((k) => offerExpertises.add(k.toLowerCase()));
      }
      const hasOverlap = candidateExpertises.some((e) => offerExpertises.has(e));
      if (!hasOverlap) return false;
    }

    return true;
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) return null;
  if (!user) return null;

  const handleInterest = (offer: CandidateOffer) => {
    if (interestedOffers.has(offer.id)) return;
    setInterestedOffers((prev) => new Set(prev).add(offer.id));
    toast.success(
      `Votre intérêt pour l'opportunité ${offer.reference} a été transmis à Logan. Un consultant vous contactera sous 48h.`,
      { duration: 5000 }
    );
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="w-full bg-black">
        <div className="px-6 sm:px-8 lg:px-10 flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="font-serif text-2xl tracking-[-0.02em] text-white hover:text-white/80 transition-colors duration-300">
              Logan
            </Link>
            <span className="w-px h-5 bg-white/20 mx-4" />
            <span className="text-[11px] text-white/40 tracking-[0.12em] uppercase font-sans font-light">Espace Candidat</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link to="/" className="font-sans text-[13px] font-light text-white/60 hover:text-white transition-colors duration-300 hidden sm:block">
              Accueil
            </Link>
            <button
              onClick={signOut}
              className="font-sans text-[13px] font-light text-white/80 hover:text-white border border-white/20 hover:border-white/40 rounded-sm px-4 py-2 transition-colors duration-300"
            >
              Déconnexion
            </button>
          </nav>
        </div>
      </header>

      {/* Hero banner */}
      <section className="bg-black py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-[0.06]" style={{ background: 'radial-gradient(circle, hsl(0 0% 50%), transparent 70%)' }} />
        </div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          className="px-6 sm:px-8 lg:px-10 max-w-5xl mx-auto relative z-10"
        >
          <motion.div variants={fadeUp} className="w-10 h-px bg-white/30 mb-8" />

          <div className="flex items-start gap-6 md:gap-8">
            {/* Profile card */}
            <motion.div variants={fadeUp} className="shrink-0">
              <Avatar className="w-20 h-20 md:w-24 md:h-24 border-2 border-white/20">
                {photoPreviewUrl ? (
                  <AvatarImage src={photoPreviewUrl} alt="Photo de profil" />
                ) : null}
                <AvatarFallback className="bg-white/10 text-white text-lg font-serif">
                  {prenom && nom ? `${prenom[0]}${nom[0]}` : <User className="w-8 h-8" />}
                </AvatarFallback>
              </Avatar>
            </motion.div>

            <div className="flex-1 min-w-0">
              <motion.h1 variants={fadeUp} className="text-3xl md:text-5xl font-serif font-normal text-white leading-[1.1] mb-4 tracking-[-0.01em]">
                Bienvenue{prenom ? `, ${prenom}` : user.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ''}
              </motion.h1>

              {/* Profile recap chips */}
              <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-2 mb-4">
                {seniorityInfo && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-black bg-white rounded-sm px-3 py-1.5 tracking-wide">
                    {seniorityInfo.label}
                  </span>
                )}
                {departement && (
                  <span className="inline-flex items-center text-[11px] font-medium text-white/80 bg-white/10 border border-white/15 rounded-sm px-3 py-1.5">
                    {departement}
                  </span>
                )}
                {cabinet && (
                  <span className="inline-flex items-center text-[11px] font-medium text-white/80 bg-white/10 border border-white/15 rounded-sm px-3 py-1.5">
                    {cabinet}
                  </span>
                )}
              </motion.div>

              <motion.p variants={fadeUp} className="text-sm md:text-base text-white/50 font-sans font-light max-w-lg leading-relaxed">
                Découvrez les opportunités sélectionnées par Logan. Exprimez votre intérêt en toute confidentialité.
              </motion.p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Info banner */}
      <div className="bg-secondary border-b border-border">
        <div className="px-6 sm:px-8 lg:px-10 max-w-5xl mx-auto py-5">
          <p className="text-xs text-muted-foreground font-sans leading-relaxed">
            <span className="font-medium text-foreground">Comment ça fonctionne :</span> Les offres ci-dessous sont anonymisées. Si une opportunité vous intéresse, cliquez sur « Je suis intéressé(e) ». Un consultant Logan vous contactera pour un échange confidentiel avant toute mise en relation.
          </p>
        </div>
      </div>

      {/* Offers */}
      <main className="flex-1 py-12 px-6 sm:px-8 lg:px-10 max-w-5xl mx-auto w-full">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-[10px] font-sans font-medium tracking-[0.2em] uppercase text-muted-foreground mb-2">Opportunités disponibles</p>
            <div className="w-8 h-px bg-foreground" />
          </div>
          <span className="text-xs text-muted-foreground font-sans">{CANDIDATE_OFFERS.length} offre{CANDIDATE_OFFERS.length > 1 ? 's' : ''}</span>
        </div>

        <div className="space-y-5">
          <AnimatePresence mode="popLayout">
          {CANDIDATE_OFFERS.map((offer, index) => {
            const isInterested = interestedOffers.has(offer.id);
            const isExpanded = expandedOffer === offer.id;
            const hasMultipleExpertises = offer.activitySplit && Object.keys(offer.activitySplit).length >= 2;
            const style = CARD_STYLES[index % 2];
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
                className={`${style.bg} rounded-lg overflow-hidden transition-shadow duration-500 hover:shadow-[var(--shadow-elevated)]`}
                style={{ boxShadow: 'var(--shadow-card)' }}
              >
                <button
                  type="button"
                  className="w-full text-left p-6 md:p-8"
                  onClick={() => setExpandedOffer(isExpanded ? null : offer.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Top row: department + badges */}
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <span className={`font-serif text-2xl md:text-3xl font-medium ${style.text} leading-none`}>
                          {offer.dept}
                        </span>
                        <span className={`text-[10px] ${style.muted} font-sans tracking-widest uppercase ${style.tagBg} px-2.5 py-1 rounded`}>
                          {offer.reference}
                        </span>
                        {offer.ranking && (
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold ${style.text} font-sans ${style.tagBg} px-2.5 py-1 rounded`}>
                            <Star className="w-3 h-3" />
                            {offer.natFlag} {offer.ranking}
                          </span>
                        )}
                        {isInterested && (
                          <span className={`inline-flex items-center gap-1 text-[10px] ${style.muted} font-sans`}>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Intérêt transmis
                          </span>
                        )}
                      </div>

                      {/* Seniority */}
                      <p className={`text-sm ${style.muted} font-sans mb-3 flex items-center gap-2`}>
                        <Building2 className="w-3.5 h-3.5" />
                        {offer.seniority}
                      </p>

                      {/* Meta row */}
                      <div className={`flex items-center gap-5 text-xs ${style.muted} font-sans`}>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" />
                          {offer.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(offer.postedAt)}
                        </span>
                      </div>

                      {/* Tags preview (collapsed) */}
                      {!isExpanded && offer.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-4">
                          {offer.tags.slice(0, 4).map((tag) => (
                            <span key={tag} className={`text-[10px] px-2.5 py-1 rounded-full border ${style.border} ${style.tagText}`}>
                              {tag}
                            </span>
                          ))}
                          {offer.tags.length > 4 && (
                            <span className={`text-[10px] ${style.muted}`}>+{offer.tags.length - 4}</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Expand chevron */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${style.tagBg} shrink-0 mt-1`}>
                      <ChevronDown
                        className={`w-5 h-5 ${style.muted} transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      {/* Expanded detail — always light bg for readability */}
                      <div className="bg-background border-t border-border">
                        <div className="p-6 md:p-8">
                          {/* Header */}
                          <div className="mb-6 pb-5 border-b border-border">
                            <div className="text-[8px] tracking-[0.16em] uppercase text-muted-foreground mb-2">Opportunité · Présentée par LOGAN</div>
                            <div className="font-serif text-xl font-bold text-foreground mb-1">
                              {offer.dept} — {offer.seniority}
                            </div>
                            <div className="text-[11px] text-muted-foreground">
                              {offer.natFlag} Cabinet anonyme · {offer.ranking || 'Non classé'} · Identité protégée
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-4">
                              {offer.tags.map((tag) => (
                                <span key={tag} className="text-[10px] px-3 py-1.5 rounded-full bg-secondary text-foreground/70 font-medium">{tag}</span>
                              ))}
                            </div>
                          </div>

                          {/* Activity pie chart */}
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

                          {/* Description */}
                          <div className="mb-6 pb-5 border-b border-border">
                            <div className="text-[8px] font-bold tracking-[0.14em] uppercase text-muted-foreground mb-3">Description du poste</div>
                            <p className="text-sm text-muted-foreground leading-relaxed">{offer.description}</p>
                          </div>

                          {/* Context & team */}
                          {(offer.contexte || offer.equipe) && (
                            <div className="mb-6 pb-5 border-b border-border">
                              <div className="text-[8px] font-bold tracking-[0.14em] uppercase text-muted-foreground mb-3">Contexte & équipe</div>
                              <div className="grid grid-cols-2 gap-4">
                                {offer.contexte && (
                                  <div>
                                    <div className="text-[8px] uppercase tracking-[0.1em] text-muted-foreground mb-1">Contexte</div>
                                    <div className="text-sm font-semibold text-foreground">{offer.contexte}</div>
                                  </div>
                                )}
                                {offer.equipe && (
                                  <div>
                                    <div className="text-[8px] uppercase tracking-[0.1em] text-muted-foreground mb-1">Composition de l'équipe</div>
                                    <div className="text-sm font-semibold text-foreground">{offer.equipe}</div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Profil idéal */}
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

                          {/* Conditions */}
                          {(offer.retroStr || offer.heures || offer.tt) && (
                            <div className="mb-6 pb-5 border-b border-border">
                              <div className="text-[8px] font-bold tracking-[0.14em] uppercase text-muted-foreground mb-3">Rémunération & conditions</div>
                              <div className="grid grid-cols-3 gap-3">
                                <div className="bg-secondary rounded-lg p-4 text-center">
                                  <div className="text-[8px] uppercase tracking-[0.1em] text-muted-foreground mb-2">Rétrocession</div>
                                  <div className="font-serif text-base font-bold text-foreground">{offer.retroStr || 'Confidentiel'}</div>
                                </div>
                                <div className="bg-secondary rounded-lg p-4 text-center">
                                  <div className="text-[8px] uppercase tracking-[0.1em] text-muted-foreground mb-2">Heures / an</div>
                                  <div className="font-serif text-base font-bold text-foreground">{offer.heures || 'Non communiqué'}</div>
                                </div>
                                <div className="bg-secondary rounded-lg p-4 text-center">
                                  <div className="text-[8px] uppercase tracking-[0.1em] text-muted-foreground mb-2">Télétravail</div>
                                  <div className="font-serif text-base font-bold text-foreground">{offer.tt || '—'}</div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* CTA */}
                          <div className="text-center pt-2">
                            <p className="text-[10px] text-muted-foreground mb-4 leading-relaxed">
                              LOGAN qualifie l'opportunité des deux côtés avant toute mise en relation. Votre identité reste confidentielle jusqu'à accord mutuel.
                            </p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleInterest(offer);
                              }}
                              disabled={isInterested}
                              className={`w-full py-3.5 font-bold text-sm rounded-lg transition-all duration-300 ${
                                isInterested
                                  ? 'bg-secondary text-muted-foreground cursor-default'
                                  : 'bg-foreground text-background hover:bg-foreground/90'
                              }`}
                            >
                              {isInterested ? (
                                <span className="flex items-center justify-center gap-2">
                                  <CheckCircle2 className="w-4 h-4" />
                                  Intérêt transmis à Logan
                                </span>
                              ) : (
                                'Je suis intéressé(e) par cette opportunité →'
                              )}
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

        {/* Footer info */}
        <div className="mt-12 pt-8 border-t border-border flex justify-between items-center">
          <p className="text-xs text-muted-foreground font-sans">
            Connecté en tant que {user.email}
          </p>
          <button
            onClick={signOut}
            className="text-xs text-muted-foreground hover:text-foreground font-sans underline transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CandidateDashboard;
