import { motion } from 'framer-motion';
import { useRegistrationStore } from '@/stores/registrationStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AutocompleteInput from '@/components/shared/AutocompleteInput';
import SeniorityBadge from '@/components/shared/SeniorityBadge';
import { usePQE } from '@/hooks/usePQE';
import { CABINETS, DEPARTEMENTS, NATIONALITES, TIERS, MOIS } from '@/lib/constants';
import { Switch } from '@/components/ui/switch';

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 1980 + 1 }, (_, i) => currentYear - i);

const Step2Identity = () => {
  const store = useRegistrationStore();
  const pqe = usePQE(store.sermentMois, store.sermentAnnee);

  const canProceed = store.prenom.length >= 2 && store.nom.length >= 2 &&
    store.email.includes('@') && store.sermentMois && store.sermentAnnee &&
    store.cabinet.length >= 2 && store.departement.length >= 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 0.68, 0, 1.2] }}
      className="max-w-2xl mx-auto px-4 py-8"
    >
      <h2 className="text-3xl font-serif text-foreground mb-2">Votre identité</h2>
      <p className="text-muted-foreground font-sans mb-8">Ces informations restent strictement confidentielles.</p>

      <div className="space-y-6">
        {/* Nom / Prénom */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="font-sans text-sm">Prénom *</Label>
            <Input value={store.prenom} onChange={e => store.setField('prenom', e.target.value)} placeholder="Jean" className="mt-1" />
          </div>
          <div>
            <Label className="font-sans text-sm">Nom *</Label>
            <Input value={store.nom} onChange={e => store.setField('nom', e.target.value)} placeholder="Dupont" className="mt-1" />
          </div>
        </div>

        {/* Email / Tel */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="font-sans text-sm">Email *</Label>
            <Input type="email" value={store.email} onChange={e => store.setField('email', e.target.value)} placeholder="jean@cabinet.com" className="mt-1" />
          </div>
          <div>
            <Label className="font-sans text-sm">Téléphone</Label>
            <Input value={store.telephone} onChange={e => store.setField('telephone', e.target.value)} placeholder="+33 6 12 34 56 78" className="mt-1" />
          </div>
        </div>

        {/* Serment */}
        <div>
          <Label className="font-sans text-sm">Date de prestation de serment *</Label>
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

        {/* Département */}
        <div>
          <Label className="font-sans text-sm">Département / Pratique *</Label>
          <Select value={store.departement} onValueChange={v => store.setField('departement', v)}>
            <SelectTrigger className="mt-1"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
            <SelectContent>
              {DEPARTEMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Cabinet */}
        <div>
          <Label className="font-sans text-sm">Cabinet actuel *</Label>
          <AutocompleteInput
            data={CABINETS}
            value={store.cabinet}
            onChange={v => store.setField('cabinet', v as string)}
            placeholder="Rechercher un cabinet..."
            showMeta
            className="mt-1"
          />
        </div>

        {/* Nationalité / Tier */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="font-sans text-sm">Nationalité du cabinet</Label>
            <Select value={store.cabNat} onValueChange={v => store.setField('cabNat', v)}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
              <SelectContent>
                {NATIONALITES.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="font-sans text-sm">Tier Legal 500</Label>
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
          <h3 className="font-serif text-lg text-foreground">Rémunération <span className="text-xs text-muted-foreground font-sans">(confidentiel)</span></h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="font-sans text-sm">Rétrocession brute annuelle (€)</Label>
              <Input value={store.retrocession} onChange={e => store.setField('retrocession', e.target.value)} placeholder="80 000" className="mt-1" />
            </div>
            <div>
              <Label className="font-sans text-sm">Bonus (€)</Label>
              <Input value={store.bonus} onChange={e => store.setField('bonus', e.target.value)} placeholder="10 000" className="mt-1" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Switch
              checked={store.hasObjectifFacturable === true}
              onCheckedChange={v => store.setField('hasObjectifFacturable', v)}
            />
            <Label className="font-sans text-sm">Objectif d'heures facturables</Label>
          </div>
          {store.hasObjectifFacturable && (
            <div>
              <Label className="font-sans text-sm">Nombre d'heures/an</Label>
              <Input value={store.objectifFacturable} onChange={e => store.setField('objectifFacturable', e.target.value)} placeholder="1800" className="mt-1" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={store.prevStep} className="font-sans">Retour</Button>
          <Button onClick={store.nextStep} disabled={!canProceed} className="bg-carter-red hover:bg-carter-red-light text-accent-foreground font-sans">
            Continuer
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default Step2Identity;
