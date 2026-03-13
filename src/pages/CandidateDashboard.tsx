import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Footer from '@/components/layout/Footer';
import { CANDIDATE_OFFERS, type CandidateOffer } from '@/lib/candidateMockData';
import { MapPin, Calendar, Briefcase, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import ActivityPieChart from '@/components/shared/ActivityPieChart';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

const CandidateDashboard = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [interestedOffers, setInterestedOffers] = useState<Set<string>>(new Set());
  const [expandedOffer, setExpandedOffer] = useState<string | null>(null);

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
          <motion.h1 variants={fadeUp} className="text-3xl md:text-5xl font-serif font-normal text-white leading-[1.1] mb-4 tracking-[-0.01em]">
            Bienvenue{user.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ''}
          </motion.h1>
          <motion.p variants={fadeUp} className="text-sm md:text-base text-white/50 font-sans font-light max-w-lg leading-relaxed">
            Découvrez les opportunités sélectionnées par Logan. Exprimez votre intérêt en toute confidentialité.
          </motion.p>
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
      <main className="flex-1 py-10 px-6 sm:px-8 lg:px-10 max-w-5xl mx-auto w-full">
        <div className="mb-8">
          <p className="text-[10px] font-sans font-medium tracking-[0.2em] uppercase text-muted-foreground mb-3">Opportunités disponibles</p>
          <div className="w-8 h-px bg-border" />
        </div>

        <div className="space-y-3">
          {CANDIDATE_OFFERS.map((offer, index) => {
            const isInterested = interestedOffers.has(offer.id);
            const isExpanded = expandedOffer === offer.id;
            const hasMultipleExpertises = offer.activitySplit && Object.keys(offer.activitySplit).length >= 2;

            return (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                layout
                className="border border-border rounded-sm bg-card hover:border-foreground/20 transition-colors duration-300 group"
              >
                <button
                  type="button"
                  className="w-full text-left p-5 md:p-6"
                  onClick={() => setExpandedOffer(isExpanded ? null : offer.id)}
                >
                    <div className="flex items-start justify-between gap-4">
                     <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-serif text-lg text-foreground">{offer.dept}</span>
                        <span className="text-[10px] text-muted-foreground font-sans tracking-wider uppercase bg-secondary px-2 py-0.5 rounded-sm">
                          {offer.reference}
                        </span>
                        {offer.ranking && (
                          <span className="text-[10px] font-bold text-foreground font-sans bg-secondary px-2 py-0.5 rounded-sm">
                            {offer.natFlag} {offer.ranking}
                          </span>
                        )}
                        {isInterested && (
                          <span className="flex items-center gap-1 text-[10px] text-muted-foreground font-sans">
                            <CheckCircle2 className="w-3 h-3" />
                            Intérêt transmis
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground font-sans mb-2">
                        {offer.seniority}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground font-sans">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {offer.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(offer.postedAt)}
                        </span>
                      </div>
                    </div>
                    <ArrowRight
                      className={`w-4 h-4 text-muted-foreground transition-transform duration-300 mt-1 ${isExpanded ? 'rotate-90' : 'group-hover:translate-x-0.5'}`}
                    />
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-border">
                        {/* White/beige detailed card */}
                        <div className="bg-background rounded-b-sm overflow-hidden p-5 md:p-6">
                          {/* Header */}
                          <div className="mb-5 pb-5 border-b border-border">
                            <div className="text-[8px] tracking-[0.16em] uppercase text-muted-foreground mb-2">Opportunité · Présentée par LOGAN</div>
                            <div className="font-serif text-lg font-bold text-foreground mb-1">
                              {offer.dept} — {offer.seniority}
                            </div>
                            <div className="text-[11px] text-muted-foreground">
                              {offer.natFlag} Cabinet anonyme · {offer.ranking || 'Non classé'} · Identité protégée
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-border">
                              {offer.tags.map((tag) => (
                                <span key={tag} className="text-[10px] px-2.5 py-1 rounded-full border border-border text-muted-foreground">{tag}</span>
                              ))}
                            </div>
                          </div>

                          {/* Activity pie chart */}
                          {hasMultipleExpertises && offer.activitySplit && (
                            <div className="mb-5 pb-5 border-b border-border">
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
                          <div className="mb-5 pb-5 border-b border-border">
                            <div className="text-[8px] font-bold tracking-[0.14em] uppercase text-muted-foreground mb-3">Description du poste</div>
                            <p className="text-[11px] text-muted-foreground leading-relaxed">{offer.description}</p>
                          </div>

                          {/* Context & team */}
                          {(offer.contexte || offer.equipe) && (
                            <div className="mb-5 pb-5 border-b border-border">
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
                            <div className="mb-5 pb-5 border-b border-border">
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
                            <div className="mb-5 pb-5 border-b border-border">
                              <div className="text-[8px] font-bold tracking-[0.14em] uppercase text-muted-foreground mb-3">Rémunération & conditions</div>
                              <div className="grid grid-cols-3 gap-4">
                                <div className="bg-secondary rounded-lg p-3">
                                  <div className="text-[8px] uppercase tracking-[0.1em] text-muted-foreground mb-1.5">Rétrocession</div>
                                  <div className="font-serif text-sm font-bold text-foreground">{offer.retroStr || 'Confidentiel'}</div>
                                </div>
                                <div className="bg-secondary rounded-lg p-3">
                                  <div className="text-[8px] uppercase tracking-[0.1em] text-muted-foreground mb-1.5">Heures / an</div>
                                  <div className="font-serif text-sm font-bold text-foreground">{offer.heures || 'Non communiqué'}</div>
                                </div>
                                <div className="bg-secondary rounded-lg p-3">
                                  <div className="text-[8px] uppercase tracking-[0.1em] text-muted-foreground mb-1.5">Télétravail</div>
                                  <div className="font-serif text-sm font-bold text-foreground">{offer.tt || '—'}</div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* CTA */}
                          <div className="text-center pt-2">
                            <p className="text-[10px] text-muted-foreground mb-3 leading-relaxed">
                              LOGAN qualifie l'opportunité des deux côtés avant toute mise en relation. Votre identité reste confidentielle jusqu'à accord mutuel.
                            </p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleInterest(offer);
                              }}
                              disabled={isInterested}
                              className={`w-full py-3 font-bold text-sm rounded transition-all duration-300 ${
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
