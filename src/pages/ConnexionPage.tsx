import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const ConnexionPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showChoice, setShowChoice] = useState(false);
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user?.email_confirmed_at) {
      setShowChoice(true);
    }
  }, [user, loading]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data, error } = await (supabase.auth as any).signInWithPassword({ email, password });
      if (error) throw error;
      if (!data?.user?.email_confirmed_at) {
        await (supabase.auth as any).signOut();
        toast.error('Confirmez votre email avant de vous connecter');
        return;
      }
      toast.success('Connexion réussie');
      setShowChoice(true);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center pt-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md text-center"
        >
          <div className="w-12 h-px bg-black/20 mx-auto mb-8" />

          {showChoice ? (
            <>
              <h1 className="font-sans text-3xl md:text-4xl text-black mb-4">
                Bienvenue
              </h1>
              <p className="text-sm text-black/60 font-sans leading-relaxed mb-10">
                Choisissez votre espace
              </p>
              <div className="flex flex-col gap-4 max-w-sm mx-auto">
                <Button
                  onClick={() => navigate('/espace-candidat')}
                  className="w-full py-6 font-sans text-sm"
                >
                  Espace Candidat
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/cabinet')}
                  className="w-full py-6 font-sans text-sm"
                >
                  Espace Cabinet
                </Button>
              </div>
            </>
          ) : (
            <>
              <h1 className="font-serif text-3xl md:text-4xl text-black mb-4">
                Connexion
              </h1>
              <p className="text-sm text-black/60 font-sans leading-relaxed mb-10">
                Accédez à votre espace Logan
              </p>

              <form onSubmit={handleLogin} className="space-y-4 max-w-sm mx-auto text-left">
                <div>
                  <Label htmlFor="email" className="font-sans text-xs text-black/60 uppercase tracking-wider">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="font-sans text-xs text-black/60 uppercase tracking-wider">
                    Mot de passe
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="mt-1"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full py-6 font-sans text-sm"
                  disabled={submitting}
                >
                  {submitting ? 'Chargement...' : 'Se connecter'}
                </Button>
              </form>
            </>
          )}

        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default ConnexionPage;
