import { useState, useMemo } from 'react';
import { useCabinetStore } from '@/stores/cabinetStore';
import { PROFILES, DEPT_KEY_MAP, type CabinetProfile } from '@/lib/cabinetConstants';
import { NAT_FLAGS, NAT_LABELS, formatTier, LEGAL500_DEPARTMENTS, getFirmTierForDept } from '@/lib/legal500Rankings';
import { cn } from '@/lib/utils';
import { X, Search, Eye, Plus, FileText, Users } from 'lucide-react';
import ActivityPieChart from '@/components/shared/ActivityPieChart';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import CabinetStep3Search from './CabinetStep3Search';

const PALIER_MAP: Record<string, string> = {
  starter: 'Starter · 1.500€/mois',
  business: 'Business · 3.000€/mois',
  enterprise: 'Enterprise · Sur devis',
};

const FILTERS = [
  { key: 'all', label: 'Tous' },
  { key: 'ma', label: 'M&A' },
  { key: 'pe', label: 'Private Equity' },
  { key: 'banque', label: 'Banque & Finance' },
  { key: 'social', label: 'Droit Social' },
  { key: 'fiscal', label: 'Fiscal' },
  { key: 'new', label: '🔔 Nouveaux' },
];

const CabinetDashboard = () => {
  const s = useCabinetStore();
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('date');
  const [drawerProfile, setDrawerProfile] = useState<CabinetProfile | null>(null);

  // New search: skip dept selection, go directly to search form
  if (s.dashboardView === 'newSearch') {
    if (s.currentSearchStep === 0 || s.currentSearchStep === 1) {
      return <SearchFormWrapper />;
    }
    if (s.currentSearchStep === 2) {
      return <SearchValidation />;
    }
  }

  // Explorer le marché
  if (s.dashboardView === 'explore') {
    return (
      <ExploreView
        filter={filter}
        setFilter={setFilter}
        sort={sort}
        setSort={setSort}
        drawerProfile={drawerProfile}
        setDrawerProfile={setDrawerProfile}
      />
    );
  }

  // Dashboard home
  return (
    <div>
      {s.searches.length > 0 && (
        <div className="mb-7">
          <div className="text-[9px] font-bold tracking-[0.14em] uppercase text-muted-foreground mb-3">Recherches actives</div>
          <div className="grid gap-3">
            {s.searches.map((search) => (
              <div key={search.id} className="border border-border rounded-md p-4 bg-background flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-foreground">{search.deptLabel}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {search.seniorities.join(', ')} · {search.expertise.join(', ')}
                  </div>
                </div>
                <span className="text-[9px] font-bold tracking-[0.08em] uppercase px-2.5 py-1 rounded-sm bg-foreground text-background">
                  {search.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Two main CTAs */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => s.setField('dashboardView', 'explore')}
          className="group relative text-left rounded-lg border-2 border-border p-6 transition-all hover:border-foreground hover:shadow-lg bg-background"
        >
          <Eye className="w-6 h-6 text-foreground mb-4" />
          <div className="font-sans text-lg font-bold text-foreground mb-2">Explorer le marché des candidats</div>
          <p className="text-xs text-muted-foreground leading-relaxed mb-4">
            Parcourez librement tous les profils à l'écoute du marché, toutes matières confondues. Alertez LOGAN si un candidat vous intéresse — en dehors de tout mandat.
          </p>
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <Users className="w-3.5 h-3.5" />
            {PROFILES.length} profils disponibles
          </div>
        </button>

        <button
          onClick={() => {
            s.resetSearch();
            s.setField('dashboardView', 'newSearch');
          }}
          className="group relative text-left rounded-lg border-2 border-border p-6 transition-all hover:border-foreground hover:shadow-lg bg-background"
        >
          <FileText className="w-6 h-6 text-foreground mb-4" />
          <div className="font-sans text-lg font-bold text-foreground mb-2">Publier une nouvelle recherche</div>
          <p className="text-xs text-muted-foreground leading-relaxed mb-4">
            Déposez un mandat confidentiel. LOGAN identifie et approche les meilleurs profils selon vos critères précis.
          </p>
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <Plus className="w-3.5 h-3.5" />
            Créer une recherche
          </div>
        </button>
      </div>
    </div>
  );
};

// ── DEPARTMENT SELECTION ──
const DeptSelection = () => {
  const s = useCabinetStore();

  const selectDept = (key: string, label: string) => {
    s.setField('currentSearchDept', key);
    s.setField('currentSearchDeptLabel', label);
    // Auto-detect ranking for this dept
    const tier = s.selectedFirm ? getFirmTierForDept(s.selectedFirm, key) : null;
    if (tier !== null) {
      s.setField('ranking', formatTier(tier));
    } else {
      s.setField('ranking', 'Non répertorié dans le Legal 500');
    }
    s.setField('currentSearchStep', 1);
  };

  return (
    <div className="max-w-[780px] mx-auto">
      <button
        onClick={() => s.setField('dashboardView', 'home')}
        className="text-xs text-muted-foreground hover:text-foreground mb-6 flex items-center gap-1"
      >
        ← Retour au tableau de bord
      </button>

      <h2 className="font-serif text-3xl font-normal text-foreground leading-tight mb-2.5">Nouvelle recherche</h2>
      <p className="text-sm text-muted-foreground font-light leading-relaxed mb-8 max-w-xl">
        Sélectionnez le département concerné par votre recherche. LOGAN identifiera automatiquement votre classement Legal 500 pour ce département.
      </p>

      <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-3">Département concerné par la recherche</div>
      <div className="grid grid-cols-2 gap-3">
        {LEGAL500_DEPARTMENTS.map((dept) => {
          const tier = s.selectedFirm ? getFirmTierForDept(s.selectedFirm, dept.key) : null;
          return (
            <button
              key={dept.key}
              onClick={() => selectDept(dept.key, dept.label)}
              className="text-left p-4 rounded-md border border-border bg-background hover:border-foreground hover:shadow-sm transition-all"
            >
              <div className="text-sm font-semibold text-foreground mb-1">{dept.label}</div>
              <div className="text-[10px] text-muted-foreground">
                {tier !== null ? (
                  <span className={cn(
                    'font-bold px-2 py-0.5 rounded-sm inline-block',
                    tier <= 2 ? 'bg-foreground text-background' : 'bg-secondary text-foreground'
                  )}>
                    {formatTier(tier)}
                  </span>
                ) : (
                  <span className="italic">Non répertorié</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ── SEARCH FORM WRAPPER ──
const SearchFormWrapper = () => {
  const s = useCabinetStore();
  return (
    <div>
      <div className="max-w-[780px] mx-auto mb-4">
        <button
          onClick={() => s.setField('dashboardView', 'home')}
          className="text-xs text-muted-foreground hover:text-foreground mb-4 flex items-center gap-1"
        >
          ← Retour au tableau de bord
        </button>
      </div>
      <CabinetStep3Search
        isEmbedded
        onBack={() => s.setField('dashboardView', 'home')}
        onNext={() => s.setField('currentSearchStep', 2)}
      />
    </div>
  );
};

// ── SEARCH VALIDATION ──
const SearchValidation = () => {
  const s = useCabinetStore();
  const [checks, setChecks] = useState([false, false]);

  const toggleCheck = (i: number) => {
    const next = [...checks];
    next[i] = !next[i];
    setChecks(next);
  };

  const allChecked = checks.every(Boolean);

  return (
    <div className="max-w-[780px] mx-auto">
      <button
        onClick={() => s.setField('currentSearchStep', 1)}
        className="text-xs text-muted-foreground hover:text-foreground mb-6 flex items-center gap-1"
      >
        ← Modifier ma recherche
      </button>

      <h2 className="font-serif text-3xl font-normal text-foreground leading-tight mb-2.5">Validation de la recherche</h2>
      <p className="text-sm text-muted-foreground font-light leading-relaxed mb-8 max-w-xl">
        Vérifiez votre recherche et visualisez comment elle apparaîtra.
      </p>

      {/* Recap - grey bg, black text */}
      <div className="bg-[#F0F0F0] rounded-lg p-6 mb-5">
        <div className="text-[9px] font-bold tracking-[0.14em] uppercase text-black/40 mb-3 pb-2.5 border-b border-black/10">Récapitulatif</div>
        <div className="space-y-2">
          <Row label="Département" value={s.currentSearchDeptLabel} />
          <Row label="Classement" value={s.ranking || 'Non répertorié'} />
          <Row label="Séniorité" value={s.seniorities.join(', ') || '—'} />
          <Row label="Expertise" value={s.expertise.join(', ') || '—'} />
          <Row label="Anglais" value={s.english || '—'} />
          <Row label="Contexte" value={s.contexte || '—'} />
          <Row label="Rétrocession" value={s.retroMin || s.retroMax ? `${s.retroMin || '?'}€ – ${s.retroMax || '?'}€` : '—'} />
          <Row label="Confidentialité" value={s.confNiveau || '—'} />
        </div>
      </div>

      {/* Preview: as seen by candidate — full detail */}
      <div className="mb-6">
        <div className="text-[9px] font-bold tracking-[0.14em] uppercase text-muted-foreground mb-3">Aperçu — tel que vu par le candidat</div>
        <div className="bg-foreground rounded-lg overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-white/[0.08]">
            <div className="text-[8px] tracking-[0.16em] uppercase text-white/35 mb-2">Opportunité · Présentée par LOGAN</div>
            <div className="font-serif text-xl font-bold text-white mb-1.5">
              {s.currentSearchDeptLabel} · {s.seniorities.join(' / ') || '—'}{s.expertise.length ? ` — ${s.expertise.join(', ')}` : ''}
            </div>
            <div className="text-[11px] text-white/50">
              {NAT_FLAGS[s.detectedNat] || '🏢'} {NAT_LABELS[s.detectedNat] || 'Cabinet'} · {s.ranking || 'Non classé'}
            </div>
            <div className="text-[10px] text-white/30 mt-1">Identité du cabinet protégée · Mise en relation via LOGAN uniquement</div>
            <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-white/[0.08]">
              {s.seniorities.map((se) => (
                <span key={se} className="text-[10px] px-2.5 py-1 rounded-full border border-white/15 text-white/65">{se}</span>
              ))}
              {s.expertise.map((e) => (
                <span key={e} className="text-[10px] px-2.5 py-1 rounded-full border border-white/15 text-white/65">{e}</span>
              ))}
              {s.english && <span className="text-[10px] px-2.5 py-1 rounded-full border border-white/15 text-white/65">Anglais : {s.english}</span>}
            </div>
          </div>

          {/* Activity breakdown with pie chart */}
          {s.expertise.length > 0 && Object.keys(s.activitySplit).length > 0 && (
            <div className="p-6 border-b border-white/[0.08]">
              <div className="text-[8px] font-bold tracking-[0.14em] uppercase text-white/35 mb-4">Répartition de l'activité</div>
              {s.expertise.length >= 2 ? (
                <div className="flex items-start gap-6">
                  <ActivityPieChart data={s.activitySplit} size={120} innerRadius={28} outerRadius={52} showLegend={false} darkMode />
                  <div className="flex-1 space-y-2.5">
                    {s.expertise.map((exp) => (
                      <div key={exp}>
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="text-xs font-medium text-white">{exp}</span>
                          <span className="text-xs font-bold text-white">{s.activitySplit[exp] || 0}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {s.expertise.map((e) => (
                    <span key={e} className="text-[10px] bg-white/[0.07] border border-white/[0.12] rounded px-2.5 py-1 text-white/65">{e}</span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Context & team */}
          {(s.contexte || s.eqAssocies || s.eqCounsels || s.eqCollab) && (
            <div className="p-6 border-b border-white/[0.08]">
              <div className="text-[8px] font-bold tracking-[0.14em] uppercase text-white/35 mb-4">Contexte & équipe</div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                {s.contexte && (
                  <div>
                    <div className="text-[8px] uppercase tracking-[0.1em] text-white/35 mb-1">Contexte</div>
                    <div className="text-sm font-semibold text-white">{s.contexte}</div>
                  </div>
                )}
                {(s.eqAssocies || s.eqCounsels || s.eqCollab) && (
                  <div>
                    <div className="text-[8px] uppercase tracking-[0.1em] text-white/35 mb-1">Équipe</div>
                    <div className="text-sm font-semibold text-white">
                      {[s.eqAssocies ? `${s.eqAssocies} associé(s)` : '', s.eqCounsels ? `${s.eqCounsels} counsel(s)` : '', s.eqCollab ? `${s.eqCollab} collaborateur(s)` : ''].filter(Boolean).join(', ')}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Profil idéal */}
          {((s as any).profilCriteres as string[] || []).length > 0 && (
            <div className="p-6 border-b border-white/[0.08]">
              <div className="text-[8px] font-bold tracking-[0.14em] uppercase text-white/35 mb-3">Profil idéal</div>
              <div className="flex flex-wrap gap-1.5">
                {((s as any).profilCriteres as string[]).map((c) => (
                  <span key={c} className="text-[10px] bg-white/[0.08] border border-white/[0.15] rounded-full px-3 py-1.5 text-white/70 font-medium">{c}</span>
                ))}
              </div>
            </div>
          )}

          {/* Rémunération & conditions */}
          <div className="p-6 border-b border-white/[0.08]">
            <div className="text-[8px] font-bold tracking-[0.14em] uppercase text-white/35 mb-4">Rémunération & conditions</div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/[0.05] rounded-lg p-3">
                <div className="text-[8px] uppercase tracking-[0.1em] text-white/35 mb-1.5">Rétrocession</div>
                <div className="font-serif text-sm font-bold text-white">
                  {s.retroMin || s.retroMax ? `${s.retroMin || '?'}€ – ${s.retroMax || '?'}€` : 'Confidentiel'}
                </div>
              </div>
              <div className="bg-white/[0.05] rounded-lg p-3">
                <div className="text-[8px] uppercase tracking-[0.1em] text-white/35 mb-1.5">Heures / an</div>
                <div className="font-serif text-sm font-bold text-white">{s.heures ? `${s.heures}h` : 'Non communiqué'}</div>
              </div>
              <div className="bg-white/[0.05] rounded-lg p-3">
                <div className="text-[8px] uppercase tracking-[0.1em] text-white/35 mb-1.5">Télétravail</div>
                <div className="font-serif text-sm font-bold text-white">{s.tt || '—'}</div>
              </div>
            </div>
            {s.bonusEnabled && s.bonusTypes.length > 0 && (
              <div className="mt-4 pt-3 border-t border-white/[0.08]">
                <div className="text-[8px] uppercase tracking-[0.1em] text-white/35 mb-2">Bonus & avantages</div>
                <div className="flex flex-wrap gap-1.5">
                  {s.bonusTypes.map((b) => (
                    <span key={b} className="text-[10px] bg-white/[0.06] border border-white/[0.10] rounded px-2.5 py-1 text-white/55">{b}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CTA preview */}
          <div className="p-6 text-center">
            <p className="text-[10px] text-white/30 mb-3 leading-relaxed">
              LOGAN qualifie l'opportunité des deux côtés avant toute mise en relation.
            </p>
            <button className="w-full py-3 bg-white text-foreground font-bold text-sm rounded cursor-default">
              Je suis intéressé(e) par cette opportunité →
            </button>
            <div className="mt-2 text-[10px] text-white/25">0% commission · Levée de rideau conditionnée à votre accord</div>
          </div>
        </div>
      </div>

      {/* Approval */}
      <div className="bg-foreground rounded-md p-5 mb-6">
        <div className="font-serif text-base font-semibold text-white mb-3">Confirmez votre recherche</div>
        <div className="flex flex-col gap-2">
          {[
            "Je confirme les critères de ma recherche.",
            "Je comprends que la mise en relation est confidentielle et orchestrée par LOGAN.",
          ].map((text, i) => (
            <button
              key={i}
              onClick={() => toggleCheck(i)}
              className={cn(
                'flex items-start gap-3 p-3 rounded border text-left transition-all',
                checks[i] ? 'bg-white/[0.07] border-white/[0.18]' : 'bg-white/[0.03] border-white/[0.08]'
              )}
            >
              <div className={cn(
                'w-[18px] h-[18px] rounded-sm border-[1.5px] flex-shrink-0 mt-0.5 flex items-center justify-center',
                checks[i] ? 'bg-white border-white' : 'border-white/25'
              )}>
                {checks[i] && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="hsl(var(--foreground))" strokeWidth="2" fill="none" strokeLinecap="round" /></svg>}
              </div>
              <span className="text-xs text-white/65 leading-relaxed">{text}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center pt-7 border-t border-border">
        <Button variant="outline" onClick={() => s.setField('currentSearchStep', 1)} className="font-sans text-sm rounded-sm">← Modifier</Button>
        <Button
          onClick={() => {
            s.saveCurrentSearch();
            toast.success('Recherche publiée avec succès !');
          }}
          disabled={!allChecked}
          className="bg-foreground text-background hover:bg-foreground/90 font-sans text-sm font-bold rounded-sm px-8"
        >
          Publier ma recherche →
        </Button>
      </div>
    </div>
  );
};

// ── EXPLORE VIEW ──
const ExploreView = ({
  filter, setFilter, sort, setSort, drawerProfile, setDrawerProfile
}: {
  filter: string;
  setFilter: (f: string) => void;
  sort: string;
  setSort: (s: string) => void;
  drawerProfile: CabinetProfile | null;
  setDrawerProfile: (p: CabinetProfile | null) => void;
}) => {
  const s = useCabinetStore();

  const filtered = useMemo(() => {
    let profiles = [...PROFILES];
    if (filter === 'new') profiles = profiles.filter((p) => p.isNew);
    else if (filter !== 'all') profiles = profiles.filter((p) => p.dept === filter);
    if (sort === 'pqe') profiles.sort((a, b) => parseInt(b.pqe) - parseInt(a.pqe));
    else if (sort === 'match') profiles.sort((a, b) => b.match - a.match);
    return profiles;
  }, [filter, sort]);

  return (
    <div>
      <button
        onClick={() => s.setField('dashboardView', 'home')}
        className="text-xs text-muted-foreground hover:text-foreground mb-6 flex items-center gap-1"
      >
        ← Retour au tableau de bord
      </button>

      <h2 className="font-serif text-2xl font-normal text-foreground leading-tight mb-1">Explorer le marché</h2>
      <p className="text-xs text-muted-foreground mb-6">
        Parcourez tous les profils enregistrés. Cliquez sur « Ce candidat m'intéresse » pour que LOGAN puisse se rapprocher du candidat en dehors de tout mandat.
      </p>

      {/* Filters */}
      <div className="flex items-center gap-2.5 mb-5 flex-wrap">
        <span className="text-[11px] font-semibold text-foreground mr-1">Filtrer :</span>
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              'text-[10px] font-semibold px-3 py-1.5 border rounded-full transition-all',
              filter === f.key
                ? 'bg-foreground text-background border-foreground'
                : 'bg-background text-muted-foreground border-border hover:border-foreground'
            )}
          >
            {f.label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="text-[11px] border border-border rounded px-2 py-1 bg-background text-foreground cursor-pointer"
          >
            <option value="date">Plus récents</option>
            <option value="pqe">Expérience</option>
            <option value="match">Matching</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p) => (
          <div
            key={p.id}
            onClick={() => setDrawerProfile(p)}
            className="rounded-lg p-5 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5 relative border border-border"
            style={{ background: 'hsl(0 0% 96%)' }}
          >
            {p.isNew && (
              <span className="absolute top-3 right-3 text-[7px] font-bold tracking-[0.12em] uppercase bg-foreground text-background px-2 py-0.5 rounded-sm">NOUVEAU</span>
            )}
            <div className="text-[9px] text-foreground/40 tracking-[0.08em] mb-3 font-serif">{p.id}</div>
            <div className="font-serif text-base font-bold text-foreground mb-1.5 leading-tight">{p.title}</div>
            <div className="text-[11px] text-muted-foreground mb-3 font-serif">{p.origin} · {p.natFlag}</div>
            <div className="flex flex-wrap gap-1 mb-3">
              <span className="text-[9px] font-semibold px-2 py-0.5 rounded-sm bg-foreground text-background">{p.deptLabel}</span>
              <span className="text-[9px] font-semibold px-2 py-0.5 rounded-sm bg-secondary text-foreground/70 border border-border">{p.seniority}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 border-t border-border pt-3">
              <div><div className="text-[8px] text-muted-foreground uppercase tracking-[0.08em]">Anglais</div><div className="text-[11px] font-semibold text-foreground">{p.english}</div></div>
              <div><div className="text-[8px] text-muted-foreground uppercase tracking-[0.08em]">Disponibilité</div><div className="text-[11px] font-semibold text-foreground">{p.disponibilite}</div></div>
            </div>
          </div>
        ))}
      </div>

      {/* Drawer */}
      {drawerProfile && (
        <>
          <div className="fixed inset-0 bg-foreground/30 z-[399]" onClick={() => setDrawerProfile(null)} />
          <div className="fixed top-0 right-0 bottom-0 w-[480px] bg-background shadow-2xl z-[400] overflow-y-auto border-l border-border">
            <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between z-10">
              <span className="text-[11px] font-bold tracking-[0.08em] uppercase text-foreground">Fiche candidat anonymisée</span>
              <button onClick={() => setDrawerProfile(null)} className="bg-secondary rounded-full w-7 h-7 flex items-center justify-center hover:bg-border">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5">
              {/* Anonymous header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center text-muted-foreground font-serif text-xl">
                  ?
                </div>
                <div>
                  <p className="font-serif text-lg text-foreground">{drawerProfile.title}</p>
                  <span className="text-xs font-sans font-medium px-2.5 py-1 rounded-sm bg-foreground text-background mt-1 inline-block">
                    {drawerProfile.seniority}
                  </span>
                </div>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-border">
                <div><span className="text-xs text-muted-foreground font-sans font-light">Pratique</span><p className="text-sm font-sans font-medium mt-0.5">{drawerProfile.deptLabel}</p></div>
                <div><span className="text-xs text-muted-foreground font-sans font-light">Nationalité cabinet</span><p className="text-sm font-sans font-medium mt-0.5">{drawerProfile.natFlag} {drawerProfile.origin}</p></div>
                <div><span className="text-xs text-muted-foreground font-sans font-light">Classement Legal 500</span><p className="text-sm font-sans font-medium mt-0.5">{drawerProfile.originTier}</p></div>
                <div><span className="text-xs text-muted-foreground font-sans font-light">Anglais</span><p className="text-sm font-sans font-medium mt-0.5">{drawerProfile.english}</p></div>
                <div><span className="text-xs text-muted-foreground font-sans font-light">Disponibilité</span><p className="text-sm font-sans font-medium mt-0.5">{drawerProfile.disponibilite}</p></div>
                {drawerProfile.formation && <div><span className="text-xs text-muted-foreground font-sans font-light">Formation</span><p className="text-sm font-sans font-medium mt-0.5">{drawerProfile.formation}</p></div>}
              </div>

              {/* Activity pie chart */}
              {Object.keys(drawerProfile.split).length > 0 && (
                <div className="mb-6 pb-6 border-b border-border">
                  <p className="text-[9px] font-bold tracking-[0.14em] uppercase text-muted-foreground mb-4">Répartition de l'activité</p>
                  <div className="flex items-start gap-6">
                    <ActivityPieChart data={drawerProfile.split} size={120} innerRadius={28} outerRadius={52} showLegend={false} />
                    <div className="flex-1 space-y-2">
                      {Object.entries(drawerProfile.split).map(([name, value]) => (
                        <div key={name} className="flex items-center justify-between">
                          <span className="text-xs font-sans text-foreground">{name}</span>
                          <span className="text-xs font-sans font-bold text-foreground">{value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Expertise tags */}
              {drawerProfile.expertise.length > 0 && (
                <div className="mb-6 pb-6 border-b border-border">
                  <p className="text-[9px] font-bold tracking-[0.14em] uppercase text-muted-foreground mb-3">Expertises</p>
                  <div className="flex flex-wrap gap-2">
                    {drawerProfile.expertise.map(e => (
                      <span key={e} className="px-3 py-1 rounded-sm bg-secondary text-foreground text-xs font-sans font-light border border-border">{e}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Clientele */}
              {drawerProfile.retro_actuel && (
                <div className="mb-6 pb-6 border-b border-border">
                  <p className="text-[9px] font-bold tracking-[0.14em] uppercase text-muted-foreground mb-3">Conditions</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div><span className="text-xs text-muted-foreground font-sans font-light">Rétrocession</span><p className="text-sm font-sans font-medium mt-0.5">{drawerProfile.retro_actuel}</p></div>
                    <div><span className="text-xs text-muted-foreground font-sans font-light">Mobilité</span><p className="text-sm font-sans font-medium mt-0.5">{drawerProfile.mobilite}</p></div>
                  </div>
                </div>
              )}

              {/* Motivation */}
              {drawerProfile.motivation && (
                <div className="mb-6 pb-6 border-b border-border">
                  <p className="text-[9px] font-bold tracking-[0.14em] uppercase text-muted-foreground mb-2">Projet</p>
                  <p className="text-sm font-sans font-light text-foreground">{drawerProfile.motivation}</p>
                </div>
              )}

              {/* Footer */}
              <div className="mb-4">
                <p className="text-xs font-sans font-light text-muted-foreground">
                  Non visible : nom, prénom, email, téléphone, nom du cabinet actuel.
                </p>
              </div>

              {/* CTA */}
              <div className="bg-foreground rounded-md p-4 text-center">
                <div className="text-sm font-bold text-white mb-1.5">Ce candidat vous intéresse ?</div>
                <p className="text-[11px] text-white/45 mb-3 leading-relaxed">LOGAN se rapprochera du candidat en dehors de tout mandat pour explorer son intérêt.</p>
                <button
                  onClick={() => {
                    setDrawerProfile(null);
                    toast.success(`Intérêt transmis à LOGAN pour le profil ${drawerProfile.id}`);
                  }}
                  className="w-full py-2.5 bg-white text-foreground font-bold text-xs rounded hover:bg-white/90 transition-colors"
                >
                  Ce candidat m'intéresse →
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-5 pb-5 border-b border-secondary last:border-b-0">
    <div className="text-[9px] font-bold tracking-[0.14em] uppercase text-muted-foreground mb-3">{title}</div>
    {children}
  </div>
);

const KV = ({ k, v }: { k: string; v: string }) => (
  <div className="flex justify-between items-baseline mb-1.5">
    <span className="text-[11px] text-muted-foreground">{k}</span>
    <span className="text-xs font-semibold text-foreground text-right max-w-[60%]">{v}</span>
  </div>
);

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-baseline py-1.5 border-b border-black/10 last:border-b-0">
    <span className="text-[11px] text-black/50">{label}</span>
    <span className="text-xs font-medium text-black text-right max-w-[65%]">{value}</span>
  </div>
);

export default CabinetDashboard;
