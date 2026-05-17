import { motion } from 'motion/react';
import { useCabinetStore } from '@/stores/cabinetStore';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

const CabinetStep6Confirm = () => {
  const s = useCabinetStore();
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    const registerCabinet = async () => {
      if (registered || registering || !s.email || !s.password) return;
      setRegistering(true);
      try {
        const { data, error } = await supabase.auth.signUp({
          email: s.email,
          password: s.password,
          options: {
            emailRedirectTo: `${window.location.origin}/cabinet`,
            data: {
              full_name: s.cabinetName,
              user_type: 'cabinet',
            },
          },
        });
        if (error) throw error;
        if (data?.session) {
          await supabase.auth.signOut();
        }
        setRegistered(true);
        toast.success('Compte créé avec succès');
      } catch (error: unknown) {
        toast.error(error instanceof Error ? error.message : 'Erreur lors de la création du compte');
      } finally {
        setRegistering(false);
      }
    };

    registerCabinet();
  }, [registered, registering, s.cabinetName, s.email, s.password]);

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
          Un email de vérification a été envoyé à <strong>{s.email}</strong>. Cliquez sur le lien pour activer votre compte, puis connectez-vous pour accéder à votre espace cabinet.
        </p>
        <Button
          onClick={() => { window.location.href = '/connexion'; }}
          className="w-full bg-foreground text-background hover:bg-foreground/90 font-sans text-sm font-bold py-6 rounded-sm"
        >
          Aller à la connexion →
        </Button>
      </div>
    </motion.div>
  );
};

export default CabinetStep6Confirm;
