import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, LogIn, Eye, EyeOff } from 'lucide-react';
import { useCabinetStore } from '@/stores/cabinetStore';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import { toast } from 'sonner';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const benefits = [
  { title: 'Visibilité continue du marché', desc: 'Informations en temps réel sur la dynamique des profils disponibles — sans attendre une candidature.' },
  { title: 'Vivier ultra-qualifié toute l\'année', desc: 'Chaque profil est validé manuellement par LOGAN. Accédez à un vivier actif pour tous vos besoins annuels.' },
  { title: 'Accompagnement à chaque étape', desc: 'Un consultant LOGAN dédié à vos côtés — de la publication de votre recherche au placement final.' },
  { title: 'Solution plus économique', desc: 'Abonnement annuel illimité sans commission par placement. Contre 20–45K€ HT par recrutement en modèle traditionnel.' },
  { title: 'Confidentialité absolue', desc: 'Votre recherche comme les profils consultés restent strictement anonymisés. La levée de rideau se fait uniquement avec l\'accord du candidat.' },
  { title: 'Accès prioritaire aux opportunités', desc: 'Les membres LOGAN sont notifiés en premier des nouveaux profils disponibles avant toute diffusion externe.' },
];

const stats = [
  { value: '+300', label: 'Profils qualifiés' },
  { value: '0%', label: 'Commission au placement' },
  { value: '48h', label: 'Activation du compte' },
  { value: '100%', label: 'Confidentiel' },
];

const CabinetStep1Hero = () => {
  const setStep = useCabinetStore((s) => s.setStep);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) return;
    setSubmitting(true);
    try {
      const { error } = await (supabase.auth as any).signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });
      if (error) throw error;
      toast.success('Connexion réussie');
      // Go directly to dashboard
      setStep(6);
    } catch (error: any) {
      toast.error(error.message || 'Erreur de connexion');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-lg overflow-hidden">
      {/* Hero section - black */}
      <div className="bg-black relative overflow-hidden px-8 md:px-16 pt-16 pb-14">
        {/* Subtle circles */}
        <div className="absolute -top-24 -right-24 w-[440px] h-[440px] rounded-full border border-white/[0.04] pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-[280px] h-[280px] rounded-full border border-white/[0.03] pointer-events-none" />

        <motion.div variants={stagger} initial="hidden" animate="visible">
          {/* Badge */}
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 border border-white/10 rounded-sm px-3 py-1.5 mb-10">
            <span className="font-serif text-xs font-bold text-white/80 tracking-[0.1em]">LOGAN</span>
            <span className="w-px h-3 bg-white/20" />
            <span className="text-[9px] text-white/40 tracking-[0.12em] uppercase">Réseau Privé · Espace Cabinet</span>
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl font-light text-white leading-[1.04] tracking-[-0.02em] mb-1" style={{ fontFamily: "'Söhne', 'Inter', system-ui, sans-serif" }}>
            Welcome to
          </motion.h1>
          <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl font-light text-white/70 italic leading-[1.04] tracking-[-0.02em] mb-6" style={{ fontFamily: "'Söhne', 'Inter', system-ui, sans-serif" }}>
            LOGAN
          </motion.h1>

          <motion.p variants={fadeUp} className="text-base text-white/70 leading-relaxed max-w-xl mb-2 font-sans font-light">
            Le réseau confidentiel des avocats d'affaires.
          </motion.p>
          <motion.p variants={fadeUp} className="text-[15px] text-white/45 leading-relaxed max-w-xl mb-12 font-sans font-light">
            Devenez membre et bénéficiez d'un accès annuel illimité à un vivier ultra-qualifié — sans commission au placement.
          </motion.p>

          {/* Benefits grid */}
          <motion.div variants={fadeUp} className="grid md:grid-cols-2 gap-3 mb-12 max-w-2xl">
            {benefits.map((b) => (
              <div key={b.title} className="bg-white/[0.04] border border-white/[0.07] rounded p-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 bg-white/60 rounded-full flex-shrink-0" />
                  <span className="text-xs font-semibold text-white">{b.title}</span>
                </div>
                <p className="text-xs text-white/45 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="flex items-center gap-5 flex-wrap">
            <Button
              onClick={() => setStep(2)}
              size="lg"
              className="bg-white text-black hover:bg-white/90 font-sans text-sm font-bold px-8 py-6 rounded-sm tracking-wide group"
            >
              Rejoindre LOGAN
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
            <button
              onClick={() => setShowLogin(!showLogin)}
              className="font-sans text-sm text-white/50 hover:text-white transition-colors flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Déjà membre ? Se connecter
            </button>
          </motion.div>

          {/* Login form */}
          {showLogin && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-8 max-w-md"
            >
              <div className="border border-white/10 rounded-sm p-6 bg-white/[0.03] backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-5">
                  <LogIn className="w-4 h-4 text-white/60" />
                  <span className="text-[10px] font-bold tracking-[0.12em] uppercase text-white/50">Connexion cabinet</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-[9px] font-bold tracking-[0.12em] uppercase text-white/40 mb-1.5 block">Email</label>
                    <Input
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      type="email"
                      placeholder="votre@email.com"
                      className="bg-white/[0.05] border-white/10 text-white placeholder:text-white/20 focus:border-white/30"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold tracking-[0.12em] uppercase text-white/40 mb-1.5 block">Mot de passe</label>
                    <div className="relative">
                      <Input
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className="bg-white/[0.05] border-white/10 text-white placeholder:text-white/20 focus:border-white/30 pr-10"
                        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <Button
                    onClick={handleLogin}
                    disabled={!loginEmail || !loginPassword || submitting}
                    className="w-full bg-white text-black hover:bg-white/90 font-sans text-sm font-bold rounded-sm py-5"
                  >
                    {submitting ? 'Connexion...' : 'Se connecter'}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div variants={fadeUp} className="mt-6">
            <span className="text-xs text-white/30 italic font-sans">Inscription en 3 étapes · Activation sous 48h</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Stats bar */}
      <div className="bg-secondary border-b border-border px-8 md:px-16 py-5 flex">
        {stats.map((s, i) => (
          <div key={s.label} className={`flex-1 text-center ${i < stats.length - 1 ? 'border-r border-border' : ''}`}>
            <div className="font-serif text-2xl font-bold text-foreground">{s.value}</div>
            <div className="text-[9px] text-muted-foreground mt-1 tracking-[0.08em] uppercase">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CabinetStep1Hero;
