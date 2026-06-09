import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useCabinetStore } from '@/stores/cabinetStore';
import { CABINETS } from '@/lib/constants';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

const STATUSES = ['Associé(e)', 'Managing Partner', 'RH'] as const;

const CabinetStartPage = () => {
  const navigate = useNavigate();
  const setField = useCabinetStore((s) => s.setField);
  const setStep = useCabinetStore((s) => s.setStep);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [cabinet, setCabinet] = useState('');
  const [cabinetSearch, setCabinetSearch] = useState('');
  const [cabinetOpen, setCabinetOpen] = useState(false);
  const [status, setStatus] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const filteredCabinets = CABINETS.filter(c =>
    c.toLowerCase().includes(cabinetSearch.toLowerCase())
  );

  const isValid =
    firstName.trim() && lastName.trim() && cabinet.trim() &&
    status && phone.trim().length >= 10 && email.includes('@') &&
    password.length >= 8;

  const handleSubmit = async () => {
    if (!isValid || submitting) return;
    setSubmitting(true);
    try {
      // 1. Créer le compte
      const { data: signUpData, error } = await (supabase.auth as any).signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin + '/cabinet',
          data: {
            full_name: `${firstName} ${lastName}`.trim(),
            cabinet_name: cabinet,
            user_type: 'cabinet',
          },
        },
      });
      if (error) throw error;

      const userId = signUpData?.user?.id;
      if (!userId) throw new Error('Aucun utilisateur créé.');

      // 2. Mettre à jour cabinet_accounts (créé par le trigger handle_new_user)
      const contactRow = { prenom: firstName, nom: lastName, role: status, email, mobile: phone };
      const { error: updErr } = await supabase
        .from('cabinet_accounts')
        .update({
          cabinet_name: cabinet,
          contacts: [contactRow] as any,
          palier: 'business',
        } as any)
        .eq('user_id', userId);

      if (updErr) console.warn('cabinet_accounts update:', updErr);

      // 3. Hydrater le store pour affichage immédiat
      setField('cabinetName', cabinet);
      setField('email', email);
      setField('contacts', [contactRow] as any);
      setStep(6);

      navigate('/cabinet');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Erreur lors de la création du compte.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = 'w-full bg-white/[0.03] border border-white/12 text-white placeholder:text-white/20 rounded-sm px-3.5 py-3 text-sm focus:border-white/35 focus:outline-none transition-colors';
  const labelCls = 'text-[9px] font-sans font-semibold tracking-[0.18em] uppercase text-white/30 mb-1.5 block';

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header minimal */}
      <header className="px-8 h-16 flex items-center">
        <button onClick={() => navigate(-1)} className="font-serif text-[28px] tracking-[0.04em] text-white hover:opacity-70 transition-opacity">
          Logan
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          <p className="text-[11px] font-sans tracking-[0.22em] uppercase text-white/30 mb-5">
            Accès cabinet
          </p>
          <h1 className="font-serif font-[300] text-[2rem] text-white leading-[1.1] mb-2">
            Bienvenue.
          </h1>
          <p className="text-white/40 font-sans font-light text-[0.88rem] leading-relaxed mb-10">
            Renseignez vos informations pour accéder à votre espace.
          </p>

          <div className="space-y-4">
            {/* Prénom / Nom */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Prénom</label>
                <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Jean" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Nom</label>
                <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Dupont" className={inputCls} />
              </div>
            </div>

            {/* Cabinet autocomplete */}
            <div className="relative">
              <label className={labelCls}>Cabinet</label>
              <input
                value={cabinetOpen ? cabinetSearch : cabinet}
                onChange={e => { setCabinetSearch(e.target.value); setCabinet(''); if (!cabinetOpen) setCabinetOpen(true); }}
                onFocus={() => { setCabinetOpen(true); setCabinetSearch(cabinet); }}
                onBlur={() => setTimeout(() => setCabinetOpen(false), 150)}
                placeholder="Rechercher votre cabinet…"
                className={inputCls}
              />
              {cabinetOpen && filteredCabinets.length > 0 && (
                <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-[#0e0e0e] border border-white/12 rounded-sm max-h-44 overflow-y-auto">
                  {filteredCabinets.map(c => (
                    <button key={c} onMouseDown={e => e.preventDefault()}
                      onClick={() => { setCabinet(c); setCabinetSearch(c); setCabinetOpen(false); }}
                      className="w-full text-left px-3.5 py-2.5 text-[13px] text-white/60 hover:bg-white/6 hover:text-white transition-colors">
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Statut */}
            <div>
              <label className={labelCls}>Statut</label>
              <div className="grid grid-cols-3 gap-2">
                {STATUSES.map(s => (
                  <button key={s} onClick={() => setStatus(s)}
                    className={cn('py-2.5 rounded-sm text-[12px] font-sans transition-all border',
                      status === s ? 'bg-white text-black border-white' : 'bg-transparent text-white/45 border-white/12 hover:border-white/30 hover:text-white/75')}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Téléphone / Email */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Téléphone</label>
                <input value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} type="tel" placeholder="06 12 34 56 78" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="votre@cabinet.com" className={inputCls} />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label className={labelCls}>Mot de passe</label>
              <div className="relative">
                <input
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="8 caractères minimum"
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
              onClick={handleSubmit}
              disabled={!isValid || submitting}
              className="w-full bg-white text-black hover:bg-white/90 font-sans text-[12.3px] font-normal rounded-sm py-5 mt-2 tracking-wide disabled:opacity-25 transition-opacity"
            >
              {submitting ? 'Création en cours…' : 'Accéder à mon espace →'}
            </Button>
          </div>

          <p className="text-white/20 font-sans text-[11px] text-center mt-6">
            Vous avez déjà un compte ?{' '}
            <button onClick={() => navigate('/connexion')} className="text-white/40 hover:text-white/70 underline underline-offset-2 transition-colors">
              Se connecter
            </button>
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default CabinetStartPage;
