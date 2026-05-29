import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const ConfirmationPage = () => {
  const [status, setStatus] = useState('Validation de votre email en cours...');
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setStatus('Email validé ! Redirection...');
        setTimeout(() => navigate('/auth'), 2000);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setStatus('Email validé ! Redirection...');
        setTimeout(() => navigate('/auth'), 2000);
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <p className="font-display text-xl text-white mb-4">Logan</p>
        <p className="text-white/60 font-sans">{status}</p>
      </div>
    </div>
  );
};

export default ConfirmationPage;
