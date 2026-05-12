import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useRegistrationStore } from '@/stores/registrationStore';
import StepProgress from '@/components/registration/StepProgress';
import Step2Identity from '@/components/registration/Step2Identity';
import Step3Activity from '@/components/registration/Step3Activity';
import Step4Project from '@/components/registration/Step4Project';
import Step5Status from '@/components/registration/Step5Status';
import Step6Review from '@/components/registration/Step6Review';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Check, Link2, UserPlus, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const AdminRegistration = () => {
  const store = useRegistrationStore();
  const [phase, setPhase] = useState<'stepper' | 'link'>('stepper');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  // Enable admin mode and start at step 2 on mount
  useEffect(() => {
    store.reset();
    store.setField('isAdminMode', true);
    store.goToStep(2);
    return () => {
      store.reset(); // Clean up on unmount
    };
  }, []);

  // Apply light theme for the form steps (same as RegisterPage)
  useEffect(() => {
    if (phase === 'stepper') {
      document.body.classList.add('theme-light');
    }
    return () => document.body.classList.remove('theme-light');
  }, [phase]);

  // Intercept step 7 (confirm) — in admin mode this means the review was "submitted"
  // We save to admin_candidate_invites instead
  useEffect(() => {
    if (store.currentStep === 7 && store.isAdminMode && phase === 'stepper') {
      handleGenerateLink();
    }
  }, [store.currentStep]);

  const handleGenerateLink = async () => {
    setSaving(true);

    // Collect all store data as submission
    const submissionData: Record<string, any> = {};
    const keys = [
      'prenom', 'nom', 'telephone', 'linkedinUrl', 'photoPreviewUrl',
      'sermentMois', 'sermentAnnee', 'cabinet', 'cabNat', 'cabTier',
      'departement', 'retrocession', 'bonus', 'hasObjectifFacturable',
      'objectifFacturable', 'objectifFacturableReel', 'conserverRetrocession',
      'raisonsBaisseRetro', 'anglais', 'typesClients', 'disponibilite',
      'isAssocieOrCounsel', 'statutAssoc', 'chiffreAffairesPortable',
      'assocExpertiseSummary', 'assocProjet', 'assocAttentes', 'assocCabTypes',
      'tailleOperations', 'activites', 'pourcentages', 'sousActivites',
      'positionnementPreteur', 'clienteleFrancaise',
      'positionnementRestr', 'clienteleRestr', 'restrFinancier',
      'socialConseil', 'socialRelationType', 'socialIndividuel', 'socialEmployeur',
      'socialPosCabinet', 'socialClientele', 'socialExpertises',
      'maPeFonds', 'maSanteVendeur', 'maVcFonds',
      'maIndusSecteurs', 'maIndusClientele', 'maSanteClientele', 'maVcStades',
      'concAcquereur', 'concCtxDefense', 'concDomestique',
      'concOpsTypes', 'concCtxInterventions', 'concConsMissions', 'concSecteurs', 'concAutorites',
      'fiscInvestisseur', 'fiscCtxDefense', 'fiscDomestique',
      'fiscTransacOps', 'fiscCtxDossiers', 'fiscConsMissions', 'fiscClientele', 'fiscComplexite', 'fiscSpecialisations',
      'dpubPublique', 'dpubCtxDefense', 'dpubDomestique',
      'dpubContratsInterventions', 'dpubCtxInterventions', 'dpubConsDomaines', 'dpubClientele', 'dpubDimensionProjets', 'dpubSecteurs',
      'qualitesAppreciees', 'axesAmelioration', 'motivation',
      'cabinetsCibles', 'noGo', 'noGoCabinets', 'processusCours',
      'souhaitePrendreRdv', 'creneauPrefere',
      'statutEcoute', 'visibilite',
    ];
    keys.forEach(k => {
      submissionData[k] = (store as any)[k];
    });

    const { data, error } = await supabase
      .from('admin_candidate_invites')
      .insert({
        submission_data: submissionData as any,
        created_by: (await supabase.auth.getUser()).data.user!.id,
      })
      .select('token')
      .single();

    setSaving(false);

    if (error || !data) {
      toast.error("Erreur lors de la création de l'invitation");
      store.goToStep(6); // Go back to review
      return;
    }

    const link = `${window.location.origin}/auth?invite=${data.token}`;
    setGeneratedLink(link);
    setPhase('link');
    toast.success('Profil créé — lien d\'invitation généré');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    toast.success('Lien copié !');
    setTimeout(() => setCopied(false), 2000);
  };

  const resetForm = () => {
    store.reset();
    store.setField('isAdminMode', true);
    store.goToStep(2);
    setPhase('stepper');
    setGeneratedLink('');
  };

  // Link generated view
  if (phase === 'link') {
    return (
      <div className="theme-light bg-background min-h-full -m-6 lg:-m-8 p-6 lg:p-8">
        <h1 className="font-serif text-2xl font-bold text-foreground mb-2">Inscription candidat</h1>
        <p className="text-sm text-muted-foreground mb-8">Profil créé avec succès. Transmettez le lien au candidat.</p>

        <div className="bg-card border border-border rounded-lg p-6 max-w-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Link2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{store.prenom} {store.nom}</p>
              <p className="text-xs text-muted-foreground">{store.departement} · {store.cabinet}</p>
            </div>
          </div>

          <Label className="text-xs font-light text-muted-foreground uppercase tracking-wider">Lien d'invitation (sans expiration)</Label>
          <div className="flex gap-2 mt-2 mb-4">
            <Input value={generatedLink} readOnly className="text-xs font-mono" />
            <Button variant="outline" size="icon" onClick={copyLink}>
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>

          <p className="text-[11px] text-muted-foreground leading-relaxed mb-6">
            Le candidat pourra valider son profil et créer son compte (email + mot de passe) via ce lien.
            Aucune expiration. Vous pouvez l'envoyer par SMS ou WhatsApp.
          </p>

          <div className="flex gap-3">
            <Button variant="outline" onClick={resetForm} className="text-xs">
              <UserPlus className="w-3.5 h-3.5 mr-1.5" /> Inscrire un autre candidat
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Multi-step registration (same as candidate flow)
  const renderStep = () => {
    switch (store.currentStep) {
      case 2: return <Step2Identity />;
      case 3: return <Step3Activity />;
      case 4: return <Step4Project />;
      case 5: return <Step5Status />;
      case 6: return <Step6Review />;
      default: return <Step2Identity />;
    }
  };

  return (
    <div className="theme-light bg-background min-h-full -m-6 lg:-m-8">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-4 px-6 pt-4 pb-0">
          <h1 className="font-serif text-lg font-bold text-foreground">Inscrire un candidat</h1>
          <span className="text-[10px] font-sans text-muted-foreground tracking-wide uppercase bg-secondary px-2 py-0.5 rounded-sm">Mode admin</span>
        </div>
        <StepProgress currentStep={store.currentStep} />
      </div>
      {saving ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-muted-foreground">Génération du lien d'invitation…</p>
        </div>
      ) : (
        renderStep()
      )}
    </div>
  );
};

export default AdminRegistration;
