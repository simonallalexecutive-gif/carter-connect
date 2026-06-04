import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
const AdminLoginPage = () => {
  const [email, setEmail] = useState('simonallal.executive@gmail.com');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin + '/admin' } });
    setSent(true);
    setLoading(false);
  };
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <p className="font-serif text-[32px] tracking-[0.04em] text-white text-center mb-12">Logan</p>
        <h1 className="text-2xl font-serif text-white mb-8 text-center">Espace administrateur</h1>
        {sent ? <p className="text-white/60 text-center">Lien envoyé — vérifiez {email}</p> : (
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-sm text-white" />
            <Button type="submit" disabled={loading} className="w-full bg-white text-black rounded-sm">{loading?'Envoi...':'Recevoir le lien de connexion'}</Button>
          </form>
        )}
      </div>
    </div>
  );
};
export default AdminLoginPage;