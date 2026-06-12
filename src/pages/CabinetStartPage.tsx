import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useCabinetStore } from '@/stores/cabinetStore';
import { CABINETS } from '@/lib/constants';
import { toast } from 'sonner';
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react';

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
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const filteredCabinets = CABINETS.filter(c =>
    c.toLowerCase().includes(cabinetSearch.toLowerCase())
  );

  const pwdRules = {
    length:    password.length >= 8,
    upper:     /[A-Z]/.test(password),
    lower:     /[a-z]/.test(password),
    number:    /[0-9]/.test(password),
    special:   /[^A-Za-z0-9]/.test(password),
  };
  const pwdValid   = Object.values(pwdRules).every(Boolean);
  const pwdMatch   = confirmPassword.length > 0 && password === confirmPassword;

  const isValid =
    firstName.trim() && lastName.trim() && cabinet.trim() &&
    status && phone.replace(/\D/g, '').length >= 10 && email.includes('@') &&
    pwdValid && pwdMatch;

  const handleSubmit = async () => {
    if (!isValid || submitting) return;
    setSubmitting(true);
    try {
      const contactRow = { prenom: firstName, nom: lastName, role: status, email, mobile: phone };

      const { data: signUpData, error } = await (supabase.auth as any).signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin + '/connexion',
          data: {
            full_name: `${firstName} ${lastName}`.trim(),
            cabinet_name: cabinet,
            user_type: 'cabinet',
            contact_prenom: firstName,
            contact_nom: lastName,
            contact_role: status,
            contact_mobile: phone,
            contact_email: email,
          },
        },
      });
      if (error) throw error;

      const userId = signUpData?.user?.id;
      if (!userId) throw new Error('Aucun utilisateur créé.');

      setField('cabinetName', cabinet);
      setField('email', email);
      setField('contacts', [contactRow] as any);

      setDone(true);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Erreur lors de la création du compte.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = 'w-full bg-black/[0.04] border border-black/15 text-black placeholder:text-black/30 rounded-sm px-3.5 py-3 text-sm focus:border-black/50 focus:outline-none transition-colors';
  const labelCls = 'text-[9px] font-sans font-semibold tracking-[0.18em] uppercase text-black/50 mb-1.5 block';

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header minimal */}
      <header className="px-8 h-16 flex items-center">
        <button onClick={() => navigate(-1)} className="font-serif text-[28px] tracking-[0.04em] text-black hover:opacity-60 transition-opacity">
          Logan
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        {done ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md text-center"
          >
            <CheckCircle2 className="w-9 h-9 text-black/30 mx-auto mb-6" />
            <h2 className="font-serif font-[300] text-[1.8rem] text-black mb-4">Vérifiez votre email.</h2>
            <p className="text-black/55 font-sans font-light text-[0.9rem] leading-[1.8] mb-8">
              Un email de confirmation a été envoyé à{' '}
              <span className="text-black/80">{email}</span>.<br />
              Cliquez sur le lien pour activer votre compte, puis connectez-vous via la page de connexion.
            </p>
            <button
              onClick={() => navigate('/connexion')}
              className="text-black/50 hover:text-black font-sans text-[12.3px] tracking-wide transition-colors border-b border-black/20 hover:border-black/60 pb-px"
            >
              Se connecter →
            </button>
          </motion.div>
        ) : (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          <p className="text-[11px] font-sans tracking-[0.22em] uppercase text-black/40 mb-5">
            Accès cabinet
          </p>
          <h1 className="font-serif font-[300] text-[2rem] text-black leading-[1.1] mb-2">
            Bienvenue.
          </h1>
          <p className="text-black/50 font-sans font-light text-[0.88rem] leading-relaxed mb-10">
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
                <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-black/12 rounded-sm max-h-44 overflow-y-auto shadow-lg">
                  {filteredCabinets.map(c => (
                    <button key={c} onMouseDown={e => e.preventDefault()}
                      onClick={() => { setCabinet(c); setCabinetSearch(c); setCabinetOpen(false); }}
                      className="w-full text-left px-3.5 py-2.5 text-[13px] text-black/60 hover:bg-black/5 hover:text-black transition-colors">
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
                      status === s ? 'bg-black text-white border-black' : 'bg-transparent text-black/50 border-black/15 hover:border-black/40 hover:text-black/80')}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Téléphone / Email */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Téléphone</label>
                <input
                  value={phone}
                  onChange={e => {
                    const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                    const formatted = digits.replace(/(\d{2})(?=\d)/g, '$1.');
                    setPhone(formatted);
                  }}
                  type="tel"
                  placeholder="06.12.34.56.78"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Email professionnel</label>
                <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="votre@cabinet.com" autoComplete="off" className={inputCls} />
              </div>
            </div>
            <p className="text-black/35 font-sans text-[10.5px] leading-relaxed -mt-1">
              Renseignez votre adresse email professionnelle — elle sera utilisée pour vous connecter à votre espace.
            </p>

            {/* Mot de passe */}
            <div>
              <label className={labelCls}>Mot de passe</label>
              <div className="relative">
                <input
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Créer un mot de passe"
                  autoComplete="new-password"
                  className={cn(inputCls, 'pr-10')}
                />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 hover:text-black/60 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password.length > 0 && (
                <div className="mt-2.5 grid grid-cols-2 gap-x-4 gap-y-1">
                  {[
                    { key: 'length',  label: '8 caractères minimum' },
                    { key: 'upper',   label: '1 majuscule' },
                    { key: 'lower',   label: '1 minuscule' },
                    { key: 'number',  label: '1 chiffre' },
                    { key: 'special', label: '1 caractère spécial' },
                  ].map(r => (
                    <span key={r.key} className={cn('flex items-center gap-1.5 text-[10.5px] font-sans transition-colors',
                      pwdRules[r.key as keyof typeof pwdRules] ? 'text-black/60' : 'text-black/25')}>
                      <span className={cn('w-1 h-1 rounded-full flex-shrink-0',
                        pwdRules[r.key as keyof typeof pwdRules] ? 'bg-black/60' : 'bg-black/20')} />
                      {r.label}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Confirmer le mot de passe */}
            <div>
              <label className={labelCls}>Confirmer le mot de passe</label>
              <div className="relative">
                <input
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Répéter le mot de passe"
                  autoComplete="new-password"
                  className={cn(inputCls, 'pr-10',
                    confirmPassword.length > 0 && !pwdMatch ? 'border-red-500/60' : '')}
                />
                <button type="button" onClick={() => setShowConfirm(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 hover:text-black/60 transition-colors">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPassword.length > 0 && !pwdMatch && (
                <p className="text-[10.5px] font-sans text-red-600/80 mt-1.5">Les mots de passe ne correspondent pas.</p>
              )}
              {pwdMatch && (
                <p className="text-[10.5px] font-sans text-black/50 mt-1.5">Les mots de passe correspondent.</p>
              )}
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!isValid || submitting}
              className="w-full bg-black text-white hover:bg-black/85 font-sans text-[12.3px] font-normal rounded-sm py-5 mt-2 tracking-wide disabled:opacity-25 transition-opacity"
            >
              {submitting ? 'Création en cours…' : 'Accéder à mon espace →'}
            </Button>
          </div>

          <p className="text-black/35 font-sans text-[11px] text-center mt-6">
            Vous avez déjà un compte ?{' '}
            <button onClick={() => navigate('/connexion')} className="text-black/55 hover:text-black underline underline-offset-2 transition-colors">
              Se connecter
            </button>
          </p>
        </motion.div>
        )}
      </main>
    </div>
  );
};

export default CabinetStartPage;
