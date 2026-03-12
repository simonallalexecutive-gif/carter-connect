import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRegistrationStore } from '@/stores/registrationStore';
import { ArrowRight, User, Building2, LogIn } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';

type View = 'choice' | 'login-candidat' | 'login-cabinet';

const Step1Hero = () => {
  const nextStep = useRegistrationStore(s => s.nextStep);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const espaceParam = searchParams.get('espace');

  const initialView: View = espaceParam === 'candidat' ? 'login-candidat' : espaceParam === 'cabinet' ? 'login-cabinet' : 'choice';
  const [view, setView] = useState<View>(initialView);
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (espaceParam === 'candidat') setView('login-candidat');
    else if (espaceParam === 'cabinet') setView('login-cabinet');
  }, [espaceParam]);

  const isLogin = view === 'login-candidat' || view === 'login-cabinet';
  const isCabinet = view === 'login-cabinet';

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 relative overflow-hidden">
      {/* Fixed header — same as landing page */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="px-6 sm:px-8 lg:px-10 flex items-center h-20">
          <Link to="/" className="font-serif text-2xl tracking-[-0.02em] text-white hover:text-white/80 transition-colors duration-300">
            Logan
          </Link>
        </div>
      </header>

      {/* Ambient circles */}
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full border border-white/[0.04] pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-[350px] h-[350px] rounded-full border border-white/[0.03] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-[0.04] pointer-events-none" style={{ background: 'radial-gradient(circle, hsl(0 0% 60%), transparent 70%)' }} />

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
            <div className="w-10 h-px bg-white/30 mx-auto mb-10" />
            <span className="font-serif text-3xl tracking-[-0.02em] text-white block mb-8">
              Logan
            </span>
            <h1 className="text-3xl md:text-5xl font-serif font-normal text-white mb-4 leading-tight tracking-[-0.02em]">
              Rejoignez le réseau<br />
              <em className="text-white/60 font-normal">confidentiel</em>
            </h1>
            <p className="text-sm text-white/45 font-sans font-light mb-14 max-w-md mx-auto leading-relaxed">
              La plateforme de mise en relation entre avocats d'affaires et cabinets de premier plan.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
              <button
                onClick={() => setView('login-candidat')}
                className="group relative p-8 rounded-sm border text-left transition-all duration-500 border-white/10 hover:border-white/30 cursor-pointer hover:bg-white/[0.04]"
              >
                <User className="w-6 h-6 text-white/60 mb-4" />
                <h3 className="font-serif text-xl text-white mb-2 font-normal">Espace candidat</h3>
                <p className="font-sans text-xs text-white/40 font-light leading-relaxed">Avocat en recherche d'opportunités</p>
                <ArrowRight className="w-4 h-4 text-white/50 absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
              <button
                onClick={() => setView('login-cabinet')}
                className="group relative p-8 rounded-sm border text-left transition-all duration-500 border-white/10 hover:border-white/30 cursor-pointer hover:bg-white/[0.04]"
              >
                <Building2 className="w-6 h-6 text-white/60 mb-4" />
                <h3 className="font-serif text-xl text-white mb-2 font-normal">Espace cabinet</h3>
                <p className="font-sans text-xs text-white/40 font-light leading-relaxed">Cabinet à la recherche de talents</p>
                <ArrowRight className="w-4 h-4 text-white/50 absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </div>

            <p className="mt-10 text-xs text-white/25 font-sans font-light tracking-wide">
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
            className="text-center max-w-md w-full relative z-10"
          >
            <div className="w-10 h-px bg-white/30 mx-auto mb-10" />
            <span className="font-serif text-2xl tracking-[-0.02em] text-white block mb-6">
              Logan
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-normal text-white mb-2 tracking-[-0.02em]">
              {isCabinet ? 'Espace cabinet' : 'Espace candidat'}
            </h2>
            <p className="text-sm text-white/45 font-sans font-light mb-12">
              {isCabinet
                ? 'Connectez-vous ou inscrivez votre cabinet.'
                : 'Connectez-vous ou créez votre profil confidentiel.'}
            </p>

            {/* Login form */}
            <div className="border border-white/10 rounded-sm p-8 text-left mb-6 bg-white/[0.03] backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-6">
                <LogIn className="w-4 h-4 text-white/60" />
                <p className="text-[10px] font-sans font-medium tracking-[0.15em] uppercase text-white/50">Déjà inscrit</p>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="font-sans text-xs text-white/40 uppercase tracking-wider">Identifiant / Code</Label>
                  <Input
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    placeholder={isCabinet ? 'Votre identifiant cabinet' : 'Votre identifiant Logan'}
                    className="mt-2 bg-white/[0.05] border-white/10 text-white placeholder:text-white/20 focus:border-white/30"
                  />
                </div>
                <div>
                  <Label className="font-sans text-xs text-white/40 uppercase tracking-wider">Mot de passe</Label>
                  <Input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="mt-2 bg-white/[0.05] border-white/10 text-white placeholder:text-white/20 focus:border-white/30"
                  />
                </div>
                <Button
                  disabled={!code || !password}
                  className="w-full bg-white text-black hover:bg-white/90 font-sans text-sm font-medium rounded-sm py-5"
                >
                  Se connecter
                </Button>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs font-sans text-white/30 font-light">ou</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Register CTA */}
            <Button
              onClick={() => {
                if (isCabinet) {
                  navigate('/cabinet?start=2');
                } else {
                  nextStep();
                }
              }}
              variant="outline"
              size="lg"
              className="w-full border-white/20 text-white hover:bg-white/[0.06] hover:border-white/40 font-sans text-sm font-medium rounded-sm py-5 group"
            >
              Je m'inscris
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>

            <button
              onClick={() => { setView('choice'); setCode(''); setPassword(''); }}
              className="mt-8 text-xs font-sans font-light text-white/35 hover:text-white/70 transition-colors"
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
