import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const ConfirmationPage = () => {
  const [status, setStatus] = useState('Validation de votre email en cours...');
  const navigate = useNavigate();

  useEffect(() => {
    const redirect = () => {
      setStatus('Email confirmé. Redirection vers votre espace...');
      setTimeout(() => navigate('/espace-candidat'), 2000);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) redirect();
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') redirect();
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p style={{ fontFamily: "'Bodoni Moda', 'Georgia', serif" }} className="text-[36px] font-light tracking-[0.06em] text-white mb-6">Logan</p>
        <p className="text-[10px] text-white/40 font-sans tracking-[0.18em] uppercase mb-10">Réseau confidentiel d'avocats d'affaires</p>
        <div className="w-8 h-px bg-white/20 mx-auto mb-8" />
        <p className="text-white/70 font-sans font-light text-sm leading-relaxed">{status}</p>
      </div>
    </div>
  );
};

export default ConfirmationPage;
