import { motion } from 'framer-motion';
import { useRegistrationStore } from '@/stores/registrationStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AutocompleteInput from '@/components/shared/AutocompleteInput';
import SeniorityBadge from '@/components/shared/SeniorityBadge';
import { usePQE } from '@/hooks/usePQE';
import { CABINETS, DEPARTEMENTS, NATIONALITES, TIERS, MOIS, LEGAL500_BY_PRACTICE } from '@/lib/constants';
import { Switch } from '@/components/ui/switch';
import { Camera, X } from 'lucide-react';
import { useRef } from 'react';

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 1980 + 1 }, (_, i) => currentYear - i);

const Step2Identity = () => {
  const store = useRegistrationStore();
  const pqe = usePQE(store.sermentMois, store.sermentAnnee);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const canProceed = store.prenom.length >= 2 && store.nom.length >= 2 &&
    store.email.includes('@') && store.sermentMois && store.sermentAnnee &&
    store.cabinet.length >= 2 && store.departement.length >= 2;

  // Auto-fill cabinet nationality and tier from Legal500 by practice
  const handleCabinetSelect = (v: string | string[]) => {
    const cabinetName = typeof v === 'string' ? v : v[0];
    store.setField('cabinet', cabinetName as string);

    // Try to find ranking in selected practice area
    const practiceRankings = store.departement ? LEGAL500_BY_PRACTICE[store.departement] : null;
    if (practiceRankings && practiceRankings[cabinetName]) {
      const meta = practiceRankings[cabinetName];
      store.setField('cabNat', meta.nat);
      store.setField('cabTier', meta.band);
    }
  };

  // Also auto-fill when department changes
  const handleDepartmentChange = (dept: string) => {
    store.setField('departement', dept);
    // If cabinet is already selected, try to auto-fill from new practice rankings
    if (store.cabinet) {
      const practiceRankings = LEGAL500_BY_PRACTICE[dept];
      if (practiceRankings && practiceRankings[store.cabinet]) {
        const meta = practiceRankings[store.cabinet];
        store.setField('cabNat', meta.nat);
        store.setField('cabTier', meta.band);
      }
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      store.setField('photo', file);
      const url = URL.createObjectURL(file);
      store.setField('photoPreviewUrl', url);
    }
  };

  const removePhoto = () => {
    store.setField('photo', null);
    store.setField('photoPreviewUrl', '');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 0.68, 0, 1.2] }}
      className="max-w-2xl mx-auto px-4 py-8"
    >
      <h2 className="text-3xl font-serif text-foreground mb-2">Votre identité</h2>
      <p className="text-muted-foreground font-sans font-light mb-8">Ces informations restent strictement confidentielles.</p>

      <div className="space-y-6">
        {/* Photo */}
        <div className="flex items-center gap-6">
          <div className="relative">
            {store.photoPreviewUrl ? (
              <div className="relative">
                <img
                  src={store.photoPreviewUrl}
                  alt="Photo"
                  className="w-20 h-20 rounded-full object-cover border-2 border-border"
                />
                <button
                  onClick={removePhoto}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-foreground text-background flex items-center justify-center"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => photoInputRef.current?.click()}
                className="w-20 h-20 rounded-full border-2 border-dashed border-border flex items-center justify-center hover:border-carter-accent/50 transition-colors"
              >
                <Camera className="w-6 h-6 text-muted-foreground" />
              </button>
            )}
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </div>
          <div>
            <p className="font-sans text-sm font-medium text-foreground">Photo professionnelle</p>
            <p className="font-sans text-xs text-muted-foreground">Optionnel · JPG ou PNG, max 5 Mo</p>
          </div>
        </div>

        {/* Nom / Prénom */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="font-sans text-sm font-light">Prénom *</Label>
            <Input value={store.prenom} onChange={e => store.setField('prenom', e.target.value)} placeholder="Jean" className="mt-1" />
          </div>
          <div>
            <Label className="font-sans text-sm font-light">Nom *</Label>
            <Input value={store.nom} onChange={e => store.setField('nom', e.target.value)} placeholder="Dupont" className="mt-1" />
          </div>
        </div>

        {/* Email / Tel */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="font-sans text-sm font-light">Email *</Label>
            <Input type="email" value={store.email} onChange={e => store.setField('email', e.target.value)} placeholder="jean@cabinet.com" className="mt-1" />
          </div>
          <div>
            <Label className="font-sans text-sm font-light">Téléphone</Label>
            <Input value={store.telephone} onChange={e => store.setField('telephone', e.target.value)} placeholder="+33 6 12 34 56 78" className="mt-1" />
          </div>
        </div>

        {/* Serment */}
        <div>
          <Label className="font-sans text-sm font-light">Date de prestation de serment *</Label>
          <div className="grid grid-cols-2 gap-4 mt-1">
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
          {pqe && <div className="mt-2"><SeniorityBadge info={pqe} /></div>}
        </div>

        {/* Département — FIRST before cabinet */}
        <div>
          <Label className="font-sans text-sm font-light">Département / Pratique *</Label>
          <Select value={store.departement} onValueChange={handleDepartmentChange}>
            <SelectTrigger className="mt-1"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
            <SelectContent>
              {DEPARTEMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Cabinet */}
        <div>
          <Label className="font-sans text-sm font-light">Cabinet actuel *</Label>
          <AutocompleteInput
            data={CABINETS}
            value={store.cabinet}
            onChange={handleCabinetSelect}
            placeholder="Rechercher un cabinet..."
            showMeta
            className="mt-1"
          />
          {store.cabinet && store.departement && LEGAL500_BY_PRACTICE[store.departement]?.[store.cabinet] && (
            <p className="text-xs text-carter-accent font-sans mt-1">
              Classement Legal 500 ({store.departement}) : {LEGAL500_BY_PRACTICE[store.departement][store.cabinet].band}
            </p>
          )}
        </div>

        {/* Nationalité / Tier */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="font-sans text-sm font-light">Nationalité du cabinet</Label>
            <Select value={store.cabNat} onValueChange={v => store.setField('cabNat', v)}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
              <SelectContent>
                {NATIONALITES.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="font-sans text-sm font-light">Tier Legal 500</Label>
            <Select value={store.cabTier} onValueChange={v => store.setField('cabTier', v)}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
              <SelectContent>
                {TIERS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Financier */}
        <div className="carter-card p-6 space-y-4">
          <h3 className="font-serif text-lg text-foreground">Rémunération <span className="text-xs text-muted-foreground font-sans font-light">(confidentiel)</span></h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="font-sans text-sm font-light">Rétrocession brute annuelle (€)</Label>
              <Input value={store.retrocession} onChange={e => store.setField('retrocession', e.target.value)} placeholder="80 000" className="mt-1" />
            </div>
            <div>
              <Label className="font-sans text-sm font-light">Bonus (€)</Label>
              <Input value={store.bonus} onChange={e => store.setField('bonus', e.target.value)} placeholder="10 000" className="mt-1" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Switch
              checked={store.hasObjectifFacturable === true}
              onCheckedChange={v => store.setField('hasObjectifFacturable', v)}
            />
            <Label className="font-sans text-sm font-light">Objectif d'heures facturables</Label>
          </div>
          {store.hasObjectifFacturable && (
            <div>
              <Label className="font-sans text-sm font-light">Nombre d'heures/an</Label>
              <Input value={store.objectifFacturable} onChange={e => store.setField('objectifFacturable', e.target.value)} placeholder="1800" className="mt-1" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={store.prevStep} className="font-sans font-light">Retour</Button>
          <Button onClick={store.nextStep} disabled={!canProceed} className="bg-carter-accent hover:bg-carter-accent-light text-accent-foreground font-sans font-medium">
            Continuer
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default Step2Identity;
