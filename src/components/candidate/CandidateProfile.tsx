import { useRegistrationStore } from '@/stores/registrationStore';
import { usePQE } from '@/hooks/usePQE';
import { useAuth } from '@/hooks/useAuth';
import { User, Building2, Star, Mail, Phone, Briefcase } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const CandidateProfile = () => {
  const { user } = useAuth();
  const {
    photoPreviewUrl, prenom, nom, email, telephone,
    departement, cabinet, sermentMois, sermentAnnee,
    activites, pourcentages, statutEcoute, visibilite,
    qualitesAppreciees, axesAmelioration, motivation,
  } = useRegistrationStore();
  const seniorityInfo = usePQE(sermentMois, sermentAnnee);

  const activeActivites = Object.entries(activites).filter(([, v]) => v).map(([k]) => k);

  return (
    <div className="space-y-8">
      {/* Identity card */}
      <div className="bg-secondary/50 border border-border rounded-lg p-6 md:p-8">
        <div className="flex items-start gap-6">
          <Avatar className="w-20 h-20 border-2 border-border">
            {photoPreviewUrl ? <AvatarImage src={photoPreviewUrl} alt="Photo" /> : null}
            <AvatarFallback className="bg-secondary text-foreground text-lg font-serif">
              {prenom && nom ? `${prenom[0]}${nom[0]}` : <User className="w-8 h-8" />}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-serif text-2xl text-foreground mb-1">{prenom && nom ? `${prenom} ${nom}` : 'Votre profil'}</h3>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {seniorityInfo && (
                <span className="text-[10px] font-semibold bg-foreground text-background px-2.5 py-1 rounded-sm uppercase tracking-wide">{seniorityInfo.label}</span>
              )}
              {departement && (
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-foreground/70 bg-secondary border border-border px-2.5 py-1 rounded-sm">
                  <Star className="w-3 h-3" />{departement}
                </span>
              )}
              {cabinet && (
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-foreground/70 bg-secondary border border-border px-2.5 py-1 rounded-sm">
                  <Building2 className="w-3 h-3" />{cabinet}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              {(email || user?.email) && (
                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{email || user?.email}</span>
              )}
              {telephone && (
                <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{telephone}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-border rounded-lg p-5">
          <div className="text-[8px] font-bold tracking-[0.14em] uppercase text-muted-foreground mb-2">Statut d'écoute</div>
          <div className="font-serif text-lg text-foreground capitalize">{statutEcoute || 'Non défini'}</div>
        </div>
        <div className="border border-border rounded-lg p-5">
          <div className="text-[8px] font-bold tracking-[0.14em] uppercase text-muted-foreground mb-2">Visibilité</div>
          <div className="font-serif text-lg text-foreground capitalize">{visibilite || 'Non définie'}</div>
        </div>
      </div>

      {/* Expertises */}
      {activeActivites.length > 0 && (
        <div className="border border-border rounded-lg p-6">
          <div className="text-[8px] font-bold tracking-[0.14em] uppercase text-muted-foreground mb-4">Domaines d'expertise</div>
          <div className="flex flex-wrap gap-2">
            {activeActivites.map((a) => (
              <span key={a} className="text-[11px] bg-secondary border border-border rounded-full px-3 py-1.5 text-foreground font-medium">
                {a}{pourcentages[a] ? ` · ${pourcentages[a]}%` : ''}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Qualities & areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {qualitesAppreciees.length > 0 && (
          <div className="border border-border rounded-lg p-5">
            <div className="text-[8px] font-bold tracking-[0.14em] uppercase text-muted-foreground mb-3">Qualités appréciées</div>
            <div className="flex flex-wrap gap-1.5">
              {qualitesAppreciees.map((q) => (
                <span key={q} className="text-[10px] bg-secondary rounded-full px-3 py-1 text-foreground/70">{q}</span>
              ))}
            </div>
          </div>
        )}
        {axesAmelioration.length > 0 && (
          <div className="border border-border rounded-lg p-5">
            <div className="text-[8px] font-bold tracking-[0.14em] uppercase text-muted-foreground mb-3">Axes de développement</div>
            <div className="flex flex-wrap gap-1.5">
              {axesAmelioration.map((a) => (
                <span key={a} className="text-[10px] bg-secondary rounded-full px-3 py-1 text-foreground/70">{a}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Motivation */}
      {motivation && (
        <div className="border border-border rounded-lg p-6">
          <div className="text-[8px] font-bold tracking-[0.14em] uppercase text-muted-foreground mb-3">Motivation</div>
          <p className="text-sm text-muted-foreground leading-relaxed">{motivation}</p>
        </div>
      )}

      <p className="text-[10px] text-muted-foreground text-center">
        Pour modifier votre profil, contactez votre consultant Logan dédié.
      </p>
    </div>
  );
};

export default CandidateProfile;
