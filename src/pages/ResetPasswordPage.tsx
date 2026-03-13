import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('type=recovery')) {
      setIsRecovery(true);
    }
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await (supabase.auth as any).updateUser({ password });
      if (error) throw error;
      toast.success('Mot de passe mis à jour');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isRecovery) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center pt-20 px-6">
          <p className="text-muted-foreground font-sans">Lien invalide ou expiré.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center pt-20 px-6">
        <div className="w-full max-w-md">
          <h1 className="font-serif text-3xl text-foreground mb-6 text-center">Nouveau mot de passe</h1>
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <Label htmlFor="password" className="font-sans text-xs text-muted-foreground uppercase tracking-wider">
                Nouveau mot de passe
              </Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="mt-1" />
            </div>
            <Button type="submit" className="w-full py-6 font-sans text-sm" disabled={submitting}>
              {submitting ? 'Chargement...' : 'Mettre à jour'}
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResetPasswordPage;
