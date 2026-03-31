import { useRegistrationStore } from '@/stores/registrationStore';
import { usePQE } from '@/hooks/usePQE';
import { useAuth } from '@/hooks/useAuth';
import { User, Building2, Star, Mail, Phone, Pencil, Plus, FileText, X, ShieldCheck, Check } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';

const CandidateProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const store = useRegistrationStore();
  const {
    photoPreviewUrl, prenom, nom, email, telephone,
    departement, cabinet, sermentMois, sermentAnnee,
    activites, pourcentages, statutEcoute, visibilite,
    qualitesAppreciees, axesAmelioration, motivation,
    movePriorities, cabinetsCibles, noGoCabinets,
    retrocession, bonus, anglais, typesClients,
    tailleOperations, conserverRetrocession, cvFile,
  } = store;
  const seniorityInfo = usePQE(sermentMois, sermentAnnee);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeActivites = Object.entries(activites).filter(([, v]) => v).map(([k]) => k);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    store.setField('cvFile', file);
  };

  return (
    <div className="space-y-8">
      {/* Identity card */}
      <div className="bg-secondary/50 border border-border rounded-lg p-6 md:p-8">
        <div className="flex items-start gap-6">
          <Avatar className="w-20 h-20 border-2 border-border">
            {photoPreviewUrl ? <AvatarImage src={photoPreviewUrl} alt="Photo" /> : null}
            <AvatarFallback className="bg-secondary text-foreground text-lg font-sans">
              {prenom && nom ? `${prenom[0]}${nom[0]}` : <User className="w-8 h-8" />}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-sans text-2xl text-foreground mb-1">{prenom && nom ? `${prenom} ${nom}` : 'Votre profil'}</h3>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {seniorityInfo && (
                <span className="text-[10px] font-semibold bg-foreground text-background px-2.5 py-1 rounded-sm uppercase tracking-wide">{seniorityInfo.label} · {seniorityInfo.years} ans</span>
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

      {/* Status & Visibility */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-border rounded-lg p-5">
          <div className="text-[8px] font-bold tracking-[0.14em] uppercase text-muted-foreground mb-2">Statut d'écoute</div>
          <div className="font-sans text-lg text-foreground">
            {statutEcoute === 'actif' ? 'En recherche active' : statutEcoute === 'passif' ? 'À l\'écoute' : 'Non défini'}
          </div>
        </div>
        <div className="border border-border rounded-lg p-5">
          <div className="text-[8px] font-bold tracking-[0.14em] uppercase text-muted-foreground mb-2">Visibilité</div>
          <div className="font-sans text-lg text-foreground">
            {visibilite === 'confidentiel' ? 'Confidentiel – fermé' : visibilite === 'semi-confidentiel' ? 'Confidentiel – ouvert' : 'Non définie'}
          </div>
        </div>
      </div>

      {/* Rémunération */}
      {(retrocession || bonus) && (
        <div className="border border-border rounded-lg p-6">
          <div className="text-[8px] font-bold tracking-[0.14em] uppercase text-muted-foreground mb-4">Rémunération</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {retrocession && (
              <div>
                <div className="text-[9px] text-muted-foreground font-sans">Rétrocession</div>
                <p className="text-sm font-sans font-medium mt-0.5">{retrocession} €</p>
              </div>
            )}
            {bonus && (
              <div>
                <div className="text-[9px] text-muted-foreground font-sans">Bonus</div>
                <p className="text-sm font-sans font-medium mt-0.5">{bonus} €</p>
              </div>
            )}
          </div>
          {conserverRetrocession !== null && (
            <p className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground font-sans font-light">
              {conserverRetrocession ? 'Souhaite conserver sa rétrocession' : 'Ouvert à une baisse de rétrocession'}
            </p>
          )}
        </div>
      )}

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

      {/* Priorities */}
      {movePriorities.length > 0 && (
        <div className="border border-border rounded-lg p-6">
          <div className="text-[8px] font-bold tracking-[0.14em] uppercase text-muted-foreground mb-4">Priorités</div>
          <div className="flex flex-wrap gap-2">
            {movePriorities.map((p) => (
              <span key={p} className="inline-flex items-center gap-1.5 text-[10px] bg-foreground text-background rounded-full px-3 py-1.5 font-sans font-light">
                <Check className="w-2.5 h-2.5" />{p}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Qualities & Axes */}
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

      {/* Additional info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {anglais && (
          <div className="border border-border rounded-lg p-5">
            <div className="text-[8px] font-bold tracking-[0.14em] uppercase text-muted-foreground mb-2">Anglais</div>
            <div className="font-sans text-sm text-foreground">{anglais}</div>
          </div>
        )}
        {tailleOperations.length > 0 && (
          <div className="border border-border rounded-lg p-5">
            <div className="text-[8px] font-bold tracking-[0.14em] uppercase text-muted-foreground mb-2">Taille des opérations</div>
            <div className="flex flex-wrap gap-1.5">
              {tailleOperations.map(t => (
                <span key={t} className="text-[10px] bg-secondary rounded-full px-3 py-1 text-foreground/70">{t}</span>
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

      {/* CV upload - discreet */}
      <div className="border border-border rounded-lg p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-[8px] font-bold tracking-[0.14em] uppercase text-muted-foreground">CV</div>
            <span className="text-[10px] text-muted-foreground/60 font-sans font-light">optionnel</span>
          </div>
          {!cvFile && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 text-xs font-sans font-light text-muted-foreground hover:text-foreground transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Ajouter
            </button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="hidden"
        />
        {cvFile && (
          <div className="flex items-center gap-2 mt-2 px-3 py-2 rounded-sm border border-border bg-card">
            <FileText className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs font-sans font-light text-foreground truncate flex-1">{cvFile.name}</span>
            <button type="button" onClick={() => store.setField('cvFile', null)} className="text-muted-foreground hover:text-foreground">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
        <div className="flex items-start gap-1.5 mt-2">
          <ShieldCheck className="w-3 h-3 text-muted-foreground/50 mt-0.5 shrink-0" />
          <p className="text-[10px] text-muted-foreground/60 font-sans font-light leading-relaxed">
            Logan s'engage à ne jamais transmettre votre CV sans votre accord explicite.
          </p>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={() => navigate('/inscription')}
          className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-lg text-sm font-bold hover:bg-foreground/90 transition-colors"
        >
          <Pencil className="w-4 h-4" />
          Modifier mon profil
        </button>
      </div>
    </div>
  );
};

export default CandidateProfile;
