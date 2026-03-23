import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import AutocompleteInput from '@/components/shared/AutocompleteInput';
import { CABINETS } from '@/lib/constants';
import { getAllFirmNames } from '@/lib/legal500Rankings';
import { Bell, Plus, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const SENIORITY_OPTIONS = ['Junior (0-3 ans)', 'Mid Level (3-6 ans)', 'Sénior (+6 ans)', 'Counsel', 'Associé'];
const PRACTICE_OPTIONS = ['M&A', 'Private Equity', 'Banque & Finance', 'Droit Social', 'Fiscal', 'Restructuring', 'Immobilier', 'Contentieux'];

interface AlertConfig {
  id: string;
  label: string;
  seniorities: string[];
  practices: string[];
  originFirms: string[];
  isActive: boolean;
}

interface CabinetNotificationAlertsProps {
  onClose: () => void;
}

const CabinetNotificationAlerts = ({ onClose }: CabinetNotificationAlertsProps) => {
  const [alerts, setAlerts] = useState<AlertConfig[]>([]);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [label, setLabel] = useState('');
  const [seniorities, setSeniorities] = useState<string[]>([]);
  const [practices, setPractices] = useState<string[]>([]);
  const [originFirms, setOriginFirms] = useState<string[]>([]);
  const [currentFirm, setCurrentFirm] = useState('');

  const allFirms = [...new Set([...CABINETS, ...getAllFirmNames()])].sort();

  const toggleSeniority = (s: string) => {
    setSeniorities(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const togglePractice = (p: string) => {
    setPractices(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  };

  const addFirm = (firm: string | string[]) => {
    const f = typeof firm === 'string' ? firm : firm[0];
    if (f && !originFirms.includes(f)) {
      setOriginFirms([...originFirms, f]);
    }
    setCurrentFirm('');
  };

  const removeFirm = (firm: string) => {
    setOriginFirms(originFirms.filter(f => f !== firm));
  };

  const saveAlert = () => {
    if (seniorities.length === 0 && practices.length === 0 && originFirms.length === 0) {
      toast.error('Veuillez renseigner au moins un critère');
      return;
    }

    const newAlert: AlertConfig = {
      id: `alert-${Date.now()}`,
      label: label || `Alerte ${alerts.length + 1}`,
      seniorities,
      practices,
      originFirms,
      isActive: true,
    };

    setAlerts([...alerts, newAlert]);
    resetForm();
    toast.success('Alerte créée avec succès');
  };

  const resetForm = () => {
    setShowForm(false);
    setLabel('');
    setSeniorities([]);
    setPractices([]);
    setOriginFirms([]);
    setCurrentFirm('');
  };

  const toggleAlert = (id: string) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a));
  };

  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id));
    toast.success('Alerte supprimée');
  };

  return (
    <div className="fixed inset-0 z-[500] flex">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative ml-auto w-[420px] bg-background h-full overflow-y-auto shadow-2xl border-l border-border">
        <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-foreground" />
            <span className="text-[11px] font-bold tracking-[0.08em] uppercase text-foreground">Alertes prioritaires</span>
          </div>
          <button onClick={onClose} className="bg-secondary rounded-full w-7 h-7 flex items-center justify-center hover:bg-border">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5">
          <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
            Soyez notifié en priorité lorsqu'un candidat correspondant à vos critères se dit à l'écoute du marché.
          </p>

          {/* Existing alerts */}
          {alerts.length > 0 && (
            <div className="space-y-3 mb-6">
              {alerts.map(alert => (
                <div key={alert.id} className="border border-border rounded-md p-4 bg-background">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-foreground">{alert.label}</span>
                    <div className="flex items-center gap-2">
                      <Switch checked={alert.isActive} onCheckedChange={() => toggleAlert(alert.id)} />
                      <button onClick={() => deleteAlert(alert.id)} className="text-muted-foreground hover:text-foreground">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {alert.seniorities.map(s => (
                      <span key={s} className="text-[9px] font-semibold px-2 py-0.5 rounded-sm bg-secondary text-foreground">{s}</span>
                    ))}
                    {alert.practices.map(p => (
                      <span key={p} className="text-[9px] font-semibold px-2 py-0.5 rounded-sm bg-foreground text-background">{p}</span>
                    ))}
                    {alert.originFirms.map(f => (
                      <span key={f} className="text-[9px] font-semibold px-2 py-0.5 rounded-sm bg-primary/10 text-foreground border border-border">{f}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add alert form */}
          {showForm ? (
            <div className="border border-border rounded-md p-4 bg-secondary/30 space-y-4">
              <div>
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Nom de l'alerte</Label>
                <Input value={label} onChange={e => setLabel(e.target.value)} placeholder="Ex: Senior M&A Magic Circle" className="mt-1.5" />
              </div>

              <div>
                <Label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Séniorité</Label>
                <div className="flex flex-wrap gap-1.5">
                  {SENIORITY_OPTIONS.map(s => (
                    <button
                      key={s}
                      onClick={() => toggleSeniority(s)}
                      className={cn(
                        'text-[10px] font-semibold px-2.5 py-1 border rounded-full transition-all',
                        seniorities.includes(s)
                          ? 'bg-foreground text-background border-foreground'
                          : 'bg-background text-muted-foreground border-border hover:border-foreground'
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Pratique</Label>
                <div className="flex flex-wrap gap-1.5">
                  {PRACTICE_OPTIONS.map(p => (
                    <button
                      key={p}
                      onClick={() => togglePractice(p)}
                      className={cn(
                        'text-[10px] font-semibold px-2.5 py-1 border rounded-full transition-all',
                        practices.includes(p)
                          ? 'bg-foreground text-background border-foreground'
                          : 'bg-background text-muted-foreground border-border hover:border-foreground'
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Cabinets d'origine</Label>
                <AutocompleteInput
                  value={currentFirm}
                  onChange={addFirm}
                  suggestions={allFirms}
                  placeholder="Rechercher un cabinet..."
                />
                {originFirms.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {originFirms.map(f => (
                      <span key={f} className="text-[10px] font-semibold px-2 py-1 rounded-sm bg-secondary text-foreground flex items-center gap-1">
                        {f}
                        <button onClick={() => removeFirm(f)} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <Button onClick={saveAlert} size="sm" className="bg-foreground text-background text-xs font-bold">
                  Créer l'alerte
                </Button>
                <Button variant="outline" size="sm" onClick={resetForm} className="text-xs">
                  Annuler
                </Button>
              </div>
            </div>
          ) : (
            <Button
              onClick={() => setShowForm(true)}
              variant="outline"
              className="w-full text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" /> Créer une alerte
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CabinetNotificationAlerts;
