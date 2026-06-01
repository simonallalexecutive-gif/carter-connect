import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCabinetStore } from '@/stores/cabinetStore';
import CabinetStepProgress from '@/components/cabinet/CabinetStepProgress';
import CabinetStep2Identity from '@/components/cabinet/CabinetStep2Identity';
import CabinetStep4Subscription from '@/components/cabinet/CabinetStep4Subscription';
import CabinetStep5Validation from '@/components/cabinet/CabinetStep5Validation';
import { serializeCabinet } from '@/lib/cabinetSerializer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Check, Link2, Building2 } from 'lucide-react';
import { toast } from 'sonner';

const AdminCabinetRegistration = () => {
  const s = useCabinetStore();
  const [phase, setPhase] = useState<'stepper' | 'link'>('stepper');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  // Init: reset store and start at Cabinet identity step (=2)
  useEffect(() => {
    s.reset();
    s.setStep(2);
    return () => { s.reset(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply white registration theme
  useEffect(() => {
    if (phase === 'stepper') document.body.classList.add('theme-light-registration');
    return () => document.body.classList.remove('theme-light-registration');
  }, [phase]);

  // Intercept final confirm: when step reaches 5 → save and produce invite link instead of signing up
  useEffect(() => {
    if (s.step === 5 && phase === 'stepper') {
      handleGenerateLink();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s.step]);

  const handleGenerateLink = async () => {
    setSaving(true);
    const submissionData = {
      ...serializeCabinet(s),
      _userType: 'cabinet' as const,
      _cabinetName: s.cabinetName,
      _palier: s.palier,
      _contacts: s.contacts,
    };

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
      s.setStep(4);
      return;
    }

    const link = `${window.location.origin}/inscription?invite=${data.token}`;
    setGeneratedLink(link);
    setPhase('link');
    toast.success('Cabinet créé — lien d\'invitation généré');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    toast.success('Lien copié !');
    setTimeout(() => setCopied(false), 2000);
  };

  const resetForm = () => {
    s.reset();
    s.setStep(2);
    setPhase('stepper');
    setGeneratedLink('');
  };

  if (phase === 'link') {
    return (
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground mb-2">Inscription cabinet</h1>
        <p className="text-sm text-muted-foreground mb-8">Cabinet créé avec succès. Transmettez le lien au cabinet.</p>

        <div className="bg-background border border-border rounded-lg p-6 max-w-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Link2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{s.cabinetName || 'Cabinet'}</p>
              <p className="text-xs text-muted-foreground">Palier : {s.palier}</p>
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
            Le cabinet pourra valider son profil et créer son compte via ce lien.
          </p>

          <Button variant="outline" onClick={resetForm} className="text-xs">
            <Building2 className="w-3.5 h-3.5 mr-1.5" /> Inscrire un autre cabinet
          </Button>
        </div>
      </div>
    );
  }

  const renderStep = () => {
    switch (s.step) {
      case 2: return <CabinetStep2Identity />;
      case 3: return <CabinetStep4Subscription />;
      case 4: return <CabinetStep5Validation />;
      default: return <CabinetStep2Identity />;
    }
  };

  return (
    <div className="theme-light-registration bg-background min-h-full -m-8 lg:-m-12">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-4 px-6 pt-5 pb-3">
          <h1 className="font-serif text-lg font-normal text-foreground tracking-[-0.01em]">Inscrire un cabinet</h1>
          <span className="text-[10px] font-sans font-medium text-muted-foreground tracking-[0.15em] uppercase bg-secondary px-2 py-0.5 rounded-sm">Mode admin</span>
        </div>
        <CabinetStepProgress />
      </div>
      <div className="pt-10 md:pt-14 px-6 md:px-12 pb-16">
        {saving ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-sm font-sans text-muted-foreground">Génération du lien d'invitation…</p>
          </div>
        ) : (
          renderStep()
        )}
      </div>
    </div>
  );
};

export default AdminCabinetRegistration;
