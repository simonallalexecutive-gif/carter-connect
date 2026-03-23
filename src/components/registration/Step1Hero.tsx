import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRegistrationStore } from '@/stores/registrationStore';
import { ArrowRight, User, Building2, LogIn } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type View = 'choice' | 'login-candidat' | 'login-cabinet';

interface Step1HeroProps {
  onBeforeRegister?: () => void;
}

const Step1Hero = ({ onBeforeRegister }: Step1HeroProps) => {
  const nextStep = useRegistrationStore(s => s.nextStep);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const espaceParam = searchParams.get('espace');

  const initialView: View = espaceParam === 'candidat' ? 'login-candidat' : espaceParam === 'cabinet' ? 'login-cabinet' : 'choice';
  const [view, setView] = useState<View>(initialView);
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!code || !password) return;
    setSubmitting(true);
    try {
      const { error } = await (supabase.auth as any).signInWithPassword({
        email: code,
        password,
      });
      if (error) throw error;
      toast.success('Connexion réussie');
      if (isCabinet) {
        navigate('/cabinet');
      } else {
        navigate('/espace-candidat');
      }
    } catch (error: any) {
      toast.error(error.message || 'Erreur de connexion');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (espaceParam === 'candidat') setView('login-candidat');
    else if (espaceParam === 'cabinet') setView('login-cabinet');
  }, [espaceParam]);

  const isLogin = view === 'login-candidat' || view === 'login-cabinet';
  const isCabinet = view === 'login-cabinet';

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 relative overflow-hidden">
      {/* Fixed header */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="px-6 sm:px-8 lg:px-10 flex items-center h-20">
          <Link to="/" className="font-serif text-2xl tracking-[-0.02em] text-black hover:text-black/80 transition-colors duration-300">
            Logan
          </Link>
        </div>
      </header>

      {/* Ambient circles */}
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full border border-black/[0.04] pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-[350px] h-[350px] rounded-full border border-black/[0.03] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-[0.04] pointer-events-none" style={{ background: 'radial-gradient(circle, hsl(0 0% 40%), transparent 70%)' }} />

      <AnimatePresence mode="wait">
        {view === 'choice' && (
          <motion.div
            key="choice"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-2xl w-full relative z-10"
          >
            <div className="w-10 h-px bg-black/20 mx-auto mb-10" />
            <h1 className="text-3xl md:text-5xl font-serif font-normal text-black mb-4 leading-tight tracking-[-0.02em]">
              Rejoignez le réseau<br />
              <em className="text-black/50 font-normal">confidentiel</em>
            </h1>
            <p className="text-sm text-black/45 font-sans font-light mb-14 max-w-md mx-auto leading-relaxed">
              La plateforme de mise en relation entre avocats d'affaires et cabinets de premier plan.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
              <button
                onClick={() => setView('login-candidat')}
                className="group relative p-8 rounded-sm border text-left transition-all duration-500 border-black/10 hover:border-black/30 cursor-pointer hover:bg-black/[0.02]"
              >
                <User className="w-6 h-6 text-black/50 mb-4" />
                <h3 className="font-serif text-xl text-black mb-2 font-normal">Espace candidat</h3>
                <p className="font-sans text-xs text-black/40 font-light leading-relaxed">Avocat en recherche d'opportunités</p>
                <ArrowRight className="w-4 h-4 text-black/40 absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
              <button
                onClick={() => setView('login-cabinet')}
                className="group relative p-8 rounded-sm border text-left transition-all duration-500 border-black/10 hover:border-black/30 cursor-pointer hover:bg-black/[0.02]"
              >
                <Building2 className="w-6 h-6 text-black/50 mb-4" />
                <h3 className="font-serif text-xl text-black mb-2 font-normal">Espace cabinet</h3>
                <p className="font-sans text-xs text-black/40 font-light leading-relaxed">Cabinet à la recherche de talents</p>
                <ArrowRight className="w-4 h-4 text-black/40 absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </div>

            <p className="mt-10 text-xs text-black/25 font-sans font-light tracking-wide">
              Inscription confidentielle · Profil validé sous 48h
            </p>
          </motion.div>
        )}

        {isLogin && (
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-md w-full relative z-10 mt-20"
          >
            <div className="w-10 h-px bg-black/20 mx-auto mb-8" />
            <h2 className="text-lg md:text-xl font-serif font-normal text-black/70 mb-1 tracking-[-0.02em]">
              {isCabinet ? 'Espace cabinet' : 'Espace candidat'}
            </h2>
            <p className="text-xs text-black/40 font-sans font-light mb-10">
              {isCabinet
                ? 'Connectez-vous ou inscrivez votre cabinet.'
                : 'Connectez-vous ou créez votre profil confidentiel.'}
            </p>

            {/* Login form */}
            <div className="border border-black/10 rounded-sm p-8 text-left mb-5 bg-black/[0.02]">
              <div className="flex items-center gap-2 mb-6">
                <LogIn className="w-4 h-4 text-black/50" />
                <p className="text-[10px] font-sans font-medium tracking-[0.15em] uppercase text-black/50">Déjà inscrit</p>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="font-sans text-xs text-black/40 uppercase tracking-wider">Email</Label>
                  <Input
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    type="email"
                    placeholder={isCabinet ? 'votre@email.com' : 'votre@email.com'}
                    className="mt-2 bg-white border-black/10 text-black placeholder:text-black/25 focus:border-black/30"
                  />
                </div>
                <div>
                  <Label className="font-sans text-xs text-black/40 uppercase tracking-wider">Mot de passe</Label>
                  <Input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="mt-2 bg-white border-black/10 text-black placeholder:text-black/25 focus:border-black/30"
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  />
                </div>
                <Button
                  onClick={handleLogin}
                  disabled={!code || !password || submitting}
                  className="w-full bg-black text-white hover:bg-black/90 font-sans text-sm font-medium rounded-sm py-5"
                >
                  {submitting ? 'Connexion...' : 'Se connecter'}
                </Button>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-5">
              <div className="flex-1 h-px bg-black/10" />
              <span className="text-xs font-sans text-black/30 font-light">ou</span>
              <div className="flex-1 h-px bg-black/10" />
            </div>

            {/* Register CTA */}
            <Button
              onClick={() => {
                if (isCabinet) {
                  navigate('/cabinet?start=2');
                } else if (onBeforeRegister) {
                  onBeforeRegister();
                } else {
                  nextStep();
                }
              }}
              size="lg"
              className="w-full bg-black text-white hover:bg-black/90 font-sans text-sm font-medium rounded-sm py-5 group"
            >
              Je m'inscris
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>

            <button
              onClick={() => { setView('choice'); setCode(''); setPassword(''); }}
              className="mt-8 text-xs font-sans font-light text-black/35 hover:text-black/70 transition-colors"
            >
              ← Retour
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Step1Hero;
