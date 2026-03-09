import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
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
    if (!loading && user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success('Connexion réussie');
        navigate('/');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
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
                ? 'Accédez à votre espace Carter'
                : 'Rejoignez le réseau confidentiel Carter'}
            </p>
          </div>

          {/* Google */}
          <Button
            variant="outline"
            className="w-full mb-6 py-6 font-sans text-sm"
            onClick={handleGoogleLogin}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continuer avec Google
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground font-sans">ou</span>
            </div>
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
