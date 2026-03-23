import { useState, useMemo, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import AutocompleteInput from '@/components/shared/AutocompleteInput';
import SeniorityBadge from '@/components/shared/SeniorityBadge';
import ChipSelector from '@/components/shared/ChipSelector';
import { usePQE } from '@/hooks/usePQE';
import { CABINETS, DEPARTEMENTS, MOIS, RAISONS_BAISSE_RETRO } from '@/lib/constants';
import { formatNumberWithDots, formatPhoneWithDots } from '@/lib/formatters';
import { LEGAL500_DB, NAT_LABELS as L500_NAT_LABELS, formatTier, getAllFirmNames } from '@/lib/legal500Rankings';
import { Copy, Check, Link2, UserPlus, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 1980 + 1 }, (_, i) => currentYear - i);

const DEPT_TO_L500: Record<string, string> = {
  "Arbitrage / Contentieux": "contentieux",
  "Financement LBO": "banque",
  "Financement de projets": "finproj",
  "Concurrence": "regulatory",
  "Droit Public": "public",
  "Droit Social": "social",
  "Fiscal": "fiscal",
  "Immobilier": "immo",
  "IP / Tech": "vc",
  "M&A (dominante)": "ma",
  "Private Equity (dominante)": "pe",
  "Marchés de Capitaux": "finproj",
  "Restructuring": "restructuring",
};

const AdminRegistration = () => {
  const [step, setStep] = useState<'form' | 'link'>('form');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state (same as candidate Step2Identity minus email/password)
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [sermentMois, setSermentMois] = useState<number | null>(null);
  const [sermentAnnee, setSermentAnnee] = useState<number | null>(null);
  const [cabinet, setCabinet] = useState('');
  const [cabNat, setCabNat] = useState('');
  const [cabTier, setCabTier] = useState('');
  const [departement, setDepartement] = useState('');
  const [retrocession, setRetrocession] = useState('');
  const [bonus, setBonus] = useState('');
  const [anglais, setAnglais] = useState('');
  const [motivation, setMotivation] = useState('');
  const [disponibilite, setDisponibilite] = useState('');
  const [mobilite, setMobilite] = useState('');
  const [conserverRetro, setConserverRetro] = useState<boolean | null>(null);

  const pqe = usePQE(sermentMois, sermentAnnee);

  const allCabinets = useMemo(() => {
    const set = new Set([...CABINETS, ...getAllFirmNames()]);
    return [...set].sort((a, b) => a.localeCompare(b));
  }, []);

  const autoDetectRanking = (cabinetName: string, dept: string) => {
    let firmEntry = LEGAL500_DB[cabinetName];
    if (!firmEntry) {
      const match = Object.keys(LEGAL500_DB).find(k =>
        k.toLowerCase().startsWith(cabinetName.toLowerCase()) ||
        cabinetName.toLowerCase().startsWith(k.split(' ').slice(0, 3).join(' ').toLowerCase())
      );
      if (match) firmEntry = LEGAL500_DB[match];
    }
    if (firmEntry) {
      setCabNat(L500_NAT_LABELS[firmEntry.nat] || firmEntry.nat);
      const deptKey = DEPT_TO_L500[dept];
      if (deptKey && firmEntry.rankings[deptKey] !== undefined) {
        setCabTier(formatTier(firmEntry.rankings[deptKey]));
      } else {
        setCabTier('Non répertorié');
      }
    } else {
      setCabNat('');
      setCabTier('Non répertorié');
    }
  };

  const handleCabinetSelect = (v: string | string[]) => {
    const name = typeof v === 'string' ? v : v[0];
    setCabinet(name);
    if (departement) autoDetectRanking(name, departement);
  };

  const handleDeptChange = (dept: string) => {
    setDepartement(dept);
    if (cabinet) autoDetectRanking(cabinet, dept);
  };

  const canSubmit = prenom.length >= 2 && nom.length >= 2 && telephone.length >= 8 &&
    sermentMois && sermentAnnee && departement && cabinet;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSaving(true);

    const submissionData = {
      prenom, nom, telephone, sermentMois, sermentAnnee,
      cabinet, cabNat, cabTier, departement,
      retrocession, bonus, anglais, motivation, disponibilite, mobilite,
      conserverRetro,
      pqeYears: pqe?.years,
      pqeLabel: pqe?.label,
    };

    const { data, error } = await supabase
      .from('admin_candidate_invites')
      .insert({
        submission_data: submissionData as any,
        created_by: (await supabase.auth.getUser()).data.user!.id,
      })
      .select('token')
      .single();

    setSaving(false);

    if (error || !data) {
      toast.error('Erreur lors de la création de l\'invitation');
      return;
    }

    const link = `${window.location.origin}/auth?invite=${data.token}`;
    setGeneratedLink(link);
    setStep('link');
    toast.success('Profil créé — lien d\'invitation généré');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    toast.success('Lien copié !');
    setTimeout(() => setCopied(false), 2000);
  };

  const resetForm = () => {
    setStep('form');
    setPrenom(''); setNom(''); setTelephone('');
    setSermentMois(null); setSermentAnnee(null);
    setCabinet(''); setCabNat(''); setCabTier('');
    setDepartement(''); setRetrocession(''); setBonus('');
    setAnglais(''); setMotivation(''); setDisponibilite(''); setMobilite('');
    setConserverRetro(null); setGeneratedLink('');
  };

  if (step === 'link') {
    return (
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground mb-2">Inscription candidat</h1>
        <p className="text-sm text-muted-foreground mb-8">Profil créé avec succès. Transmettez le lien au candidat.</p>

        <div className="bg-background border border-border rounded-lg p-6 max-w-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Link2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{prenom} {nom}</p>
              <p className="text-xs text-muted-foreground">{departement} · {cabinet}</p>
            </div>
          </div>

          <Label className="text-xs font-light text-muted-foreground uppercase tracking-wider">Lien d'invitation (sans expiration)</Label>
          <div className="flex gap-2 mt-2 mb-4">
            <Input value={generatedLink} readOnly className="text-xs font-mono" />
            <Button variant="outline" size="icon" onClick={copyLink}>
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>

          <p className="text-[11px] text-muted-foreground leading-relaxed mb-6">
            Le candidat pourra valider son profil et créer son compte (email + mot de passe) via ce lien. 
            Aucune expiration. Vous pouvez l'envoyer par SMS ou WhatsApp.
          </p>

          <div className="flex gap-3">
            <Button variant="outline" onClick={resetForm} className="text-xs">
              <UserPlus className="w-3.5 h-3.5 mr-1.5" /> Inscrire un autre candidat
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-foreground mb-2">Inscrire un candidat</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Remplissez le profil du candidat. Un lien lui sera généré pour qu'il valide et crée son compte.
      </p>

      <div className="max-w-2xl space-y-6">
        {/* Nom / Prénom */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs font-light text-muted-foreground uppercase tracking-wider">Prénom *</Label>
            <Input value={prenom} onChange={e => setPrenom(e.target.value)} placeholder="Jean" className="mt-2" />
          </div>
          <div>
            <Label className="text-xs font-light text-muted-foreground uppercase tracking-wider">Nom *</Label>
            <Input value={nom} onChange={e => setNom(e.target.value)} placeholder="Dupont" className="mt-2" />
          </div>
        </div>

        {/* Téléphone */}
        <div>
          <Label className="text-xs font-light text-muted-foreground uppercase tracking-wider">Téléphone *</Label>
          <Input value={telephone} onChange={e => setTelephone(formatPhoneWithDots(e.target.value))} placeholder="06.50.10.20.30" className="mt-2" />
        </div>

        {/* Serment */}
        <div>
          <Label className="text-xs font-light text-muted-foreground uppercase tracking-wider">Date de prestation de serment *</Label>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <Select value={sermentMois?.toString() || ''} onValueChange={v => setSermentMois(parseInt(v))}>
              <SelectTrigger><SelectValue placeholder="Mois" /></SelectTrigger>
              <SelectContent>
                {MOIS.map(m => <SelectItem key={m.value} value={m.value.toString()}>{m.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={sermentAnnee?.toString() || ''} onValueChange={v => setSermentAnnee(parseInt(v))}>
              <SelectTrigger><SelectValue placeholder="Année" /></SelectTrigger>
              <SelectContent>
                {YEARS.map(y => <SelectItem key={y} value={y.toString()}>{y}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          {pqe && <div className="mt-3"><SeniorityBadge info={pqe} /></div>}
        </div>

        {/* Département */}
        <div>
          <Label className="text-xs font-light text-muted-foreground uppercase tracking-wider">Département *</Label>
          <Select value={departement} onValueChange={handleDeptChange}>
            <SelectTrigger className="mt-2"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
            <SelectContent>
              {DEPARTEMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Cabinet */}
        <div>
          <Label className="text-xs font-light text-muted-foreground uppercase tracking-wider">Cabinet actuel *</Label>
          <div className="mt-2">
            <AutocompleteInput
              value={cabinet}
              onChange={handleCabinetSelect}
              suggestions={allCabinets}
              placeholder="Nom du cabinet"
            />
          </div>
          {cabTier && (
            <div className="flex items-center gap-2 mt-2">
              {cabNat && <span className="text-[10px] text-muted-foreground">{cabNat}</span>}
              <span className={cn(
                'text-[9px] font-bold tracking-[0.06em] uppercase px-2 py-0.5 rounded-sm',
                cabTier.startsWith('Tier') ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'
              )}>{cabTier}</span>
            </div>
          )}
        </div>

        {/* Rétrocession */}
        <div>
          <Label className="text-xs font-light text-muted-foreground uppercase tracking-wider">Rétrocession annuelle (€)</Label>
          <Input value={retrocession} onChange={e => setRetrocession(formatNumberWithDots(e.target.value))} placeholder="65.000" className="mt-2" />
        </div>

        {/* Flexibilité rétro */}
        <div>
          <Label className="text-xs font-light text-muted-foreground uppercase tracking-wider">Accepterait une baisse de rétrocession ?</Label>
          <div className="flex gap-3 mt-2">
            <Button variant={conserverRetro === true ? 'default' : 'outline'} size="sm" onClick={() => setConserverRetro(true)} className="text-xs">Oui</Button>
            <Button variant={conserverRetro === false ? 'default' : 'outline'} size="sm" onClick={() => setConserverRetro(false)} className="text-xs">Non</Button>
          </div>
        </div>

        {/* Anglais */}
        <div>
          <Label className="text-xs font-light text-muted-foreground uppercase tracking-wider">Niveau d'anglais</Label>
          <Select value={anglais} onValueChange={setAnglais}>
            <SelectTrigger className="mt-2"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
            <SelectContent>
              {['Bilingue', 'Courant', 'Professionnel', 'Intermédiaire', 'Basique'].map(a => (
                <SelectItem key={a} value={a}>{a}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Disponibilité + Mobilité */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs font-light text-muted-foreground uppercase tracking-wider">Disponibilité</Label>
            <Select value={disponibilite} onValueChange={setDisponibilite}>
              <SelectTrigger className="mt-2"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
              <SelectContent>
                {['Immédiate', 'Sous 1 mois', 'Sous 2 mois', 'Sous 3 mois', '+ de 3 mois'].map(d => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs font-light text-muted-foreground uppercase tracking-wider">Mobilité</Label>
            <Input value={mobilite} onChange={e => setMobilite(e.target.value)} placeholder="Paris" className="mt-2" />
          </div>
        </div>

        {/* Motivation */}
        <div>
          <Label className="text-xs font-light text-muted-foreground uppercase tracking-wider">Notes / Motivation</Label>
          <Textarea value={motivation} onChange={e => setMotivation(e.target.value)} placeholder="Notes internes sur le candidat..." className="mt-2 min-h-[80px]" />
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4 border-t border-border">
          <Button onClick={handleSubmit} disabled={!canSubmit || saving} className="bg-primary text-primary-foreground font-bold text-sm px-8">
            {saving ? 'Création...' : 'Créer le profil et générer le lien →'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminRegistration;
