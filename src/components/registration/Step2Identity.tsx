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
import { getAllChambersFirmNames, getFirmPractices, getChambersRankingByPractice, formatChambersBand, CHAMBERS_DEPARTMENTS, CHAMBERS_KEY_TO_PRACTICE } from '@/lib/chambersRankings';
import { Camera, X, ArrowLeft, ArrowRight, Linkedin, Eye, EyeOff, Check, AlertCircle, Loader2 } from 'lucide-react';
import { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 1980 + 1 }, (_, i) => currentYear - i);


const Step2Identity = () => {
  const store = useRegistrationStore();
  const isAdmin = store.isAdminMode;
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
    const set = new Set([...CABINETS, ...getAllChambersFirmNames()]);
    return [...set].sort((a, b) => a.localeCompare(b));
  }, []);

  const canProceed = isAdmin || (store.prenom.length >= 2 && store.nom.length >= 2 &&
    store.email.includes('@') && store.telephone.length >= 10 &&
    store.sermentMois && store.sermentAnnee &&
    store.departement.length >= 2 && store.cabinet.length >= 2 &&
    isPasswordValid && passwordsMatch &&
    store.retrocession.length >= 1 &&
    store.conserverRetrocession !== null);

  const missingFields = useMemo(() => {
    const missing: string[] = [];
    if (store.prenom.length < 2) missing.push('Prénom');
    if (store.nom.length < 2) missing.push('Nom');
    if (!isAdmin && !store.email.includes('@')) missing.push('Email');
    if (store.telephone.length < 10) missing.push('Téléphone');
    if (!isAdmin && !isPasswordValid) missing.push('Mot de passe');
    if (!isAdmin && !passwordsMatch) missing.push('Confirmation mot de passe');
    if (!store.sermentMois || !store.sermentAnnee) missing.push('Date de serment');
    if (store.departement.length < 2) missing.push('Département');
    if (store.cabinet.length < 2) missing.push('Cabinet');
    if (store.retrocession.length < 1) missing.push('Rétrocession');
    if (store.conserverRetrocession === null) missing.push('Flexibilité rétrocession');
    return missing;
  }, [store.prenom, store.nom, store.email, store.telephone, isPasswordValid, passwordsMatch, store.sermentMois, store.sermentAnnee, store.departement, store.cabinet, store.retrocession, store.conserverRetrocession, isAdmin]);

  const handleCabinetSelect = (v: string | string[]) => {
    const cabinetName = typeof v === 'string' ? v : v[0];
    store.setField('cabinet', cabinetName as string);
  };

  // All Chambers practices available for selection
  const allPractices = useMemo(() => {
    return CHAMBERS_DEPARTMENTS.map(d => ({
      key: d.key,
      label: CHAMBERS_KEY_TO_PRACTICE[d.key] || d.label,
    })).sort((a, b) => a.label.localeCompare(b.label, 'fr'));
  }, []);

  // Get current Chambers band for selected practice (null = not ranked)
  const currentChambersBand = useMemo(() => {
    if (!store.cabinet || !store.departement) return undefined;
    return getChambersRankingByPractice(store.cabinet, store.departement);
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

  const fetchLinkedinPhoto = useCallback(async (url: string) => {
    if (!url.includes('linkedin.com/in/') || linkedinLoading) return;
    if (store.photo) return;
    
    const match = url.match(/linkedin\.com\/in\/([^/?#]+)/);
    if (!match?.[1]) return;
    
    const username = match[1];
    setLinkedinLoading(true);
    setLinkedinError('');
    
    // Try unavatar.io directly as an image URL (no edge function needed)
    const unavatarUrl = `https://unavatar.io/linkedin/${username}?fallback=false`;
    
    try {
      const img = new Image();
      const loaded = await new Promise<boolean>((resolve) => {
        img.onload = () => resolve(img.naturalWidth > 1 && img.naturalHeight > 1);
        img.onerror = () => resolve(false);
        img.src = unavatarUrl;
      });
      
      if (loaded) {
        store.setField('photoPreviewUrl', unavatarUrl);
      } else {
        setLinkedinError('Photo non trouvée — vous pouvez l\'ajouter manuellement.');
      }
    } catch {
      setLinkedinError('Impossible de récupérer la photo LinkedIn.');
    } finally {
      setLinkedinLoading(false);
    }
  }, [linkedinLoading, store]);

  const handleLinkedinChange = (value: string) => {
    store.setField('linkedinUrl', value);
  };

  const handleLinkedinPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text');
    if (pasted.includes('linkedin.com/in/')) {
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
      className="max-w-5xl mx-auto px-6 py-10"
    >
      <h2 className="text-3xl font-serif text-foreground mb-2 font-normal tracking-[-0.02em]">Votre profil</h2>
      <p className="text-muted-foreground font-sans text-sm font-light mb-10">Ces informations restent strictement confidentielles.</p>

      <div className="space-y-8">
        {/* LinkedIn URL */}
        <div>
          <Label className="font-sans text-xs font-light text-muted-foreground uppercase tracking-wider">Profil LinkedIn</Label>
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
        {isAdmin ? (
          <div>
            <Label className="font-sans text-xs font-light text-muted-foreground uppercase tracking-wider">Téléphone *</Label>
            <Input value={store.telephone} onChange={e => store.setField('telephone', formatPhoneWithDots(e.target.value))} placeholder="06.50.10.20.30" className="mt-2" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="font-sans text-xs font-light text-muted-foreground uppercase tracking-wider">Email *</Label>
              <Input type="email" value={store.email} onChange={e => store.setField('email', e.target.value)} placeholder="jean@cabinet.com" className="mt-2" />
            </div>
            <div>
              <Label className="font-sans text-xs font-light text-muted-foreground uppercase tracking-wider">Téléphone *</Label>
              <Input value={store.telephone} onChange={e => store.setField('telephone', formatPhoneWithDots(e.target.value))} placeholder="06.50.10.20.30" className="mt-2" />
            </div>
          </div>
        )}

        {/* Password — hidden in admin mode */}
        {!isAdmin && (
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
        )}
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

            {store.isAssocieOrCounsel && (
              <div className="space-y-8 border-t border-border pt-6 animate-fade-in">
                {/* CA Portable with gauge */}
                <div>
                  <Label className="font-sans text-xs font-light text-muted-foreground uppercase tracking-wider">Chiffre d'affaires portable</Label>
                  <div className="mt-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground font-sans">0 K€</span>
                      <span className="text-lg font-serif font-semibold text-foreground">
                        {store.chiffreAffairesPortable ? `${store.chiffreAffairesPortable} K€` : '— K€'}
                      </span>
                      <span className="text-xs text-muted-foreground font-sans">5.000 K€</span>
                    </div>
                    <Slider
                      value={[parseInt(store.chiffreAffairesPortable?.replace(/\./g, '') || '0')]}
                      onValueChange={v => store.setField('chiffreAffairesPortable', formatNumberWithDots(v[0].toString()))}
                      min={0}
                      max={5000}
                      step={50}
                      className="w-full"
                    />
                    <div className="flex gap-2">
                      {[500, 1000, 2000, 3000].map(v => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => store.setField('chiffreAffairesPortable', formatNumberWithDots(v.toString()))}
                          className="px-3 py-1 rounded-sm border border-border text-xs font-sans text-muted-foreground hover:border-foreground hover:text-foreground transition-all"
                        >
                          {formatNumberWithDots(v.toString())} K€
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Expertise summary */}
                <div>
                  <Label className="font-sans text-xs font-light text-muted-foreground uppercase tracking-wider">Résumé de votre expertise</Label>
                  <Textarea
                    value={store.assocExpertiseSummary}
                    onChange={e => store.setField('assocExpertiseSummary', e.target.value)}
                    placeholder="Décrivez votre expertise, vos domaines d'intervention principaux et votre positionnement sur le marché..."
                    className="mt-2 min-h-[100px]"
                  />
                  <p className="text-xs text-muted-foreground font-sans font-light mt-1.5">{store.assocExpertiseSummary.length}/500 caractères</p>
                </div>

                {/* Projet & attentes */}
                <div>
                  <Label className="font-sans text-xs font-light text-muted-foreground uppercase tracking-wider">Votre projet</Label>
                  <Textarea
                    value={store.assocProjet}
                    onChange={e => store.setField('assocProjet', e.target.value)}
                    placeholder="Qu'est-ce qui motive votre réflexion ? Quel type de structure recherchez-vous ? Quels sont vos objectifs à 3-5 ans ?"
                    className="mt-2 min-h-[100px]"
                  />
                </div>

                <div>
                  <Label className="font-sans text-xs font-light text-muted-foreground uppercase tracking-wider mb-3 block">Vos attentes principales</Label>
                  <ChipSelector
                    options={ASSOC_ATTENTES}
                    selected={store.assocAttentes}
                    onChange={v => store.setField('assocAttentes', v)}
                    maxSelect={4}
                  />
                  <p className="text-xs text-muted-foreground font-sans font-light mt-2">Max 4 sélections</p>
                </div>

                {/* Type de cabinets qui intéressent */}
                <div>
                  <Label className="font-sans text-xs font-light text-muted-foreground uppercase tracking-wider mb-3 block">Quel type de cabinet vous intéresserait ?</Label>
                  <ChipSelector
                    options={ASSOC_CAB_TYPES}
                    selected={store.assocCabTypes}
                    onChange={v => store.setField('assocCabTypes', v)}
                  />
                </div>

                {/* BP Upload */}
                <div>
                  <Label className="font-sans text-xs font-light text-muted-foreground uppercase tracking-wider mb-2 block">Business plan (optionnel)</Label>
                  <FileDropzone file={store.businessPlanFile} onFileChange={f => store.setField('businessPlanFile', f)} />
                  <p className="text-xs text-muted-foreground font-sans font-light mt-1.5">PDF, Word ou Excel · max 10 Mo</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Cabinet — FIRST */}
        <div>
          <div className="flex items-center gap-2">
            <Label className="font-sans text-xs font-light text-muted-foreground uppercase tracking-wider">Cabinet actuel *</Label>
          </div>
          <AutocompleteInput
            data={allCabinets}
            value={store.cabinet}
            onChange={handleCabinetSelect}
            placeholder="Rechercher un cabinet..."
            className="mt-2"
          />
        </div>

        {/* Pratique — all Chambers departments */}
        <div>
          <Label className="font-sans text-xs font-light text-muted-foreground uppercase tracking-wider">Votre pratique *</Label>
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
              {store.departement && currentChambersBand !== undefined && (
                <div className="mt-3 flex items-center gap-2">
                  {currentChambersBand !== null ? (
                    <>
                      <span className="inline-flex items-center px-3 py-1 rounded-sm bg-foreground text-background text-xs font-sans font-medium">
                        Chambers Band {currentChambersBand}
                      </span>
                      <span className="text-xs text-muted-foreground font-sans font-light">
                        {store.cabinet} · {store.departement}
                      </span>
                    </>
                  ) : (
                    <span className="text-xs text-muted-foreground font-sans font-light italic">
                      {store.cabinet} n'est pas classé dans Chambers pour la pratique {store.departement}
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
              <Label className="font-sans text-xs font-light text-muted-foreground uppercase tracking-wider">Cabinets précédents</Label>
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
              <div key={idx} className="rounded-sm border border-border p-4 space-y-3 bg-card">
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
                      Compétences développées dans ce cabinet
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
                              const practices = isSelected
                                ? prev.practices.filter(pr => pr !== p.label)
                                : [...prev.practices, p.label];
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




        {/* Rémunération */}
        <div className="rounded-sm p-8 space-y-6 border border-border relative z-0 bg-card">
          <div>
            <p className="text-[10px] font-sans font-medium tracking-[0.15em] uppercase text-muted-foreground mb-2">Confidentiel</p>
            <h3 className="font-serif text-xl text-foreground font-normal">Rémunération</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="font-sans text-xs font-light text-muted-foreground uppercase tracking-wider">Rétrocession brute annuelle (€) *</Label>
              <Input value={store.retrocession} onChange={e => store.setField('retrocession', formatNumberWithDots(e.target.value))} placeholder="80.000" className="mt-2" />
            </div>
            <div>
              <Label className="font-sans text-xs font-light text-muted-foreground uppercase tracking-wider">Bonus (€) *</Label>
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
              <Label className="font-sans text-xs font-light text-muted-foreground uppercase tracking-wider">Objectif (heures/an)</Label>
                <Input value={store.objectifFacturable} onChange={e => store.setField('objectifFacturable', formatNumberWithDots(e.target.value))} placeholder="1.800" className="mt-2" />
              </div>
              <div>
                <Label className="font-sans text-xs font-light text-muted-foreground uppercase tracking-wider">Réalisé en pratique (heures/an)</Label>
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
          {!canProceed && missingFields.length > 0 && (
            <div className="flex items-start gap-2 p-3 rounded-sm bg-secondary/50 border border-border">
              <AlertCircle className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground font-sans font-light">
                Champs manquants : {missingFields.join(', ')}
              </p>
            </div>
          )}
          <div className="flex justify-between items-center">
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
      </div>
    </motion.div>
  );
};

export default Step2Identity;
