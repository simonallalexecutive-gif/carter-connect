import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const ConnexionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  // Gérer le retour depuis l'email de confirmation (code PKCE ou token hash)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const tokenHash = params.get('token_hash');
    const type = params.get('type');
    const hash = location.hash;
    const hasToken = code || tokenHash || hash.includes('access_token=');

    if (!hasToken) return;

    const handle = async () => {
      try {
        if (code) {
          // PKCE flow
          await (supabase.auth as any).exchangeCodeForSession(code);
        }
        // Pour implicit flow, Supabase le gère automatiquement via onAuthStateChange
        setConfirmed(true);
        // Retirer les params de l'URL sans recharger
        window.history.replaceState({}, '', '/connexion');
        // Déconnecter pour forcer une reconnexion manuelle propre
        await (supabase.auth as any).signOut();
      } catch (err) {
        console.error('Token exchange error:', err);
        setConfirmed(true); // Afficher quand même le message de confirmation
        window.history.replaceState({}, '', '/connexion');
      }
    };

    handle();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setSubmitting(true);
    try {
      const { data, error } = await (supabase.auth as any).signInWithPassword({ email, password });
      if (error) throw error;
      if (!data?.user?.email_confirmed_at) {
        await (supabase.auth as any).signOut();
        toast.error('Confirmez votre email avant de vous connecter.');
        return;
      }

      const userId = data.user.id;

      // Détecter le type d'utilisateur : cabinet ou candidat
      const { data: cabinet } = await (supabase as any)
        .from('cabinet_accounts')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (cabinet) {
        navigate('/cabinet');
        return;
      }

      const { data: candidate } = await (supabase as any)
        .from('candidate_registrations')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (candidate) {
        navigate('/espace-candidat');
        return;
      }

      // Admin ou autre → espace candidat par défaut
      navigate('/espace-candidat');
    } catch (err: any) {
      toast.error(err.message || 'Identifiants incorrects.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = 'w-full bg-white/[0.04] border border-white/15 text-white placeholder:text-white/25 rounded-sm px-4 py-3 text-sm focus:border-white/40 focus:outline-none transition-colors';
  const labelCls = 'text-[9px] font-sans font-semibold tracking-[0.18em] uppercase text-white/30 mb-1.5 block';

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header minimal */}
      <header className="px-8 h-16 flex items-center">
        <Link to="/" className="font-serif text-[28px] tracking-[0.04em] text-white hover:opacity-70 transition-opacity">
          Logan
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-sm"
        >
          <AnimatePresence mode="wait">
            {confirmed ? (
              /* ── Écran post-confirmation email ── */
              <motion.div
                key="confirmed"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="text-center"
              >
                <CheckCircle2 className="w-8 h-8 text-white/35 mx-auto mb-6" />
                <h1 className="font-serif font-[300] text-[2rem] text-white leading-[1.1] mb-3">
                  Email confirmé.
                </h1>
                <p className="text-white/35 font-sans font-light text-[0.88rem] leading-relaxed mb-10">
                  Votre adresse a bien été vérifiée.<br />Connectez-vous pour accéder à votre espace.
                </p>
                <Button
                  onClick={() => setConfirmed(false)}
                  className="w-full bg-white text-black hover:bg-white/90 font-sans text-[12.3px] font-normal rounded-sm py-5 tracking-wide"
                >
                  Se connecter →
                </Button>
              </motion.div>
            ) : (
              /* ── Formulaire de connexion ── */
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h1 className="font-serif font-[300] text-[2rem] text-white leading-[1.1] mb-2">
                  Connexion.
                </h1>
                <p className="text-white/35 font-sans font-light text-[0.88rem] leading-relaxed mb-10">
                  Accédez à votre espace Logan.
                </p>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className={labelCls}>Email</label>
                    <input
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      type="email"
                      placeholder="votre@email.com"
                      autoComplete="email"
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Mot de passe</label>
                    <div className="relative">
                      <input
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        className={cn(inputCls, 'pr-10')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={!email || !password || submitting}
                    className="w-full bg-white text-black hover:bg-white/90 font-sans text-[12.3px] font-normal rounded-sm py-5 mt-2 tracking-wide disabled:opacity-25"
                  >
                    {submitting ? 'Connexion…' : 'Accéder à mon espace →'}
                  </Button>
                </form>

                <div className="mt-8 flex flex-col gap-3 items-center">
                  <Link to="/reset-password" className="text-white/25 hover:text-white/50 font-sans text-[11px] tracking-wide transition-colors">
                    Mot de passe oublié ?
                  </Link>
                  <Link to="/candidat" className="text-white/25 hover:text-white/50 font-sans text-[11px] tracking-wide transition-colors">
                    Pas encore de compte ? Rejoindre Logan
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
};

export default ConnexionPage;
