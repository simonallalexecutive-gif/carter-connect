import { useState, useMemo } from 'react';
import { useCabinetStore } from '@/stores/cabinetStore';
import { PROFILES, DEPT_KEY_MAP, CABINET_EXPERTISE_DETAIL, type CabinetProfile } from '@/lib/cabinetConstants';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CHAMBERS_DEPARTMENTS, getChambersRanking, formatChambersBand } from '@/lib/chambersRankings';
import { NAT_FLAGS, NAT_LABELS } from '@/lib/legal500Rankings';
import { cn } from '@/lib/utils';
import { X, Search, Eye, Plus, FileText, Users, User } from 'lucide-react';
import ActivityPieChart from '@/components/shared/ActivityPieChart';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import CabinetStep3Search from './CabinetStep3Search';

const PALIER_MAP: Record<string, string> = {
  starter: 'Starter · 1.500€/mois',
  business: 'Business · 3.000€/mois',
  enterprise: 'Enterprise · Sur devis',
};

// Aligned with CHAMBERS_DEPARTMENTS (now includes Tax)
const FILTERS = [
  { key: 'all', label: 'Tous' },
  { key: 'ma', label: 'Corporate/M&A/PE' },
  { key: 'banque', label: 'Banking & Finance' },
  { key: 'restructuring', label: 'Restructuring/Insolvency' },
  { key: 'public', label: 'Public Law' },
  { key: 'arbitrage', label: 'International Arbitration' },
  { key: 'social', label: 'Employment' },
  { key: 'concurrence', label: 'Competition/European Law' },
  { key: 'immo', label: 'Real Estate' },
  { key: 'projets', label: 'Projects & Energy' },
  { key: 'tax', label: 'Tax' },
  { key: 'new', label: '🔔 Nouveaux' },
];

// Pie chart palette: bleu nuit, bleu pétrole, gris clair, gris foncé, noir
const EXPLORE_PIE_PALETTE = [
  'hsl(220, 40%, 18%)',   // bleu nuit
  'hsl(195, 45%, 28%)',   // bleu pétrole
  'hsl(210, 15%, 55%)',   // gris clair
  'hsl(210, 10%, 35%)',   // gris foncé
  'hsl(0, 0%, 10%)',      // noir
  'hsl(200, 30%, 40%)',   // bleu pétrole clair
  'hsl(215, 20%, 45%)',   // bleu gris
  'hsl(0, 0%, 65%)',      // gris moyen
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

  // Mes recherches actives
  if (s.dashboardView === 'activeSearches') {
    return (
      <div>
        <h2 className="font-serif text-2xl text-foreground mb-6">Mes recherches actives</h2>
        {s.searches.length === 0 ? (
          <div className="text-center py-16">
            <Search className="w-10 h-10 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-sm text-muted-foreground font-sans">Aucune recherche active pour le moment.</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 font-sans text-xs"
              onClick={() => { s.resetSearch(); s.setField('dashboardView', 'newSearch'); }}
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" /> Nouvelle recherche
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {s.searches.map((search) => (
              <div key={search.id} className="rounded-lg border border-border p-5 bg-background">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-sans text-sm font-bold text-foreground">{search.deptLabel || search.deptKey}</h3>
                  <span className="text-[10px] font-sans text-muted-foreground px-2 py-0.5 rounded-full bg-muted">
                    {search.seniorities?.join(', ') || 'Non spécifié'}
                  </span>
                </div>
                {search.expertise.length > 0 && (
                  <p className="text-xs text-muted-foreground font-sans">{search.expertise.join(', ')}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
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
const SENIORITY_YEARS_MAP: Record<string, string> = {
  junior: '0/3 ans',
  mid: '3/6 ans',
  senior: '+6 ans',
};

const VALIDATION_PIE_PALETTE = [
  'hsl(220, 40%, 18%)',   // bleu nuit
  'hsl(185, 40%, 25%)',   // vert pétrole
  'hsl(210, 15%, 65%)',   // gris clair
  'hsl(200, 35%, 30%)',   // bleu pétrole foncé
  'hsl(155, 30%, 22%)',   // vert foncé
  'hsl(215, 25%, 40%)',   // bleu gris
  'hsl(0, 0%, 50%)',      // gris moyen
  'hsl(220, 30%, 28%)',   // bleu nuit clair
];

const SearchValidation = () => {
  const s = useCabinetStore();
  const [checks, setChecks] = useState([false, false]);

  const toggleCheck = (i: number) => {
    const next = [...checks];
    next[i] = !next[i];
    setChecks(next);
  };

  const allChecked = checks.every(Boolean);

  const profileTypes = s.profileTypes || [];
  const profileLabel = profileTypes.includes('associe') ? 'Associé' : profileTypes.includes('counsel') ? 'Counsel' : 'Collaborateur';
  const senYears = s.seniorities.length ? s.seniorities.map((k) => SENIORITY_YEARS_MAP[k] || '').filter(Boolean).join(', ') : '';
  const natLabel = s.detectedNat ? (NAT_LABELS[s.detectedNat] || s.detectedNat) : '';
  const hasChambersRanking = s.detectedRankings && s.detectedRankings.length > 0;

  // Get selected scope items
  const activeActivities = useMemo(() => {
    return Object.entries(s.cabinetActivites)
      .filter(([, v]) => v)
      .map(([k]) => {
        for (const exp of s.expertise) {
          const detail = CABINET_EXPERTISE_DETAIL[exp];
          if (detail) {
            for (const sec of detail.sections) {
              const item = sec.items.find((it) => it.key === k);
              if (item) return { label: item.label, section: sec.title };
            }
          }
        }
        return { label: k, section: 'Autre' };
      });
  }, [s.cabinetActivites, s.expertise]);

  // Section counts for pie chart
  const sectionCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    activeActivities.forEach((a) => {
      counts[a.section] = (counts[a.section] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [activeActivities]);

  const retroStr = s.retroMin && s.retroMax ? `${s.retroMin}€ — ${s.retroMax}€` : s.retroMin ? `À partir de ${s.retroMin}€` : s.retroMax ? `Jusqu'à ${s.retroMax}€` : '';

  return (
    <div className="max-w-[780px] mx-auto">
      <button
        onClick={() => s.setField('currentSearchStep', 1)}
        className="text-xs text-muted-foreground hover:text-foreground mb-6 flex items-center gap-1"
      >
        ← Modifier ma recherche
      </button>

      <h2 className="font-sans text-3xl font-normal text-foreground leading-tight mb-2.5">Validation de la recherche</h2>
      <p className="text-[11px] text-muted-foreground font-light leading-relaxed mb-3 max-w-xl">
        Voici l'aperçu de votre recherche telle qu'elle apparaîtra aux yeux des candidats.
      </p>

      {/* Preview card — dark premium style */}
      <div className="mb-6">
        <div className="bg-foreground rounded-lg overflow-hidden shadow-[0_25px_60px_-12px_rgba(0,0,0,0.5)] backdrop-blur-sm">

          {/* ─── 1. EN-TÊTE : Statut | Département | Années ─── */}
          <div className="p-6 md:p-8 border-b border-white/[0.08]">
            <div className="text-[8px] tracking-[0.16em] uppercase text-white/35 font-sans mb-3">Opportunité · Présentée par LOGAN</div>
            <div className="flex items-center gap-2 flex-wrap text-[15px] font-semibold text-white font-sans">
              <span>{profileLabel}</span>
              <span className="text-white/25">|</span>
              <span>{s.currentSearchDeptLabel || s.expertise.join(' / ') || 'Département'}</span>
              {senYears && (
                <>
                  <span className="text-white/25">|</span>
                  <span>{senYears}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-3 mt-2 text-[10px] text-white/40 font-sans">
              {natLabel && <span>{natLabel}</span>}
              {natLabel && <span className="text-white/15">·</span>}
              <span>Pratique reconnue Chambers : {hasChambersRanking ? 'Oui' : 'Non'}</span>
            </div>
            <div className="text-[10px] text-white/25 mt-2 font-sans">Identité protégée · Mise en relation via LOGAN uniquement</div>
          </div>

          {/* ─── 2. EXPERTISE RECHERCHÉE ─── */}
          {s.expertise.length > 0 && (
            <div className="p-6 md:p-8 border-b border-white/[0.08]">
              <div className="text-[8px] font-bold tracking-[0.14em] uppercase text-white/35 font-sans mb-4">Expertise recherchée</div>
              
              {/* Expertise chips */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {s.expertise.map((exp) => (
                  <span key={exp} className="text-[11px] bg-secondary border border-border rounded px-3 py-1.5 text-foreground/80 font-sans font-medium">{exp}</span>
                ))}
              </div>

              {/* Scope detail chips + pie chart */}
              {(activeActivities.length > 0 || sectionCounts.length > 0) && (
                <div className="flex items-start gap-6 mt-4 pt-4 border-t border-white/[0.06]">
                  {/* Pie chart by section type */}
                  {sectionCounts.length > 0 && (
                    <div className="flex flex-col items-center flex-shrink-0">
                      <ResponsiveContainer width={120} height={120}>
                        <PieChart>
                          <Pie
                            data={sectionCounts}
                            cx="50%"
                            cy="50%"
                            innerRadius={28}
                            outerRadius={52}
                            dataKey="value"
                            stroke="hsl(0, 0%, 10%)"
                            strokeWidth={2}
                          >
                            {sectionCounts.map((_, i) => (
                              <Cell key={i} fill={VALIDATION_PIE_PALETTE[i % VALIDATION_PIE_PALETTE.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value: number, name: string) => [`${value} sélection(s)`, name]}
                            contentStyle={{ fontSize: '10px', borderRadius: '4px', background: 'hsl(0,0%,15%)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="flex flex-col gap-1 mt-2">
                        {sectionCounts.map((sc, i) => (
                          <div key={sc.name} className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: VALIDATION_PIE_PALETTE[i % VALIDATION_PIE_PALETTE.length] }} />
                            <span className="text-[9px] text-white/50 font-sans">{sc.name} ({sc.value})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Scope chips */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[8px] uppercase tracking-[0.1em] text-white/35 font-sans mb-2">Scope d'intervention</p>
                    <div className="flex flex-wrap gap-1.5">
                      {activeActivities.map((a) => (
                        <span key={a.label} className="text-[10px] bg-white/[0.07] border border-white/[0.12] rounded px-2.5 py-1 text-white/70 font-sans">{a.label}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Activity split pie chart when multiple expertises */}
              {s.expertise.length >= 2 && Object.keys(s.activitySplit).length > 0 && (
                <div className="mt-5 pt-4 border-t border-white/[0.06]">
                  <p className="text-[8px] uppercase tracking-[0.1em] text-white/35 font-sans mb-3">Répartition de l'activité</p>
                  <div className="flex items-start gap-5">
                    <ResponsiveContainer width={100} height={100}>
                      <PieChart>
                        <Pie
                          data={s.expertise.map((k) => ({ name: k, value: s.activitySplit[k] || 0 })).filter(d => d.value > 0)}
                          cx="50%"
                          cy="50%"
                          innerRadius={24}
                          outerRadius={44}
                          dataKey="value"
                          stroke="hsl(0, 0%, 10%)"
                          strokeWidth={2}
                        >
                          {s.expertise.map((_, i) => (
                            <Cell key={i} fill={VALIDATION_PIE_PALETTE[i % VALIDATION_PIE_PALETTE.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number, name: string) => [`${value}%`, name]}
                          contentStyle={{ fontSize: '10px', borderRadius: '4px', background: 'hsl(0,0%,15%)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-col gap-1.5">
                      {s.expertise.map((k, i) => {
                        const pct = s.activitySplit[k] || 0;
                        if (pct === 0) return null;
                        return (
                          <div key={k} className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: VALIDATION_PIE_PALETTE[i % VALIDATION_PIE_PALETTE.length] }} />
                            <span className="text-[10px] text-white/60 font-sans">{k} — {pct}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─── 3. CONTEXTE & ÉQUIPE ─── */}
          {(s.contexte || s.eqAssocies || s.eqCounsels || s.eqCollab) && (
            <div className="p-6 md:p-8 border-b border-white/[0.08]">
              <div className="text-[8px] font-bold tracking-[0.14em] uppercase text-white/35 font-sans mb-4">Contexte & équipe</div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                {s.contexte && (
                  <div>
                    <div className="text-[8px] uppercase tracking-[0.1em] text-white/35 font-sans mb-1">Contexte</div>
                    <div className="text-[13px] font-semibold text-white font-sans">{s.contexte}</div>
                  </div>
                )}
                {(s.eqAssocies || s.eqCounsels || s.eqCollab) && (
                  <div>
                    <div className="text-[8px] uppercase tracking-[0.1em] text-white/35 font-sans mb-1">Composition actuelle</div>
                    <div className="text-[13px] font-semibold text-white font-sans">
                      {[s.eqAssocies ? `${s.eqAssocies} associé(s)` : '', s.eqCounsels ? `${s.eqCounsels} counsel(s)` : '', s.eqCollab ? `${s.eqCollab} collaborateur(s)` : ''].filter(Boolean).join(', ')}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── 4. RÉTROCESSION & CONDITIONS ─── */}
          <div className="p-6 md:p-8 border-b border-white/[0.08]">
            <div className="text-[8px] font-bold tracking-[0.14em] uppercase text-white/35 font-sans mb-4">Rétrocession & conditions</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/[0.05] rounded-lg p-3">
                <div className="text-[8px] uppercase tracking-[0.1em] text-white/35 font-sans mb-1.5">Rétrocession</div>
                <div className="font-sans text-[13px] font-bold text-white">{retroStr || 'Confidentiel'}</div>
              </div>
              {s.hasHeures && s.heures && (
                <div className="bg-white/[0.05] rounded-lg p-3">
                  <div className="text-[8px] uppercase tracking-[0.1em] text-white/35 font-sans mb-1.5">Objectif heures</div>
                  <div className="font-sans text-[13px] font-bold text-white">{s.heures}h/an</div>
                </div>
              )}
              {s.bonusEnabled && s.bonusTypes.length > 0 && (
                <div className="bg-white/[0.05] rounded-lg p-3">
                  <div className="text-[8px] uppercase tracking-[0.1em] text-white/35 font-sans mb-1.5">Bonus</div>
                  <div className="font-sans text-[13px] font-bold text-white">
                    {s.bonusTypes.join(', ')}
                    {s.bonusDesc && ` (${s.bonusDesc}€)`}
                  </div>
                </div>
              )}
              {s.tt && (
                <div className="bg-white/[0.05] rounded-lg p-3">
                  <div className="text-[8px] uppercase tracking-[0.1em] text-white/35 font-sans mb-1.5">Télétravail</div>
                  <div className="font-sans text-[13px] font-bold text-white">{s.tt}</div>
                </div>
              )}
              {s.english && (
                <div className="bg-white/[0.05] rounded-lg p-3">
                  <div className="text-[8px] uppercase tracking-[0.1em] text-white/35 font-sans mb-1.5">Anglais</div>
                  <div className="font-sans text-[13px] font-bold text-white">{s.english}</div>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 md:p-8 text-center">
            <p className="text-[10px] text-white/30 font-sans mb-3 leading-relaxed">
              LOGAN qualifie l'opportunité des deux côtés avant toute mise en relation.
            </p>
            <button className="w-full py-3 bg-white text-foreground font-bold text-[13px] rounded cursor-default font-sans">
              Je suis intéressé(e) par cette opportunité →
            </button>
            <div className="mt-2 text-[10px] text-white/25 font-sans">Un consultant Logan vous contactera sous 48h pour échanger plus en détails sur cette opportunité</div>
          </div>
        </div>
      </div>

      {/* Approval */}
      <div className="bg-foreground rounded-md p-5 mb-6">
        <div className="font-sans text-[13px] font-semibold text-white mb-3">Confirmez votre recherche</div>
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
              <span className="text-[11px] text-white/65 leading-relaxed font-sans">{text}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center pt-7 border-t border-border">
        <Button variant="outline" onClick={() => s.setField('currentSearchStep', 1)} className="font-sans text-[11px] rounded-sm">← Modifier</Button>
        <Button
          onClick={() => {
            s.saveCurrentSearch();
            toast.success('Recherche publiée avec succès !');
          }}
          disabled={!allChecked}
          className="bg-foreground text-background hover:bg-foreground/90 font-sans text-[11px] font-bold rounded-sm px-8"
        >
          Publier ma recherche →
        </Button>
      </div>
    </div>
  );
};

// ── Helper: derive status label from profile ──
function getStatusLabel(p: CabinetProfile): string {
  if (p.seniority === 'Associé') return 'Associé';
  if (p.seniority === 'Counsel') return 'Counsel';
  return 'Collaborateur';
}

function getSeniorityDetail(p: CabinetProfile): string | null {
  const status = getStatusLabel(p);
  if (status !== 'Collaborateur') return null;
  if (p.seniority === 'Junior' || p.seniority.includes('Junior')) return 'Junior';
  if (p.seniority === 'Mid Level' || p.seniority.includes('Mid')) return 'Mid-level';
  if (p.seniority === 'Sénior' || p.seniority.includes('Sénior') || p.seniority.includes('Senior')) return 'Sénior';
  return null;
}

function getNatLabel(nat: string): string {
  const map: Record<string, string> = { FR: 'Français', US: 'Américain', UK: 'Anglais' };
  return map[nat] || nat;
}

function isChambersRanked(p: CabinetProfile): boolean {
  return !!(p.originTier && p.originTier.startsWith('Tier'));
}

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
  const [chambersOnly, setChambersOnly] = useState(false);
  const [seniorityFilter, setSeniorityFilter] = useState<string>('all');

  const SENIORITY_FILTERS = [
    { key: 'all', label: 'Toutes' },
    { key: 'Junior', label: 'Junior' },
    { key: 'Mid Level', label: 'Mid-level' },
    { key: 'Senior', label: 'Sénior' },
    { key: 'Counsel', label: 'Counsel' },
    { key: 'Associé', label: 'Associé' },
  ];

  const filtered = useMemo(() => {
    let profiles = [...PROFILES];
    if (filter === 'new') profiles = profiles.filter((p) => p.isNew);
    else if (filter !== 'all') profiles = profiles.filter((p) => p.dept === filter);
    if (chambersOnly) profiles = profiles.filter((p) => isChambersRanked(p));
    if (seniorityFilter !== 'all') profiles = profiles.filter((p) => p.seniority === seniorityFilter || p.seniority.includes(seniorityFilter));
    if (sort === 'pqe') profiles.sort((a, b) => parseInt(b.pqe) - parseInt(a.pqe));
    else if (sort === 'match') profiles.sort((a, b) => b.match - a.match);
    return profiles;
  }, [filter, sort, chambersOnly, seniorityFilter]);

  return (
    <div>
      <button
        onClick={() => s.setField('dashboardView', 'home')}
        className="text-xs text-muted-foreground hover:text-foreground mb-6 flex items-center gap-1"
      >
        ← Retour au tableau de bord
      </button>

      <h2 className="font-sans text-2xl font-normal text-foreground leading-tight mb-1">Explorer le marché</h2>
      <p className="text-xs text-muted-foreground mb-6">
        Parcourez tous les profils enregistrés. Cliquez sur un profil pour consulter le détail anonymisé.
      </p>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span className="text-[11px] font-semibold text-foreground mr-1">Pratique :</span>
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              'text-[10px] font-medium px-3 py-1.5 border rounded-full transition-all',
              filter === f.key
                ? 'bg-foreground text-background border-foreground'
                : 'bg-background text-muted-foreground border-border hover:border-foreground'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Chambers checkbox + seniority + sort */}
      <div className="flex items-center gap-4 mb-5 flex-wrap">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="chambersFilter"
            checked={chambersOnly}
            onChange={e => setChambersOnly(e.target.checked)}
            className="w-3.5 h-3.5 rounded border-border accent-foreground cursor-pointer"
          />
          <label htmlFor="chambersFilter" className="text-[11px] text-foreground font-medium cursor-pointer select-none">
            Le candidat doit exercer dans un cabinet dont la pratique est reconnue par Chambers
          </label>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-foreground">Séniorité :</span>
          <select
            value={seniorityFilter}
            onChange={(e) => setSeniorityFilter(e.target.value)}
            className="text-[11px] border border-border rounded px-2 py-1 bg-background text-foreground cursor-pointer"
          >
            {SENIORITY_FILTERS.map((sf) => (
              <option key={sf.key} value={sf.key}>{sf.label}</option>
            ))}
          </select>
        </div>
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

      {/* Grid — dark matte cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p) => {
          const status = getStatusLabel(p);
          const senDetail = getSeniorityDetail(p);
          const natLabel = getNatLabel(p.nat);
          const chambers = isChambersRanked(p);

          return (
            <div
              key={p.id}
              onClick={() => setDrawerProfile(p)}
              className="rounded-lg p-5 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5 relative border border-border bg-card"
            >
              {p.isNew && (
                <span className="absolute top-3 right-3 text-[7px] font-bold tracking-[0.12em] uppercase bg-foreground/90 text-background px-2 py-0.5 rounded-sm">NOUVEAU</span>
              )}
              <div className="text-[9px] text-muted-foreground tracking-[0.08em] mb-2 font-sans">{p.id}</div>
              <div className="font-sans text-sm font-bold text-foreground mb-1.5 leading-tight">
                {status}{senDetail ? ` — ${senDetail}` : ''}{p.pqe ? ` · ${p.pqe}` : ''}
              </div>
              <div className="font-sans text-[13px] font-semibold text-muted-foreground mb-2">{p.deptLabel}</div>

              {/* Expertises from activity split */}
              {Object.keys(p.split).length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {Object.keys(p.split).map((expertise) => (
                    <span key={expertise} className="text-[10px] font-bold px-2 py-1 rounded border border-border text-foreground/70 bg-secondary">{expertise}</span>
                  ))}
                </div>
              )}

              {/* Key info */}
              <div className="space-y-2 text-[11px] font-sans border-t border-border pt-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">Nationalité du cabinet</span>
                  <span className="font-bold text-foreground/85 border border-border rounded px-2 py-0.5">{natLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">Reconnu Chambers</span>
                  <span className={cn('font-bold border border-border rounded px-2 py-0.5', chambers ? 'text-foreground/85' : 'text-muted-foreground')}>{chambers ? 'Oui' : 'Non'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">Recherche active</span>
                  <span className="font-bold text-foreground/85 border border-border rounded px-2 py-0.5">{p.disponibilite === 'Immédiate' ? 'Oui' : 'Non'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Drawer */}
      {drawerProfile && (
        <ProfileDrawer profile={drawerProfile} onClose={() => setDrawerProfile(null)} />
      )}
    </div>
  );
};

// ── PROFILE DRAWER ──
const ProfileDrawer = ({ profile: p, onClose }: { profile: CabinetProfile; onClose: () => void }) => {
  const status = getStatusLabel(p);
  const senDetail = getSeniorityDetail(p);
  const natLabel = getNatLabel(p.nat);
  const chambers = isChambersRanked(p);

  // Mock priorities for demo (from Step4Project PRIORITIES list)
  const mockPriorities = p.motivation?.includes('autonomie')
    ? ['Responsabilité et autonomie', 'Qualité du management', 'Pratique et dossiers']
    : p.motivation?.includes('rémunération') || p.motivation?.includes('Rémunération')
    ? ['Rémunération', 'Perspectives', 'Équilibre pro/perso']
    : ['Rémunération', 'Responsabilité et autonomie', 'Flexibilité et organisation'];

  // Mock positioning/clientele from expertise
  const positioning = p.split && Object.keys(p.split).length > 0
    ? Object.entries(p.split).map(([k]) => {
        if (k.includes('M&A')) return 'Côté acquéreur / vendeur';
        if (k.includes('Private Equity')) return 'Côté fonds';
        if (k.includes('Financement')) return 'Côté prêteur / emprunteur';
        if (k.includes('Restructuring')) return 'Côté débiteur / créancier';
        if (k.includes('Social')) return 'Côté employeur';
        return '';
      }).filter(Boolean)
    : [];

  const clientele = p.pqe && parseInt(p.pqe) >= 6
    ? 'CAC 40 / ETI / Fonds d\'investissement'
    : 'ETI / PME / Start-ups';

  return (
    <>
      <div className="fixed inset-0 bg-foreground/30 z-[399]" onClick={onClose} />
      <div className="fixed top-0 right-0 bottom-0 w-[500px] bg-background shadow-2xl z-[400] overflow-y-auto border-l border-border">
        <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between z-10">
          <span className="text-[12px] font-bold tracking-[0.06em] uppercase text-foreground font-sans">
            {status}{senDetail ? ` — ${senDetail}` : ''}{p.pqe ? ` · ${p.pqe}` : ''}
          </span>
          <button onClick={onClose} className="bg-secondary rounded-full w-7 h-7 flex items-center justify-center hover:bg-border">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6">
          {/* Anonymous header with silhouette */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[hsl(220,40%,18%)] to-[hsl(195,45%,28%)] flex items-center justify-center">
              <User className="w-7 h-7 text-white/60" />
            </div>
            <div>
              <p className="font-sans text-lg font-semibold text-foreground">
                Profil anonymisé du candidat
              </p>
              <p className="text-[11px] text-muted-foreground font-sans mt-0.5">{p.id} · {p.deptLabel}</p>
            </div>
          </div>

          {/* Main info */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-6 pb-6 border-b border-border">
            <div>
              <span className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground font-sans">Statut</span>
              <p className="text-sm font-sans font-semibold mt-0.5">{status}{senDetail ? ` — ${senDetail}` : ''}</p>
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground font-sans">Ancienneté</span>
              <p className="text-sm font-sans font-semibold mt-0.5">{p.pqe}</p>
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground font-sans">Nationalité du cabinet</span>
              <p className="text-sm font-sans font-semibold mt-0.5">{natLabel}</p>
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground font-sans">Reconnu Chambers</span>
              <p className="text-sm font-sans font-semibold mt-0.5">{chambers ? 'Oui' : 'Non'}</p>
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground font-sans">Anglais</span>
              <p className="text-sm font-sans font-semibold mt-0.5">{p.english}</p>
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground font-sans">Recherche active</span>
              <p className="text-sm font-sans font-semibold mt-0.5">{p.disponibilite === 'Immédiate' ? 'Oui' : 'Non'}</p>
            </div>
          </div>

          {/* Activity pie chart + positioning/clientele */}
          {Object.keys(p.split).length > 0 && (
            <div className="mb-6 pb-6 border-b border-border">
              <p className="text-[9px] font-bold tracking-[0.14em] uppercase text-muted-foreground mb-4">Répartition de l'activité</p>
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0">
                  <ActivityPieChart
                    data={p.split}
                    size={130}
                    innerRadius={30}
                    outerRadius={56}
                    showLegend={false}
                    customColors={EXPLORE_PIE_PALETTE}
                  />
                </div>
                <div className="flex-1 space-y-2">
                  {Object.entries(p.split).map(([name, value], i) => (
                    <div key={name} className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: EXPLORE_PIE_PALETTE[i % EXPLORE_PIE_PALETTE.length] }} />
                      <span className="text-[11px] font-sans text-foreground flex-1">{name}</span>
                      <span className="text-[11px] font-sans font-bold text-foreground">{value}%</span>
                    </div>
                  ))}
                  {/* Positioning & Clientele, discreetly beside the chart */}
                  {positioning.length > 0 && (
                    <div className="pt-2 mt-2 border-t border-border">
                      <span className="text-[9px] text-muted-foreground font-sans">Positionnement : </span>
                      <span className="text-[10px] text-foreground font-sans">{positioning.join(' / ')}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-[9px] text-muted-foreground font-sans">Clientèle : </span>
                    <span className="text-[10px] text-foreground font-sans">{clientele}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Retrocession */}
          {p.retro_actuel && (
            <div className="mb-6 pb-6 border-b border-border">
              <p className="text-[9px] font-bold tracking-[0.14em] uppercase text-muted-foreground mb-3">Rétrocession</p>
              <p className="text-sm font-sans font-semibold text-foreground">{p.retro_actuel}</p>
            </div>
          )}

          {/* Candidate priorities */}
          <div className="mb-6 pb-6 border-b border-border">
            <p className="text-[9px] font-bold tracking-[0.14em] uppercase text-muted-foreground mb-3">Axes d'amélioration souhaités</p>
            <div className="flex flex-wrap gap-2">
              {mockPriorities.map((priority) => (
                <span key={priority} className="text-[10px] font-sans font-medium px-3 py-1.5 rounded-full bg-secondary text-foreground border border-border">
                  {priority}
                </span>
              ))}
            </div>
          </div>

          {/* Motivation */}
          {p.motivation && (
            <div className="mb-6 pb-6 border-b border-border">
              <p className="text-[9px] font-bold tracking-[0.14em] uppercase text-muted-foreground mb-2">Projet professionnel</p>
              <p className="text-[12px] font-sans font-light text-foreground leading-relaxed">{p.motivation}</p>
            </div>
          )}

          {/* Footer */}
          <div className="mb-4">
            <p className="text-[10px] font-sans font-light text-muted-foreground">
              Non visible : nom, prénom, email, téléphone, nom du cabinet actuel.
            </p>
          </div>

          {/* CTA */}
          <div className="bg-foreground rounded-md p-4 text-center">
            <div className="text-sm font-bold text-white mb-1.5">Ce candidat vous intéresse ?</div>
            <p className="text-[11px] text-white/45 mb-3 leading-relaxed">LOGAN se rapprochera du candidat en dehors de tout mandat pour explorer son intérêt.</p>
            <button
              onClick={() => {
                onClose();
                toast.success(`Intérêt transmis à LOGAN pour le profil ${p.id}`);
              }}
              className="w-full py-2.5 bg-white text-foreground font-bold text-xs rounded hover:bg-white/90 transition-colors"
            >
              Ce candidat m'intéresse →
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CabinetDashboard;
