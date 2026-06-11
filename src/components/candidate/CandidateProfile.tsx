import { useRegistrationStore } from '@/stores/registrationStore';
import { usePQE } from '@/hooks/usePQE';
import { useAuth } from '@/hooks/useAuth';
import { FileText, X, ShieldCheck, Plus, Check, Pencil, Save, Loader2 } from 'lucide-react';
import SeniorityBadge from '@/components/shared/SeniorityBadge';
import AutocompleteInput from '@/components/shared/AutocompleteInput';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRef, useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { buildQuantizedChartData } from '@/lib/percentages';
import { ACTIVITES_BY_PRACTICE, ACTIVITES_DEFAULT, CABINET_META, CABINETS } from '@/lib/constants';
import { CHAMBERS_DB, getAllChambersFirmNames, getChambersRankingByPractice, CHAMBERS_DEPARTMENTS, CHAMBERS_KEY_TO_PRACTICE } from '@/lib/chambersRankings';
import { getFirmTierForDept as getLegal500TierForDept, formatTier as formatLegal500Tier } from '@/lib/legal500Rankings';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const CHART_COLORS = [
  'hsl(215, 60%, 30%)',
  'hsl(215, 50%, 42%)',
  'hsl(220, 55%, 22%)',
  'hsl(210, 45%, 52%)',
  'hsl(218, 40%, 36%)',
  'hsl(222, 50%, 28%)',
];

const PRIORITIES_OPTIONS = [
  'Qualité du management', 'Formation et encadrement', 'Équilibre pro/perso',
  'Rémunération', 'Notoriété du cabinet', 'Taille de la structure',
  'Internationalité', "Secteur d'activité", 'Pratique transactionnelle', 'Pratique contentieuse',
];

const PRACTICE_TO_LEGAL500_KEY: Record<string, string> = {
  'Corporate/M&A': 'ma', 'Private Equity': 'pe', 'Financement / Banking': 'banking',
  'Restructuring': 'restructuring', 'Droit Social': 'social', 'Immobilier': 'immo',
  'Fiscal': 'fiscal', 'IP / Technologies': 'ip', 'Concurrence': 'competition',
  'Droit public': 'public', 'Compliance': 'compliance', 'M&A (dominante)': 'ma',
  'Private Equity (dominante)': 'pe', 'Financement LBO': 'banking',
};

const labelCls = 'text-[9px] uppercase tracking-[0.15em] text-muted-foreground font-sans font-light mb-1 block';
const inputCls = 'w-full border border-border rounded-sm px-3 py-2 text-sm font-sans bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30';

const CandidateProfile = () => {
  const { user } = useAuth();
  const store = useRegistrationStore();
  const {
    photoPreviewUrl, prenom, nom, email, telephone,
    departement, cabinet, sermentMois, sermentAnnee,
    activites, pourcentages, statutEcoute, visibilite,
    movePriorities, cabinetsCibles, noGoCabinets,
    retrocession, bonus, anglais, typesClients,
    tailleOperations, conserverRetrocession, cvFile,
    linkedinUrl, hasObjectifFacturable, objectifFacturable, objectifFacturableReel,
    isAssocieOrCounsel, statutAssoc, chiffreAffairesPortable, assocExpertiseSummary,
    assocAttentes, assocCabTypes, disponibilite, raisonsBaisseRetro, motivation,
  } = store;
  const seniorityInfo = usePQE(sermentMois, sermentAnnee);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [draftCabinet, setDraftCabinet] = useState('');
  const [draftDept, setDraftDept] = useState('');
  const [draftRetro, setDraftRetro] = useState('');
  const [draftBonus, setDraftBonus] = useState('');
  const [draftStatut, setDraftStatut] = useState('passif');
  const [draftPriorities, setDraftPriorities] = useState<string[]>([]);

  const allCabinets = useMemo(() => {
    const set = new Set([...CABINETS, ...getAllChambersFirmNames()]);
    return [...set].sort((a, b) => a.localeCompare(b));
  }, []);

  const allPractices = useMemo(() => {
    const practices = CHAMBERS_DEPARTMENTS.map(d => ({
      key: d.key,
      label: CHAMBERS_KEY_TO_PRACTICE[d.key] || d.label,
    }));
    if (!practices.some(p => p.label === 'Venture Capital')) {
      practices.push({ key: 'vc', label: 'Venture Capital' });
    }
    return practices.sort((a, b) => a.label.localeCompare(b.label, 'fr'));
  }, []);

  const draftChambersRanking = useMemo(() => {
    if (!draftCabinet || !draftDept) return undefined;
    return getChambersRankingByPractice(draftCabinet, draftDept);
  }, [draftCabinet, draftDept]);

  const draftLegal500Tier = useMemo(() => {
    if (!draftCabinet || !draftDept) return undefined;
    const key = PRACTICE_TO_LEGAL500_KEY[draftDept];
    if (!key) return undefined;
    return getLegal500TierForDept(draftCabinet, key);
  }, [draftCabinet, draftDept]);

  const startEdit = () => {
    setDraftCabinet(cabinet || '');
    setDraftDept(departement || '');
    setDraftRetro(String(retrocession || ''));
    setDraftBonus(String(bonus || ''));
    setDraftStatut(statutEcoute || 'passif');
    setDraftPriorities([...movePriorities]);
    setEditing(true);
  };

  const cancelEdit = () => setEditing(false);

  const saveEdit = async () => {
    setSaving(true);
    try {
      store.setField('cabinet', draftCabinet);
      store.setField('departement', draftDept);
      store.setField('retrocession', draftRetro as any);
      store.setField('bonus', draftBonus as any);
      store.setField('statutEcoute', draftStatut as any);
      store.setField('movePriorities', draftPriorities);

      const { data: existing } = await supabase
        .from('candidate_registrations')
        .select('submission_data')
        .eq('user_id', user!.id)
        .single();

      const updated = {
        ...(existing?.submission_data || {}),
        cabinet: draftCabinet,
        departement: draftDept,
        retrocession: draftRetro,
        bonus: draftBonus,
        statutEcoute: draftStatut,
        movePriorities: draftPriorities,
      };

      const { error } = await supabase
        .from('candidate_registrations')
        .update({ submission_data: updated })
        .eq('user_id', user!.id);

      if (error) throw error;
      toast.success('Profil mis à jour.');
      setEditing(false);
    } catch (e: any) {
      toast.error(e.message || 'Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  };

  const togglePriority = (p: string) => {
    setDraftPriorities(prev => {
      if (prev.includes(p)) return prev.filter(x => x !== p);
      if (prev.length >= 3) { toast.error('Maximum 3 priorités.'); return prev; }
      return [...prev, p];
    });
  };

  const practiceActivities = departement ? (ACTIVITES_BY_PRACTICE[departement] || ACTIVITES_DEFAULT) : ACTIVITES_DEFAULT;
  const allActivites = practiceActivities.sections.flatMap(s => s.items);
  const activeActivites = allActivites.filter(a => activites[a.key]);

  const chartData = useMemo(() => buildQuantizedChartData(
    activeActivites.map((item, i) => ({ key: item.key, name: item.label, raw: pourcentages[item.key] || 10, color: CHART_COLORS[i % CHART_COLORS.length] })),
  ), [activeActivites, pourcentages]);

  const chambersInfo = useMemo(() => {
    if (!cabinet || !departement) return null;
    const firm = CHAMBERS_DB[cabinet];
    if (!firm) return { isIntegrated: false };
    const ranking = getChambersRankingByPractice(cabinet, departement);
    return { isIntegrated: true, band: ranking ?? null };
  }, [cabinet, departement]);

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
      {/* Action bar */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-sans font-medium text-foreground">Mon profil</h2>
        {!editing ? (
          <button onClick={startEdit} className="inline-flex items-center gap-1.5 text-xs font-sans text-muted-foreground hover:text-foreground border border-border px-3 py-1.5 rounded-sm transition-colors">
            <Pencil className="w-3.5 h-3.5" />Modifier
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button onClick={cancelEdit} className="text-xs font-sans text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5">Annuler</button>
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
            {photoPreviewUrl
              ? <img src={photoPreviewUrl} alt="" className="w-14 h-14 rounded-full object-cover border border-border flex-shrink-0" />
              : <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center font-serif text-lg text-foreground flex-shrink-0">{prenom?.[0]}{nom?.[0]}</div>
            }
            <div>
              <p className="font-serif text-lg text-foreground">{prenom} {nom}</p>
              <p className="text-sm font-sans font-light text-muted-foreground">{email || user?.email}</p>
              {telephone && <p className="text-xs font-sans font-light text-muted-foreground mt-0.5">{telephone}</p>}
              {linkedinUrl && <p className="text-xs font-sans font-light text-muted-foreground mt-0.5 truncate max-w-xs">{linkedinUrl}</p>}
            </div>
          </div>

          {editing ? (
            <div className="space-y-4">
              {/* Cabinet — même composant qu'à l'inscription */}
              <div>
                <label className={labelCls}>Cabinet actuel</label>
                <AutocompleteInput
                  data={allCabinets}
                  value={draftCabinet}
                  onChange={v => { setDraftCabinet(typeof v === 'string' ? v : v[0] || ''); setDraftDept(''); }}
                  placeholder="Rechercher un cabinet..."
                  single
                />
              </div>

              {/* Pratique — même Select qu'à l'inscription */}
              <div>
                <label className={labelCls}>Pratique</label>
                <Select value={draftDept} onValueChange={setDraftDept}>
                  <SelectTrigger><SelectValue placeholder="Sélectionner votre pratique" /></SelectTrigger>
                  <SelectContent>
                    {allPractices.map(p => <SelectItem key={p.key} value={p.label}>{p.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* Badges classements */}
              {draftCabinet && draftDept && (
                <div className="space-y-2">
                  {draftChambersRanking !== undefined && (
                    draftChambersRanking !== null
                      ? <div className="flex items-center gap-2"><span className="px-3 py-1 rounded-sm bg-foreground text-background text-[11px] font-sans font-medium">Chambers Band {draftChambersRanking}</span><span className="text-[11px] text-muted-foreground">{draftCabinet} · {draftDept}</span></div>
                      : <p className="text-[11px] text-muted-foreground italic">{draftCabinet} n'est pas classé Chambers pour {draftDept}</p>
                  )}
                  {draftLegal500Tier !== undefined && (
                    draftLegal500Tier !== null
                      ? <div className="flex items-center gap-2"><span className="px-3 py-1 rounded-sm border border-foreground text-foreground text-[11px] font-sans font-medium">Legal 500 · {formatLegal500Tier(draftLegal500Tier)}</span><span className="text-[11px] text-muted-foreground">{draftCabinet} · {draftDept}</span></div>
                      : <p className="text-[11px] text-muted-foreground italic">{draftCabinet} n'est pas classé Legal 500 pour {draftDept}</p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {seniorityInfo && <div><span className="text-[10px] text-muted-foreground font-sans font-light">Séniorité</span><div className="mt-1"><SeniorityBadge info={seniorityInfo} /></div></div>}
              <DataRow label="Cabinet" value={cabinet} />
              <DataRow label="Répertorié Chambers" value={chambersInfo?.isIntegrated ? 'Oui' : 'Non'} />
              <DataRow label="Pratique" value={departement} />
            </div>
          )}
        </SectionBlock>

        {/* Rémunération */}
        <SectionBlock title="Rémunération">
          {editing ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Rétrocession (€)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={draftRetro}
                  onChange={e => setDraftRetro(e.target.value.replace(/[^0-9]/g, ''))}
                  className={inputCls}
                  placeholder="ex : 120000"
                />
              </div>
              <div>
                <label className={labelCls}>Bonus (€)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={draftBonus}
                  onChange={e => setDraftBonus(e.target.value.replace(/[^0-9]/g, ''))}
                  className={inputCls}
                  placeholder="ex : 15000"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {retrocession && <DataRow label="Rétrocession" value={`${retrocession} €`} />}
              {bonus && <DataRow label="Bonus" value={`${bonus} €`} />}
              {hasObjectifFacturable && objectifFacturable && <DataRow label="Objectif heures" value={`${objectifFacturable}h`} />}
              {hasObjectifFacturable && objectifFacturableReel && <DataRow label="Réalisé" value={`${objectifFacturableReel}h`} />}
            </div>
          )}
          {conserverRetrocession !== null && !editing && (
            <p className="mt-4 pt-3 border-t border-border text-xs font-sans text-muted-foreground font-light">
              {conserverRetrocession ? 'Souhaite conserver sa rétrocession' : 'Ouvert à une baisse de rétrocession'}
              {!conserverRetrocession && raisonsBaisseRetro.length > 0 && ` — ${raisonsBaisseRetro.join(', ')}`}
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
            <TagList items={tailleOperations} label="Taille opérations" />
            <TagList items={typesClients} label="Clientèle" />
          </div>
          {anglais && <p className="text-xs font-sans font-light mt-3"><span className="text-muted-foreground">Anglais : </span>{anglais}</p>}
        </SectionBlock>

        {/* Associé / Counsel */}
        {isAssocieOrCounsel && (
          <SectionBlock title={statutAssoc === 'associe' ? 'Associé' : 'Counsel'}>
            <div className="grid grid-cols-2 gap-4">
              {chiffreAffairesPortable && <DataRow label="CA portable" value={`${chiffreAffairesPortable} €`} />}
              {assocExpertiseSummary && <DataRow label="Expertise" value={assocExpertiseSummary} />}
            </div>
            <TagList items={assocAttentes} label="Attentes" />
            <TagList items={assocCabTypes} label="Types de cabinets visés" />
          </SectionBlock>
        )}

        {/* Projet — priorités éditables */}
        <SectionBlock title="Projet">
          {editing ? (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={labelCls}>Priorités <span className="normal-case font-sans">(max 3)</span></label>
                <span className={cn('text-[10px] font-sans', draftPriorities.length === 3 ? 'text-foreground font-semibold' : 'text-muted-foreground')}>
                  {draftPriorities.length} / 3
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {PRIORITIES_OPTIONS.map(p => {
                  const active = draftPriorities.includes(p);
                  const disabled = !active && draftPriorities.length >= 3;
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
              {movePriorities.length > 0 && (
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-muted-foreground mb-1.5">Priorités</p>
                  <div className="flex flex-wrap gap-1.5">
                    {movePriorities.map(p => (
                      <span key={p} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-foreground text-background text-[10px] font-sans font-light">
                        <Check className="w-2.5 h-2.5" />{p}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {motivation && <div><p className="text-[9px] uppercase tracking-wider text-muted-foreground mb-1">Motivation</p><p className="text-sm font-sans font-light">{motivation}</p></div>}
              <div className="grid grid-cols-2 gap-3">
                <TagList items={cabinetsCibles} label="Cabinets cibles" />
                <TagList items={noGoCabinets} label="Cabinets exclus" />
              </div>
            </div>
          )}
        </SectionBlock>

        {/* Statut */}
        <SectionBlock title="Statut">
          {editing ? (
            <div>
              <label className={labelCls}>Disponibilité</label>
              <div className="flex gap-3 mt-1">
                {[{ value: 'actif', label: 'En recherche active' }, { value: 'passif', label: "À l'écoute" }].map(opt => (
                  <button key={opt.value} type="button" onClick={() => setDraftStatut(opt.value)}
                    className={cn('px-4 py-2 rounded-sm text-xs font-sans border transition-all',
                      draftStatut === opt.value ? 'bg-foreground text-background border-foreground' : 'bg-transparent text-muted-foreground border-border hover:border-foreground/40'
                    )}
                  >{opt.label}</button>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <DataRow label="Écoute" value={statutEcoute === 'actif' ? 'En recherche active' : statutEcoute === 'passif' ? "À l'écoute" : '—'} />
              <DataRow label="Visibilité" value={visibilite === 'confidentiel' ? 'Confidentiel – fermé' : visibilite === 'semi-confidentiel' ? 'Confidentiel – ouvert' : '—'} />
              {disponibilite && <DataRow label="Disponibilité" value={disponibilite} />}
            </div>
          )}
        </SectionBlock>
      </div>

      {/* CV */}
      <div className="border border-border rounded-lg p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-[8px] font-bold tracking-[0.14em] uppercase text-muted-foreground">CV</div>
            <span className="text-[10px] text-muted-foreground/60 font-sans font-light">optionnel</span>
          </div>
          {!cvFile && (
            <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1.5 text-xs font-sans font-light text-muted-foreground hover:text-foreground transition-colors">
              <Plus className="w-3.5 h-3.5" />Ajouter
            </button>
          )}
        </div>
        <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" onChange={e => store.setField('cvFile', e.target.files?.[0] || null)} className="hidden" />
        {cvFile && (
          <div className="flex items-center gap-2 mt-2 px-3 py-2 rounded-sm border border-border bg-card">
            <FileText className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs font-sans font-light text-foreground truncate flex-1">{cvFile.name}</span>
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
