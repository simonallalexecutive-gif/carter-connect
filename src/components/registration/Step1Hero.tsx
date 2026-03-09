import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRegistrationStore } from '@/stores/registrationStore';
import { ArrowRight, User, Building2, LogIn } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type View = 'choice' | 'login-candidat';

const Step1Hero = () => {
  const nextStep = useRegistrationStore(s => s.nextStep);
  const navigate = useNavigate();
  const [view, setView] = useState<View>('choice');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen gradient-dark flex items-center justify-center px-6">
      <AnimatePresence mode="wait">
        {view === 'choice' && (
          <motion.div
            key="choice"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-2xl w-full"
          >
            <div className="carter-divider mx-auto mb-10" />
            <span className="font-serif text-3xl tracking-[-0.02em] text-foreground block mb-8">
              Carter
            </span>
            <h1 className="text-3xl md:text-5xl font-serif font-normal text-foreground mb-4 leading-tight tracking-[-0.02em]">
              Rejoignez le réseau<br />
              <em className="text-accent font-normal">confidentiel</em>
            </h1>
            <p className="text-sm text-muted-foreground font-sans font-light mb-14 max-w-md mx-auto leading-relaxed">
              La plateforme de mise en relation entre avocats d'affaires et cabinets de premier plan.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
              <button
                onClick={() => setView('login-candidat')}
                className="group relative p-8 rounded-sm border text-left transition-all duration-500 border-border hover:border-accent/50 cursor-pointer hover:bg-card/50"
              >
                <User className="w-6 h-6 text-accent mb-4" />
                <h3 className="font-serif text-xl text-foreground mb-2 font-normal">Espace candidat</h3>
                <p className="font-sans text-xs text-muted-foreground font-light leading-relaxed">Avocat en recherche d'opportunités</p>
                <ArrowRight className="w-4 h-4 text-accent absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
              <button
                onClick={() => navigate('/cabinet')}
                className="group relative p-8 rounded-sm border text-left transition-all duration-500 border-border hover:border-accent/50 cursor-pointer hover:bg-card/50"
              >
                <Building2 className="w-6 h-6 text-accent mb-4" />
                <h3 className="font-serif text-xl text-foreground mb-2 font-normal">Espace cabinet</h3>
                <p className="font-sans text-xs text-muted-foreground font-light leading-relaxed">Cabinet à la recherche de talents</p>
                <ArrowRight className="w-4 h-4 text-accent absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </div>

            <p className="mt-10 text-xs text-muted-foreground/50 font-sans font-light tracking-wide">
              Inscription confidentielle · Profil validé sous 48h
            </p>
          </motion.div>
        )}

        {view === 'login-candidat' && (
          <motion.div
            key="login-candidat"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-md w-full"
          >
            <div className="carter-divider mx-auto mb-10" />
            <span className="font-serif text-2xl tracking-[-0.02em] text-foreground block mb-6">
              Carter
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-normal text-foreground mb-2 tracking-[-0.02em]">
              Espace candidat
            </h2>
            <p className="text-sm text-muted-foreground font-sans font-light mb-12">
              Connectez-vous ou créez votre profil confidentiel.
            </p>

            {/* Login form */}
            <div className="border border-border rounded-sm p-8 text-left mb-6 bg-card/30 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-6">
                <LogIn className="w-4 h-4 text-accent" />
                <p className="carter-label">Déjà inscrit</p>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="font-sans text-xs text-muted-foreground uppercase tracking-wider">Identifiant / Code</Label>
                  <Input
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    placeholder="Votre identifiant Carter"
                    className="mt-2 bg-background/50 border-border"
                  />
                </div>
                <div>
                  <Label className="font-sans text-xs text-muted-foreground uppercase tracking-wider">Mot de passe</Label>
                  <Input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="mt-2 bg-background/50 border-border"
                  />
                </div>
                <Button
                  disabled={!code || !password}
                  className="w-full bg-foreground text-background hover:bg-foreground/90 font-sans text-sm font-medium rounded-sm py-5"
                >
                  Se connecter
                </Button>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs font-sans text-muted-foreground font-light">ou</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Register CTA */}
            <Button
              onClick={nextStep}
              variant="outline"
              size="lg"
              className="w-full border-accent/30 text-foreground hover:bg-accent/10 hover:border-accent/50 font-sans text-sm font-medium rounded-sm py-5 group"
            >
              Je m'inscris
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>

            <button
              onClick={() => setView('choice')}
              className="mt-8 text-xs font-sans font-light text-muted-foreground hover:text-foreground transition-colors"
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
