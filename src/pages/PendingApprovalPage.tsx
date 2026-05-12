import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Mail, Clock, CheckCircle2 } from 'lucide-react';

const PendingApprovalPage = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState<string>('pending_email_verification');

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate('/connexion', { replace: true }); return; }
    (async () => {
      const { data } = await supabase
        .from('candidate_registrations')
        .select('status')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (data?.status === 'approved') { navigate('/espace-candidat', { replace: true }); return; }
      if (data?.status) setStatus(data.status);
      else setStatus(user.email_confirmed_at ? 'pending_admin_approval' : 'pending_email_verification');
    })();
  }, [user, loading, navigate]);

  const isEmailPending = status === 'pending_email_verification' && !user?.email_confirmed_at;

  return (
    <div className="min-h-screen bg-[hsl(0,0%,7%)] text-white flex items-center justify-center px-6">
      <div className="max-w-lg text-center">
        <span className="font-serif text-xl tracking-[-0.02em] block mb-12">Logan</span>
        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-8">
          {isEmailPending ? <Mail className="w-7 h-7" /> : <Clock className="w-7 h-7" />}
        </div>
        <h1 className="text-3xl font-serif mb-4 tracking-[-0.02em]">
          {isEmailPending ? 'Vérifiez votre adresse email' : 'Profil en cours de validation'}
        </h1>
        <p className="text-sm text-white/60 leading-relaxed mb-10 font-light">
          {isEmailPending
            ? 'Cliquez sur le lien envoyé par email pour confirmer votre inscription. Une fois validé, votre profil sera examiné par l’équipe Logan sous 48 heures ouvrées.'
            : 'Votre adresse a bien été vérifiée. L’équipe Logan examine votre profil et reviendra vers vous sous 48 heures ouvrées avec l’ouverture de votre espace candidat.'}
        </p>
        <div className="flex items-center justify-center gap-3 text-[11px] text-white/40 mb-10">
          <span className={`flex items-center gap-1.5 ${user?.email_confirmed_at ? 'text-white/80' : ''}`}>
            <CheckCircle2 className="w-3.5 h-3.5" /> Email vérifié
          </span>
          <span>·</span>
          <span className={status === 'approved' ? 'text-white/80' : ''}>Validation Logan</span>
        </div>
        <Button onClick={signOut} variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/5 rounded-sm">
          Se déconnecter
        </Button>
      </div>
    </div>
  );
};

export default PendingApprovalPage;
