import { motion } from 'motion/react';
import { useCabinetStore } from '@/stores/cabinetStore';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { serializeCabinet } from '@/lib/cabinetSerializer';

const CabinetStep6Confirm = () => {
  const s = useCabinetStore();
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    const registerCabinet = async () => {
      if (registered || registering || !s.email || !s.password) return;
      setRegistering(true);
      try {
        const { data: signUpData, error } = await (supabase.auth as any).signUp({
          email: s.email,
          password: s.password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              full_name: s.cabinetName,
              cabinet_name: s.cabinetName,
              user_type: 'cabinet',
            },
          },
        });
        if (error) throw error;

        const userId = signUpData?.user?.id;
        if (userId) {
          // Upload logo if it's a File-derived data URL — convert to blob and upload
          let logoStoragePath: string | null = null;
          try {
            if (s.cabinetLogoUrl && s.cabinetLogoUrl.startsWith('data:')) {
              const res = await fetch(s.cabinetLogoUrl);
              const blob = await res.blob();
              const ext = (blob.type.split('/')[1] || 'png').split('+')[0];
              const path = `${userId}/logo-${Date.now()}.${ext}`;
              const { error: upErr } = await supabase.storage
                .from('cabinet-files')
                .upload(path, blob, { upsert: true, contentType: blob.type });
              if (!upErr) logoStoragePath = path;
            } else if (s.cabinetLogoUrl) {
              // Remote URL (e.g. Clearbit) — keep as-is
              logoStoragePath = s.cabinetLogoUrl;
            }
          } catch (e) { console.warn('Logo upload failed', e); }

          const submissionData = serializeCabinet(s);

          // The handle_new_user trigger inserted an empty row → UPDATE it
          const { error: updErr } = await supabase
            .from('cabinet_accounts')
            .update({
              cabinet_name: s.cabinetName || 'Cabinet',
              logo_url: logoStoragePath,
              palier: s.palier || 'business',
              submission_data: submissionData as any,
              contacts: (s.contacts || []) as any,
              searches: (s.searches || []) as any,
            } as any)
            .eq('user_id', userId);

          if (updErr) console.error('Failed to persist cabinet:', updErr);
        }

        setRegistered(true);
        toast.success('Compte créé avec succès');
      } catch (error: any) {
        toast.error(error.message || 'Erreur lors de la création du compte');
      } finally {
        setRegistering(false);
      }
    };

    registerCabinet();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-[600px] mx-auto text-center py-12 px-6"
    >
      <div className="w-[76px] h-[76px] rounded-full bg-foreground flex items-center justify-center mx-auto mb-7">
        <Check className="w-8 h-8 text-background" strokeWidth={2.5} />
      </div>

      <h2 className="font-sans text-3xl font-bold text-foreground mb-3">Demande transmise à LOGAN</h2>
      <p className="text-sm text-muted-foreground leading-relaxed font-light max-w-md mx-auto mb-8">
        Votre compte a été créé. Vérifiez votre email pour confirmer votre inscription, puis connectez-vous pour accéder à votre espace cabinet.
      </p>

      <div className="grid grid-cols-3 gap-3 max-w-[460px] mx-auto mb-9">
        {[
          { value: '48h', label: 'Activation' },
          { value: '0%', label: 'Commission' },
          { value: '100%', label: 'Confidentiel' },
        ].map((stat) => (
          <div key={stat.label} className="bg-secondary rounded p-4 text-center">
            <div className="font-sans text-xl font-bold text-foreground">{stat.value}</div>
            <div className="text-[9px] text-muted-foreground mt-1 uppercase tracking-[0.06em]">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-foreground rounded p-4 max-w-[440px] mx-auto mb-7 text-left">
        <div className="text-[11px] text-white/40 mb-1">Votre contact LOGAN</div>
        <div className="font-sans text-base text-white font-semibold">Équipe LOGAN Advisory</div>
        <div className="text-xs text-white/60 mt-1">contact@logan-advisory.com</div>
      </div>

      <div className="border-t border-border pt-6 max-w-[440px] mx-auto">
        <p className="text-[11px] text-muted-foreground mb-4">
          Une fois votre email confirmé, connectez-vous depuis l'espace cabinet pour accéder à votre tableau de bord.
        </p>
        <Button
          onClick={() => s.setStep(6)}
          className="w-full bg-foreground text-background hover:bg-foreground/90 font-sans text-sm font-bold py-6 rounded-sm"
        >
          Accéder à mon espace cabinet →
        </Button>
      </div>
    </motion.div>
  );
};

export default CabinetStep6Confirm;
