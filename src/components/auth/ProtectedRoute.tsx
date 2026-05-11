import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

type Props = {
  children: React.ReactNode;
  /** Optional user_type required to view this route. If unset, any authenticated user is allowed. */
  requireUserType?: 'candidat' | 'cabinet';
};

const ProtectedRoute = ({ children, requireUserType }: Props) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate(`/connexion?redirect=${encodeURIComponent(location.pathname)}`, { replace: true });
      return;
    }
    if (requireUserType) {
      const ut = (user.user_metadata as any)?.user_type;
      if (ut && ut !== requireUserType) {
        navigate(ut === 'cabinet' ? '/cabinet' : '/espace-candidat', { replace: true });
      }
    }
  }, [user, loading, navigate, location.pathname, requireUserType]);

  if (loading || !user) return null;
  return <>{children}</>;
};

export default ProtectedRoute;
