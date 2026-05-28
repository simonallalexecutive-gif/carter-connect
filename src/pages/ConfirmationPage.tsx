import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const ConfirmationPage = () => {
  const [status, setStatus] = useState('Validation en cours...');
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        setStatus('Email validé ! Redirection...');
        setTimeout(() => navigate('/auth'), 2000);
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <p className="text-white text-lg font-serif">{status}</p>
    </div>
  );
};

export default ConfirmationPage;
