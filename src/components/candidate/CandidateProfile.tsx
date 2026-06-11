import { useRegistrationStore } from '@/stores/registrationStore';
import { usePQE } from '@/hooks/usePQE';
import { useAuth } from '@/hooks/useAuth';
import { FileText, X, ShieldCheck, Plus, Check, Pencil, Save, Loader2 } from 'lucide-react';
import SeniorityBadge from '@/components/shared/SeniorityBadge';
import AutocompleteInput from '@/components/shared/AutocompleteInput';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useRef, useMemo, useState, useCallback } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { buildQuantizedChartData } from '@/lib/percentages';
import { ACTIVITES_BY_PRACTICE, ACTIVITES_DEFAULT, CABINET_META, CABINETS } from '@/lib/constants';
import { CHAMBERS_DB, getAllChambersFirmNames, getChambersRankingByPractice, CHAMBERS_DEPARTMENTS, CHAMBERS_KEY_TO_PRACTICE } from '@/lib/chambersRankings';
import { getFirmTierForDept as getLegal500TierForDept, formatTier as formatLegal500Tier } from '@/lib/legal500Rankings';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { formatNumberWithDots } from '@/lib/formatters';

const CHART_COLORS = [
  'hsl(215, 60%, 30%)', 'hsl(215, 50%, 42%)', 'hsl(220, 55%, 22%)',
  'hsl(210, 45%, 52%)', 'hsl(218, 40%, 36%)', 'hsl(222, 50%, 28%)',
];

const PRIORITIES_OPTIONS = [
  'Qualité du management', 'Formation et encadrement', 'Équilibre pro/perso',
  'Rémunération', 'Notoriété du cabinet', 'Taille de la structure',
  'Internationalité', "Secteur d'activité", 'Pratique transactionnelle', 'Pratique contentieuse',
];

const PRACTICE_TO_LEGAL500_KEY: Record<string, string> = {
  'Corporate/M&A': 'ma', 'Private Equity': 'pe', 'M&A (dominante)': 'ma',
  'Private Equity (dominante)': 'pe', 'Financement LBO': 'banking',
  'Financement de projets': 'projets', 'Restructuring': 'restructuring',
  'Droit Social': 'social', 'Immobilier': 'immo', 'Droit fiscal': 'fiscal',
};

const labelCls = 'text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-1 block';

const CandidateProfile = () => {
  const { user } = useAuth();
  const store = useRegistrationStore();
  const seniorityInfo = usePQE(store.sermentMois, store.sermentAnnee);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [snapshot, setSnapshot] = useState<Record<string, any> | null>(null);

  // Cabinets + practices — mêmes données que l'inscription
  const allCabinets = useMemo(() => {
    const set = new Set([...CABINETS, ...getAllChambersFirmNames()]);
    return [...set].sort((a, b) => a.localeCompare(b));
  }, []);

  const allPractices = useMemo(() => {
    const practices = CHAMBERS_DEPARTMENTS.map(d => ({
      key: d.key,
      label: CHAMBERS_KEY_TO_PRACTICE[d.key] || d.label,
    }));
    if (!practices.some(p => p.label === 'Venture Capital'))
      practices.push({ key: 'vc', label: 'Venture Capital' });
    return practices.sort((a, b) => a.label.localeCompare(b.label, 'fr'));
  }, []);

  // Rankings live depuis le store (se mettent à jour en temps réel)
  const currentChambersRanking = useMemo(() =>
    store.cabinet && store.departement ? getChambersRankingByPractice(store.cabinet, store.departement) : undefined,
    [store.cabinet, store.departement]
  );

  const currentLegal500Tier = useMemo(() => {
    if (!store.cabinet || !store.departement) return undefined;
    const key = PRACTICE_TO_LEGAL500_KEY[store.departement];
    return key ? getLegal500TierForDept(store.cabinet, key) : undefined;
  }, [store.cabinet, store.departement]);

  // Démarre l'édition : snapshot du store pour pouvoir annuler
  const startEdit = useCallback(() => {
    const snap: Record<string, any> = {};
    const s = useRegistrationStore.getState();
    ['cabinet', 'departement', 'retrocession', 'bonus', 'statutEcoute', 'movePriorities'].forEach(k => {
      snap[k] = (s as any)[k];
    });
    setSnapshot(snap);
    setEditing(true);
  }, []);

  // Annule : restaure le snapshot dans le store
  const cancelEdit = useCallback(() => {
    if (snapshot) {
      Object.entries(snapshot).forEach(([k, v]) => store.setField(k as any, v));
    }
    setEditing(false);
    setSnapshot(null);
  }, [snapshot, store]);

  // Sauvegarde : persiste le store en base
  const saveEdit = async () => {
    setSaving(true);
    try {
      const { data: existing } = await supabase
        .from('candidate_registrations')
        .select('submission_data')
        .eq('user_id', user!.id)
        .single();

      const s = useRegistrationStore.getState();
      const updated = {
        ...(existing?.submission_data || {}),
        cabinet: s.cabinet,
        departement: s.departement,
        retrocession: s.retrocession,
        bonus: s.bonus,
        statutEcoute: s.statutEcoute,
        movePriorities: s.movePriorities,
      };

      const { error } = await supabase
        .from('candidate_registrations')
        .update({ submission_data: updated })
        .eq('user_id', user!.id);

      if (error) throw error;
      toast.success('Profil mis à jour.');
      setEditing(false);
      setSnapshot(null);
    } catch (e: any) {
      toast.error(e.message || 'Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  };

  const togglePriority = (p: string) => {
    const current = store.movePriorities;
    if (current.includes(p)) {
      store.setField('movePriorities', current.filter(x => x !== p));
    } else if (current.length < 3) {
      store.setField('movePriorities', [...current, p]);
    } else {
      toast.error('Maximum 3 priorités.');
    }
  };

  // Activité chart
  const practiceActivities = store.departement
    ? (ACTIVITES_BY_PRACTICE[store.departement] || ACTIVITES_DEFAULT)
    : ACTIVITES_DEFAULT;
  const allActivites = practiceActivities.sections.flatMap(s => s.items);
  const activeActivites = allActivites.filter(a => store.activites[a.key]);

  const chartData = useMemo(() => buildQuantizedChartData(
    activeActivites.map((item, i) => ({
      key: item.key, name: item.label,
      raw: store.pourcentages[item.key] || 10,
      color: CHART_COLORS[i % CHART_COLORS.length],
    }))
  ), [activeActivites, store.pourcentages]);

  const chambersInfoReadOnly = useMemo(() => {
    if (!store.cabinet || !store.departement) return null;
    const firm = CHAMBERS_DB[store.cabinet];
    if (!firm) return { isIntegrated: false };
    const ranking = getChambersRankingByPractice(store.cabinet, store.departement);
    return { isIntegrated: true, band: ranking ?? null };
  }, [store.cabinet, store.departement]);

  const SectionBlock = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-card p-5">
      <p className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground font-sans font-light mb-3">{title}</p>
      {children}
    </div>
  );

  const DataRow = ({ label, value }: { label: string; value: string }) => (
    <div>
      <span className="text-[9px] text-muted-foreground font-sans font-light">{label}</span>
      <p className="text-[13px] font-sans font-normal mt-0.5 text-foreground">{value || '—'}</p>
    </div>
  );

  const TagList = ({ items, label }: { items: string[]; label?: string }) => {
    if (!items || items.length === 0) return null;
    return (
      <div>
        {label && <p className="text-[9px] uppercase tracking-wider text-muted-foreground mb-1.5">{label}</p>}
        <div className="flex flex-wrap gap-1.5">
          {items.map(t => <span key={t} className="text-[10px] px-2 py-0.5 rounded-sm bg-secondary text-foreground border border-border">{t}</span>)}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Barre action */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-sans font-medium text-foreground">Mon profil</h2>
        {!editing ? (
          <button onClick={startEdit} className="inline-flex items-center gap-1.5 text-xs font-sans text-muted-foreground hover:text-foreground border border-border px-3 py-1.5 rounded-sm transition-colors">
            <Pencil className="w-3.5 h-3.5" />Modifier
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button onClick={cancelEdit} className="text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 transition-colors">Annuler</button>
            <button onClick={saveEdit} disabled={saving} className="inline-flex items-center gap-1.5 text-xs bg-foreground text-background px-3 py-1.5 rounded-sm hover:bg-foreground/90 disabled:opacity-50">
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              Sauvegarder
            </button>
          </div>
        )}
      </div>

      <div className="border border-border rounded-sm overflow-hidden">

        {/* Identité */}
        <SectionBlock title="Identité">
          <div className="flex items-start gap-5 mb-5">
            {store.photoPreviewUrl
              ? <img src={store.photoPreviewUrl} alt="" className="w-14 h-14 rounded-full object-cover border border-border flex-shrink-0" />
              : <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center font-serif text-lg flex-shrink-0">{store.prenom?.[0]}{store.nom?.[0]}</div>
            }
            <div>
              <p className="font-serif text-lg text-foreground">{store.prenom} {store.nom}</p>
              <p className="text-sm font-sans font-light text-muted-foreground">{store.email || user?.email}</p>
              {store.telephone && <p className="text-xs font-sans font-light text-muted-foreground mt-0.5">{store.telephone}</p>}
              {store.linkedinUrl && <p className="text-xs font-sans font-light text-muted-foreground mt-0.5 truncate max-w-xs">{store.linkedinUrl}</p>}
            </div>
          </div>

          {editing ? (
            <div className="space-y-4">
              {/* Cabinet — branché sur store.cabinet comme à l'inscription */}
              <div>
                <label className={labelCls}>Cabinet actuel</label>
                <AutocompleteInput
                  data={allCabinets}
                  value={store.cabinet}
                  onChange={v => store.setField('cabinet', (typeof v === 'string' ? v : v[0]) || '')}
                  placeholder="Rechercher un cabinet..."
                  single
                  className="mt-1"
                />
              </div>

              {/* Pratique — branché sur store.departement */}
              <div>
                <label className={labelCls}>Pratique</label>
                <Select value={store.departement} onValueChange={v => store.setField('departement', v)}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Sélectionner votre pratique" /></SelectTrigger>
                  <SelectContent>
                    {allPractices.map(p => <SelectItem key={p.key} value={p.label}>{p.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* Classements live */}
              {store.cabinet && store.departement && (
                <div className="space-y-1.5">
                  {currentChambersRanking !== undefined && (
                    currentChambersRanking !== null
                      ? <div className="flex items-center gap-2"><span className="px-3 py-1 rounded-sm bg-foreground text-background text-[11px] font-sans font-medium">Chambers Band {currentChambersRanking}</span><span className="text-[11px] text-muted-foreground">{store.cabinet} · {store.departement}</span></div>
                      : <p className="text-[11px] text-muted-foreground italic">{store.cabinet} n'est pas classé Chambers pour {store.departement}</p>
                  )}
                  {currentLegal500Tier !== undefined && (
                    currentLegal500Tier !== null
                      ? <div className="flex items-center gap-2"><span className="px-3 py-1 rounded-sm border border-foreground text-foreground text-[11px] font-sans font-medium">Legal 500 · {formatLegal500Tier(currentLegal500Tier)}</span><span className="text-[11px] text-muted-foreground">{store.cabinet} · {store.departement}</span></div>
                      : <p className="text-[11px] text-muted-foreground italic">{store.cabinet} n'est pas classé Legal 500 pour {store.departement}</p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {seniorityInfo && <div><span className="text-[10px] text-muted-foreground font-sans font-light">Séniorité</span><div className="mt-1"><SeniorityBadge info={seniorityInfo} /></div></div>}
              <DataRow label="Cabinet" value={store.cabinet} />
              <DataRow label="Répertorié Chambers" value={chambersInfoReadOnly?.isIntegrated ? 'Oui' : 'Non'} />
              <DataRow label="Pratique" value={store.departement} />
            </div>
          )}
        </SectionBlock>

        {/* Rémunération */}
        <SectionBlock title="Rémunération">
          {editing ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Rétrocession (€)</label>
                <Input
                  type="text"
                  inputMode="numeric"
                  value={store.retrocession}
                  onChange={e => store.setField('retrocession', e.target.value.replace(/[^0-9]/g, '') as any)}
                  placeholder="ex : 120000"
                  className="mt-1"
                />
              </div>
              <div>
                <label className={labelCls}>Bonus (€)</label>
                <Input
                  type="text"
                  inputMode="numeric"
                  value={store.bonus}
                  onChange={e => store.setField('bonus', e.target.value.replace(/[^0-9]/g, '') as any)}
                  placeholder="ex : 15000"
                  className="mt-1"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {store.retrocession && <DataRow label="Rétrocession" value={`${store.retrocession} €`} />}
              {store.bonus && <DataRow label="Bonus" value={`${store.bonus} €`} />}
              {store.hasObjectifFacturable && store.objectifFacturable && <DataRow label="Objectif heures" value={`${store.objectifFacturable}h`} />}
              {store.hasObjectifFacturable && store.objectifFacturableReel && <DataRow label="Réalisé" value={`${store.objectifFacturableReel}h`} />}
            </div>
          )}
          {store.conserverRetrocession !== null && !editing && (
            <p className="mt-4 pt-3 border-t border-border text-xs font-sans text-muted-foreground font-light">
              {store.conserverRetrocession ? 'Souhaite conserver sa rétrocession' : 'Ouvert à une baisse de rétrocession'}
              {!store.conserverRetrocession && store.raisonsBaisseRetro.length > 0 && ` — ${store.raisonsBaisseRetro.join(', ')}`}
            </p>
          )}
        </SectionBlock>

        {/* Activité — lecture seule */}
        <SectionBlock title="Activité">
          {chartData.length > 0 && (
            <div className="flex flex-col md:flex-row gap-6 items-start mb-4">
              <div className="w-36 h-36 flex-shrink-0 self-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%" innerRadius={32} outerRadius={60} dataKey="value" paddingAngle={2} stroke="hsl(var(--background))" strokeWidth={2} labelLine={false}>
                      {chartData.map((item, i) => <Cell key={item.name} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => [`${v}%`, '']} contentStyle={{ fontSize: '11px', borderRadius: '4px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-1.5">
                {chartData.map((item, i) => (
                  <div key={item.name} className="flex items-center gap-2 text-xs font-sans font-light">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                    <span className="text-foreground">{item.name}</span>
                    <span className="text-muted-foreground ml-auto">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <TagList items={store.tailleOperations} label="Taille opérations" />
            <TagList items={store.typesClients} label="Clientèle" />
          </div>
          {store.anglais && <p className="text-xs font-sans font-light mt-3"><span className="text-muted-foreground">Anglais : </span>{store.anglais}</p>}
        </SectionBlock>

        {/* Associé / Counsel */}
        {store.isAssocieOrCounsel && (
          <SectionBlock title={store.statutAssoc === 'associe' ? 'Associé' : 'Counsel'}>
            <div className="grid grid-cols-2 gap-4">
              {store.chiffreAffairesPortable && <DataRow label="CA portable" value={`${store.chiffreAffairesPortable} €`} />}
              {store.assocExpertiseSummary && <DataRow label="Expertise" value={store.assocExpertiseSummary} />}
            </div>
            <TagList items={store.assocAttentes} label="Attentes" />
            <TagList items={store.assocCabTypes} label="Types de cabinets visés" />
          </SectionBlock>
        )}

        {/* Projet */}
        <SectionBlock title="Projet">
          {editing ? (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={labelCls}>Priorités <span className="normal-case font-light">(max 3)</span></label>
                <span className={cn('text-[10px] font-sans', store.movePriorities.length === 3 ? 'text-foreground font-semibold' : 'text-muted-foreground')}>
                  {store.movePriorities.length} / 3
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {PRIORITIES_OPTIONS.map(p => {
                  const active = store.movePriorities.includes(p);
                  const disabled = !active && store.movePriorities.length >= 3;
                  return (
                    <button key={p} type="button" onClick={() => togglePriority(p)} disabled={disabled}
                      className={cn(
                        'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-sans border transition-all',
                        active ? 'bg-foreground text-background border-foreground'
                          : disabled ? 'opacity-30 cursor-not-allowed border-border text-muted-foreground'
                          : 'bg-transparent text-muted-foreground border-border hover:border-foreground/40'
                      )}
                    >
                      {active && <Check className="w-2.5 h-2.5" />}{p}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {store.movePriorities.length > 0 && (
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-muted-foreground mb-1.5">Priorités</p>
                  <div className="flex flex-wrap gap-1.5">
                    {store.movePriorities.map(p => (
                      <span key={p} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-foreground text-background text-[10px] font-sans font-light">
                        <Check className="w-2.5 h-2.5" />{p}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {store.motivation && <div><p className="text-[9px] uppercase tracking-wider text-muted-foreground mb-1">Motivation</p><p className="text-sm font-sans font-light">{store.motivation}</p></div>}
              <div className="grid grid-cols-2 gap-3">
                <TagList items={store.cabinetsCibles} label="Cabinets cibles" />
                <TagList items={store.noGoCabinets} label="Cabinets exclus" />
              </div>
            </div>
          )}
        </SectionBlock>

        {/* Statut */}
        <SectionBlock title="Statut">
          {editing ? (
            <div>
              <label className={labelCls}>Disponibilité</label>
              <div className="flex gap-3 mt-2">
                {[{ value: 'actif', label: 'En recherche active' }, { value: 'passif', label: "À l'écoute" }].map(opt => (
                  <button key={opt.value} type="button" onClick={() => store.setField('statutEcoute', opt.value as any)}
                    className={cn('px-4 py-2 rounded-sm text-xs font-sans border transition-all',
                      store.statutEcoute === opt.value ? 'bg-foreground text-background border-foreground' : 'bg-transparent text-muted-foreground border-border hover:border-foreground/40'
                    )}
                  >{opt.label}</button>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <DataRow label="Écoute" value={store.statutEcoute === 'actif' ? 'En recherche active' : store.statutEcoute === 'passif' ? "À l'écoute" : '—'} />
              <DataRow label="Visibilité" value={store.visibilite === 'confidentiel' ? 'Confidentiel – fermé' : store.visibilite === 'semi-confidentiel' ? 'Confidentiel – ouvert' : '—'} />
              {store.disponibilite && <DataRow label="Disponibilité" value={store.disponibilite} />}
            </div>
          )}
        </SectionBlock>
      </div>

      {/* CV */}
      <div className="border border-border rounded-lg p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-bold tracking-[0.14em] uppercase text-muted-foreground">CV</span>
            <span className="text-[10px] text-muted-foreground/60 font-sans font-light">optionnel</span>
          </div>
          {!store.cvFile && (
            <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1.5 text-xs font-sans font-light text-muted-foreground hover:text-foreground transition-colors">
              <Plus className="w-3.5 h-3.5" />Ajouter
            </button>
          )}
        </div>
        <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" onChange={e => store.setField('cvFile', e.target.files?.[0] || null)} className="hidden" />
        {store.cvFile && (
          <div className="flex items-center gap-2 mt-2 px-3 py-2 rounded-sm border border-border bg-card">
            <FileText className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs font-sans font-light truncate flex-1">{store.cvFile.name}</span>
            <button type="button" onClick={() => store.setField('cvFile', null)} className="text-muted-foreground hover:text-foreground"><X className="w-3.5 h-3.5" /></button>
          </div>
        )}
        <div className="flex items-start gap-1.5 mt-2">
          <ShieldCheck className="w-3 h-3 text-muted-foreground/50 mt-0.5 shrink-0" />
          <p className="text-[10px] text-muted-foreground/60 font-sans font-light leading-relaxed">Logan s'engage à ne jamais transmettre votre CV sans votre accord explicite.</p>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
