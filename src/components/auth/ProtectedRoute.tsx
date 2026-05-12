import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

type Props = {
  children: React.ReactNode;
  requireUserType?: 'candidat' | 'cabinet';
  /** If true (default for candidats), require status === 'approved'. */
  requireApproved?: boolean;
};

const ProtectedRoute = ({ children, requireUserType, requireApproved = true }: Props) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate(`/connexion?redirect=${encodeURIComponent(location.pathname)}`, { replace: true });
      return;
    }

    const ut = (user.user_metadata as any)?.user_type;
    if (requireUserType && ut && ut !== requireUserType) {
      navigate(ut === 'cabinet' ? '/cabinet' : '/espace-candidat', { replace: true });
      return;
    }

    const run = async () => {
      // Admins always allowed
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);
      const isAdmin = (roles ?? []).some((r: any) => r.role === 'admin');
      if (isAdmin) { setAllowed(true); setChecking(false); return; }

      // Candidate approval gate
      if (requireApproved && (requireUserType === 'candidat' || ut === 'candidat')) {
        const { data: reg } = await supabase
          .from('candidate_registrations')
          .select('status')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        if (!reg || reg.status !== 'approved') {
          navigate('/en-attente-validation', { replace: true });
          return;
        }
      }
      setAllowed(true);
      setChecking(false);
    };
    run();
  }, [user, loading, navigate, location.pathname, requireUserType, requireApproved]);

  if (loading || checking || !user || !allowed) return null;
  return <>{children}</>;
};

export default ProtectedRoute;
