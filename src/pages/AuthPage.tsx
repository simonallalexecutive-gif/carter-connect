import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { toast } from 'sonner';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [userType, setUserType] = useState<'candidat' | 'cabinet'>('candidat');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user?.email_confirmed_at) {
      navigate('/espace-candidat');
    }
  }, [user, loading, navigate]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (isLogin) {
        const { data, error } = await (supabase.auth as any).signInWithPassword({ email, password });
        if (error) throw error;
        if (!data?.user?.email_confirmed_at) {
          await (supabase.auth as any).signOut();
          toast.error('Confirmez votre email avant de vous connecter');
          return;
        }
        toast.success('Connexion réussie');
        navigate('/espace-candidat');
      } else {
        const { error } = await (supabase.auth as any).signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth`,
            data: { full_name: fullName, user_type: userType },
          },
        });
        if (error) throw error;
        toast.success('Vérifiez votre email pour confirmer votre inscription');
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center pt-20 px-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-3">
              {isLogin ? 'Connexion' : 'Inscription'}
            </h1>
            <p className="text-sm text-muted-foreground font-sans">
              {isLogin
                ? 'Accédez à votre espace Logan'
                : 'Rejoignez le réseau confidentiel Logan'}
            </p>
          </div>

          {/* Email form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <Label htmlFor="fullName" className="font-sans text-xs text-muted-foreground uppercase tracking-wider">
                    Nom complet
                  </Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="font-sans text-xs text-muted-foreground uppercase tracking-wider">
                    Je suis
                  </Label>
                  <div className="flex gap-3 mt-1">
                    <Button
                      type="button"
                      variant={userType === 'candidat' ? 'default' : 'outline'}
                      className="flex-1 font-sans text-sm"
                      onClick={() => setUserType('candidat')}
                    >
                      Candidat
                    </Button>
                    <Button
                      type="button"
                      variant={userType === 'cabinet' ? 'default' : 'outline'}
                      className="flex-1 font-sans text-sm"
                      onClick={() => setUserType('cabinet')}
                    >
                      Cabinet
                    </Button>
                  </div>
                </div>
              </>
            )}
            <div>
              <Label htmlFor="email" className="font-sans text-xs text-muted-foreground uppercase tracking-wider">
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
              <Label htmlFor="password" className="font-sans text-xs text-muted-foreground uppercase tracking-wider">
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
              {submitting
                ? 'Chargement...'
                : isLogin
                  ? 'Se connecter'
                  : "S'inscrire"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6 font-sans">
            {isLogin ? "Pas encore de compte ?" : 'Déjà un compte ?'}{' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-foreground underline hover:no-underline"
            >
              {isLogin ? "S'inscrire" : 'Se connecter'}
            </button>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AuthPage;
