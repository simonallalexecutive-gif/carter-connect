import { useState, useMemo } from 'react';
import { useCabinetStore } from '@/stores/cabinetStore';
import { PROFILES, DEPT_KEY_MAP, type CabinetProfile } from '@/lib/cabinetConstants';
import { NAT_FLAGS, NAT_LABELS, formatTier, LEGAL500_DEPARTMENTS, getFirmTierForDept } from '@/lib/legal500Rankings';
import { cn } from '@/lib/utils';
import { X, Search, Eye, Plus, FileText, Users } from 'lucide-react';
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

  // New search: department selection
  if (s.dashboardView === 'newSearch') {
    if (s.currentSearchStep === 0) {
      return <DeptSelection />;
    }
    if (s.currentSearchStep === 1) {
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
      {/* Dashboard header */}
      <div className="bg-foreground rounded-lg p-6 mb-7">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[9px] tracking-[0.18em] uppercase text-white/35 mb-1.5">Espace Cabinet</div>
            <div className="font-serif text-xl font-bold text-white">{s.cabinetName || 'Mon cabinet'}</div>
            <div className="flex items-center gap-2.5 mt-1.5">
              {s.detectedNat && (
                <span className="text-xs text-white/50">{NAT_FLAGS[s.detectedNat]} {NAT_LABELS[s.detectedNat]}</span>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="bg-white/[0.07] border border-white/[0.1] rounded px-3.5 py-2 mb-1.5">
              <div className="text-[9px] text-white/35 tracking-[0.1em] uppercase mb-0.5">Abonnement</div>
              <div className="text-sm font-bold text-white">{PALIER_MAP[s.palier] || 'Business'}</div>
            </div>
          </div>
        </div>

        {/* Contacts */}
        {s.contacts.length > 0 && s.contacts[0].prenom && (
          <div className="mt-4 pt-4 border-t border-white/[0.08]">
            <div className="text-[9px] text-white/30 tracking-[0.1em] uppercase mb-2">Référents</div>
            <div className="flex gap-3 flex-wrap">
              {s.contacts.filter(c => c.prenom).map((c, i) => (
                <span key={i} className="text-[11px] text-white/60">{c.prenom} {c.nom}{c.email ? ` · ${c.email}` : ''}</span>
              ))}
            </div>
          </div>
        )}

        {/* Rankings summary */}
        {s.detectedRankings.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/[0.08]">
            <div className="text-[9px] text-white/30 tracking-[0.1em] uppercase mb-2">Classements Legal 500</div>
            <div className="flex gap-2 flex-wrap">
              {s.detectedRankings.slice(0, 6).map((r) => (
                <span key={r.key} className="text-[10px] px-2.5 py-1 rounded-full border border-white/15 text-white/60">
                  {r.label} · {formatTier(r.tier)}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Active searches */}
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
          <div className="font-serif text-lg font-bold text-foreground mb-2">Explorer le marché des candidats</div>
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
          <div className="font-serif text-lg font-bold text-foreground mb-2">Publier une nouvelle recherche</div>
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
          onClick={() => s.setField('currentSearchStep', 0)}
          className="text-xs text-muted-foreground hover:text-foreground mb-4 flex items-center gap-1"
        >
          ← Changer de département
        </button>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground">Recherche en</span>
          <span className="text-sm font-bold text-foreground">{s.currentSearchDeptLabel}</span>
          {s.ranking && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm bg-secondary text-foreground">{s.ranking}</span>
          )}
        </div>
      </div>
      <CabinetStep3Search
        isEmbedded
        onBack={() => s.setField('currentSearchStep', 0)}
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

      {/* Recap */}
      <div className="bg-background rounded border border-border p-5 mb-5">
        <div className="text-[9px] font-bold tracking-[0.14em] uppercase text-muted-foreground mb-3 pb-2.5 border-b border-secondary">Récapitulatif</div>
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

      {/* Preview: as seen by LOGAN */}
      <div className="mb-5">
        <div className="text-[9px] font-bold tracking-[0.14em] uppercase text-muted-foreground mb-3">Aperçu — tel que vu par LOGAN</div>
        <div className="bg-foreground rounded-md p-5">
          <div className="text-[8px] tracking-[0.16em] uppercase text-white/30 mb-2">Mandat cabinet · {s.cabinetName}</div>
          <div className="font-serif text-lg font-bold text-white mb-1">{s.currentSearchDeptLabel} · {s.seniorities.join(' / ') || '—'}</div>
          <div className="text-xs text-white/50 mb-3">{s.ranking} · {NAT_FLAGS[s.detectedNat] || ''} {s.cabinetName}</div>
          <div className="flex flex-wrap gap-1.5">
            {s.expertise.map((e) => (
              <span key={e} className="text-[10px] bg-white/[0.07] border border-white/[0.12] rounded px-2.5 py-1 text-white/60">{e}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Preview: as seen by candidate */}
      <div className="mb-6">
        <div className="text-[9px] font-bold tracking-[0.14em] uppercase text-muted-foreground mb-3">Aperçu — tel que vu par le candidat</div>
        <div className="bg-foreground rounded-md p-5">
          <div className="text-[8px] tracking-[0.16em] uppercase text-white/30 mb-2">Opportunité · Présentée par LOGAN</div>
          <div className="font-serif text-lg font-bold text-white mb-1">{s.currentSearchDeptLabel} · {s.seniorities.join(' / ') || '—'}</div>
          <div className="text-xs text-white/50 mb-3">{NAT_FLAGS[s.detectedNat] || '🏢'} {NAT_LABELS[s.detectedNat] || 'Cabinet'} · {s.ranking || 'Non classé'}</div>
          <div className="text-[10px] text-white/30 mt-3">Identité du cabinet protégée · Mise en relation via LOGAN uniquement</div>
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
            className="bg-background rounded-lg border border-border p-5 cursor-pointer transition-all hover:border-foreground hover:shadow-lg hover:-translate-y-0.5 relative"
          >
            {p.isNew && (
              <span className="absolute top-3 right-3 text-[7px] font-bold tracking-[0.12em] uppercase bg-foreground text-background px-2 py-0.5 rounded-sm">NOUVEAU</span>
            )}
            <div className="text-[9px] text-muted-foreground tracking-[0.08em] mb-3">{p.id}</div>
            <div className="font-serif text-base font-bold text-foreground mb-1.5 leading-tight">{p.title}</div>
            <div className="text-[11px] text-muted-foreground mb-3">{p.origin} · {p.natFlag}</div>
            <div className="flex flex-wrap gap-1 mb-3">
              <span className="text-[9px] font-semibold px-2 py-0.5 rounded-sm bg-foreground text-background">{p.deptLabel}</span>
              <span className="text-[9px] font-semibold px-2 py-0.5 rounded-sm bg-secondary text-foreground">{p.pqe} PQE</span>
            </div>
            <div className="grid grid-cols-2 gap-2 border-t border-secondary pt-3">
              <div><div className="text-[8px] text-muted-foreground uppercase">Anglais</div><div className="text-[11px] font-semibold text-foreground">{p.english}</div></div>
              <div><div className="text-[8px] text-muted-foreground uppercase">Disponibilité</div><div className="text-[11px] font-semibold text-foreground">{p.disponibilite}</div></div>
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
              <div className="bg-foreground rounded-md p-4 mb-5">
                <div className="text-[9px] tracking-[0.12em] uppercase text-white/30 mb-1.5">{drawerProfile.id}</div>
                <div className="font-serif text-lg font-bold text-white mb-1">{drawerProfile.title}</div>
                <div className="text-[11px] text-white/45">{drawerProfile.natFlag} {drawerProfile.origin}</div>
              </div>

              <Section title="Parcours">
                <KV k="Expérience" v={`${drawerProfile.pqe} PQE · ${drawerProfile.seniority}`} />
                <KV k="Formation" v={drawerProfile.formation} />
                <KV k="Anglais" v={drawerProfile.english} />
                <KV k="Disponibilité" v={drawerProfile.disponibilite} />
              </Section>

              <Section title="Expertises">
                <div className="flex flex-wrap gap-1 mb-3">
                  {drawerProfile.expertise.map((e) => (
                    <span key={e} className="text-[9px] font-semibold px-2.5 py-1 rounded-sm bg-secondary text-foreground">{e}</span>
                  ))}
                </div>
              </Section>

              <Section title="Motivation">
                <div className="bg-secondary border-l-[3px] border-foreground p-3 rounded-r text-xs text-foreground leading-relaxed italic">
                  {drawerProfile.motivation}
                </div>
              </Section>

              <div className="bg-foreground rounded-md p-4 text-center mt-2">
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
  <div className="flex justify-between items-baseline py-1.5 border-b border-secondary last:border-b-0">
    <span className="text-[11px] text-muted-foreground">{label}</span>
    <span className="text-xs font-medium text-foreground text-right max-w-[65%]">{value}</span>
  </div>
);

export default CabinetDashboard;
