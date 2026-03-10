import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LogoBanner from '@/components/layout/LogoBanner';
import Footer from '@/components/layout/Footer';
import { CANDIDATE_OFFERS, type CandidateOffer } from '@/lib/candidateMockData';
import { MapPin, Calendar, Briefcase, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useEffect } from 'react';

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
      <LogoBanner subtitle="Espace Candidat" />

      <main className="flex-1 py-10 px-6 md:px-12 lg:px-20 max-w-5xl mx-auto w-full">
        {/* Welcome */}
        <div className="mb-10">
          <h1 className="font-serif text-2xl md:text-3xl text-foreground mb-2">
            Bienvenue{user.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ''}
          </h1>
          <p className="text-sm text-muted-foreground font-sans">
            Découvrez les opportunités sélectionnées par Logan. Exprimez votre intérêt en toute confidentialité.
          </p>
        </div>

        {/* Info banner */}
        <div className="bg-secondary border border-border rounded-sm p-5 mb-8">
          <p className="text-xs text-muted-foreground font-sans leading-relaxed">
            <span className="font-medium text-foreground">Comment ça fonctionne :</span> Les offres ci-dessous sont anonymisées. Si une opportunité vous intéresse, cliquez sur « Je suis intéressé(e) ». Un consultant Logan vous contactera pour un échange confidentiel avant toute mise en relation.
          </p>
        </div>

        {/* Offers */}
        <div className="space-y-4">
          {CANDIDATE_OFFERS.map((offer) => {
            const isInterested = interestedOffers.has(offer.id);
            const isExpanded = expandedOffer === offer.id;

            return (
              <motion.div
                key={offer.id}
                layout
                className="border border-border rounded-sm bg-card hover:border-foreground/20 transition-colors duration-300"
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
                      className={`w-4 h-4 text-muted-foreground transition-transform duration-300 mt-1 ${isExpanded ? 'rotate-90' : ''}`}
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
                      <div className="px-5 md:px-6 pb-5 md:pb-6 border-t border-border pt-4">
                        <p className="text-sm text-foreground/80 font-sans leading-relaxed mb-4">
                          {offer.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-5">
                          {offer.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] font-sans text-muted-foreground border border-border rounded-sm px-2 py-1"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInterest(offer);
                          }}
                          disabled={isInterested}
                          className={`font-sans text-sm px-5 py-2.5 rounded-sm transition-all duration-300 ${
                            isInterested
                              ? 'bg-secondary text-muted-foreground cursor-default'
                              : 'bg-foreground text-background hover:bg-foreground/90'
                          }`}
                        >
                          {isInterested ? (
                            <span className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4" />
                              Intérêt transmis à Logan
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <Briefcase className="w-4 h-4" />
                              Je suis intéressé(e)
                            </span>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Déconnexion */}
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
