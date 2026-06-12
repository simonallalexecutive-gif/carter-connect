import { motion } from 'motion/react';
import { supabase } from '@/integrations/supabase/client';
import { useRegistrationStore } from '@/stores/registrationStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import AutocompleteInput from '@/components/shared/AutocompleteInput';
import SeniorityBadge from '@/components/shared/SeniorityBadge';
import FileDropzone from '@/components/shared/FileDropzone';
import ChipSelector from '@/components/shared/ChipSelector';
import { usePQE } from '@/hooks/usePQE';
import { CABINETS, MOIS, RAISONS_BAISSE_RETRO, ASSOC_ATTENTES, ASSOC_CAB_TYPES } from '@/lib/constants';
import { formatNumberWithDots, formatPhoneWithDots } from '@/lib/formatters';
import { getAllFirmNames, LEGAL500_DEPARTMENTS, getFirmTierForDept, formatTier, getLegal500Summary } from '@/lib/legal500Rankings';
import { DEPT_KEY_MAP } from '@/lib/cabinetConstants';
import { Camera, X, ArrowLeft, ArrowRight, Linkedin, Eye, EyeOff, Check, AlertCircle, Loader2 } from 'lucide-react';
import { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 1980 + 1 }, (_, i) => currentYear - i);


const Step2Identity = () => {
  const store = useRegistrationStore();
  const isAdmin = store.isAdminMode;
  const isEditMode = store.isEditMode;
  const pqe = usePQE(store.sermentMois, store.sermentAnnee);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [linkedinLoading, setLinkedinLoading] = useState(false);
  const [linkedinError, setLinkedinError] = useState('');

  const hasSerment = store.sermentMois && store.sermentAnnee;

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

  const allCabinets = useMemo(() => {
    const set = new Set([...CABINETS, ...getAllFirmNames()]);
    return [...set].sort((a, b) => a.localeCompare(b, 'fr'));
  }, []);

  const canProceed = false; // replaced by missingFields check below

  const missingFields = useMemo(() => {
    const missing: string[] = [];
    if (!isEditMode && store.prenom.length < 2) missing.push('Prénom');
    if (!isEditMode && store.nom.length < 2) missing.push('Nom');
    if (!isEditMode && !isAdmin && !store.email.includes('@')) missing.push('Email');
    if (!isEditMode && store.telephone.length < 10) missing.push('Téléphone');
    if (!isEditMode && !isAdmin && !isPasswordValid) missing.push('Mot de passe');
    if (!isEditMode && !isAdmin && !passwordsMatch) missing.push('Confirmation mot de passe');
    if (!isEditMode && (!store.sermentMois || !store.sermentAnnee)) missing.push('Date de serment');
    if (store.departement.length < 2) missing.push('Département');
    if (store.cabinet.length < 2) missing.push('Cabinet');
    if (store.retrocession.length < 1) missing.push('Rétrocession');
    if (store.conserverRetrocession === null) missing.push('Flexibilité rétrocession');
    return missing;
  }, [store.prenom, store.nom, store.email, store.telephone, isPasswordValid, passwordsMatch, store.sermentMois, store.sermentAnnee, store.departement, store.cabinet, store.retrocession, store.conserverRetrocession, isAdmin, isEditMode]);

  const handleCabinetSelect = (v: string | string[]) => {
    const cabinetName = typeof v === 'string' ? v : v[0];
    store.setField('cabinet', cabinetName as string);
  };

  // Pratiques Legal 500 couvertes par Logan
  const allPractices = useMemo(() => {
    return LEGAL500_DEPARTMENTS.sort((a, b) => a.label.localeCompare(b.label, 'fr'));
  }, []);

  // Tier Legal 500 auto-détecté pour cabinet + pratique sélectionnés
  const currentLegal500Tier = useMemo(() => {
    if (!store.cabinet || !store.departement) return undefined;
    const deptKey = DEPT_KEY_MAP[store.departement] || store.departement;
    return getFirmTierForDept(store.cabinet, deptKey);
  }, [store.cabinet, store.departement]);

  const handleDepartmentChange = (dept: string) => {
    store.setField('departement', dept);
  };

  // Reset counsel/associé when PQE drops below 6
  useEffect(() => {
    if (pqe && pqe.years <= 6 && store.isAssocieOrCounsel) {
      store.setField('isAssocieOrCounsel', false);
      store.setField('statutAssoc', '');
    }
  }, [pqe?.years]);

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

  // LinkedIn photo auto-fetch disabled — silhouette kept until manual upload
  const fetchLinkedinPhoto = useCallback((_url: string) => {}, []);

  const handleLinkedinChange = (value: string) => {
    store.setField('linkedinUrl', value);
  };

  const handleLinkedinPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text');
    if (pasted.includes('linkedin.com/in/')) {
      e.preventDefault();
      store.setField('linkedinUrl', pasted);
      setTimeout(() => fetchLinkedinPhoto(pasted), 100);
    }
  };

  const handleLinkedinBlur = () => {
    const url = store.linkedinUrl;
    if (url.includes('linkedin.com/in/') && !store.photoPreviewUrl) {
      fetchLinkedinPhoto(url);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-[780px] mx-auto"
    >
      <div className="text-[9px] font-bold text-muted-foreground tracking-[0.16em] uppercase mb-3 flex items-center gap-2">
        <span className="w-5 h-[1.5px] bg-foreground rounded-sm" />
        Étape 1 / 5
      </div>
      <h2 className="font-sans text-3xl md:text-4xl font-normal text-foreground leading-tight mb-2.5">Votre identité</h2>
      <p className="text-sm text-muted-foreground font-light leading-relaxed mb-10 max-w-xl">Ces informations restent strictement confidentielles et ne sont jamais transmises sans votre accord explicite.</p>

      <div className="space-y-10">
        {/* ── Identité & contact ───────────────────────────────── */}
        <div className="space-y-7 py-8 border-b border-border">
          <div className="text-[12px] font-bold tracking-[0.16em] uppercase text-foreground mb-1 flex items-center gap-2"><span className="w-5 h-[1.5px] bg-foreground rounded-sm" />IDENTITÉ & CONTACT</div>

          {/* Photo + LinkedIn — alignés horizontalement */}
          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 items-start">
            <div className="flex items-center gap-4">
              <div className="relative">
                {store.photoPreviewUrl ? (
                  <div className="relative">
                    <img src={store.photoPreviewUrl} alt="Photo" className="w-20 h-20 rounded-full object-cover border border-border" />
                    <button onClick={removePhoto} className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-foreground text-background flex items-center justify-center">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button onClick={() => photoInputRef.current?.click()} className="w-20 h-20 rounded-full border border-border bg-white flex items-center justify-center overflow-hidden hover:opacity-80 transition-opacity duration-200 group">
                    <svg viewBox="0 0 80 80" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="40" cy="40" r="40" fill="white"/>
                      {/* Tête */}
                      <circle cx="40" cy="30" r="13" fill="black"/>
                      {/* Corps */}
                      <ellipse cx="40" cy="68" rx="22" ry="18" fill="black"/>
                    </svg>
                  </button>
                )}
                <input ref={photoInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </div>
              <div>
                <p className="font-sans text-sm font-medium text-foreground">Photo professionnelle</p>
                <p className="font-sans text-xs text-muted-foreground font-light">Optionnel · JPG ou PNG, max 5 Mo</p>
              </div>
            </div>

            <div>
              <Label className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground">Profil LinkedIn</Label>
              <div className="relative mt-2">
                {linkedinLoading && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin" />
                )}
                <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={store.linkedinUrl}
                  onChange={e => handleLinkedinChange(e.target.value)}
                  onPaste={handleLinkedinPaste}
                  onBlur={handleLinkedinBlur}
                  placeholder="https://linkedin.com/in/votre-profil"
                  className="pl-10"
                />
              </div>
              {linkedinError && (
                <p className="font-sans text-xs text-orange-500 font-light mt-1.5">{linkedinError}</p>
              )}
            </div>
          </div>

          {!isEditMode && <div className="h-px bg-border" />}

          {/* Nom / Prénom — masqué en mode édition */}
          {!isEditMode && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground">Prénom *</Label>
              <Input value={store.prenom} onChange={e => store.setField('prenom', e.target.value)} placeholder="Jean" className="mt-2" />
            </div>
            <div>
              <Label className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground">Nom *</Label>
              <Input value={store.nom} onChange={e => store.setField('nom', e.target.value)} placeholder="Dupont" className="mt-2" />
            </div>
          </div>
          )}

          {/* Email / Tel — masqué en mode édition */}
          {!isEditMode && (isAdmin ? (
            <div>
              <Label className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground">Téléphone *</Label>
              <Input value={store.telephone} onChange={e => store.setField('telephone', formatPhoneWithDots(e.target.value))} placeholder="06.50.10.20.30" className="mt-2" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground">Email *</Label>
                <Input type="email" value={store.email} onChange={e => store.setField('email', e.target.value)} placeholder="jean@cabinet.com" className="mt-2" />
              </div>
              <div>
                <Label className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground">Téléphone *</Label>
                <Input value={store.telephone} onChange={e => store.setField('telephone', formatPhoneWithDots(e.target.value))} placeholder="06.50.10.20.30" className="mt-2" />
              </div>
            </div>
          ))}
        </div>

        {/* ── Sécurité du compte — masqué en mode édition ──────── */}
        {!isAdmin && !isEditMode && (
        <div className="space-y-6 py-8 border-b border-border">
          <div className="text-[12px] font-bold tracking-[0.16em] uppercase text-foreground mb-1 flex items-center gap-2"><span className="w-5 h-[1.5px] bg-foreground rounded-sm" />SÉCURITÉ DU COMPTE</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground">Mot de passe *</Label>
              <div className="relative mt-2">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={store.password}
                  onChange={e => store.setField('password', e.target.value)}
                  placeholder="Créez votre mot de passe"
                  className="pr-10"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <Label className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground">Confirmer le mot de passe *</Label>
              <div className="relative mt-2">
                <Input
                  type={showConfirm ? 'text' : 'password'}
                  value={store.passwordConfirm}
                  onChange={e => store.setField('passwordConfirm', e.target.value)}
                  placeholder="Confirmez votre mot de passe"
                  className="pr-10"
                  autoComplete="new-password"
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
          {store.password.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5">
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
        )}

        {/* ── Barreau — masqué en mode édition ────────────────── */}
        {!isEditMode && <div className="space-y-6 py-8 border-b border-border">
          <div className="text-[12px] font-bold tracking-[0.16em] uppercase text-foreground mb-1 flex items-center gap-2"><span className="w-5 h-[1.5px] bg-foreground rounded-sm" />BARREAU</div>
          <div>
            <Label className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground">Date de prestation de serment *</Label>
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
        </div>}

        {/* Statut Counsel / Associé — visible si PQE > 6 ans */}
        {hasSerment && pqe && pqe.years > 6 && (
          <div className="carter-card p-6 space-y-5">
            <div>
              <Label className="font-sans text-sm font-medium block mb-3">Avez-vous le statut de Counsel ou d'Associé ?</Label>
              <div className="space-y-2.5">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    id="statut-non"
                    name="statutAssoc"
                    checked={!store.isAssocieOrCounsel}
                    onChange={() => {
                      store.setField('isAssocieOrCounsel', false);
                      store.setField('statutAssoc', '');
                    }}
                    className="accent-foreground"
                  />
                  <Label htmlFor="statut-non" className="font-sans text-sm font-light cursor-pointer">Non, je suis collaborateur</Label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    id="statut-counsel"
                    name="statutAssoc"
                    checked={store.isAssocieOrCounsel && store.statutAssoc === 'counsel'}
                    onChange={() => {
                      store.setField('isAssocieOrCounsel', true);
                      store.setField('statutAssoc', 'counsel');
                    }}
                    className="accent-foreground"
                  />
                  <Label htmlFor="statut-counsel" className="font-sans text-sm font-light cursor-pointer">Oui, je suis Counsel</Label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    id="statut-associe"
                    name="statutAssoc"
                    checked={store.isAssocieOrCounsel && store.statutAssoc === 'associe'}
                    onChange={() => {
                      store.setField('isAssocieOrCounsel', true);
                      store.setField('statutAssoc', 'associe');
                    }}
                    className="accent-foreground"
                  />
                  <Label htmlFor="statut-associe" className="font-sans text-sm font-light cursor-pointer">Oui, je suis Associé(e)</Label>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Bloc Parcours professionnel */}
        <div className="space-y-6 py-8 border-b border-border">
          <div className="text-[12px] font-bold tracking-[0.16em] uppercase text-foreground mb-1 flex items-center gap-2"><span className="w-5 h-[1.5px] bg-foreground rounded-sm" />PARCOURS PROFESSIONNEL</div>

          {/* Cabinet — FIRST */}
          <div>
            <div className="flex items-center gap-2">
              <Label className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground">Cabinet actuel *</Label>
            </div>
            <AutocompleteInput
              data={allCabinets}
              value={store.cabinet}
              onChange={handleCabinetSelect}
              placeholder="Rechercher un cabinet..."
              className="mt-2"
            />
          </div>

          {/* Pratique */}
          <div>
            <Label className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground">Votre pratique *</Label>
            <p className="font-sans text-[11px] italic text-muted-foreground font-light mt-1.5 leading-relaxed">
              Pour les candidats exerçant à la fois en M&A et en Private Equity, merci de sélectionner votre pratique en fonction de votre dominante.
            </p>
            {store.cabinet ? (
              <>
                <Select value={store.departement} onValueChange={handleDepartmentChange}>
                  <SelectTrigger className="mt-2"><SelectValue placeholder="Sélectionner votre pratique" /></SelectTrigger>
                  <SelectContent>
                    {allPractices.map(p => (
                      <SelectItem key={p.key} value={p.label}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {store.departement && currentLegal500Tier !== undefined && (
                  <div className="mt-3">
                    {currentLegal500Tier !== null ? (
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-sm border border-foreground bg-background text-foreground text-[11px] leading-tight font-sans font-medium">
                          Legal 500 · {formatTier(currentLegal500Tier)}
                        </span>
                        <span className="text-[11px] text-muted-foreground font-sans font-light">
                          {store.cabinet} · {store.departement}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[11px] text-muted-foreground font-sans font-light italic">
                        {store.cabinet} n'est pas classé dans Legal 500 pour {store.departement}
                      </span>
                    )}
                  </div>
                )}
              </>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground font-sans font-light">
                Veuillez d'abord renseigner votre cabinet.
              </p>
            )}
          </div>

          {/* Previous Cabinets */}
          {store.cabinet && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground">Cabinets précédents</Label>
                {store.previousCabinets.length < 3 && (
                  <button
                    type="button"
                    onClick={() => store.setField('previousCabinets', [...store.previousCabinets, { name: '', practices: [] }])}
                    className="text-xs font-sans font-medium text-foreground/70 hover:text-foreground border border-border rounded-sm px-3 py-1.5 transition-colors"
                  >
                    + Ajouter un cabinet
                  </button>
                )}
              </div>
              {store.previousCabinets.length === 0 && (
                <p className="text-xs text-muted-foreground font-sans font-light">
                  Avez-vous exercé dans d'autres cabinets auparavant ?
                </p>
              )}
              {store.previousCabinets.map((prev, idx) => (
                <div key={idx} className="rounded-sm border border-border p-4 space-y-3 bg-background">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <AutocompleteInput
                        data={allCabinets}
                        value={prev.name}
                        onChange={(v) => {
                          const updated = [...store.previousCabinets];
                          updated[idx] = { ...updated[idx], name: typeof v === 'string' ? v : v[0] };
                          store.setField('previousCabinets', updated);
                        }}
                        placeholder="Nom du cabinet..."
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = store.previousCabinets.filter((_, i) => i !== idx);
                        store.setField('previousCabinets', updated);
                      }}
                      className="p-1 text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {prev.name && (
                    <div>
                      <p className="text-[10px] text-muted-foreground font-sans font-light uppercase tracking-wider mb-2">
                        Précisez simplement votre dominante dans ce cabinet ?
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {allPractices.map(p => {
                          const isSelected = prev.practices.includes(p.label);
                          return (
                            <button
                              key={p.key}
                              type="button"
                              onClick={() => {
                                const updated = [...store.previousCabinets];
                                const practices = isSelected ? [] : [p.label];
                                updated[idx] = { ...updated[idx], practices };
                                store.setField('previousCabinets', updated);
                              }}
                              className={cn(
                                "px-2.5 py-1 rounded-sm text-[10px] font-sans border transition-all",
                                isSelected
                                  ? "bg-foreground text-background border-foreground font-medium"
                                  : "bg-transparent text-muted-foreground border-border hover:border-foreground/40"
                              )}
                            >
                              {p.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>



        {/* Rémunération */}
        <div className="space-y-6 py-8 border-b border-border">
          <div className="text-[12px] font-bold tracking-[0.16em] uppercase text-foreground mb-1 flex items-center gap-2"><span className="w-5 h-[1.5px] bg-foreground rounded-sm" />RÉMUNÉRATION</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground">Rétrocession brute annuelle (€) *</Label>
              <Input value={store.retrocession} onChange={e => store.setField('retrocession', formatNumberWithDots(e.target.value))} placeholder="80.000" className="mt-2" />
            </div>
            <div>
              <Label className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground">Bonus (€) *</Label>
              <Input value={store.bonus} onChange={e => store.setField('bonus', formatNumberWithDots(e.target.value))} placeholder="10.000" className="mt-2" />
            </div>
          </div>

          {/* Objectif facturable */}
          <div className="flex items-center gap-3 relative z-10">
            <Switch
              checked={store.hasObjectifFacturable === true}
              onCheckedChange={v => store.setField('hasObjectifFacturable', v)}
              className="relative z-10"
            />
            <Label className="font-sans text-sm font-light text-foreground cursor-pointer" htmlFor="objectif-facturable">Objectif d'heures facturables</Label>
          </div>
          {store.hasObjectifFacturable && (
            <div className="grid grid-cols-2 gap-4">
              <div>
              <Label className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground">Objectif (heures/an)</Label>
                <Input value={store.objectifFacturable} onChange={e => store.setField('objectifFacturable', formatNumberWithDots(e.target.value))} placeholder="1.800" className="mt-2" />
              </div>
              <div>
                <Label className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground">Réalisé en pratique (heures/an)</Label>
                <Input value={store.objectifFacturableReel} onChange={e => store.setField('objectifFacturableReel', formatNumberWithDots(e.target.value))} placeholder="1.650" className="mt-2" />
              </div>
            </div>
          )}

          {/* Rétrocession flexibility */}
          <div className="border-t border-border pt-6 space-y-4">
            <Label className="font-sans text-sm font-medium block text-foreground">
              Souhaitez-vous conserver a minima votre rétrocession actuelle ?
            </Label>
            <div className="flex gap-4 flex-wrap relative z-10">
              <button
                type="button"
                onClick={() => store.setField('conserverRetrocession', true)}
                className={cn(
                  "px-4 py-2.5 rounded-sm text-sm font-sans font-light border transition-all duration-200 relative z-10 cursor-pointer",
                  store.conserverRetrocession === true
                    ? "bg-foreground text-background border-foreground font-medium"
                    : "bg-background text-foreground/70 border-border hover:border-foreground/60"
                )}
              >
                Oui, c'est indispensable
              </button>
              <button
                type="button"
                onClick={() => store.setField('conserverRetrocession', false)}
                className={cn(
                  "px-4 py-2.5 rounded-sm text-sm font-sans font-light border transition-all duration-200 relative z-10 cursor-pointer",
                  store.conserverRetrocession === false
                    ? "bg-foreground text-background border-foreground font-medium"
                    : "bg-background text-foreground/70 border-border hover:border-foreground/60"
                )}
              >
                Envisageable selon le projet
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="space-y-3 pt-6">
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={store.prevStep} className="font-sans font-light rounded-sm gap-2">
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>
            <Button
              onClick={store.nextStep}
              className="bg-foreground text-background hover:bg-foreground/90 font-sans font-medium rounded-sm gap-2"
            >
              Continuer
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Step2Identity;
