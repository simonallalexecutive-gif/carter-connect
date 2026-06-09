import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const ConnexionCandidatPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
          <p className="text-[11px] font-sans tracking-[0.22em] uppercase text-white/30 mb-5">
            Espace candidat
          </p>
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
      </main>
    </div>
  );
};

export default ConnexionCandidatPage;
