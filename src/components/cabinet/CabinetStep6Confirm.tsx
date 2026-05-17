import { motion } from 'motion/react';
import { useCabinetStore } from '@/stores/cabinetStore';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Mail, Check } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';

const CabinetStep6Confirm = () => {
  const s = useCabinetStore();
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const registrationStarted = useRef(false);

  useEffect(() => {
    const registerCabinet = async () => {
      if (registrationStarted.current || registered || registering || !s.email || !s.password) return;
      registrationStarted.current = true;
      setRegistering(true);
      setError(null);
      try {
        const { data, error } = await supabase.auth.signUp({
          email: s.email,
          password: s.password,
          options: {
            emailRedirectTo: `${window.location.origin}/cabinet`,
            data: {
              full_name: s.cabinetName,
              cabinet_name: s.cabinetName,
              user_type: 'cabinet',
            },
          },
        });
        if (error) throw error;
        // Force the classic email-verification flow: no active session.
        if (data?.session) {
          await supabase.auth.signOut();
        }
        setRegistered(true);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Erreur lors de la création du compte';
        setError(msg);
        toast.error(msg);
      } finally {
        setRegistering(false);
      }
    };

    registerCabinet();
  }, [registered, registering, s.cabinetName, s.email, s.password]);

  const handleResend = async () => {
    if (!s.email) return;
    setResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: s.email,
        options: { emailRedirectTo: `${window.location.origin}/cabinet` },
      });
      if (error) throw error;
      toast.success('Email de vérification renvoyé');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Erreur lors de l’envoi');
    } finally {
      setResending(false);
    }
  };

  if (registering && !registered) {
    return (
      <div className="max-w-[600px] mx-auto text-center py-16 px-6">
        <div className="w-10 h-10 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin mx-auto mb-6" />
        <p className="text-sm text-muted-foreground">Création de votre compte cabinet…</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-[600px] mx-auto text-center py-12 px-6"
    >
      <div className="w-[76px] h-[76px] rounded-full bg-foreground flex items-center justify-center mx-auto mb-7">
        {error ? (
          <Mail className="w-8 h-8 text-background" strokeWidth={2} />
        ) : (
          <Check className="w-8 h-8 text-background" strokeWidth={2.5} />
        )}
      </div>

      <h2 className="font-sans text-3xl font-bold text-foreground mb-3">
        {error ? 'Création du compte interrompue' : 'Vérifiez votre adresse email'}
      </h2>
      <p className="text-sm text-muted-foreground leading-relaxed font-light max-w-md mx-auto mb-8">
        {error
          ? error
          : 'Votre compte cabinet a été créé. Un email de validation vient d’être envoyé pour confirmer votre inscription. Cliquez sur le lien dans cet email pour activer votre accès.'}
      </p>

      {!error && (
        <div className="bg-secondary rounded p-5 max-w-[440px] mx-auto mb-7 text-left flex items-start gap-3">
          <Mail className="w-5 h-5 text-foreground mt-0.5 shrink-0" strokeWidth={1.5} />
          <div className="min-w-0">
            <div className="text-[11px] text-muted-foreground uppercase tracking-[0.08em] mb-1">Email envoyé à</div>
            <div className="font-sans text-sm font-medium text-foreground truncate">{s.email}</div>
          </div>
        </div>
      )}

      <div className="border-t border-border pt-6 max-w-[440px] mx-auto space-y-3">
        {!error && (
          <Button
            onClick={handleResend}
            disabled={resending}
            variant="outline"
            className="w-full font-sans text-sm py-5 rounded-sm"
          >
            {resending ? 'Envoi…' : 'Renvoyer l’email de vérification'}
          </Button>
        )}
        <Button
          onClick={() => { window.location.href = '/connexion'; }}
          className="w-full bg-foreground text-background hover:bg-foreground/90 font-sans text-sm font-bold py-6 rounded-sm"
        >
          Aller à la connexion →
        </Button>
        <p className="text-[11px] text-muted-foreground pt-2">
          Une fois votre email validé, vous pourrez vous connecter pour accéder à votre espace cabinet.
        </p>
      </div>
    </motion.div>
  );
};

export default CabinetStep6Confirm;
