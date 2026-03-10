import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useRegistrationStore } from '@/stores/registrationStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import AutocompleteInput from '@/components/shared/AutocompleteInput';
import SeniorityBadge from '@/components/shared/SeniorityBadge';
import FileDropzone from '@/components/shared/FileDropzone';
import ChipSelector from '@/components/shared/ChipSelector';
import { usePQE } from '@/hooks/usePQE';
import { CABINETS, DEPARTEMENTS, NATIONALITES, TIERS, MOIS, TAILLE_OPERATIONS, DISPONIBILITES, RAISONS_BAISSE_RETRO } from '@/lib/constants';
import { formatNumberWithDots, formatPhoneWithDots } from '@/lib/formatters';
import { Camera, X, ArrowLeft, ArrowRight, Linkedin, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';
import { useRef, useState, useMemo } from 'react';

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 1980 + 1 }, (_, i) => currentYear - i);

const Step2Identity = () => {
  const store = useRegistrationStore();
  const pqe = usePQE(store.sermentMois, store.sermentAnnee);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const isSeniorProfile = pqe && (pqe.label === 'Counsel' || pqe.label === 'Associé');

  const passwordRules = useMemo(() => {
    const pw = store.password;
    return {
      minLength: pw.length >= 8,
      hasUpper: /[A-Z]/.test(pw),
      hasLower: /[a-z]/.test(pw),
      hasNumber: /[0-9]/.test(pw),
      hasSpecial: /[^A-Za-z0-9]/.test(pw),
    };
  }, [store.password]);

  const isPasswordValid = Object.values(passwordRules).every(Boolean);
  const passwordsMatch = store.password === store.passwordConfirm && store.passwordConfirm.length > 0;

  const canProceed = store.prenom.length >= 2 && store.nom.length >= 2 &&
    store.email.includes('@') && store.sermentMois && store.sermentAnnee &&
    store.cabinet.length >= 2 && store.departement.length >= 2 &&
    isPasswordValid && passwordsMatch;

  const handleCabinetSelect = (v: string | string[]) => {
    const cabinetName = typeof v === 'string' ? v : v[0];
    store.setField('cabinet', cabinetName as string);
  };

  const handleDepartmentChange = (dept: string) => {
    store.setField('departement', dept);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      store.setField('photo', file);
      store.setField('photoPreviewUrl', URL.createObjectURL(file));
    }
  };

  const removePhoto = () => {
    store.setField('photo', null);
    store.setField('photoPreviewUrl', '');
  };

  const toggleRaisonBaisse = (raison: string) => {
    const current = store.raisonsBaisseRetro;
    if (current.includes(raison)) {
      store.setField('raisonsBaisseRetro', current.filter(r => r !== raison));
    } else {
      store.setField('raisonsBaisseRetro', [...current, raison]);
    }
  };

  const handleLinkedinPaste = async (url: string) => {
    store.setField('linkedinUrl', url);
    // Try to extract LinkedIn profile photo
    if (url.includes('linkedin.com/in/')) {
      try {
        const { data, error } = await supabase.functions.invoke('linkedin-photo', {
          body: { url },
        });
        if (!error && data?.photoUrl) {
          store.setField('photoPreviewUrl', data.photoUrl);
        }
      } catch {
        // Silently fail - user can still upload photo manually
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-2xl mx-auto px-6 py-10"
    >
      <div className="carter-divider mb-6" />
      <h2 className="text-3xl font-serif text-foreground mb-2 font-normal tracking-[-0.02em]">Votre identité</h2>
      <p className="text-muted-foreground font-sans text-sm font-light mb-10">Ces informations restent strictement confidentielles.</p>

      <div className="space-y-8">
        {/* LinkedIn URL */}
        <div>
          <Label className="font-sans text-xs font-light text-muted-foreground uppercase tracking-wider">Profil LinkedIn</Label>
          <div className="relative mt-2">
            <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={store.linkedinUrl}
              onChange={e => handleLinkedinPaste(e.target.value)}
              onPaste={e => {
                setTimeout(() => handleLinkedinPaste((e.target as HTMLInputElement).value), 0);
              }}
              placeholder="https://linkedin.com/in/votre-profil"
              className="pl-10"
            />
          </div>
          <p className="font-sans text-xs text-muted-foreground font-light mt-1.5">Collez votre lien LinkedIn — votre photo de profil sera importée automatiquement.</p>
        </div>

        {/* Photo */}
        <div className="flex items-center gap-6">
          <div className="relative">
            {store.photoPreviewUrl ? (
              <div className="relative">
                <img src={store.photoPreviewUrl} alt="Photo" className="w-20 h-20 rounded-full object-cover border border-border" />
                <button onClick={removePhoto} className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-foreground text-background flex items-center justify-center">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button onClick={() => photoInputRef.current?.click()} className="w-20 h-20 rounded-full border border-dashed border-border flex items-center justify-center hover:border-accent/50 transition-colors duration-300">
                <Camera className="w-5 h-5 text-muted-foreground" />
              </button>
            )}
            <input ref={photoInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
          </div>
          <div>
            <p className="font-sans text-sm font-medium text-foreground">Photo professionnelle</p>
            <p className="font-sans text-xs text-muted-foreground font-light">Optionnel · JPG ou PNG, max 5 Mo</p>
          </div>
        </div>

        {/* Nom / Prénom */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="font-sans text-xs font-light text-muted-foreground uppercase tracking-wider">Prénom *</Label>
            <Input value={store.prenom} onChange={e => store.setField('prenom', e.target.value)} placeholder="Jean" className="mt-2" />
          </div>
          <div>
            <Label className="font-sans text-xs font-light text-muted-foreground uppercase tracking-wider">Nom *</Label>
            <Input value={store.nom} onChange={e => store.setField('nom', e.target.value)} placeholder="Dupont" className="mt-2" />
          </div>
        </div>

        {/* Email / Tel */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="font-sans text-xs font-light text-muted-foreground uppercase tracking-wider">Email *</Label>
            <Input type="email" value={store.email} onChange={e => store.setField('email', e.target.value)} placeholder="jean@cabinet.com" className="mt-2" />
          </div>
          <div>
            <Label className="font-sans text-xs font-light text-muted-foreground uppercase tracking-wider">Téléphone</Label>
            <Input value={store.telephone} onChange={e => store.setField('telephone', formatPhoneWithDots(e.target.value))} placeholder="06.50.10.20.30" className="mt-2" />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-4">
          <div>
            <Label className="font-sans text-xs font-light text-muted-foreground uppercase tracking-wider">Mot de passe *</Label>
            <div className="relative mt-2">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={store.password}
                onChange={e => store.setField('password', e.target.value)}
                placeholder="Créez votre mot de passe"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {store.password.length > 0 && (
              <div className="mt-3 space-y-1.5">
                {[
                  { key: 'minLength', label: '8 caractères minimum' },
                  { key: 'hasUpper', label: 'Une lettre majuscule' },
                  { key: 'hasLower', label: 'Une lettre minuscule' },
                  { key: 'hasNumber', label: 'Un chiffre' },
                  { key: 'hasSpecial', label: 'Un caractère spécial (!@#$...)' },
                ].map(rule => {
                  const passed = passwordRules[rule.key as keyof typeof passwordRules];
                  return (
                    <div key={rule.key} className="flex items-center gap-2">
                      {passed ? (
                        <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                      )}
                      <span className={`font-sans text-xs ${passed ? 'text-green-500' : 'text-muted-foreground'}`}>
                        {rule.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div>
            <Label className="font-sans text-xs font-light text-muted-foreground uppercase tracking-wider">Confirmer le mot de passe *</Label>
            <div className="relative mt-2">
              <Input
                type={showConfirm ? 'text' : 'password'}
                value={store.passwordConfirm}
                onChange={e => store.setField('passwordConfirm', e.target.value)}
                placeholder="Confirmez votre mot de passe"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {store.passwordConfirm.length > 0 && !passwordsMatch && (
              <p className="text-xs text-red-400 font-sans mt-1.5">Les mots de passe ne correspondent pas</p>
            )}
            {passwordsMatch && (
              <p className="text-xs text-green-500 font-sans mt-1.5 flex items-center gap-1">
                <Check className="w-3 h-3" /> Mots de passe identiques
              </p>
            )}
          </div>
        </div>
        {/* Serment */}
        <div>
          <Label className="font-sans text-xs font-light text-muted-foreground uppercase tracking-wider">Date de prestation de serment *</Label>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <Select value={store.sermentMois?.toString() || ''} onValueChange={v => store.setField('sermentMois', parseInt(v))}>
              <SelectTrigger><SelectValue placeholder="Mois" /></SelectTrigger>
              <SelectContent>
                {MOIS.map(m => <SelectItem key={m.value} value={m.value.toString()}>{m.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={store.sermentAnnee?.toString() || ''} onValueChange={v => store.setField('sermentAnnee', parseInt(v))}>
              <SelectTrigger><SelectValue placeholder="Année" /></SelectTrigger>
              <SelectContent>
                {YEARS.map(y => <SelectItem key={y} value={y.toString()}>{y}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          {pqe && <div className="mt-3"><SeniorityBadge info={pqe} /></div>}
        </div>

        {/* Associé / Counsel */}
        {isSeniorProfile && (
          <div className="carter-card p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Checkbox
                id="assocCounsel"
                checked={store.isAssocieOrCounsel}
                onCheckedChange={v => store.setField('isAssocieOrCounsel', v as boolean)}
              />
              <Label htmlFor="assocCounsel" className="font-sans text-sm font-medium cursor-pointer">
                Je suis Associé(e) ou Counsel
              </Label>
            </div>
            {store.isAssocieOrCounsel && (
              <div className="space-y-4 pl-7">
                <div>
                  <Label className="font-sans text-xs font-light text-muted-foreground uppercase tracking-wider">Chiffre d'affaires portable (€)</Label>
                  <Input value={store.chiffreAffairesPortable} onChange={e => store.setField('chiffreAffairesPortable', formatNumberWithDots(e.target.value))} placeholder="500.000" className="mt-2" />
                </div>
                <div>
                  <Label className="font-sans text-xs font-light text-muted-foreground uppercase tracking-wider mb-2 block">Business plan (optionnel)</Label>
                  <FileDropzone file={store.businessPlanFile} onFileChange={f => store.setField('businessPlanFile', f)} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Département */}
        <div>
          <Label className="font-sans text-xs font-light text-muted-foreground uppercase tracking-wider">Département / Pratique *</Label>
          <Select value={store.departement} onValueChange={handleDepartmentChange}>
            <SelectTrigger className="mt-2"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
            <SelectContent>
              {DEPARTEMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Cabinet */}
        <div>
          <Label className="font-sans text-xs font-light text-muted-foreground uppercase tracking-wider">Cabinet actuel *</Label>
          <AutocompleteInput
            data={CABINETS}
            value={store.cabinet}
            onChange={handleCabinetSelect}
            placeholder="Rechercher un cabinet..."
            className="mt-2"
          />
        </div>

        {/* Nationalité / Tier */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="font-sans text-xs font-light text-muted-foreground uppercase tracking-wider">Nationalité du cabinet</Label>
            <Select value={store.cabNat} onValueChange={v => store.setField('cabNat', v)}>
              <SelectTrigger className="mt-2"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
              <SelectContent>
                {NATIONALITES.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="font-sans text-xs font-light text-muted-foreground uppercase tracking-wider">Tier Legal 500</Label>
            <Select value={store.cabTier} onValueChange={v => store.setField('cabTier', v)}>
              <SelectTrigger className="mt-2"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
              <SelectContent>
                {TIERS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Taille des opérations */}
        <div>
          <Label className="font-sans text-xs font-light text-muted-foreground uppercase tracking-wider mb-3 block">Taille des opérations</Label>
          <ChipSelector
            options={TAILLE_OPERATIONS}
            selected={store.tailleOperations}
            onChange={v => store.setField('tailleOperations', v)}
          />
        </div>

        {/* Disponibilité */}
        <div>
          <Label className="font-sans text-xs font-light text-muted-foreground uppercase tracking-wider">Disponibilité</Label>
          <Select value={store.disponibilite} onValueChange={v => store.setField('disponibilite', v)}>
            <SelectTrigger className="mt-2"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
            <SelectContent>
              {DISPONIBILITES.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Rémunération */}
        <div className="carter-card p-8 space-y-6">
          <div>
            <p className="carter-label mb-2">Confidentiel</p>
            <h3 className="font-serif text-xl text-foreground font-normal">Rémunération</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="font-sans text-xs font-light text-muted-foreground uppercase tracking-wider">Rétrocession brute annuelle (€)</Label>
              <Input value={store.retrocession} onChange={e => store.setField('retrocession', formatNumberWithDots(e.target.value))} placeholder="80.000" className="mt-2" />
            </div>
            <div>
              <Label className="font-sans text-xs font-light text-muted-foreground uppercase tracking-wider">Bonus (€)</Label>
              <Input value={store.bonus} onChange={e => store.setField('bonus', formatNumberWithDots(e.target.value))} placeholder="10.000" className="mt-2" />
            </div>
          </div>

          {/* Objectif facturable */}
          <div className="flex items-center gap-3">
            <Switch
              checked={store.hasObjectifFacturable === true}
              onCheckedChange={v => store.setField('hasObjectifFacturable', v)}
            />
            <Label className="font-sans text-sm font-light">Objectif d'heures facturables</Label>
          </div>
          {store.hasObjectifFacturable && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-sans text-xs font-light text-muted-foreground uppercase tracking-wider">Objectif (heures/an)</Label>
                <Input value={store.objectifFacturable} onChange={e => store.setField('objectifFacturable', e.target.value)} placeholder="1800" className="mt-2" />
              </div>
              <div>
                <Label className="font-sans text-xs font-light text-muted-foreground uppercase tracking-wider">Réalisé en pratique (heures/an)</Label>
                <Input value={store.objectifFacturableReel} onChange={e => store.setField('objectifFacturableReel', e.target.value)} placeholder="1650" className="mt-2" />
              </div>
            </div>
          )}

          {/* Rétrocession flexibility */}
          <div className="border-t border-border pt-6 space-y-4">
            <Label className="font-sans text-sm font-medium block">
              Souhaitez-vous conserver a minima votre rétrocession actuelle ?
            </Label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="conserverRetro"
                  checked={store.conserverRetrocession === true}
                  onChange={() => store.setField('conserverRetrocession', true)}
                  className="accent-[hsl(38,55%,72%)]"
                />
                <span className="font-sans text-sm font-light">Oui, c'est indispensable</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="conserverRetro"
                  checked={store.conserverRetrocession === false}
                  onChange={() => store.setField('conserverRetrocession', false)}
                  className="accent-[hsl(38,55%,72%)]"
                />
                <span className="font-sans text-sm font-light">Envisageable selon le projet</span>
              </label>
            </div>
            {store.conserverRetrocession === false && (
              <div className="space-y-3 pl-1">
                <p className="text-xs text-muted-foreground font-sans font-light">Pour quelles raisons accepteriez-vous une baisse ?</p>
                {RAISONS_BAISSE_RETRO.map(raison => (
                  <div key={raison} className="flex items-center gap-2">
                    <Checkbox
                      id={`raison-${raison}`}
                      checked={store.raisonsBaisseRetro.includes(raison)}
                      onCheckedChange={() => toggleRaisonBaisse(raison)}
                    />
                    <label htmlFor={`raison-${raison}`} className="font-sans text-sm font-light cursor-pointer">{raison}</label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={store.prevStep} className="font-sans font-light rounded-sm gap-2">
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
          <Button onClick={store.nextStep} disabled={!canProceed} className="bg-foreground text-background hover:bg-foreground/90 font-sans font-medium rounded-sm gap-2">
            Continuer
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default Step2Identity;
